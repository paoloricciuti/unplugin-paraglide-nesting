import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { unplugin } from './unplugin.js';
import { add_additional_files } from './utils.js';

export function paraglide(args: Parameters<typeof paraglideVitePlugin>[0]) {
	return [
		paraglideVitePlugin(add_additional_files(args)),
		unplugin.vite({ outdir: args.outdir }),
	];
}
