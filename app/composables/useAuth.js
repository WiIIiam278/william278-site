const AUTH_COOKIE = "JSESSIONID";
const XSRF_COOKIE = "XSRF-TOKEN";

export const useAuth = () => {
    const { COOKIE_DOMAIN, SESSION_EXPIRY_DAYS } = useRuntimeConfig().public;
    const auth = useCookie(AUTH_COOKIE, { domain: COOKIE_DOMAIN, maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS });
    const xsrf = useCookie(XSRF_COOKIE, { domain: COOKIE_DOMAIN, maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS });

    if (import.meta.server) {
        auth.value = useCookie(AUTH_COOKIE, { domain: COOKIE_DOMAIN, value: auth.value, maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS }).value;
        xsrf.value = useCookie(XSRF_COOKIE, { domain: COOKIE_DOMAIN, value: xsrf.value, maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS }).value;
        useState('auth', () => auth.value);
        useState('xsrf', () => xsrf.value);
    } else if (import.meta.client) {
        auth.value = useState('auth').value;
        xsrf.value = useState('xsrf').value;
    }

    return { auth: auth.value, xsrf: xsrf.value };
}