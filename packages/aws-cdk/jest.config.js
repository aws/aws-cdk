const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    preset: "ts-jest/presets/js-with-babel-esm",
    // ts-jest can't override a value we've alread set in the root config, so we do it here
    moduleFileExtensions: ["ts", "js"],
    testMatch: [
        "<rootDir>/test/**/?(*.)+(test).ts",
    ],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        }
    },
    coverageThreshold: {
        global: {
            statements: 60,
            branches: 45,
        },
    },
};
