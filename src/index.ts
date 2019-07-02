import { elm, listen } from './dom';
import { Entry, EntrySortKey } from './entry';
import { humanSize } from './format';

const entries: Entry[] = [];

function drawContent(): void {
	const ih = entries.reduce(
		(p: string, c: Entry): string => p + c.toDOMStr(),
		''
	);
	elm('tbody', (e): void => {
		e.innerHTML = ih;
	});
	elm('#sumsize', (span): void => {
		span.innerText = humanSize(
			Number(span.innerText.substr(0, span.innerText.length - 1))
		);
	});
}

let lastSortBy = EntrySortKey.None;
let reverse = false;

function sortAndDraw(by: EntrySortKey): void {
	reverse = lastSortBy === by ? !reverse : false;
	lastSortBy = by;
	entries.sort(Entry.Sorter(by, reverse));
	drawContent();
}

function pathExpander(path: string): string {
	const pathpart = ['/'].concat(
		path
			.split('/')
			.filter(s => s)
			.map(s => s + '/')
	);
	const urls: string[] = [];
	pathpart.reduce((p: string, c: string) => {
		const url = p + c;
		urls.push(`<a href="${url}">${c}</a>`);
		return url;
	}, '');
	return urls.join('');
}

document.addEventListener('DOMContentLoaded', (): void => {
	elm('tbody>tr', (tr): void => {
		if (!tr) return;
		const name = (tr.firstChild as HTMLElement).innerText;
		const mtime = (tr.children[1] as HTMLElement).innerText;
		const size = (tr.lastChild as HTMLElement).innerText;
		entries.push(new Entry(name, mtime, size));
	});

	listen('thead>tr>th:first-child', 'click', () => {
		sortAndDraw(EntrySortKey.Name);
	});
	listen('thead>tr>th:nth-child(2)', 'click', () => {
		sortAndDraw(EntrySortKey.Time);
	});
	listen('thead>tr>th:last-child', 'click', () => {
		sortAndDraw(EntrySortKey.Size);
	});
	listen('thead>tr>th', 'click', e => {
		elm('thead>tr>th', n => {
			n.classList.remove('selected');
			if (reverse) {
				n.classList.add('reversed');
			} else n.classList.remove('reversed');
		});
		(e.target as HTMLElement).classList.add('selected');
	});

	elm('#path', e => {
		e.innerHTML = pathExpander(e.innerText);
	});

	sortAndDraw(EntrySortKey.Name);
});
