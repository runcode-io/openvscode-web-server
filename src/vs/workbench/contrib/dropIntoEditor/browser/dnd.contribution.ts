/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerEditorContribution } from 'vs/editor/browser/editorExtensions';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { DropIntoEditorContribution } from 'vs/workbench/contrib/dropIntoEditor/browser/dndEditorContribution';
import { IDropIntoEditorService, DropIntoEditorService } from 'vs/workbench/contrib/dropIntoEditor/browser/dndService';


registerEditorContribution(DropIntoEditorContribution.ID, DropIntoEditorContribution);

registerSingleton(IDropIntoEditorService, DropIntoEditorService, true);
