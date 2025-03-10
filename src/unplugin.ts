import type {
	CallExpression,
	ImportDeclaration,
	MemberExpression,
} from 'acorn';
import MagicString from 'magic-string';
import type { UnpluginFactory } from 'unplugin';
import { createUnplugin } from 'unplugin';
import { walk } from 'zimmerframe';
import { join } from 'node:path';

export interface Options {
	outdir: string;
}

export const unpluginFactory: UnpluginFactory<Options> = ({ outdir }) => ({
	name: 'vite-plugin-transform-paraglide-nesting',
	enforce: 'post',
	resolveId(source) {
		if (source === '$paraglide') {
			return join(process.cwd(), outdir, '/messages.js');
		}
		return null;
	},
	transform(code) {
		try {
			const ast = this.parse(code);
			let m_name: string | undefined;
			walk(
				ast as unknown as ImportDeclaration,
				{},
				{
					ImportDeclaration(node) {
						if (node.source.value === `$paraglide`) {
							const m_import = node.specifiers.find(
								(specifier) => {
									return (
										specifier.type === 'ImportSpecifier' &&
										specifier.imported.type ===
											'Identifier' &&
										specifier.imported.name === 'm'
									);
								},
							);
							if (m_import) {
								m_name = m_import.local.name;
							}
						}
					},
				},
			);
			if (!m_name) return code;
			const source = new MagicString(code);
			walk(
				ast as unknown as CallExpression,
				{},
				{
					CallExpression(node, { next }) {
						if (node.callee.type === 'MemberExpression') {
							function left_most(member: MemberExpression) {
								if (member.object.type === 'MemberExpression') {
									return left_most(member.object);
								}
								return member.object;
							}
							const initial = left_most(node.callee);
							if (
								initial.type === 'Identifier' &&
								initial.name === m_name
							) {
								const key = code
									.substring(
										node.callee.start,
										node.callee.end,
									)
									.replace(`${m_name}.`, '');
								source.update(
									node.callee.start,
									node.callee.end,
									`${m_name}['${key}']`,
								);
							}
						}
						next();
					},
				},
			);
			return {
				code: source.toString(),
				map: source.generateMap({ hires: true }),
			};
		} catch {
			/* empty */
		}
		return code;
	},
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);
