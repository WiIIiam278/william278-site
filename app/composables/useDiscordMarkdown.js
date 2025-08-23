import * as discordMarkdown from '@odiffey/discord-markdown'

const user = (users, id) => sanitize(users.find(user => user.id === id)?.name || id);
const channel = (channels, id) => sanitize(channels.find(channel => channel.id === id)?.name || id);
const role = (roles, id) => sanitize(roles.find(role => role.id === id)?.name || id);
const sanitize = (text) => discordMarkdown.markdownEngine.sanitizeText(text);

export const useDiscordMarkdown = (text, roles = [], channels = [], users = [], embed = false) => {
    return discordMarkdown.toHTML(text, {
        embed: embed,
        discordCallback: {
            user: node => `@${user(users, node.id)}`,
            channel: node => `#${channel(channels, node.id)}`,
            role: node => `@${role(roles, node.id)}`,
        }
    });
}