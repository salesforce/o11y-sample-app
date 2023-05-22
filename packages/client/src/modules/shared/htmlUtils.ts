export function escapeForHtml(htmlStr: string): string {
    return htmlStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function setCode(
    parentDiv: HTMLDivElement,
    codeText: string,
    highlight?: boolean
): HTMLElement {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    pre.appendChild(code);
    code.innerHTML = escapeForHtml(codeText);
    parentDiv.replaceChildren(pre);

    if (highlight) {
        // @ts-ignore
        globalThis.hljs?.highlightElement(code);
    }
    return code as HTMLElement;
}
