const AUTH_COOKIE = "JSESSIONID";
const XSRF_COOKIE = "XSRF-TOKEN";

export const useAuth = () => {
    const cookieDomain = useRuntimeConfig().public.COOKIE_DOMAIN;
    const auth = useCookie(AUTH_COOKIE, { domain: cookieDomain });
    const xsrf = useCookie(XSRF_COOKIE, { domain: cookieDomain });

    if (import.meta.server) {
        auth.value = useCookie(AUTH_COOKIE, { domain: cookieDomain, value: auth.value }).value;
        xsrf.value = useCookie(XSRF_COOKIE, { domain: cookieDomain, value: xsrf.value }).value;
        useState('auth', () => auth.value);
        useState('xsrf', () => xsrf.value);
    } else if (import.meta.client) {
        auth.value = useState('auth').value;
        xsrf.value = useState('xsrf').value;
    }
    console.log(auth.value, xsrf.value);

    return { auth: auth.value, xsrf: xsrf.value };
}