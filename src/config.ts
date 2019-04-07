
import { Task } from '@phylum/pipeline';
import { Command } from '@phylum/command';

export const config = new Task(async () => current);

const current: Config = {
	command: {}
};

interface Config {
	readonly command: Command
};

export function configure(newConfig: Partial<Config>) {
	Object.assign(current, newConfig);
	config.reset();
}
