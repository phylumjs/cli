
import { Task } from '@phylum/pipeline';
import { ConfigTask } from './config';

export class MainTask extends Task<void> {
	async run() {
		const {tasks} = await this.use(ConfigTask);
		for (const task of tasks) {
			await this.useSource(task);
		}
	}
}
