export async function elm(
	str: string,
	callback?: ((e: HTMLElement) => void) | ((e: HTMLElement) => Promise<void>)
): Promise<HTMLElement[]> {
	const ret = [].slice.call(document.querySelectorAll(str) || []);
	if (callback !== undefined) {
		const pm = ret.map(
			(r): Promise<void> => {
				const c = callback(r);
				return c instanceof Promise
					? c
					: // eslint-disable-next-line @typescript-eslint/no-unused-vars
					  new Promise((f1, f2) => f1);
			}
		);
		await Promise.all(pm);
	}
	return ret;
}

async function elemAsArray(
	elem: HTMLElement[] | HTMLElement | string
): Promise<HTMLElement[]> {
	const h = typeof elem === 'string' ? await elm(elem) : elem;
	return Array.isArray(h) ? h : [h];
}

export async function listen(
	elem: HTMLElement[] | HTMLElement | string,
	env: string,
	callback: EventListener
): Promise<void> {
	const a = await elemAsArray(elem);
	a.forEach((e): void => e.addEventListener(env, callback));
}

export async function once(
	elem: HTMLElement[] | HTMLElement | string,
	env: string,
	callback: EventListener
): Promise<void> {
	const a = await elemAsArray(elem);
	a.forEach((e): void => e.addEventListener(env, callback, { once: true }));
}

export function parseHTML(str: string): ChildNode | null {
	const dp = new DOMParser();
	const h = dp.parseFromString(str, 'text/html');
	return h.body.firstChild;
}
