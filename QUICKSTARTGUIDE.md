# How to Integrate a GLSP Diagram in VS-Code

This is a short summary of my own findings in integrating a GLSP Diagram into VS-Code. The GLSP project provides a [VS Code Integration Project](https://github.com/eclipse-glsp/glsp-vscode-integration) that is providing some glue-code to make the integration as simple as possible. But of corse integration can be very different from project to project and can not be provided as an out-of-the-box solution. The following sections provides some tips for integrating a GLSP Disagram into VS-Code.

In general the VS Code integration needs to be embedded in a [web view](https://code.visualstudio.com/api/extension-guides/webview) of a [custom editor](https://code.visualstudio.com/api/extension-guides/custom-editors) VS Code extension. 

The origin GLSP examples can be found here:

 - [Minimal task example integration for VS Code](https://github.com/eclipse-glsp/glsp-examples/tree/master/project-templates/node-json-vscode/tasklist-vscode)
 - [Example VS Code extension for the workflow diagram](https://github.com/eclipse-glsp/glsp-vscode-integration/tree/master/example/workflow)



## 1) Project Structure

Most important for a successful VS-Code integration is your project structure. In the following I assume that you have two Projects:

 - Your GLSP Diagram project (typically providing a Theia integration) 
 - Your VS-Code Integration Porject

Typically you use a monorepo where you place differenct modules into one Gir Repository. So you are working with two separate git repos providing the following directory structure:

```
/git
├── my-glsp-project/                          ┓
│   ├── my-diagram-code/                      ┃                         
│   │   ├── src/                              ┃
│   │   │   ├── ....                          ┣▶ Your GLSP Diagram Core Project
│   │   ├── package.json                      ┃
│   │   └── ....                              ┃
│   ├── my-diagram-theia/                     ┃
│   └── ....                                  ┛ 
│ 
├── my-vscode-integration/                    ┓
│   ├── extension/                            ┃
│   │   ├── src/                              ┃
│   │   │   ├── index.ts                      ┃
│   │   │   ├── my-editor-provider.ts         ┃
│   │   │   └── my-extension.ts               ┃
│   │   ├── sever/                            ┃
│   │   ├── lerna.json                        ┃
│   │   ├── package.json                      ┣▶ Your VS-Code Integration Project
│   │   ├── tsconfig.json                     ┃
│   │   ├── webpack.config.js                 ┃
│   │   ├── webpack.prod.js                   ┃
│   │   └── tsconfig.json                     ┃
│   ├── webview/                              ┃
│   │   ├── src/                              ┃
│   │   │   ├── app.ts                        ┃
│   │   │   └── index.ts                      ┃
│   │   ├── package.json                      ┃
│   │   ├── tsconfig.json                     ┃
│   │   ├── webpack.config.js                 ┃
│   │   ├── webpack.prod.js                   ┃
│   │   └── tsconfig.json                     ┃
├── lerna.json                                ┃
├── package.json                              ┛ 
```

As you can see that the vs-code integration project holds at least two modules: the `/extension module` and the `/webview module`

### The devDependencies 

The root `package.json` file should at least contain the following `devDependencies`:

```json
  "devDependencies": {
    "@eclipse-glsp/dev": "~2.0.0",
    "inversify": "6.0.2",
    "lerna": "^6.6.2",
    "typescript": "^5.2.2"
  },
```
This ensures, that you use the correct versions of typescript, eslint and prettier configuration.
Consuming the `@eclipse-glsp/dev` package is the most straight forward approach as you don't have to worry about configuration.



### The resolutions

Also a very important part of your project setup is the `resolutions` section of your root `package.json` file:

```json
  "resolutions": {
    "@my-glsp-project/my-diagram-code": "file:./../my-glsp-project/my-diagram-code/",
    "string-width": "4.2.3"
  },
```

This entry directly links your glsp core project into your vs-code integration porject. Which means you can now both projects in parallel within your local dev environment. 


## 2) The Webview Module

The Webview Module provides only the `GLSPStarter` class and the 'index.ts' file to launch the Digaram Container. It is important that you have already a implementation of the class `createMyDiagramContainer` in your main GLSP Diagram poject. This creation class can now be used in the GLSP Starter to initalize your Diagram. So the code is quite simple here: 

```javascript
import { ContainerConfiguration } from '@eclipse-glsp/client';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import { createMyDiagramContainer } from '@my-diagram/my-diagram-glsp/lib';
import { Container } from 'inversify';


class MyGLSPStarter extends GLSPStarter {
    createContainer(...containerConfiguration: ContainerConfiguration): Container {
        return createMyDiagramContainer(...containerConfiguration);
    }
}

export function launch(): void {
    new MyGLSPStarter();
}
```

The index.ts file simply launches the diagram container:

```javascript
import 'reflect-metadata';

import { launch } from './app';

launch();
```

### The Webpack

The Webview module contains a webpack configuration. The `webpack.config.js` file is important to package all the digaram part in a `webpack.js` file that can be referred from the Extension module

```javascript
// @ts-check
const path = require('path');

const outputPath = path.resolve(__dirname, './dist');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'web',

    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        filename: 'webview.js',
        path: outputPath
    },
    devtool: 'eval-source-map',
    mode: 'development',

    resolve: {
        fallback: {
            fs: false,
            net: false,
        },
        alias: {
            process: 'process/browser'
        },        
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.css$/,
                exclude: /\.useable\.css$/,
                use: ['style-loader', 'css-loader']
            }            
        ]
    },
    ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/],
    performance: {
        hints: false
    }    
};

module.exports = config;
```

## 2) The Extension Module

The Extension Module is now the VS-Code Part. This module is responsible to build a .vsix extension file that can be installed in VS-Code. The project referes to the Webview module and provides the HTML page to show up the Digaram.



### The Extension Editor Provider

The file `my-editor-provider.ts` provides the webview which is loaded in an iframe of the VS Code frontend) via the custom editor provider:

```javascript
import { GlspEditorProvider, GlspVscodeConnector } from '@eclipse-glsp/vscode-integration';
import * as vscode from 'vscode';

export default class MyEditorProvider extends GlspEditorProvider {
  diagramType = 'workflow-diagram';
 
  constructor(
    protected readonly extensionContext: vscode.ExtensionContext,
    protected override readonly glspVscodeConnector: GlspVscodeConnector
  ) {
    super(glspVscodeConnector);
  }

  setUpWebview(
    _document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
    clientId: string
  ): void {
    const webview = webviewPanel.webview;
    const extensionUri = this.extensionContext.extensionUri;
    const webviewScriptSourceUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "dist", "webview.js")
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css"
      )
    );

    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, height=device-height">
					          <meta http-equiv="Content-Security-Policy" 
                        content="default-src http://*.fontawesome.com  ${webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                        ">
				            <link href="${codiconsUri}" rel="stylesheet" />
                    <!-- disable modal confirm dialog 
                      See disussion: 
                      https://jsonforms.discourse.group/t/ignored-call-to-confirm-the-document-is-sandboxed-and-the-allow-modals-keyword-is-not-set/1400/3
                    -->
                    <script>window.confirm = () => true</script>

                </head>
                <body>
                    <div id="${clientId}_container" style="height: 100%;"></div>
                    <script src="${webviewScriptSourceUri}"></script>
                </body>
            </html>`;
  }
}

```

### The Extension Activate Function

The file `my-extensio.ts` contains the method `activate`. This method organizes connection to the server and may provide some additional code to register custom VS-Code menu actions. 

```javascript
import "reflect-metadata";

import {
  GlspSocketServerLauncher,
  GlspVscodeConnector,
  SocketGlspVscodeServer,
  configureDefaultCommands
} from '@eclipse-glsp/vscode-integration/node';
import * as path from "path";
import * as process from "process";

import * as vscode from "vscode";
import MyEditorProvider from "./my-editor-provider";
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
  const myServer = new SocketGlspVscodeServer({
            clientId: 'glsp.my-diagram',
            clientName: 'my-diagram',
            connectionOptions: {
                port: serverProcess?.getPort() || JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT),
                path: process.env.GLSP_WEBSOCKET_PATH
            }
        });


  // Initialize GLSP-VSCode connector with server wrapper
  const glspVscodeConnector = new GlspVscodeConnector({
    server: myServer,
    logging: true,
  });

  const customEditorProvider = vscode.window.registerCustomEditorProvider(
    "my-diagram",
    new myEditorProvider(context, glspVscodeConnector),
    {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    }
  );

  context.subscriptions.push(
    myServer,
    glspVscodeConnector,
    customEditorProvider
  );
  bpmnServer.start();

  configureDefaultCommands({
    extensionContext: context,
    connector: glspVscodeConnector,
    diagramPrefix: "my-diagram",
  });

}


