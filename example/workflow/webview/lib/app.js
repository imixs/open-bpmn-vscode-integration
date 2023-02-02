"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launch = void 0;
/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
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
const workflow_glsp_1 = require("@eclipse-glsp-examples/workflow-glsp");
const vscode_integration_webview_1 = require("@eclipse-glsp/vscode-integration-webview");
require("@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css");
class WorkflowGLSPStarter extends vscode_integration_webview_1.GLSPStarter {
    createContainer(diagramIdentifier) {
        return (0, workflow_glsp_1.createWorkflowDiagramContainer)(diagramIdentifier.clientId);
    }
}
function launch() {
    new WorkflowGLSPStarter();
}
exports.launch = launch;
//# sourceMappingURL=app.js.map