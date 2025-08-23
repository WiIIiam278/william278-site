export const useUpsell = (title, project) => {
    const modal = useState('modal');
    modal.value = {
        type: 'upsell',
        escapable: false,
        title,
        project,
        show: true
    };
    return modal;
}