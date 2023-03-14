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
import {
  GlspVscodeConnector,
  NavigateAction,
} from "@eclipse-glsp/vscode-integration";
import {
  configureDefaultCommands,
  GlspServerLauncher,
  SocketGlspVscodeServer,
} from "@eclipse-glsp/vscode-integration/lib/quickstart-components";
import * as path from "path";
import * as process from "process";
import "reflect-metadata";
import * as vscode from "vscode";
import BPMNEditorProvider from "./open-bpmn-editor-provider";
import * as config from "./server-config.json";

const DEFAULT_SERVER_PORT = "5007";
const { version, isSnapShot, artifactId } = config;
const JAVA_EXECUTABLE = path.join(
  __dirname,
  `../server/${artifactId}-${version}${isSnapShot ? "-SNAPSHOT" : ""}-glsp.jar`
);

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  // Start server process using quickstart component
  if (process.env.GLSP_SERVER_DEBUG !== "true") {
    const serverProcess = new GlspServerLauncher({
      executable: JAVA_EXECUTABLE,
      socketConnectionOptions: {
        port: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT),
      },
      additionalArgs: [
        "--fileLog",
        "true",
        "--logDir",
        path.join(__dirname, "../server"),
      ],
      logging: true,
      serverType: "java",
    });
    context.subscriptions.push(serverProcess);
    await serverProcess.start();
  }

  // Wrap server with quickstart component
  const bpmnServer = new SocketGlspVscodeServer({
    // clientId: 'glsp.workflow',
    // clientName: 'workflow',
    clientId: "glsp.bpmn",
    clientName: "bpmn",
    serverPort: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT),
  });

  // Initialize GLSP-VSCode connector with server wrapper
  const glspVscodeConnector = new GlspVscodeConnector({
    server: bpmnServer,
    logging: true,
  });

  const customEditorProvider = vscode.window.registerCustomEditorProvider(
    // 'workflow.glspDiagram',
    "bpmn-diagram",
    new BPMNEditorProvider(context, glspVscodeConnector),
    {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    }
  );

  context.subscriptions.push(
    bpmnServer,
    glspVscodeConnector,
    customEditorProvider
  );
  bpmnServer.start();

  configureDefaultCommands({
    extensionContext: context,
    connector: glspVscodeConnector,
    diagramPrefix: "bpmn",
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("bpmn.goToNextNode", () => {
      glspVscodeConnector.sendActionToActiveClient(
        NavigateAction.create("next")
      );
    }),
    vscode.commands.registerCommand("bpmn.goToPreviousNode", () => {
      glspVscodeConnector.sendActionToActiveClient(
        NavigateAction.create("previous")
      );
    }),
    vscode.commands.registerCommand("bpmn.showDocumentation", () => {
      glspVscodeConnector.sendActionToActiveClient(
        NavigateAction.create("documentation")
      );
    })
  );
}
