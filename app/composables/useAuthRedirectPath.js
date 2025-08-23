const AUTH_REDIRECT_PATH_COOKIE = "X-AUTH-REDIRECT-PATH";

export const useAuthRedirectPath = () => {
    const { COOKIE_DOMAIN } = useRuntimeConfig().public;
    return useCookie(AUTH_REDIRECT_PATH_COOKIE, { domain: COOKIE_DOMAIN, maxAge: 60 });
}