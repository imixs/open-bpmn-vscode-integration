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
  GlspSocketServerLauncher,
  GlspVscodeConnector,
  SocketGlspVscodeServer,
  configureDefaultCommands
} from '@eclipse-glsp/vscode-integration/node';
import * as path from "path";
import * as process from "process";
import "reflect-metadata";
import * as vscode from "vscode";
import { BPMNPropertyPanelToggleAction } from "./open-bpmn-actions";
import BPMNEditorProvider from "./open-bpmn-editor-provider";
import * as config from "./server-config.json";


const DEFAULT_SERVER_PORT = '0';
const LOG_DIR = path.join(__dirname, '..', '..', '..', '..', 'logs');

const { version, isSnapShot, artifactId } = config;
const JAVA_EXECUTABLE = path.join(
  __dirname,
  `../server/${artifactId}-${version}${isSnapShot ? "-SNAPSHOT" : ""}-glsp.jar`
);

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Start server process using quickstart component
  let serverProcess: GlspSocketServerLauncher | undefined;
  const useIntegratedServer = JSON.parse(process.env.GLSP_INTEGRATED_SERVER ?? 'false');
  if (!useIntegratedServer && process.env.GLSP_SERVER_DEBUG !== 'true') {
      const additionalArgs = ['--fileLog', 'true', '--logDir', LOG_DIR];
      if (process.env.GLSP_WEBSOCKET_PATH) {
          additionalArgs.push('--webSocket');
      }
      serverProcess = new GlspSocketServerLauncher({
          executable: JAVA_EXECUTABLE,
          socketConnectionOptions: { port: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT) },
          additionalArgs,
          logging: true
      });

      context.subscriptions.push(serverProcess);
      await serverProcess.start();
  }

  // Wrap server with quickstart component
  const bpmnServer = new SocketGlspVscodeServer({
            clientId: 'glsp.workflow',
            clientName: 'workflow',
            connectionOptions: {
                port: serverProcess?.getPort() || JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT),
                path: process.env.GLSP_WEBSOCKET_PATH
            }
        });


  // Initialize GLSP-VSCode connector with server wrapper
  const glspVscodeConnector = new GlspVscodeConnector({
    server: bpmnServer,
    logging: true,
  });

  const customEditorProvider = vscode.window.registerCustomEditorProvider(
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

  /* add properties command */
  context.subscriptions.push(
    vscode.commands.registerCommand("bpmn.showProperties", () => {
      glspVscodeConnector.sendActionToActiveClient(
        BPMNPropertyPanelToggleAction.create()
      );
    })
  );
}
