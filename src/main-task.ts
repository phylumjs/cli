
import { Task } from '@phylum/pipeline';
import { config } from './config-task';

export default new Task<void>(async task => {
	const { command, main } = await task.use(config);
	await task.use(main);
});
