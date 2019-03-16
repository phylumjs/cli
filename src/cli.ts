#!/usr/bin/env node

import { Container } from '@phylum/pipeline';
import { MainTask } from './tasks/main';

const mainContainer = new Container();
const mainTask = mainContainer.get(MainTask);

mainTask.pipe(state => state.then(() => {
	process.exitCode = 0;
}, error => {
	console.error(error);
	process.exitCode = 1;
}));

mainTask.activate();
