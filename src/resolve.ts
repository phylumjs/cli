
import nodeResolve = require('resolve');

export function resolve(request: string, basedir = process.cwd()) {
	return new Promise<string>((resolve, reject) => {
		nodeResolve(request, { basedir }, (error, resolved) => {
			if (error && error['code'] !== 'MODULE_NOT_FOUND') {
				reject(error);
			} else {
				resolve(resolved);
			}
		});
	});
}
