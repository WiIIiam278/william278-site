export const useDump = async (id) => {
    const BASE_URL = useRuntimeConfig().public.DUMPS_BYTEBIN_URL;
    const { data } = await useFetch(`${BASE_URL}/${id}`, {
        deep: true
    });
    return data;
}