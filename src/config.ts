
import { resolve } from 'path';

function moduleRequest(request: string, context: string) {
	if (/^(?:\.\.|\.)(?:[\\/]|$)/.test(request)) {
		return resolve(context, request);
	}
	return request;
}

export class Config {
	run: string[];

	public defaults(context: string) {
		this.run = [moduleRequest('./pipeline', context)]
	}

	public apply(value: Partial<Config>, context: string) {
		if (value.run) {
			this.applyRun(value.run, context);
		}
	}

	public applyRun(value: string[], context: string) {
		if (typeof value === 'string') {
			this.run = [moduleRequest(value, context)];
		}
		if (!Array.isArray(value)) {
			throw new TypeError('config.run must be a string or an array.');
		}
		this.run = value.map(request => moduleRequest(request, context));
	}

	public validate() {
		if (this.run.length === 0) {
			throw new Error('No tasks are specified to run.');
		}
	}
}
