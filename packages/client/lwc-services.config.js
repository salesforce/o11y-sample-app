// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js

const buildDir = '../../dist-client';

module.exports = {
    resources: [
        { from: 'src/resources/', to: `${buildDir}/resources/` },
        {
            from: '../../node_modules/@salesforce-ux/design-system/assets',
            to: `${buildDir}/assets`
        }
    ],
    sourceDir: './src',
    buildDir,
    devServer: {
        proxy: { '/': 'http://localhost:3002' }
    }
};
