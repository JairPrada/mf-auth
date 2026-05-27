import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import Otp from './Otp';
import { manifest } from './manifest';

// Auto-inject this MF's stylesheet
const cssUrl = new URL('./remoteEntry.css', import.meta.url).href;
if (!document.querySelector(`link[href="${cssUrl}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
}

const roots = new WeakMap<HTMLElement, Root>();

export default {
    manifest,
    mount(el: HTMLElement, props: Record<string, unknown>): void {
        const root = createRoot(el);
        roots.set(el, root);
        root.render(createElement(Otp, props as unknown as Parameters<typeof Otp>[0]));
    },
    unmount(el: HTMLElement): void {
        roots.get(el)?.unmount();
        roots.delete(el);
    },
};
