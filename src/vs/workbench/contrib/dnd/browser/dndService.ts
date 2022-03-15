/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from 'vs/base/common/cancellation';
import { IDisposable, toDisposable } from 'vs/base/common/lifecycle';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Position } from 'vs/editor/common/core/position';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { ITextEditorDataTransfer } from 'vs/workbench/contrib/dnd/common/dataTransfer';

export const ITextEditorDragAndDropService = createDecorator<ITextEditorDragAndDropService>('textEditorDragAndDropService');


export interface ITextEditorDragAndDropService {
	_serviceBrand: undefined;

	registerTextEditorDragAndDropController(controller: TextEditorDragAndDropController): IDisposable;

	getControllers(editor: ICodeEditor): TextEditorDragAndDropController[];
}

export interface TextEditorDragAndDropController {
	handleDrop(editor: ICodeEditor, position: Position, source: ITextEditorDataTransfer, token: CancellationToken): Promise<void>;
}

export class TextEditorDragAndDropService implements ITextEditorDragAndDropService {

	_serviceBrand: undefined;

	private _handlePool = 1;
	private readonly _controllers = new Map<number, TextEditorDragAndDropController>();

	registerTextEditorDragAndDropController(controller: TextEditorDragAndDropController): IDisposable {
		const handle = this._handlePool++;
		this._controllers.set(handle, controller);
		return toDisposable(() => {
			this._controllers.delete(handle);
		});
	}

	getControllers(editor: ICodeEditor): TextEditorDragAndDropController[] {
		return Array.from(this._controllers.values());
	}
}
