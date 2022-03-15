/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export interface ITextEditorDataTransferItem {
	asString(): Thenable<string>;
	value: any;
}

export type ITextEditorDataTransfer = Map<string, ITextEditorDataTransferItem>;
