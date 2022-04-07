#!/bin/bash

# Check to make sure that internal resources (typically from nexus) don't sneak into yarn.lock.
[[ `grep -c -e "\.salesforce\." yarn.lock` -ne 0 ]] && echo "Check yarn.lock for invalid references to internal Salesforce resources." && exit 1 || exit 0;

# Is this failing?
# 1. Make sure you're not referencing any internal packages in any of the package.json files as dependency or devDependency.
# 2. rm yarn.lock && yarn cache clean && yarn install
