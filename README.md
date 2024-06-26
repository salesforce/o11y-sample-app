# o11y Sample App

This stand-alone LWC app demonstrates the use of the `o11y` instrumentation platform. It comes with a built-in server to receive instrumentation collected on the client-side, but it can also be configured to direct traffic to a Salesforce instance.

## Try it Out

You can go to [o11y](https://o11y.herokuapp.com/), or deploy a copy of the app.

> Note: deploying from git.soma is not supported.

**Deploys** Take place automatically PR merges into master. You can also attempt to manually deploy using the button below

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/salesforce/o11y)

## Getting Started with Local Development

-   Using [yarn](https://yarnpkg.com/getting-started/install) is recommended.
-   After having forked the repo and cloned it to your local, do:

```sh
yarn install
yarn build
yarn start  # or yarn start:both to create separate server processes
```

## Making an update

Before sending your PR, make sure to run one of:

-   `yarn build:update:build`
-   `yarn build:update:minor`
-   `yarn build:update:major`

as needed.

## [Backup] Publishing to Heroku
Every commit to master is automatically deployed to heroku. The steps below can be used if you have to revert to manual deploys for some reason

-   Must have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) pre-installed.

Ensure git remote for Heroku is set:

```sh
git remote add heroku https://git.heroku.com/o11y.git
git remote -v
```

Publish:

```sh
heroku login                        # Use SSO
git push heroku YOUR_BRANCH:master  # Push changes
heroku logs --tail                  # Continuously view logs
```
