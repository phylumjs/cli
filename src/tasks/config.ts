
import { Task, InstanceClass } from '@phylum/pipeline';
import { Command } from '../command';
import { Config } from '../config';
import { resolve, dirname } from 'path';
import { readJson } from 'fs-extra';

export class ConfigTask extends Task<{
	command: Command,
	config: Config,
	tasks: Array<Task<any>>
}> {
	async run() {
		const command = Command.parse(process.argv.slice(2), 'run');
		const config = new Config();
		config.defaults(process.cwd());

		const filename = resolve('phylum.json');
		await readJson(filename)
			.then(data => {
				config.apply(data, dirname(filename));
			})
			.catch(error => {
				if (error.code !== 'ENOENT') {
					throw error;
				}
			});

		if (command.has('run')) {
			config.applyRun(command.strings('run'), process.cwd());
		}

		config.validate();

		const tasks = await Promise.all(config.run.map(async request => {
			const child = this.createChild();
			const module = await import(request);
			if (typeof module.default !== 'function') {
				throw new Error(`Task module's default export must be a task class: ${request}`);
			}
			return child.get(module.default as InstanceClass<Task<any>>);
		}));

		return {
			command,
			config,
			tasks
		};
	}
}
