<template>
    <article class="transactions-table">
        <div v-if="transactions.value" class="search-options">
            <b>{{ t('transactions-header-record-count', { 'count': transactions.value.page.totalElements }) }}</b>
            <form class="filter-boxes" @submit="(e) => { e.preventDefault(); pageNumber = 0; updateTransactions(pageNumber.value, itemsPerPage.value); }">
                <input class="email-search" type="text" v-model="emailSearch" :placeholder="t('search-by-email')" />
                <button type="submit">Search</button>
            </form>
        </div>
        <table>
            <thead>
                <tr>
                    <th class="timestamp">{{ t('transactions-header-timestamp') }}</th>
                    <th class="project">{{ t('transactions-header-project') }}</th>
                    <th class="processor">{{ t('transactions-header-processor') }}</th>
                    <th class="marketplace">{{ t('transactions-header-marketplace') }}</th>
                    <th class="email-ref">{{ t('transactions-header-email-ref') }}</th>
                    <th class="amount">{{ t('transactions-header-amount') }}</th>
                    <th class="status">{{ t('transactions-header-status') }}</th>
                    <th class="actions">{{ t('transactions-header-actions') }}</th>
                </tr>
            </thead>
            <tbody v-if="transactions.value">
                <tr v-for="transaction in transactions.value.content" :key="transaction.id">
                    <td class="timestamp">{{ transaction.timestamp ? useTimeFormat(transaction.timestamp, true) : "" }}</td>
                    <td class="project"><IconifiedProject v-if="transaction.projectGrantSlug" :project="getProject(transaction.projectGrantSlug)" size="24px" /></td>
                    <td class="processor"><Icon :name="`fa6-brands:${transaction.processor?.toLowerCase()}`" />&nbsp;{{ formatProcessor(transaction.processor) }}</td>
                    <td class="marketplace">{{ transaction.marketplace }}</td>
                    <td class="email-ref"><div class="ref-container">
                        <div class="email">{{ transaction.email }}</div>
                        <div class="ref">{{ transaction.transactionReference }}</div>
                    </div></td>
                    <td class="amount">{{ formatAmount(transaction.currency, transaction.amount) }}</td>
                    <td class="status">
                        <div class="text">{{ getStatus(transaction) }}</div>
                        <div class="avatar-name" v-if="transaction.grantedToName?.length" @click="$emit('show-user', transaction.grantedToName)">
                            <NuxtImg v-if="transaction.grantedToAvatar" :src="transaction?.grantedToAvatar"
                                alt="User avatar" placeholder="/images/placeholder-avatar.png" />
                            <span>{{ transaction.grantedToName ?? $t('user-deleted') }}</span>
                        </div>
                    </td>
                    <td class="actions">
                        <span class="actions">
                            <button v-if="!transaction.refunded" class="red" @click="refundTransaction(transaction)">{{ $t('refund-transaction-button') }}</button>
                            <button v-if="!transaction.refunded && transaction.passedValidation && !transaction.grantedToName?.length" @click="linkTransaction(transaction)">{{$t('link-transaction-button')}}</button>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="transactions.value && !transactions.value.content">
            <IconifiedText class="empty-notice" icon="fa6-solid:coins">{{ $t('no-transactions-notice') }}</IconifiedText>
        </div>
        <Pagination v-if="transactions.value" :data="transactions.value" v-on:update="(page, perPage) => updateTransactions(page, perPage)" />
    </article>
</template>

<script setup>
const CURRENCY_FORMAT = 'en-GB';
const { t } = useI18n();
const { auth, xsrf } = useAuth();

const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

const pageNumber = ref(1);
const itemsPerPage = ref(15);
const emailSearch = ref('');
const transactions = ref(null);
const emit = defineEmits('show-user');

const projects = await useRestrictedProjects();
const getProject = (proj) => projects.find(p => p.slug === proj)

const { user } = defineProps({
    user: {
        type: Object,
        required: false
    }
});

const formatProcessor = (processor) => {
    if (processor === 'STRIPE') {
        return 'Stripe';
    }
    if (processor === 'PAYPAL') {
        return 'PayPal'
    }
}

const formatAmount = (currency, amount) =>  new Intl.NumberFormat(CURRENCY_FORMAT, { style: 'currency', currency }).format(amount);

const getStatus = (transaction) => {
    if (transaction.refunded) {
        return t('transaction-status-refunded');
    }
    if (transaction.passedValidation) {
        if (transaction.grantedToAvatar) {
            return t('transaction-status-linked');
        }
        return t('transaction-status-complete');
    }
    return t('transaction-status-failed-validation');
}

const linkTransaction = (toLink) => useInput(
    'Enter the user ID to link this transaction to:',
    'Enter user ID to link',
    '185792275899613184',
    (id) => /^(?<id>\d{17,20})$/.test(id),
    async (confirm, id) => {
        if (!confirm) return;
        try {
            toLink.refunded = false;
            toLink.passedValidation = true;
            await $fetch(`${BASE_URL}/v1/transactions/${toLink.id}/link`, {
                method: 'POST',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                },
                body: id
            });
            updateTransactions(pageNumber.value, itemsPerPage.value);
        } catch (err) {
            useAlert('Failed to link transaction: ' + err, 'Error');
            return;
        }
    }
);

const refundTransaction = async (toRefund) => {
    useConfirm(t('refund-transaction-confirm', {'email': toRefund.email}), t('refund-transaction'), async (confirm) => {
        if (!confirm) return;
        try {
            toRefund.refunded = true;
            await $fetch(`${BASE_URL}/v1/transactions/${toRefund.id}`, {
                method: 'PUT',
                credentials: auth ? 'include' : 'omit',
                headers: {
                    'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
                    'X-XSRF-TOKEN': xsrf
                },
                body: JSON.stringify(toRefund)
            });
            updateTransactions(pageNumber.value, itemsPerPage.value);
        } catch (err) {
            useAlert('Failed to mark transaction as refunded: ' + err, 'Error');
            return;
        }
    });
};

const updateTransactions = (async (page, perPage) => {
    pageNumber.value = Math.max(1, page || pageNumber.value);
    itemsPerPage.value = Math.max(15, perPage || itemsPerPage.value);
    transactions.value = await useAllTransactions(pageNumber.value - 1, itemsPerPage.value, emailSearch.value);
});
await updateTransactions(pageNumber.value, itemsPerPage.value);
</script>

<style scoped>
.transactions-table, .transactions-table table th {
    width: 100%;
}

.transactions-table table tr {
    background-color: transparent;
}

.status {
    text-align: center;
}

.status .text {
    margin: 0.2rem 0;
}

.project, .processor, .email-ref {
    width: 12% !important;
}

.email-ref .ref-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.ref-container .ref {
    color: var(--light-gray);
    font-size: 0.8rem;
}

td .actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

.status .avatar-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: var(--light-gray);
    text-overflow: ellipsis;
}

.avatar-name img {
    width: 16px;
    height: 16px;
    border-radius: 100%;
}

.avatar-name:hover {
    text-decoration: underline;
    cursor: pointer;
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

.filter-boxes input {
    max-width: 150px;
}
</style>