"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
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
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
const vscode_integration_1 = require("@eclipse-glsp/vscode-integration");
const quickstart_components_1 = require("@eclipse-glsp/vscode-integration/lib/quickstart-components");
const path = require("path");
const process = require("process");
require("reflect-metadata");
const vscode = require("vscode");
const config = require("./server-config.json");
const workflow_editor_provider_1 = require("./workflow-editor-provider");
const DEFAULT_SERVER_PORT = '5007';
const { version, isSnapShot } = config;
const JAVA_EXECUTABLE = path.join(__dirname, `../server/org.eclipse.glsp.example.workflow-${version}${isSnapShot ? '-SNAPSHOT' : ''}-glsp.jar`);
async function activate(context) {
    // Start server process using quickstart component
    if (process.env.GLSP_SERVER_DEBUG !== 'true') {
        const serverProcess = new quickstart_components_1.GlspServerLauncher({
            executable: JAVA_EXECUTABLE,
            socketConnectionOptions: { port: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT) },
            additionalArgs: ['--fileLog', 'true', '--logDir', path.join(__dirname, '../server')],
            logging: true,
            serverType: 'java'
        });
        context.subscriptions.push(serverProcess);
        await serverProcess.start();
    }
    // Wrap server with quickstart component
    const workflowServer = new quickstart_components_1.SocketGlspVscodeServer({
        clientId: 'glsp.workflow',
        clientName: 'workflow',
        serverPort: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT)
    });
    // Initialize GLSP-VSCode connector with server wrapper
    const glspVscodeConnector = new vscode_integration_1.GlspVscodeConnector({
        server: workflowServer,
        logging: true
    });
    const customEditorProvider = vscode.window.registerCustomEditorProvider('workflow.glspDiagram', new workflow_editor_provider_1.default(context, glspVscodeConnector), {
        webviewOptions: { retainContextWhenHidden: true },
        supportsMultipleEditorsPerDocument: false
    });
    context.subscriptions.push(workflowServer, glspVscodeConnector, customEditorProvider);
    workflowServer.start();
    (0, quickstart_components_1.configureDefaultCommands)({ extensionContext: context, connector: glspVscodeConnector, diagramPrefix: 'workflow' });
    context.subscriptions.push(vscode.commands.registerCommand('workflow.goToNextNode', () => {
        glspVscodeConnector.sendActionToActiveClient(vscode_integration_1.NavigateAction.create('next'));
    }), vscode.commands.registerCommand('workflow.goToPreviousNode', () => {
        glspVscodeConnector.sendActionToActiveClient(vscode_integration_1.NavigateAction.create('previous'));
    }), vscode.commands.registerCommand('workflow.showDocumentation', () => {
        glspVscodeConnector.sendActionToActiveClient(vscode_integration_1.NavigateAction.create('documentation'));
    }));
}
exports.activate = activate;
//# sourceMappingURL=workflow-extension.js.map