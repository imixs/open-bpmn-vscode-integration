# Open-BPMN VS-Code Integration

Find GLSP Example [here](https://github.com/eclipse-glsp/glsp-vscode-integration)

	$ cd eclipse-2022-09/open-bpmn/vscode-test-bpmn/
	$ yarn install


## Dependencies

Because of the integration of `@jsonforms/vanilla-renderers` we need to add the dependencies of react ^18.2.0

  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },  	
  
  
  
## Server Configuration

The directory `extension/server/` holds the Open-BPMN server jar. The server is needed to be launched within the VS-Code configuration. The setup for the server is defined in `extension/src/server-config.json`. The jar file version is resolved by the configuration params. 

See the following example: 

	{
	    "releaseRepository": "https://repo1.maven.org/maven2/",
	    "snapshotRepository": "https://oss.sonatype.org/content/repositories/snapshots/",
	    "groupId": "org.imixs.bpmn",
	    "artifactId": "open-bpmn.server",
	    "version": "0.8.0",
	    "isSnapShot": false,
	    "classifier": "glsp"
	}
 
This server configuration will resolve to the server jar file:
 
	open-bpmn.server-0.8.0-glsp.jar

The server version is also located in the Maven Central Repository:

	https://repo1.maven.org/maven2/org/imixs/bpmn/open-bpmn.server/0.8.0/



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
	
**ACHTUNG** Wir haben ind er package.json datei

        "viewType": "workflow.glspDiagram",
        
mit 

	        "viewType": "bpmn-diagram",
	        
Ausgetauscht !!!!!!!!	

This should be equal to the diagramtype - see follwoing section

** diagramType **

DiagramType  - see BPMNDiagramModule.getDiagramType()
	
It is also Define in the bpmn-language.ts file 

	diagramType: 'bpmn-diagram',


# Development

	$ cd open-bpmn.vscode/webview
	$ yarn add file:./../open-bpmn/open-bpmn.glsp-client/open-bpmn-model/
	



# Theming and CSS

The  theming the Open-BPMN elements is based on the theia platform style guide. For VS-Code we overwrite some of the Theia specific css files form Open-BPMN with additional css files located at `webview/src/css`.

You can find the colors and CSS variables divined by VS-Code here:


 - https://code.visualstudio.com/api/extension-guides/webview#theming-webview-content
 - https://code.visualstudio.com/api/references/theme-color
	
	
# Problems

Weiteres Vorgehen:

 - Server extern im Debug Modus starten - so lässt sich wenigstens das verhalten dort analysieren
 
 - Website lesen: https://github.com/eclipse-glsp/glsp-vscode-integration/tree/master/packages/vscode-integration#getting-started
 
 - Diskussion nochmal lesen: https://github.com/eclipse-glsp/glsp/discussions/872
 
 - Und dann weiter an dieser Code Stelle abarbeiten:
 
      const bpmnServer = new SocketGlspVscodeServer({
	