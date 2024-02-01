# How to Integrate a GLSP Diagram in VS-Code

This is a short summary of my own findings in integrating a GLSP Diagram into VS-Code. The GLSP project provides a [VS Code Integration Project](https://github.com/eclipse-glsp/glsp-vscode-integration) that is providing some glue-code to make the integration as simple as possible. But of corse integration can be very different from project to project and can not be provided as an out-of-the-box solution.

The following sections provides some tips for integrating a GLSP Disagram into VS-Code.

## 1) Project Structure

First of all you VS-Code integration project should provide the following directory structure:

```
.
├── my-vscode-integration
│   ├── vscode
│   │   ├── extension
│   │   │   ├── src
│   │   │   │   ├── index.ts
│   │   │   │   ├── my-editor-provider.ts
│   │   │   │   └── my-extension.ts
│   │   │   ├── sever/
│   │   │   ├── lerna.json
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   ├── webpack.config.js
│   │   │   ├── webpack.prod.js
│   │   │   └── tsconfig.json
│   │   ├── webview
│   │   │   ├── src
│   │   │   │   ├── app.ts
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   ├── webpack.config.js
│   │   │   ├── webpack.prod.js
│   │   │   └── tsconfig.json
│   ├── lerna.json
│   ├── package.json
```

As you can see there are two modules: the /extension module and the /webview module

## 2) The Webview Module

The Webview Module provides only the `GLSPStarter` class and the 'index.ts' file to launch the Digaram Container. It is important that you have already a implementation of the class `createMyDiagramContainer` in your main GLSP Diagram poject. This creation class can now be used in the GLSP Starter to initalize your Diagram. So the code is quite simple here: 

```javascript
import { ContainerConfiguration } from '@eclipse-glsp/client';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import { createBPMNDiagramContainer } from '@my-diagram/my-diagram-glsp/lib';
import { Container } from 'inversify';


class MyGLSPStarter extends GLSPStarter {
    createContainer(...containerConfiguration: ContainerConfiguration): Container {
        return createMyDiagramContainer(...containerConfiguration);
    }
}

export function launch(): void {
    new BPMNGLSPStarter();
}

```

The Webpack.config.js is important to package all the digaram part in a webpack.js file that can be referred from the Extension module


## 2) The Extension Module

The Extension Module is now the VS-Code Part. This module is responsible to build a .vsix extension file that can be installed in VS-Code. The project referes to the Webview module and provides the HTML page to show up the Digaram. This is part of the file `my-editor-provider.ts`

The file `my-extensio.ts` contains the method `activate`. This method organizes connection to the server and may provide some additional code to register custom VS-Code menu actions. 

The file `index.ts` is just to activate the extension.

All the configuration is done in the file `package.json`. This file describes custom keybindings, menus and commands. 

Also the extension need to provide the GLSP server. This can be a Java Server or a NodeJS Server. The integration differs dedending on the server part. 