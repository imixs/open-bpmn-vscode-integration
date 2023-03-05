#!/bin/bash
echo "***************************************"
echo "* Build - Open BPMN vsix.....         *"
echo "***************************************"

echo "==> build webview..."
yarn install

echo "==> build VSIX extension..."

cd open-bpmn.vscode/extension
yarn install
vsce package --yarn
cd ../..

echo "Build completed!"