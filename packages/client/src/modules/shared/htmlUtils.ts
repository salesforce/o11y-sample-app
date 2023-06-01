export function escapeForHtml(htmlStr: string): string {
    return htmlStr
        ? htmlStr
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
        : htmlStr;
}

export function setCode(parentDiv: HTMLDivElement, codeText: string, margin?: string): HTMLElement {
    const pre = document.createElement('pre');
    if (margin !== undefined) {
        pre.style.margin = margin;
    }
    const code = document.createElement('code');
    pre.appendChild(code);
    code.innerHTML = escapeForHtml(codeText);
    parentDiv.replaceChildren(pre);

    // @ts-ignore
    globalThis.hljs?.highlightElement(code);

    return code as HTMLElement;
}
