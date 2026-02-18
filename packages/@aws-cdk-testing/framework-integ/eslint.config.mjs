import { makeConfig } from '@aws-cdk/eslint-config';

const config = makeConfig('tsconfig.json');
for (const c of config) {
    if (c.rules) {
        // Disable import/order rule, it's being violated all over the place
        c.rules['import/order'] = ['off'];
        // This rule doesn't apply to app code, only library code
        c.rules['@cdklabs/no-unconditional-token-allocation'] = ['off'];
    }
}

export default config;
