#!/usr/bin/env node

import { Task } from '@phylum/pipeline';
import { CommandSpec, ArgumentSpec } from '@phylum/command';
import { resolve } from './resolve';
import { configure } from './config';
import { fork } from 'child_process';

(async () => {
	const argv = process.argv.slice(2);
	const spec = new CommandSpec().add({
		name: 'mainTask',
		defaultFallback: true,
		defaultValue: './pipeline'
	}).add({
		name: 'cliModule',
		defaultValue: '@phylum/cli/dist/cli'
	});
	let command = spec.parse(argv, {partial: true});

	const local = await resolve(command.cliModule);
	if (!local) {
		throw new Error(`Unable to resolve cli module: ${command.cliModule}`);
	} else if (local !== __filename) {
		const proc = fork(local, process.argv.slice(2), {
			cwd: process.cwd(),
			stdio: [0, 1, 2, 'ipc']
		});
		proc.on('error', error => {
			console.error(error);
			process.exit(1);
		});
		proc.on('exit', (code, signal) => {
			if (code || signal) {
				process.exit(1);
			}
		});
	} else {
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
	}
})();

process.on('unhandledRejection', error => {
	console.error(error);
	process.exit(1);
});

process.on('uncaughtException', error => {
	console.error(error);
	process.exit(1);
});
