export const useTransactionsChart = async (pastDays, dayGrouping, title) => {
    const BASE_URL = useRuntimeConfig().public.API_BASE_URL;

    const queryParams = { pastDays: pastDays, dayGrouping: dayGrouping };
    const { auth, xsrf } = useAuth();
    const { data } = await useFetch(`${BASE_URL}/v1/charts/transactions`, {
        method: 'GET',
        credentials: auth ? 'include' : 'omit',
        params: queryParams,
        headers: {
            'Cookie': `JSESSIONID=${auth}; XSRF-TOKEN=${xsrf}`,
            'X-XSRF-TOKEN': xsrf
        },
    });

    const { xAxis, series, totalValue } = data.value;
    const selectedList = {};
    series.map(s => {
        selectedList[s.name] = true;
        if (s.name === 'Total') {
            s.emphasis = { focus: 'series' };
            s.label = {
                normal: {
                    show: true,
                    position: 'top',
                    formatter: '£{c}'
                }
            }
        }
    });
    return {
        title: { 
            text: title,
            subtext: `Total: ${totalValue}`,
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        legend: { 
            data: series.map(s => s.name).sort((s1, s2) => s1 === 'Total' ? 100 : s1.localeCompare(s2)),
            bottom: '0',
            itemGap: 20,
            textStyle: {
                color: '#fff'
            },
            selected: selectedList
        },
        grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
        xAxis: xAxis,
        yAxis: { type: 'value' },
        series: series,
        darkMode: true
    };
}