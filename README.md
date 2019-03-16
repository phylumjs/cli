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
```ts
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

## Containers
Every task module will run in it's own unique container.
