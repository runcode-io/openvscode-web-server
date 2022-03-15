/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from 'vs/base/common/cancellation';
import { Disposable } from 'vs/base/common/lifecycle';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Position } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import { IEditorContribution, ScrollType } from 'vs/editor/common/editorCommon';
import { IModelDeltaDecoration } from 'vs/editor/common/model';
import { ModelDecorationOptions } from 'vs/editor/common/model/textModel';
import { DragAndDropObserver } from 'vs/workbench/browser/dnd';
import { IDropIntoEditorService } from 'vs/workbench/contrib/dropIntoEditor/browser/dndService';
import { ITextEditorDataTransfer, ITextEditorDataTransferItem } from 'vs/workbench/contrib/dropIntoEditor/common/dataTransfer';

export class DropIntoEditorContribution extends Disposable implements IEditorContribution {

	static readonly ID: string = 'editor.contrib.dropIntoEditor';

	private static readonly DECORATION_OPTIONS = ModelDecorationOptions.register({
		description: 'workbench-dnd-target',
		className: 'dnd-target'
	});

	private _dndDecorationIds: string[] = [];

	constructor(
		private readonly editor: ICodeEditor,
		@IDropIntoEditorService dropIntoEditorService: IDropIntoEditorService,
	) {
		super();

		this._register(new DragAndDropObserver(this.editor.getContainerDomNode(), {
			onDragEnter: () => undefined,
			onDragOver: e => {
				const target = this.editor.getTargetAtClientPoint(e.clientX, e.clientY);
				if (target?.position) {
					this.showAt(target.position);
				}
			},
			onDrop: async e => {
				this._removeDecoration();

				if (!e.dataTransfer) {
					return;
				}

				const target = this.editor.getTargetAtClientPoint(e.clientX, e.clientY);
				if (target?.position) {
					const dataTransfer: ITextEditorDataTransfer = new Map<string, ITextEditorDataTransferItem>();

					for (const item of e.dataTransfer.items) {
						if (item.kind === 'string') {
							const type = item.type;
							const asStringValue = new Promise<string>(resolve => item.getAsString(resolve));
							dataTransfer.set(type, {
								asString: () => asStringValue,
								value: undefined
							});
						}
					}

					if (dataTransfer.size > 0) {
						const controllers = dropIntoEditorService.getControllers(this.editor);
						for (const controller of controllers) {
							await controller.handleDrop(editor, target.position, dataTransfer, CancellationToken.None); // todo: add cancellation
						}
					}
				}
			},
			onDragLeave: () => {
				this._removeDecoration();
			},
			onDragEnd: () => {
				this._removeDecoration();
			},
		}));
	}

	private showAt(position: Position): void {
		let newDecorations: IModelDeltaDecoration[] = [{
			range: new Range(position.lineNumber, position.column, position.lineNumber, position.column),
			options: DropIntoEditorContribution.DECORATION_OPTIONS
		}];

		this._dndDecorationIds = this.editor.deltaDecorations(this._dndDecorationIds, newDecorations);
		this.editor.revealPosition(position, ScrollType.Immediate);
	}

	private _removeDecoration(): void {
		this._dndDecorationIds = this.editor.deltaDecorations(this._dndDecorationIds, []);
	}
}
