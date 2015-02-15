#!/bin/bash

set -e

# no_changes=`git status | grep "nothing to commit" | grep "working directory clean" | wc -l`

# if [[ ${no_changes} -eq 0 ]]; then
#   echo "found uncommited changes"
#   exit 1
# fi

# (cd web-apps && npm install && NODE_ENV=production gulp deploy)

# BRANCH=`git rev-parse --abbrev-ref HEAD`

# tag=live-`date +'%Y%m%d_%H%M%S'`-${BRANCH}
# echo ${tag} > public/version.txt

# git commit -a -m "new version file"
# git push origin ${BRANCH}

# git tag ${tag}
# git push origin ${BRANCH} --tags

# git push -f live ${BRANCH}:master

# echo "... version ${tag} deployed."
say -v cellos "Deployed Deployed Deployed Liiiiiiiiiiiiiiiiive"
