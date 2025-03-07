import { paraglideRollupPlugin } from '@inlang/paraglide-js';
import { unplugin } from './unplugin.js';
import { add_additional_files } from './utils.js';

export function paraglide(args: Parameters<typeof paraglideRollupPlugin>[0]) {
	return [
		paraglideRollupPlugin(add_additional_files(args)),
		unplugin.esbuild({ outdir: args.outdir }),
	];
}
