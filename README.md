# Pipeline Cli

## Usage
```bash
npm i @phylum/cli @phylum/pipeline
```

```bash
# Basic usage:
npx phylum [[--run] <modulePath>]
```
+ `--run` - Specify the entry module that exports the task to run. Default is `./pipeline`

## Entry module
The entry module must be a commonjs module that exports a task instance as default:
```ts
const { Task } = require('@phylum/pipeline');

export.default = new Task(async () => {
	console.log('Hello World!');
});
```

## Arguments
The entry module can also export an array of [argument specs](https://github.com/phylumjs/command) for parsing custom command line arguments:
```ts
const { config } = require('@phylum/cli');

exports.default = new Task<void>(async t => {
	// Access parsed arguments:
	const {command} = await t.use(config);
	console.log(command.message);
});

exports.args = [
	{name: 'message', alias: 'm', defaultValue: 'Hello World!'}
];
```
```bash
npx phylum
# => Hello World!

npx phylum --message "Foo!"
# => Foo!
```
