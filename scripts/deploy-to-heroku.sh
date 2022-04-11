#!/bin/bash
if [ "$NUCLEUS_GIT_BRANCH" = "release" ]; then
    HEROKU_APP_NAME="o11y-sample-app"
    HEROKU_GIT_REMOTE_URL="https://git.heroku.com/o11y-sample-app.git"
else
    echo "$NUCLEUS_GIT_BRANCH is not a release branch, skipping."
    exit 0
fi

echo "Deploying to $HEROKU_APP_NAME"

cat <<EOF >~/.netrc
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_PASSWORD
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_PASSWORD
EOF

git remote add heroku $HEROKU_GIT_REMOTE_URL
git push --force heroku $NUCLEUS_GIT_BRANCH:master
