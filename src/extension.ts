import type * as vscode from 'vscode';
import { registerRenderers } from './renderers';
import type { MarkdownIt } from './renderers/types';

// Activated by VS Code's built-in Markdown preview (see "markdown.markdownItPlugins" in package.json).
export function activate(_context: vscode.ExtensionContext) {
	return {
		extendMarkdownIt(md: MarkdownIt) {
			return registerRenderers(md);
		},
	};
}

export function deactivate() {}
