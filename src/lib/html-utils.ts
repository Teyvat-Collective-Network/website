export function select<T extends Element = Element>(selector: string): T {
    return document.querySelector(selector) as T;
}

export function select_nullable<T extends Element = Element>(selector: string): T | null {
    try {
        return select<T>(selector);
    } catch {
        return null;
    }
}

export function selectall<T extends Element = Element>(selector: string): T[] {
    try {
        return [...document.querySelectorAll(selector)] as T[];
    } catch {
        return [];
    }
}
