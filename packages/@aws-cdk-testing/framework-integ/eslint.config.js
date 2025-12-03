const makeConfig = require('@aws-cdk/eslint-config');

const config = makeConfig('tsconfig.json');
for (const c of config) {
    // Disable import/order rule, it's being violated all over the place
    if (c.rules) {
        c.rules['import/order'] = ['off'];
    }
}

module.exports = config;
