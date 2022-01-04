# o11y-sample

This is a sample app that demonstrates the use of the `o11y` instrumentation platform on a stand-alone LWC app.

## Getting Started

Must have yarn pre-installed.

```sh
yarn install
yarn build
yarn start  # or yarn start:both to create separate server processes
```

## Publishing to Heroku

Must have Heroku CLI pre-installed.

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
