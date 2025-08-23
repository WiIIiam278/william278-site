import { Buffer } from "buffer";

const validated = (parsed, bucketUrl) => parsed?.startsWith(bucketUrl) ? parsed : null;

export const useTranscriptUrl = (id) => {
    const BUCKET_URL = useRuntimeConfig().public.TRANSCRIPT_BUCKET_URL;
    return validated(Buffer.from(id, 'base64').toString('ascii'), BUCKET_URL);
}

export const useTranscript = async (id) => {
    const { data } = await useFetch(useTranscriptUrl(id), {
        deep: true
    });
    return data;
}