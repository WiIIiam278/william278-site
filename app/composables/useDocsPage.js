export const useDocsPage = async (project, page = 'home') => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
    
    try {
        const { slug, title, content } = await $fetch(`${BASE_URL}/v1/projects/${project}/docs/${page}`);
        return { slug, title, content: parseWikiLinks(parseNotices(content), project) };
    } catch {
        return { slug: page, title: null, content: null };
    }
}

const parseNotices = (text) => {
    let parsed = text;
    const notices = parsed.matchAll(/> \*\*([^\*]*)\*\* ([^\n]*)\n([^\n]*)\n/g);
    for (const notice of notices) {
        const noticeTitle = notice[1];
        const noticeType = noticeTitle.replace(":", "").toLowerCase() === 'warning' ? 'warning' : 'info';
        const noticeBody = notice[2];
        parsed = parsed.replace(notice[0], `::notice\n----\ntitle: '${noticeTitle}'\ntype: '${noticeType}'\n----\n\n${noticeBody}\n\n::\n`);
    }
    return parsed;
}

const parseWikiLinks = (text, project) => {
    let parsed = text;
    const wikiLinks = parsed.matchAll(/\[\[([^\]]*)\]\]/g);
    for (const link of wikiLinks) {
        const linkName = link[1];
        const linkPath = linkName.replace(/ /g, '-').toLowerCase();
        parsed = parsed.replace(link[0], `[${linkName}](/docs/${project}/${linkPath})`);
    }
    return parsed;
}