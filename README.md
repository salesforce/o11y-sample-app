# ** ARCHIVED **

> This is the original and deprecated repo for the o11y-sample-app. Please go to [the repo on github.com](https://github.com/salesforce/o11y-sample-app)

# o11y Sample App

This stand-alone LWC app demonstrates the use of the `o11y` instrumentation platform. It comes with a built-in server to receive instrumentation collected on the client-side, but it can also be configured to direct traffic to a Salesforce instance.

## Try it Out

You can go to [o11y-sample-app](https://o11y-sample-app.herokuapp.com/), or deploy a copy of the app.

> Note: deploying from git.soma is not supported

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/salesforce/o11y-sample-app)

## Getting Started with Local Development

-   Using [yarn](https://yarnpkg.com/getting-started/install) is recommended.
-   After having forked the repo and cloned it to your local, do:

```sh
yarn install
yarn build
yarn start  # or yarn start:both to create separate server processes
```

## Version handling

1. Update `environment.appVersion` in [app.ts](packages/client/src/modules/my/app/app.ts).
2. Commit your change and push.
3. Execute:

```sh
yarn lerna version PLACEHOLDER # replace PLACEHOLDER with patch, minor or major as appropriate
```

4. Check that the version in [app.ts](packages/client/src/modules/my/app/app.ts), [lerna.json](lerna.json) client [package.json](packages/client/package.json), and server [package.json](packages/server/package.json) are the same.

## Publishing to Heroku

-   Must have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) pre-installed.

Ensure git remote for Heroku is set:

```sh
git remote add heroku https://git.heroku.com/o11y-sample-app.git
git remote -v
```

Publish:

```sh
heroku login                        # Use SSO
git push heroku YOUR_BRANCH:master  # Push changes
heroku logs --tail                  # Continuously view logs
```
