export const useInput = (message, title = "Input", inputText = null, inputValidator = null, onClose = null, markdown = false) => {
    const modal = useState('modal');
    modal.value = {
        type: 'input',
        escapable: false,
        message,
        title,
        markdown,
        inputText,
        show: true,
        inputValidator,
        onClose
    };
    return modal;
}