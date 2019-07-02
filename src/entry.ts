import { readTime, readSize, humanSize, humanTime } from './format';

export const DIR = '/';
export const PARENT = '.';

export enum EntrySortKey {
	None,
	Name,
	Time,
	Size,
	Ext
}

export class Entry {
	private static NameSorter = (n1: Entry, n2: Entry): number =>
		n1.name.localeCompare(n2.name);
	private static TimeSorter = (n1: Entry, n2: Entry): number =>
		n1.mtime.getTime() - n2.mtime.getTime();
	private static SizeSorter = (n1: Entry, n2: Entry): number =>
		n1.size - n2.size;
	private static ExtSorter = (n1: Entry, n2: Entry): number =>
		n1.ext.localeCompare(n2.ext);

	public static Sorter(
		mode: EntrySortKey,
		reverse: boolean
	): (e1: Entry, e2: Entry) => number {
		return (e1: Entry, e2: Entry): number => {
			let L1Sorter: (n1: Entry, n2: Entry) => number;
			switch (mode) {
				case EntrySortKey.Name:
					L1Sorter = this.NameSorter;
					break;
				case EntrySortKey.Size:
					L1Sorter = this.SizeSorter;
					break;
				case EntrySortKey.Time:
					L1Sorter = this.TimeSorter;
					break;
				case EntrySortKey.Ext:
					L1Sorter = this.ExtSorter;
					break;
				default:
					throw new Error('No sorter selected');
			}
			const s = this.SorterFn(e1, e2, L1Sorter, reverse);
			return reverse ? -s : s;
		};
	}

	private static SorterFn(
		e1: Entry,
		e2: Entry,
		L1Sorter: (n1: Entry, n2: Entry) => number,
		reverse: boolean
	): number {
		// Keep parent-dir-file order
		if (e1.ext == PARENT) return reverse ? 1 : -1;
		else if (e2.ext == PARENT) return reverse ? -1 : 1;
		if (e1.dir !== e2.dir) {
			// one is dir, one not, if e1 is, e1 first
			const r = e1.dir ? -1 : 1;
			return reverse ? -r : r;
		}
		for (let sorter of [
			L1Sorter,
			this.NameSorter,
			this.SizeSorter,
			this.TimeSorter,
			this.ExtSorter
		]) {
			const val = sorter(e1, e2);
			if (val) {
				return val;
			}
		}
		return 0;
	}

	private name = '';
	private mtime: Date = new Date('fail');
	private size = 0;
	private dir = false;
	private ext = '';
	public constructor(name: string, time: string, size: string) {
		if (name.match(/\/$/)) {
			this.dir = true;
			this.name = name.substr(0, name.length - 1);
			this.ext = DIR;
			if (this.name === '..') this.ext = PARENT;
		} else {
			this.dir = false;
			this.name = name;
			this.ext = (name.match(/\.([0-9a-z]+)$/i) || ['', ''])[1];
		}
		this.size = readSize(size);
		this.mtime = readTime(time);
	}

	public toDOMStr(): string {
		const origName = this.name + (this.dir ? '/' : '');
		return `<tr><td><a href="${origName}">${origName}</a></td><td>${
			this.ext === PARENT ? '-' : humanTime(this.mtime)
		}</td><td>${this.dir ? '-' : humanSize(this.size)}</td></tr>`;
	}
}
