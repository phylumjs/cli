
import { Container, Task, InstanceClass } from '@phylum/pipeline';
import { parseCommand, Command } from '../command';
import { resolve } from 'path';

export class InitTask extends Task<Array<Task<any>>> {
	public command: Command;

	async run() {
		this.command = parseCommand(process.argv.slice(2));
		const run = this.command.strings('run');
		if (run.length === 0) {
			throw new Error(`At least one task module must be specified.`);
		}

		return Promise.all(run.map(async filename => {
			const disposeContainer = this.disposable();
			const module = await import(resolve(filename));
			if (typeof module.default !== 'function') {
				throw new Error(`Task module's default export must be a task class: ${filename}`);
			}
			const container = new Container(this.container);
			disposeContainer.resolve(() => container.dispose());
			return container.get(module.default as InstanceClass<Task<any>>);
		}));
	}
}
