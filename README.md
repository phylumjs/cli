# Phylum cli (wip)

## Installation
```bash
npm i @phylum/cli @phylum/pipeline
```
*The phylun cli requires node 10 or later*

## Language Support
Currently, only plain javascript (or precompiled code) is supported.

<br>



# Usage
```bash
phylum [...args]
```
The optional configuration (**phylum.json**) is read from the current working directory:
```js
{
	// The task modules to run.
	// - can be a string or an array of strings.
	// - Cli usage: --run <...>
	"run": ["./pipeline"]
}
```

## Task modules
A task module's default export must be a task implementation:
```js
'use strict';
// example.js

const { Task } = require('@phylum/pipeline');

exports.default = class MyTask extends Task {
	async run() {
		console.log('Hello World!');
	}
}
```
```bash
phylum example
# => Hello World!
```

## Configuration API
```js
'use strict';
// example.js

const { Task } = require('@phylum/pipeline');
const { ConfigTask } = require('@phylum/cli');

exports.default = class MyTask extends Task {
	async run() {
		// Get the results from the cli configuration task:
		const {command, config, tasks} = await this.use(ConfigTask);
		/*
			# command:
			An object exposing parsed command line args.

			# config:
			An object exposing the normalized configuration.

			# tasks:
			An array of task instances that were run.
		*/

		// Example usage:
		console.log(command.string('message', 'Hello World!'));
	}
}
```
```bash
phylum example
# => Hello World!

phylum example --message "Foo, bar"
# => Foo, bar
```

## Containers
Every task module will run in it's own isolated container.<br>
The top-level container can be accessed using the config task:
```ts
'use strict';
// example.js

const { Task } = require('@phylum/pipeline');
const { ConfigTask } = require('@phylum/cli');

exports.default = class MyTask extends Task {
	async run() {
		const topLevelContainer = this.container.get(ConfigTask).container;
	}
}
```
