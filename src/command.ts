
export class Command {
	private _args = new Map<string, string[]>();

	ensure(name: string): string[] {
		let values = this._args.get(name);
		if (!values) {
			this._args.set(name, values = []);
		}
		return values;
	}

	strings(name: string, defaultValue: string[] = []): string[] {
		return this._args.get(name) || defaultValue;
	}

	string(name: string, defaultValue: string = '') {
		return this.strings(name)[0] || defaultValue;
	}

	number(name: string, defaultValue: number = 0) {
		return Number(this.string(name) || defaultValue);
	}

	flag(name: string): boolean {
		return this._args.has(name);
	}
}

export function parseCommand(argv: string[]): Command {
	const command = new Command();

	let target = command.ensure('run');
	for (const arg of argv) {
		if (/--[^-]/.test(arg)) {
			const separator = arg.indexOf('=');
			if (separator < 0) {
				target = command.ensure(arg.slice(2));
			} else {
				command.ensure(arg.slice(2, separator)).push(arg.slice(separator + 1));
			}
		} else {
			target.push(arg);
		}
	}

	// command.ensure('run').push(...argv);
	return command;
}
