import { readTime, readSize, humanSize, humanTime } from './format';

export const DIR = '/';
export const PARENT = '.';

export class Entry {
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
		console.log(this.name, this.mtime, this.size, this.dir, this.ext);
	}

	public toDOMStr(): string {
		const origName = this.name + (this.dir ? '/' : '');
		return `<tr><td><a href="${origName}">${origName}</a></td><td>${
			this.ext === PARENT ? '-' : humanTime(this.mtime)
		}</td><td>${this.dir ? '-' : humanSize(this.size)}</td></tr>`;
	}
}
