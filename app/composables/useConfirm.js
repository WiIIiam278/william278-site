export const useConfirm = (message, title = null, onClose = null, markdown = false) => {
    const modal = useState('modal');
    modal.value = {
        type: 'confirm',
        escapable: true,
        message,
        title,
        markdown,
        show: true,
        onClose
    };
    return modal;
}