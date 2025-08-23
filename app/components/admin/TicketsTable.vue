<template>
    <article class="tickets-table">
        <div v-if="tickets.value" class="search-options">
            <b>{{ t('tickets-header-record-count', { 'count': tickets.value.page.totalElements }) }}</b>
            <form class="filter-boxes" @submit="(e) => { e.preventDefault(); pageNumber = 0; updateTickets(pageNumber.value, itemsPerPage.value); }">
                <select class="ticket-status" v-model="statusFilter">
                    <option :value="null">{{ t('ticket-status-all') }}</option>
                    <option value="1" class="open-ticket">{{ t('ticket-status-open') }}</option>
                    <option value="3" class="locked-ticket">{{ t('ticket-status-locked') }}</option>
                    <option value="2" class="closed-ticket">{{ t('ticket-status-closed') }}</option>
                </select>
                <input v-if="!user" class="client-name" type="text" v-model="userFilter" :placeholder="t('search-by-username')" />
                <input class="ticket-number" type="number" v-model="idFilter" :placeholder="t('search-by-ticket-number')" />
                <button type="submit">Search</button>
            </form>
        </div>
        <table>
            <thead>
                <tr>
                    <th class="client" v-if="!user">{{ t('tickets-header-client') }}</th>
                    <th class="number">{{ t('tickets-header-number') }}</th>
                    <th class="subject">{{ t('tickets-header-subject') }}</th>
                    <th class="description">{{ t('tickets-header-description') }}</th>
                    <th class="status">{{ t('tickets-header-status') }}</th>
                    <th class="opened-at">{{ t('tickets-header-opened-at') }}</th>
                    <th class="closed-at">{{ t('tickets-header-closed-at') }}</th>
                    <th class="actions">{{ t('tickets-header-actions') }}</th>
                </tr>
            </thead>
            <tbody v-if="tickets.value">
                <tr v-for="ticket in tickets.value.content" :key="ticket.id">
                    <td class="client" v-if="!user">
                        <span class="avatar-name" @click="$emit('show-user', ticket.user?.name)">
                            <NuxtImg v-if="ticket.user?.avatar" :src="ticket.user?.avatar" width="64px" height="64px"
                                alt="User avatar" placeholder="/images/placeholder-avatar.png" />
                            <span>{{ ticket.user?.name ?? $t('user-deleted') }}</span>
                        </span>
                    </td>
                    <td class="number">
                        <IconifiedText icon="fa6-solid:ticket">#{{ getTicketName(ticket) }}</IconifiedText>
                    </td>
                    <td class="subject">
                        <IconifiedProject v-if="matchSubject(ticket.subject)" :project="matchSubject(ticket.subject)" size="24px" />
                        <span v-else>{{ t('ticket-subject-other') }}</span>
                    </td>
                    <td class="description">{{ ticket.description }}</td>
                    <td class="status">
                        <a :href="getTicketUrl(ticket)" v-if="ticket.status == 1"><IconifiedText class="open-ticket" icon="fa6-solid:check">{{ t('ticket-status-open') }}</IconifiedText></a>
                        <IconifiedText class="closed-ticket" icon="fa6-solid:lock" v-else-if="ticket.status == 2">{{ t('ticket-status-closed') }}</IconifiedText>
                        <a :href="getTicketUrl(ticket)" v-if="ticket.status == 3"><IconifiedText class="locked-ticket" icon="fa6-solid:pause">{{ t('ticket-status-locked') }}</IconifiedText></a>
                    </td>
                    <td class="opened-at">{{ ticket.openDate ? useTimeFormat(ticket.openDate, true) : "" }}</td>
                    <td class="closed-at">{{ ticket.closeDate ? useTimeFormat(ticket.closeDate, true) : "" }}</td>
                    <td class="actions">
                        <span v-if="ticket.status == 2">
                            <button class="red" @click="deleteTicket(ticket)">{{ t('ticket-action-delete') }}</button>
                            <button @click="openTranscript(ticket)">{{ t('ticket-action-view-transcript') }}</button>
                        </span>
                        <a v-else :href="getTicketUrl(ticket)"><IconifiedText icon="fa6-solid:arrow-up-right-from-square">{{ t('ticket-action-open') }}</IconifiedText></a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="tickets.value && !tickets.value.content">
            <IconifiedText class="empty-notice" icon="fa6-solid:ticket">{{ $t('no-support-tickets-notice') }}</IconifiedText>
        </div>
        <Pagination v-if="tickets.value" :data="tickets.value" v-on:update="(page, perPage) => updateTickets(page, perPage)" />
    </article>
