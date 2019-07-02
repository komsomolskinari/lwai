import { elm } from './dom';
import { Entry } from './entry';
import { humanSize } from './format';

const entries: Entry[] = [];
document.addEventListener('DOMContentLoaded', (): void => {
	elm('tbody>tr', (tr): void => {
		if (!tr) return;
		const name = (tr.firstChild as HTMLElement).innerText;
		const mtime = (tr.children[1] as HTMLElement).innerText;
		const size = (tr.lastChild as HTMLElement).innerText;
		entries.push(new Entry(name, mtime, size));
	});
	const ih = entries.reduce(
		(p: string, c: Entry): string => p + c.toDOMStr(),
		''
	);
	elm('tbody', (e): void => {
		e.innerHTML = ih;
	});
	elm('span', (span): void => {
		span.innerText = humanSize(
			Number(span.innerText.substr(0, span.innerText.length - 1))
		);
	});
});
