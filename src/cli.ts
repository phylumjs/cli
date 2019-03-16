#!/usr/bin/env node

import { Container, Task, InstanceClass } from '@phylum/pipeline';
import { parseCommand } from './command';

class InitTask extends Task<Array<Task<any>>> {
	async run() {
		const command = parseCommand(process.argv.slice(2), process.cwd());
		return Promise.all(command.run.map(async filename => {
			const disposeContainer = this.disposable();
			const module = await import(filename);
			if (typeof module.default !== 'function') {
				throw new TypeError(`Task module's default export must be a task class: ${filename}`);
			}
			const container = new Container(this.container);
			disposeContainer.resolve(() => container.dispose());
			return container.get(module.default as InstanceClass<Task<any>>);
		}));
	}
}

class MainTask extends Task<void> {
	async run() {
		const tasks = await this.use(InitTask);
		for (const task of tasks) {
			await this.useSource(task);
		}
	}
}

const mainContainer = new Container();
const mainTask = mainContainer.get(MainTask);

mainTask.pipe(state => state.then(() => {
	process.exitCode = 0;
}, error => {
	console.error(error);
	process.exitCode = 1;
}));

mainTask.activate();
