function cssloader(content) {
    return content;
}

function styleloader(content) {
    const style= document.createElement('style')
    style.innerHTML(content);
    document.head.appendChild(style);
}
