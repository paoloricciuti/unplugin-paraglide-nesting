import { paraglideEsbuildPlugin } from '@inlang/paraglide-js';
import { unplugin } from './unplugin.js';
import { add_additional_files } from './utils.js';

export function paraglide(args: Parameters<typeof paraglideEsbuildPlugin>[0]) {
	return [
		paraglideEsbuildPlugin(add_additional_files(args)),
		unplugin.esbuild({ outdir: args.outdir }),
	];
}
