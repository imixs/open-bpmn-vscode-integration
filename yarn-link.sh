#!/bin/bash

#### MAIN Script
# Script to (un)link the the Open-BPMN glsp packages located in the current git repo
# Usage:
#  $ ./yarn-link.sh  (--unlink [opional])



echo "***************************************"
echo "* Open-BPMN - yarn link...            *"
echo "***************************************"

if [[ "$2" != "--unlink" ]]; then
    # Link Open-BPMN
    echo '  linking open-bpmn main modules'
    cd ../open-bpmn/open-bpmn.glsp-client/open-bpmn-model
    yarn link
    cd ../open-bpmn-glsp
    yarn link
    cd ../open-bpmn-properties
    yarn link

    # Now link with vscode-integration
    cd ../../../open-bpmn-vscode-integration
    yarn link @open-bpmn/open-bpmn-model 
    yarn link @open-bpmn/open-bpmn-properties
    yarn link @open-bpmn/open-bpmn-glsp 
    
  
else
    yarn unlink @open-bpmn/open-bpmn-model
    yarn unlink @open-bpmn/open-bpmn-prperties
    yarn unlink @open-bpmn/open-bpmn-glsp
    yarn
    yarn install --force

    cd $baseDir/open-bpmn/open-bpmn.glsp-client/open-bpmn-glsp
    linkClient unlink 
fi 
