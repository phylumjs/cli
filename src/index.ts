
import { Container, Task } from '@phylum/pipeline';
import { InitTask } from './tasks/init';
import { Command } from './command';

export function getCommand(container: Container | Task<any>): Command {
	if (container instanceof Task) {
		container = container.container;
	}
	if (!(container instanceof Container)) {
		throw new TypeError(`container must be a container or a task.`);
	}
	if (!container.has(InitTask)) {
		throw new TypeError(`The specified container is not part of a cli environment.`);
	}
	return container.get(InitTask).command;
}
