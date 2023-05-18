#!/bin/bash

# Check to make sure that internal resources (typically from nexus) don't sneak into yarn.lock.
if [[ `grep -c -e "\.salesforce\." yarn.lock` -ne 0 ]] || [[ `grep -c -e "\.sfdc\." yarn.lock` -ne 0 ]]; then
    echo 'Check yarn.lock for invalid references to internal Salesforce resources.'
    echo "Make sure you're not referencing any internal packages in any of the package.json files as dependency or devDependency."
    echo 'Do: yarn clean:deep && yarn install'
    exit 1 
fi
