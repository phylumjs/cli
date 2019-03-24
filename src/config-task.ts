
import { Task } from '@phylum/pipeline';
import { CommandSpec } from '@phylum/command';
import { Command } from './command';
import { resolve } from 'path';

function modulePath(value: string) {
	if (/^(\.\.|\.)(\\|\/|$)/.test(value)) {
		value = resolve(value);
	}
	return value;
}

export const config = new Task<{command: Command, main: Task<any>}>(async task => {
	const argv = process.argv.slice(2);
	const spec = new CommandSpec([
		{
			name: 'run',
			type: modulePath,
			defaultFallback: true,
			defaultValue: modulePath('./pipeline')
		}
	]);

	const command = spec.parse(argv, {partial: true}) as Command;
	const module = await import(command.run);

	if (!module.default || !module.default.pipe) {
		throw new Error(`Default export must be a task: "${command.run}"`);
	}

	if (Array.isArray(module.args)) {
		module.args.forEach(s => spec.add(s));
	}

	return {
		command: spec.parse(argv) as Command,
		main: module.default
	};
});
