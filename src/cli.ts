#!/usr/bin/env node

import { Task } from '@phylum/pipeline';
import { CommandSpec, ArgumentSpec } from '@phylum/command';
import { resolve } from './resolve';
import { configure } from './config';

(async () => {
	const argv = process.argv.slice(2);
	const spec = new CommandSpec().add({
		name: 'mainTask',
		defaultFallback: true,
		defaultValue: './pipeline'
	});
	let command = spec.parse(argv, {partial: true});

	const current = __filename;
	const local = await resolve('@phylum/cli/dist/cli');
	if (local && local !== current) {
		throw new Error('Global installation is currently not supported.');
	}

	const modulePath = await resolve(command.mainTask);
	if (!modulePath) {
		throw new Error(`Main task module not found: ${command.mainTask}`);
	}

	const module = await import(modulePath);
	if (!(module.default instanceof Task)) {
		throw new Error(`Default export of main task module "${modulePath}" must be a task instance.`);
	}

	if (Array.isArray(module.args)) {
		module.args.forEach((s: ArgumentSpec) => spec.add(s));
		command = spec.parse(argv);
	}

	configure({ command });

	process.exitCode = 1;
	const main: Task<any> = module.default;
	main.start();
	main.pipe(state => {
		state.then(() => {
			process.exitCode = 0;
		}).catch(error => {
			console.error(error);
			process.exitCode = 1;
		});
	});
})();

process.on('unhandledRejection', error => {
	console.error(error);
	process.exit(1);
});

process.on('uncaughtException', error => {
	console.error(error);
	process.exit(1);
});
