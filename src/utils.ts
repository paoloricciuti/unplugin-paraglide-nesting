export function add_additional_files<
	T extends { additionalFiles?: Record<string, string> },
>(args: T): T {
	return {
		...args,
		additionalFiles: {
			...(args.additionalFiles ?? {}),
			'paraglide.d.ts': `declare module '$paraglide' {}`,
			'augment.paraglide.d.ts': `import { m as msg } from './messages';
				
declare module '$paraglide' {
	type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
		k: infer I
	) => void
		? I
		: never;

	type Str<T> = T extends string ? T : "";

	type PathToObj<TString, TOGKey = ""> = UnionToIntersection<TString extends \`\${infer First}.\${infer Rest}\` ? {
		[K in First]: PathToObj<Rest, \`\${TOGKey extends "" ? "" : \`\${Str<TOGKey>}.\`}\${First}\`>
	} : { [K in Str<TString>]: \`\${TOGKey extends "" ? "" : \`\${Str<TOGKey>}.\`}\${Str<TString>}\` }>;

	type ModuleToObj<Module, Obj = PathToObj<keyof Module>, OGModule = Module> = {
		[K in keyof Obj]: Obj[K] extends string ? Obj[K] extends keyof OGModule ? OGModule[Obj[K]] : never : ModuleToObj<Obj[K], Module, OGModule>
	};

	declare const m: ModuleToObj<typeof msg>;
}`,
		},
	};
}
