#!/usr/bin/env node

import { Container, EventAggregator, TaskError, Task } from '@phylum/pipeline';
import { resolve } from 'path';

interface TaskModule {
	default: {new(): Task<any>};
}

const container = new Container();
const failingTasks = new Set<Task<any>>();

container.get(EventAggregator).subscribe<TaskError>(TaskError, error => {
	console.error(error.error);
	process.exit(1);
});

let disposed = false;
process.on('SIGINT', () => {
	if (disposed) {
		process.exit(1);
	} else {
		disposed = true;
		container.dispose().then(() => {
			process.exit();
		});
	}
});

async function prepareTask(filename) {
	const module = await import(resolve(filename)) as TaskModule;
	if (typeof module.default !== 'function') {
		throw new TypeError(`Default export must be a task class: ${filename}`);
	}
	const task = container.get(module.default);
	task.pipe(state => {
		state.then(() => {
			failingTasks.delete(task);
			if (failingTasks.size === 0) {
				process.exitCode = 0;
			}
		}).catch(error => {
			console.error(error);
			failingTasks.add(task);
			process.exitCode = 1;
		});
	});
	return task;
}

Promise.all(process.argv.slice(2).map(prepareTask)).then(tasks => {
	tasks.forEach(task => task.activate());
}).catch(error => {
	console.error(error);
	process.exit(1);
});
