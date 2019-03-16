
import { Task } from '@phylum/pipeline';
import { InitTask } from './init';

export class MainTask extends Task<void> {
	async run() {
		const tasks = await this.use(InitTask);
		for (const task of tasks) {
			await this.useSource(task);
		}
	}
}
