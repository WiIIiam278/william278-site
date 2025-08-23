export const useAssetInput = (message, title = "Select Asset", onClose = null, contentTypeFilter = null) => {
    const modal = useState('modal');
    modal.value = {
        type: 'asset',
        escapable: false,
        message,
        title,
        contentTypeFilter,
        inputText: null,
        show: true,
        onClose
    };
    return modal;
}