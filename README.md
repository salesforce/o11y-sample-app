# o11y-sample

This is a sample app that demonstrates the use of the `o11y` instrumentation platform on a stand-alone LWC app.

## Getting Started

### Prerequisites

Install yarn: `npm install -g yarn`

Configure access to Nexus registry as described [here](https://git.soma.salesforce.com/nodeforce/nexus-npms). You'll need to make sure that Nexus is configured as the registry. Additionally make sure to install the proper cert as indicated on [Confluence](https://confluence.internal.salesforce.com/pages/viewpage.action?spaceKey=NEXUS&title=Nexus+NPM+Repositories).

### Install dependencies & build

After having installed the dependencies using `yarn install`, you'll need to build the project using `yarn build`.

### Start sample app

Start the front-end and back-end servers using `yarn serve`.

You can then navigate to your [localhost](http://localhost:3001) to view the app.
