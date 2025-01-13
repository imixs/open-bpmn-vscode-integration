# Open-BPMN VS-Code Extension

This project provides the [Open-BPMN Modeling Tool](https://github.com/imixs/open-bpmn) as a Extension for Visual Studio Code.

**Open BPMN** is a free BPMN 2.0 modeling tool to create and edit .bpmn files based on the _Business Process Model and Notation (BPMN 2.0)_, proposed by the Object Management Group (OMG).

BPMN 2.0 is an open standard to describe business processes that can be visualized in diagram editors and executed by process engines compliant with the BPMN 2.0 standard. This makes BPMN an interoperable, interchangeable and open standard in the field of business process management. BPMN was intended for users at all levels, from the business analysts who create the initial design, to the developers who implement the technical details, and finally, to the business users responsible for managing and monitoring the processes.

<center><img  width="800" src="https://github.com/imixs/open-bpmn/raw/master/doc/images/imixs-bpmn-001.png" /></center>

You will find general Information about the **Open-BPMN Modeling Tool** [here](https://github.com/imixs/open-bpmn).

# Installation

Open-BPMN can be installed into Visual Studio Code from the latest VSIX extension file:

<h2 align="center"><a href="https://github.com/imixs/open-bpmn-vscode-integration/releases/download/open-bpmn-vscode-integration-1.0.6/open-bpmn-vscode-extension-1.0.6.vsix" >Download: open-bpmn-vscode-extension-1.0.6.vsix</a></h2>

# Development

The VS Code integration of Open-BPMN is mainly based on the [Eclipse GLSP Example](https://github.com/eclipse-glsp/glsp-vscode-integration).

## Dependencies

Because of the integration of `@jsonforms/vanilla-renderers` we need to add the dependencies of react ^18.2.0

```
"dependencies": {
"react": "^18.2.0",
"react-dom": "^18.2.0"
},
```

## Testing and Debugging

This project contains a VS Code launch configuration to start the Open-BPMN Extension with the GLSP Server included or with an external Server process. To launch the Open-BPMN Extension in VS Code go the the Run & Debug Mode (Ctrl + Shift + D) and choose one of the following launch configurations:

- Launch Open-BPMN VS-Code Extension - This will launch the Language Server and the Extension in a new Window
- Launch Open-BPMN VS-Code Extension (without Server) - This will lauch the Extension without a Server process. This can be used in case you need to start a different server or whant to debug the server code. See the [Open-BPMN Project](https://github.com/imixs/open-bpmn) how to start and debug the GLSP Server.

## The Server Configuration

The directory `extension/server/` holds the Open-BPMN server jar. The server is needed to be launched within the VS-Code configuration. The setup for the server is defined in `extension/src/server-config.json`. The jar file version is resolved by the configuration params.

See the following example:

```json
{
  "releaseRepository": "https://repo1.maven.org/maven2/",
  "snapshotRepository": "https://oss.sonatype.org/content/repositories/snapshots/",
  "groupId": "org.imixs.bpmn",
  "artifactId": "open-bpmn.server",
  "version": "0.9.1",
  "isSnapShot": true,
  "classifier": "glsp"
}
```

This configuration expect the server jar file `open-bpmn.server-0.9.1-SNAPSHOT-glsp.jar`. Make sure that the corresponding .jar file is part of the `/server` folder

If you want to start you own BPMN Extension Server you can easily switch the configuration.

**IMPORTANT**: Make sure that you are starting VSCode with Java 11 or higher!

## Client Configuration

On the client side some settings are important.

On OpenBPMN we define the following settings:

        contributionId: 'Bpmn',
        label: 'BPMN 2.0 diagram',
        diagramType: 'bpmn-diagram',
        fileExtensions: ['.bpmn','.bpmn2']

**viewType**

In the `package.json` file of the extension package take care about the setting of the `viewType`. This setting reflects the view type defined on the server side

    bpmn-diagram

This should be equal to the diagram type - see `BPMNDiagramModule.getDiagramType()`. It is also Define in the bpmn-language.ts file

    diagramType: 'bpmn-diagram',

## Theming and CSS

The theming the Open-BPMN Extension for VS-Code is based on the Theia platform style guide. For VS-Code we overwrite some of the Theia specific css files form Open-BPMN with additional css files located at `webview/src/css`.

You can find the colors and CSS variables divined by VS-Code here:

- https://code.visualstudio.com/api/extension-guides/webview#theming-webview-content
- https://code.visualstudio.com/api/references/theme-color

# Build

To build the project and generate a VSIX extension file run:

    $ ./build.sh

With in VS-Code you will find two differnt launch options that can be used during development.

**Open-BPMN VS-Code Extension (without Server)**

This VS-Code launch option expects that you have already started the Open-BPMN server host manually within VSode. This option is good for testing and debugging the server part

**Open-BPMN VS-Code Extension**

This s VS-Code launch option starts the server and the VS-Code extension. This simulates how the extension will work without exernal servers. The extension starts the configured glsp-sever part form a .jar file.

## Build the Webview

To build the webview only run from the project root:

    $ yarn install --yarn

## Package VS-Code Extension

To package the VS-Code Extension into a `.vsix` file, you first have to install the vsce tool. If not yet done install the node package `rimraf`

    $ sudo npm i -g rimraf

To build the extension and create the VSIX file run:

    $ cd extension
    $ yarn install --yarn
    $ vsce package --yarn

You can check the result file with :

    $ vsce ls

**Note:** Make sure that the `pack/` directory is part of the extension sub-folder before you start the packaging process!

Find more details about the publishing and packaging process here:

- https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions

### Logging

If something withing the extension goes wrong, you can check the log files from Visual Studio Code:

1. Open the Command Palette (press `Ctrl + Shift + P`)
2. Type 'Developer: Open Logs Folder' and select the option.
3. This will open the logs folder for Visual Studio Code, which will contain a log file for the application and a separate log file for each extension.

You can check the log files from Open-BPMN in the vscode log file located in:

/window1/exthost/exthost.log

## Publish Open-BPMN

To publish open-bpmn .vsix extension you first need a personal access token for 'open-bpmn'.

From the Imixs organization's home page: https://dev.azure.com/imixs create a access token for 'open-bpmn' with the scope "Marketplace - Manage"

login via the vsce tool. You will be asked for your personal access token:

    $ vsce login open-bpmn
    https://marketplace.visualstudio.com/manage/publishers/
    Personal Access Token for publisher 'open-bpmn': ****************************************************

    The Personal Access Token verification succeeded for the publisher 'open-bpmn'.

You can now publish the Open-BPMN extension using vsce with the publish command:

    $ cd extension/
    $ vsce publish --yarn

The publishing process can take some minutes. To verify the status open:

    https://marketplace.visualstudio.com/manage/publishers/open-bpmn/

### Tag and Push

To tag the new release and push the tag to Github using VS-Code

List version

    $ git tag

Tag

    $ git tag -a open-bpmn-vscode-integration-1.1.13  -m "next version"
    $ git push origin open-bpmn-vscode-integration-1.1.13

After creating the tag, upgrade the version numbers in the package.json and lerna.json files!

# VSCE

To build the project you need to install the [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) tool first.

Run:

    $ npm install -g typescript
    $ npm install -g @vscode/vsce
