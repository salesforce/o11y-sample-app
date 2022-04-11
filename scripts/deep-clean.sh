#! /bin/bash
# This script is used to bring the folder back to what it would have been if it was freshly cloned,
# without actually cloning it. (i.e. you can keep your state). It will remove any ignored and 
# untracked files and directories. Make sure you stage/commit any files that you don't want to lose.
echo '--- Deep Clean ---'

DRYRUN='git clean -n -dx'
DRYRUN_OUTPUT=`$DRYRUN`
if [[ -z $DRYRUN_OUTPUT ]]; then
    echo 'Nothing to clean.'
else 
    $DRYRUN
    read -p 'Continue? (y/n) ' RESP
    if [[ $RESP == 'y' ]]; then
        echo 'Cleaning!'
        git clean -f -dx
        echo 'Done.'
    else 
        echo 'Canceled.'
    fi
fi
