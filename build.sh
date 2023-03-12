#!/bin/bash
echo "***************************************"
echo "* Build - Open BPMN vsix.....         *"
echo "***************************************"

echo "==> clean workspace..."
rm -R open-bpmn.vscode/webview/lib
rm -R open-bpmn.vscode/webview/node_modules
rm -R open-bpmn.vscode/extension/lib
rm -R open-bpmn.vscode/extension/node_modules
rm -R open-bpmn.vscode/extension/pack

echo "==> build webview..."
yarn install

echo "==> build VSIX extension..."
cd open-bpmn.vscode/extension
yarn install
vsce package --yarn
cd ../..

echo "==> build completed!"