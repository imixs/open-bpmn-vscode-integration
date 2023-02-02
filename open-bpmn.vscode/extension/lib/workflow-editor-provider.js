"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quickstart_components_1 = require("@eclipse-glsp/vscode-integration/lib/quickstart-components");
const vscode = require("vscode");
class WorkflowEditorProvider extends quickstart_components_1.GlspEditorProvider {
    constructor(extensionContext, glspVscodeConnector) {
        super(glspVscodeConnector);
        this.extensionContext = extensionContext;
        this.glspVscodeConnector = glspVscodeConnector;
        this.diagramType = 'workflow-diagram';
    }
    setUpWebview(_document, webviewPanel, _token, clientId) {
        const webview = webviewPanel.webview;
        const extensionUri = this.extensionContext.extensionUri;
        const webviewScriptSourceUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'pack', 'webview.js'));
        const codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));
        webviewPanel.webview.options = {
            enableScripts: true
        };
        webviewPanel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, height=device-height">
					<meta http-equiv="Content-Security-Policy" content="
                default-src http://*.fontawesome.com  ${webview.cspSource} 'unsafe-inline' 'unsafe-eval';
                ">
				<link href="${codiconsUri}" rel="stylesheet" />

                </head>
                <body>
                    <div id="${clientId}_container" style="height: 100%;"></div>
                    <script src="${webviewScriptSourceUri}"></script>
                </body>
            </html>`;
    }
}
exports.default = WorkflowEditorProvider;
//# sourceMappingURL=workflow-editor-provider.js.map