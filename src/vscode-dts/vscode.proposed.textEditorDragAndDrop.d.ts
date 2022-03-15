/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/142990
	export interface TextEditorDragAndDropController {
		handleDrop(editor: TextEditor, position: Position, dataTransfer: DataTransfer, token: CancellationToken): Thenable<void> | void;
	}

	export namespace window {
		export function registerTextEditorDragAndDropController(selector: DocumentSelector, controller: TextEditorDragAndDropController): Disposable;
	}
}
