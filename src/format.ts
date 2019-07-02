export function readTime(time: string): Date {
	const ltime = new Date(time);
	return new Date(
		Date.UTC(
			ltime.getFullYear(),
			ltime.getMonth(),
			ltime.getDate(),
			ltime.getHours(),
			ltime.getMinutes(),
			ltime.getSeconds()
		)
	);
}

export function readSize(size: string): number {
	let s = size.trim();
	if (!s.match(/[0-9]$/)) s = s.substr(0, s.length - 1);
	return Number(s);
}

const sizeDigit = 2;
export function humanSize(size: number): string {
	const gradeName = 'BKMGTPEZY';
	let grade = 0;
	let shortSize = size;
	while (shortSize >= 1024) {
		shortSize /= 1024;
		grade++;
	}

	if (grade > gradeName.length) {
		grade = gradeName.length;
		shortSize = size / 1024 ** gradeName.length;
	}

	const rawSizeStr = shortSize.toFixed(sizeDigit);
	const sizeIsInt =
		Math.abs(Number(rawSizeStr) - Math.floor(shortSize)) < 1e-5;
	const sizeStr =
		(sizeIsInt ? shortSize.toFixed(0) : rawSizeStr) + gradeName[grade];
	return sizeStr;
}

export function timePart(
	time: Date,
	utc?: boolean
): [number, number, number, number, number, number] {
	return utc
		? [
				time.getUTCFullYear(),
				time.getUTCMonth() + 1,
				time.getUTCDate(),
				time.getUTCHours(),
				time.getUTCMinutes(),
				time.getUTCSeconds()
		  ]
		: [
				time.getFullYear(),
				time.getMonth() + 1,
				time.getDate(),
				time.getHours(),
				time.getMinutes(),
				time.getSeconds()
		  ];
}

export function leftPad0(num: number): string {
	const ret = Math.floor(num) + '';
	return ret.length > 1 ? ret : '0' + ret;
}

export function humanTime(time: Date): string {
	const [y, m, d, h, i, s] = timePart(time, true).map(leftPad0);
	return `${y}-${m}-${d} ${h}:${i}:${s}`;
}
