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
phylum <...task-modules>
```

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
const { getCommand } = require('@phylum/cli');

exports.default = class MyTask extends Task {
	async run() {
		const command = getCommand(this);
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
