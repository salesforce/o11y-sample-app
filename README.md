# o11y-sample

This is a sample app that demonstrates the use of the `o11y` instrumentation platform on a stand-alone LWC app.

## Getting Started

### Prerequisites

Install yarn: `npm install -g yarn`

Configure access to Nexus registry as described [here](https://confluence.internal.salesforce.com/pages/viewpage.action?spaceKey=NEXUS&title=Nexus+NPM+Repositories). You'll need to make sure that Nexus is configured as the registry. Additionally make sure to install the proper cert as indicated on Confluence.

### Install dependencies

After having installed the dependencies using `yarn install`, and built the project using `yarn build`.

### Start sample app

Start the front-end and back-end servers using `yarn serve`.

You can then navigate to your [localhost](http://localhost:3001) to view the app.
