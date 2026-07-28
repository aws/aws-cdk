import { makeConfig } from '@aws-cdk/eslint-config';

const config = makeConfig('tsconfig.json');
for (const c of config) {
    // Disable import rules, they are being violated all over the place and we are touching
    // this library too much right now, avoiding merge conflicts
    if (c.rules) {
        c.rules['import/order'] = ['off'];
        c.rules['import/no-duplicates'] = ['off'];
    }
}

export default config;
