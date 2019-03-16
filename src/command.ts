import { resolve } from "path";

export interface Command {
	run: string[];
}

export function parseCommand(argv: string[], context: string): Command {
	// TODO: Parse arguments.
	return {
		run: argv.map(filename => resolve(filename))
	};
}
