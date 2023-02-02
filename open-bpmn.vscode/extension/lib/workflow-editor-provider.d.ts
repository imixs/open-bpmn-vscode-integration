/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.01
 ********************************************************************************/
import { GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import { GlspEditorProvider } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import * as vscode from 'vscode';
export default class WorkflowEditorProvider extends GlspEditorProvider {
    protected readonly extensionContext: vscode.ExtensionContext;
    protected readonly glspVscodeConnector: GlspVscodeConnector;
    diagramType: string;
    constructor(extensionContext: vscode.ExtensionContext, glspVscodeConnector: GlspVscodeConnector);
    setUpWebview(_document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken, clientId: string): void;
}
//# sourceMappingURL=workflow-editor-provider.d.ts.map