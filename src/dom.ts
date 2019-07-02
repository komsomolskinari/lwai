export function elm(
	str: string,
	callback?: (e: HTMLElement) => void
): HTMLElement[] {
	const ret = [].slice.call(document.querySelectorAll(str) || []);
	if (callback !== undefined) {
		ret.forEach((r): void => callback(r));
	}
	return ret;
}

export function listen(
	elem: HTMLElement[] | HTMLElement | string,
	env: string,
	callback: EventListener
): void {
	const h = typeof elem === 'string' ? elm(elem) : elem;
	const a = !Array.isArray(h) ? [h] : h;
	a.forEach((e): void => e.addEventListener(env, callback));
}

export function once(
	elem: HTMLElement[] | HTMLElement | string,
	env: string,
	callback: EventListener
): void {
	const h = typeof elem === 'string' ? elm(elem) : elem;
	const a = !Array.isArray(h) ? [h] : h;
	a.forEach((e): void => e.addEventListener(env, callback, { once: true }));
}

export function parseHTML(str: string): ChildNode | null {
	const dp = new DOMParser();
	const h = dp.parseFromString(str, 'text/html');
	return h.body.firstChild;
}
