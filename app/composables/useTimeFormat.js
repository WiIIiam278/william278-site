const DF = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Europe/London' })
const DTF = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/London' })

export const useTimeFormat = (timestamp, time = false) => (time ? DTF : DF).format(new Date(timestamp));