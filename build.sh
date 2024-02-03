#!/bin/bash
echo "***************************************"
echo "* Build - Open BPMN vsix.....         *"
echo "***************************************"

echo "==> clean workspace..."
rm -R webview/lib
rm -R webview/node_modules
rm -R extension/lib
rm -R extension/node_modules
rm -R extension/pack

echo "==> build webview..."
#yarn install
yarn all

#echo "==> build VSIX extension..."
#cd extension
#yarn install
#vsce package --yarn
#cd ../..

echo "==> build completed!"