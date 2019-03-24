#!/usr/bin/env node

import { dispose } from '@phylum/pipeline';
import mainTask from './main-task';

process.on('unhandledRejection', error => {
	console.error(error);
	process.exit(1);
});

process.on('uncaughtException', error => {
	console.error(error);
	process.exit(1);
});

mainTask.pipe(state => state.then(() => {
	process.exitCode = 0;
}, error => {
	console.error(error);
	process.exitCode = 1;
}));

let current = mainTask.start();
process.on('SIGINT', () => {
	if (current) {
		dispose(current);
		current = null;
	} else {
		process.exit(1);
	}
});
