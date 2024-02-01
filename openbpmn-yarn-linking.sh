#!/bin/bash




#### MAIN Script
# Script to (un)link the the glsp packages that spawn accross multiple repositories
# for local development.
# Usage:
#  $ ./local-linking.sh baseDir (--unlink [opional])
#       * baseDir: The base directory. All glsp repositories are expected to be
#                  childs of this directory
#       * --unlink: Optional flag. Set if packages should be unlinked instead of linked

baseDir=$(
    cd $1 || exit
    pwd
)
if [[ "$baseDir" == "" ]]; then
    echo "ERROR: No basedir was defined"
    exit 0
fi

if [[ "$2" != "--unlink" ]]; then
    # Link Open-BPMN
    echo '----------- part 1'
    cd $baseDir/open-bpmn/open-bpmn.glsp-client/open-bpmn-model
    yarn link
    cd $baseDir/open-bpmn/open-bpmn.glsp-client/open-bpmn-glsp
    yarn link
    cd $baseDir/open-bpmn/open-bpmn.glsp-client/open-bpmn-properties
    yarn link

    echo '----------- part 2'
    #cd $baseDir/open-bpmn-vscode-integration/open-bpmn.vscode/webview
    cd $baseDir/open-bpmn-vscode-integration/open-bpmn.vscode
    yarn link @open-bpmn/open-bpmn-model @open-bpmn/open-bpmn-glsp @open-bpmn/open-bpmn-properties
    
    echo '----------- part 3'
    echo ' wir sind in ' 
    pwd
    yarn install --force
    echo '----------- part 4'
    echo "==> build VSIX extension..."
    cd extension
    echo ' wir sind in ' 
    pwd
    # yarn install
    vsce package --yarn
    cd ../..
else
    yarn unlink @open-bpmn/open-bpmn-glsp
    yarn
    yarn install --force
    #linkNodeServer unlink $baseDir
    cd $baseDir/open-bpmn/open-bpmn.glsp-client/open-bpmn-glsp
    linkClient unlink 
fi
