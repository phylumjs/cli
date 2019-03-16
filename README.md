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
# Run one or more task modules:
phylum [[--run] <...task-modules>]
```
+ `task-modules` - One or more task modules to run. Defaults to `"pipeline"`.

## Task modules
A task module's default export must be a task implementation:
```js
'use strict';

const { Task } = require('@phylum/pipeline');

exports.default = class MyTask extends Task {
	async run() {
		console.log('Hello World!');
	}
}
```
```bash
phylum example.js
# => Hello World!
```

## Command line args
```js
'use strict';

const { Task } = require('@phylum/pipeline');
const { ConfigTask } = require('@phylum/cli');

exports.default = class MyTask extends Task {
	async run() {
		// Get the results from the cli configuration task:
		const {command} = await this.use(ConfigTask);

		console.log(command.string('message', 'Hello World!'));
	}
}
```
```bash
phylum example.js
# => Hello World!

phylum example.js --message "Foo, bar"
# => Foo, bar
```

## Containers
Every task module will run in it's own unique container.
