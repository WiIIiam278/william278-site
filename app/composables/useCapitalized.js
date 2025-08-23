export const useCapitalized = (text, fully = false) => {
    if (!text) return text;
    if (fully) return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    else return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
};