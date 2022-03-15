/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerEditorContribution } from 'vs/editor/browser/editorExtensions';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { DndEditorContribution } from 'vs/workbench/contrib/dnd/browser/dndEditorContribution';
import { ITextEditorDragAndDropService, TextEditorDragAndDropService } from 'vs/workbench/contrib/dnd/browser/dndService';


registerEditorContribution(DndEditorContribution.ID, DndEditorContribution);

registerSingleton(ITextEditorDragAndDropService, TextEditorDragAndDropService, true);
