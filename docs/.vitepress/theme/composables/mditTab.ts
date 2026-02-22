import { inBrowser, onContentUpdated } from 'vitepress'

export function useMditTab(): void {
    if (inBrowser) {
        window.addEventListener('click', (event) => {
            const el = event.target as Element;
            if (el.matches('button.tabs-tab-button')) {
                if (el.classList.contains('active')) return;

                const index = el.getAttribute('data-tab');
                if (!index) return;

                const wrapper = el.parentElement?.parentElement;
                if (!wrapper) return;

                const wrapperId = wrapper.getAttribute('data-id');
                const tabId = el.getAttribute('data-id');
                if (wrapperId && tabId) {
                    document.querySelectorAll(`.tabs-tabs-wrapper[data-id="${wrapperId}"]`).forEach(w => {
                        activateTab(w, tabId, true);
                    });
                }
                else {
                    activateTab(wrapper, index);
                }
            }
        });
    }
}

function activateTab(wrapper: Element, key: string, useId: boolean = false): void {
    const header = wrapper.querySelector(':scope > .tabs-tabs-header');
    if (!header) return;

    const container = wrapper.querySelector(':scope > .tabs-tabs-container');
    if (!container) return;

    Array.from(header.children).forEach(child => {
        child.classList.remove('active');
    });

    Array.from(container.children).forEach(child => {
        child.classList.remove('active');
    });

    const targetButton = header.querySelector(`:scope > .tabs-tab-button[${useId ? "data-id" : "data-tab"}="${key}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    const targetTab = container.querySelector(`:scope > .tabs-tab-content[${useId ? "data-id" : "data-index"}="${key}"]`);
    if (targetTab) {
        activateElement(targetTab);
    }
}

function activateElement(el: Element): void {
    el.classList.add('active')
    window.dispatchEvent(
        new CustomEvent('mdit:TabsTabActivate', { detail: el })
    )
}