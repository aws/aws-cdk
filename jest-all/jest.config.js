/**
 * A jest config that runs all tests in all packages in parallel, rather than package by package
 */
const path = require('path');

const DIRS = [
  'tools/@aws-cdk/spec2cdk',
  'tools/@aws-cdk/cdk-release',
  'tools/@aws-cdk/check-peer-dependencies',
  'tools/@aws-cdk/project-sync',
  'tools/@aws-cdk/pkglint',
  'tools/@aws-cdk/lazify',
  'tools/@aws-cdk/integration-test-deployment',
  'tools/@aws-cdk/lambda-integration-test-updater',
  'tools/@aws-cdk/enum-updater',
  'tools/@aws-cdk/construct-metadata-updater',
  'packages/@aws-cdk-testing/framework-integ',
  'packages/aws-cdk-lib',
  'packages/@aws-cdk/aws-neptune-alpha',
  'packages/@aws-cdk/aws-ec2-alpha',
  'packages/@aws-cdk/aws-custom-resource-sdk-adapter',
  'packages/@aws-cdk/aws-sagemaker-alpha',
  'packages/@aws-cdk/aws-ivs-alpha',
  'packages/@aws-cdk/aws-bedrock-agentcore-alpha',
  'packages/@aws-cdk/aws-glue-alpha',
  'packages/@aws-cdk/mixins-preview',
  'packages/@aws-cdk/aws-dsql-alpha',
  'packages/@aws-cdk/cx-api',
  'packages/@aws-cdk/aws-amplify-alpha',
  'packages/@aws-cdk/aws-mediaconnect-alpha',
  'packages/@aws-cdk/aws-pipes-alpha',
  'packages/@aws-cdk/aws-imagebuilder-alpha',
  'packages/@aws-cdk/aws-pipes-sources-alpha',
  'packages/@aws-cdk/aws-lambda-python-alpha',
  'packages/@aws-cdk/aws-kinesisanalytics-flink-alpha',
  'packages/@aws-cdk/aws-pipes-targets-alpha',
  'packages/@aws-cdk/aws-cloud9-alpha',
  'packages/@aws-cdk/aws-iotevents-alpha',
  'packages/@aws-cdk/aws-mediapackagev2-alpha',
  'packages/@aws-cdk/metrics-facade-alpha',
  'packages/@aws-cdk/app-staging-synthesizer-alpha',
  'packages/@aws-cdk/aws-msk-alpha',
  'packages/@aws-cdk/cfn-property-mixins',
  'packages/@aws-cdk/aws-route53resolver-alpha',
  'packages/@aws-cdk/aws-location-alpha',
  'packages/@aws-cdk/aws-s3tables-alpha',
  'packages/@aws-cdk/aws-gamelift-alpha',
  'packages/@aws-cdk/aws-apprunner-alpha',
  'packages/@aws-cdk/aws-lambda-go-alpha',
  'packages/@aws-cdk/aws-applicationsignals-alpha',
  'packages/@aws-cdk/aws-elasticache-alpha',
  'packages/@aws-cdk/example-construct-library',
  'packages/@aws-cdk/integ-tests-alpha',
  'packages/@aws-cdk/aws-iot-actions-alpha',
  'packages/@aws-cdk/custom-resource-handlers',
  'packages/@aws-cdk/aws-s3objectlambda-alpha',
  'packages/@aws-cdk/aws-codestar-alpha',
  'packages/@aws-cdk/aws-bedrock-alpha',
  'packages/@aws-cdk/aws-servicecatalogappregistry-alpha',
  'packages/@aws-cdk/aws-iotevents-actions-alpha',
  'packages/@aws-cdk/region-info',
  'packages/@aws-cdk/aws-redshift-alpha',
  'packages/@aws-cdk/aws-iot-alpha',
  'packages/@aws-cdk/aws-pipes-enrichments-alpha',
];

// In VSCode's debug terminal: disable coverage and subprocess spawning,
// so we can more easily attach the debugger to the subprocesses.
const isVsCodeDebugTerminal = process.env.NODE_OPTIONS?.includes('ms-vscode.js-debug') ?? false;

// Set context that will apply to all unit tests
process.env.CDK_CONTEXT_JSON = JSON.stringify({
  '@aws-cdk/core:strictCfnValidateErrors': true,
});

module.exports = {
  projects: DIRS.map(dir => {
    const rootDir = path.join('..', dir);

    return {
      displayName: path.basename(dir),
      rootDir,
      ...makeConfig(rootDir),
    };
  }),

  // These are only supported at the top level :(
  //
  coverageReporters: [
    'text-summary', // for console summary
    'cobertura', // for codecov. see https://docs.codecov.com/docs/code-coverage-with-javascript
    'html' // for local deep dive
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: ['\\.generated\\.[jt]s$', '<rootDir>/test/', '.warnings.jsii.js$', '/node_modules/'],
  collectCoverage: !isVsCodeDebugTerminal,

  // Jest is resource greedy so this shouldn't be more than 50%
  maxWorkers: '50%',

  reporters: [
    'default',
    ['jest-junit', { suiteName: 'jest tests', outputDirectory: 'coverage', suiteNameTemplate: '{filepath}', classNameTemplate: '{classname}', titleTemplate: '{title}' }]],

};

function makeConfig(dir) {
  const thisPackagesPackageJson = require(`${dir}/package.json`);

  let setupFilesAfterEnv = [];
  if ('aws-cdk-lib' in thisPackagesPackageJson.devDependencies ?? {}) {
    // If we depend on aws-cdk-lib, use the provided autoclean hook
    setupFilesAfterEnv.push('aws-cdk-lib/testhelpers/jest-autoclean');
    setupFilesAfterEnv.push('aws-cdk-lib/testhelpers/jest-global-app-testhook');
  } else if (thisPackagesPackageJson.name === 'aws-cdk-lib') {
    // If we *ARE* aws-cdk-lib, use the hook in a slightly different way
    setupFilesAfterEnv.push('./testhelpers/jest-autoclean.ts');
    setupFilesAfterEnv.push('./testhelpers/jest-global-app-testhook.ts');
  }

  return {
    // The preset deals with preferring TS over JS
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['<rootDir>/test/**/?(*.)+(test).ts'],

    // Transform TypeScript using ts-jest. Use of this preset still requires the depending
    // package to depend on `ts-jest` directly.
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest'
      ],
    },
    testEnvironment: 'node',
    setupFilesAfterEnv,
  };
}