```

The `activate` function is the entry point of the VS Code [extension anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy). This code is running in the extension host of VS Code and starts two things:

 * the GLSP server (either as a nodejs process communicating via IPC or any other process communicating via socket - e.g. a Java Server)
 * it sets up the webview (which is then loaded in an iframe of the VS Code frontend) via the custom editor provider

So in contrast to Theia, there is another indirection necessary, because of the extension host and the webview.

The example code  uses a external Java Server wich is connected via webSocket. This could also be changed to a NodeJs Server as you can find in the [workflow example](https://github.com/eclipse-glsp/glsp-vscode-integration/tree/master/example/workflow)

**Note:** the first import here must be always `import "reflect-metadata"`. The order is important here.  



The file `index.ts` is just to activate the extension.

```javascript
import "reflect-metadata";

import * as vscode from "vscode";
import { activate as extensionActivate } from "./open-bpmn-extension";

export function activate(context: vscode.ExtensionContext): Promise<void> {
  console.log("Launching Open-BPMN GLSP Server...");
  return extensionActivate(context);
}
```

### The Extension Configuration 

All the configuration is done in the file `package.json`. This file describes custom keybindings, menus and commands. 

### The Webpack

The extension module also contains a webpack configuration.  

```javascript
'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const nodeModules = path.resolve(__dirname, '../node_modules');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node',

    entry: path.resolve(__dirname, 'src/my-extension.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-extension.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode'
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [                             
                {
                    from: path.resolve(__dirname, '..', 'webview', 'dist')
                }
            ]ya
        })
    ],
    ignoreWarnings: [/Can't resolve .* in '.*ws\/lib'/],
    performance: {
        hints: false
    }
};

module.exports = config;
```


# Linking Package

https://medium.com/@jsilvax/a-workflow-guide-for-lerna-with-yarn-workspaces-60f97481149d 


To Install `lerna` run


  $ npm install --global lerna


