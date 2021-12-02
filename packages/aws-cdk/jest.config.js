/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = conf = {
    ...baseConfig,
    preset: "ts-jest/presets/js-with-babel-esm",
    // ts-jest can't override a value we've alread set in the root config, so we do it here
    moduleFileExtensions: ["ts", "js"],
    testMatch: [
        "<rootDir>/test/**/?(*.)+(test).ts",
    ],
    coverageThreshold: {
        global: {
            statements: 60,
            branches: 45,
        },
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
        }
    }
};