</template>

<script setup>
import { useRoute } from 'nuxt/app';

const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const { t } = useI18n();

const pageNumber = ref(1);
const itemsPerPage = ref(15);
const idFilter = ref(null);
const statusFilter = ref(null);
const userFilter = ref(useRoute()?.query?.user);

const tickets = ref(null);
const projects = await useAllProjects();
const emit = defineEmits('show-user');

const { user, searchPrefill } = defineProps({
    user: {
        type: Object,
        required: false
    },
    searchPrefill: {
        type: String,
        required: false,
        default: ''
    }
});
const { auth, xsrf } = useAuth();

// Prefill user search
if (searchPrefill?.length) {
    userFilter.value = searchPrefill;
}

const findUser = (async (username) => {
    const { value } = await useAllUsers(0, 1, username);
    if (value?.content) return value.content[0];
    return null;
});

const updateTickets = (async (page, perPage) => {
    pageNumber.value = Math.max(1, page || pageNumber.value);
    itemsPerPage.value = Math.max(15, perPage || itemsPerPage.value);
    const searchUser = (user ? user : (userFilter.value ? await findUser(userFilter.value) : null));
    tickets.value = searchUser
        ? await useTickets(searchUser, pageNumber.value - 1, itemsPerPage.value, idFilter.value, statusFilter.value) 
        : await useAllTickets(pageNumber.value - 1, itemsPerPage.value, idFilter.value, statusFilter.value);
});
await updateTickets(pageNumber.value, itemsPerPage.value);

const matchSubject = (subject) => projects.value.find(proj => proj.slug === subject);
const getTicketUrl = (ticket) => `https://discord.com/channels/${ticket.guild?.id ?? '0'}/${ticket.channelId ?? '0'}`;
const getTicketName = (ticket) => ticket.id.toString().padStart(4, '0');

const openTranscript = async (ticket) => {
    try {
        const transcript = await $fetch(`${BASE_URL}/v1/tickets/${ticket.id}/transcript`, {
            credentials: auth ? 'include' : 'omit',
            headers: {
                'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                'X-XSRF-TOKEN': xsrf
            }
        });
        navigateTo(`/transcript/${btoa(transcript)}`, { external: true });
    } catch (err) {
        useAlert('Failed to get ticket transcript: ' + err, 'Error');
        return;
    }
};

const deleteTicket = async (ticket) => {
    useConfirm(t('delete-ticket-confirm', {'number': getTicketName(ticket)}), t('delete-ticket'), async (confirm) => {
        if (!confirm) return;
        try {
            await $fetch(`${BASE_URL}/v1/tickets/${ticket.id}`, {
                method: 'DELETE',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                }
            });
        } catch (err) {
            useAlert('Failed to delete ticket: ' + err, 'Error');
            return;
        }
        await updateTickets(pageNumber.value, itemsPerPage.value);
    });
};
</script>

<style scoped>
.tickets-table, .tickets-table table th {
    width: 100%;
}

.tickets-table table tr {
    background-color: transparent;
}

.number {
    width: 8% !important;
}

td.number {
    font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
}

.subject, .status, .client {
    width: 12% !important;
}

.client .avatar-name {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-overflow: ellipsis;
}

.avatar-name img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
}

.avatar-name:hover {
    text-decoration: underline;
    cursor: pointer;
}

.open-ticket {
    color: var(--accent);
}

.closed-ticket {
    color: var(--light-gray)
}

.locked-ticket {
    color: gold !important;
}

table .opened-at, .closed-at {
    width: 10% !important;
}

td.opened-at, td.closed-at {
    color: var(--light-gray);
}

table .description {
    width: 30% !important;
    max-width: 250px !important;
    overflow: auto;
}

td.actions span {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

table .empty-notice {
    margin: 2rem 0;
    color: var(--light-gray)
}

.search-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    margin-bottom: 1rem;
}

.search-options .filter-boxes {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.filter-boxes input, .filter-boxes select {
    max-width: 150px;
}
</style>