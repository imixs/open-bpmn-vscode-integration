#!/bin/bash
echo "***************************************"
echo "* Build - Open BPMN vsix.....         *"
echo "***************************************"

echo "==> clean workspace..."
rm -R webview/lib
rm -R webview/dist
rm -R webview/node_modules
rm -R extension/lib
rm -R extension/node_modules
rm -R extension/dist
rm -R node_modules
rm yarn.lock

echo "==> clean completed!"