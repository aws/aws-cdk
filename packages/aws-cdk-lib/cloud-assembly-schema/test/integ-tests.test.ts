import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Manifest } from '../lib';

describe('Integration test', () => {
  test('valid input', () => {
    expect(() => {
      validate({
        version: Manifest.version(),
        testCases: {
          testCase1: {
            stacks: ['stack1', 'stack2'],
            stackUpdateWorkflow: true,
            cdkCommandOptions: {
              deploy: {
                enabled: true,
                expectError: false,
                expectedMessage: 'some message',
                args: {
                  exclusively: true,
                  toolkitStackName: 'Stack',
                  reuseAssets: ['asset1', 'asset2'],
                  changeSetName: 'changeset',
                  force: true,
                  rollback: false,
                  notificationArns: ['arn1', 'arn2'],
                  execute: true,
                  parameters: {
                    'MYPARAM': 'Value',
                    'Stack1:OtherParam': 'OtherValue',
                  },
                  usePreviousParameters: true,
                  outputsFile: 'outputs.json',
                  ci: true,
                  requireApproval: 'never',
                  app: 'node bin/my-app.js',
                  roleArn: 'roleArn',
                  context: {
                    KEY: 'value',
                  },
                  trace: true,
                  strict: true,
                  lookups: true,
                  ignoreErrors: true,
                  json: true,
                  verbose: true,
                  debug: true,
                  profile: 'profile',
                  proxy: 'https://proxy',
                  caBundlePath: 'path/to/bundle',
                  ec2Creds: true,
                  versionReporting: false,
                  pathMetadata: false,
                  assetMetadata: true,
                  staging: false,
                  output: true,
                  notices: true,
                  color: false,
                },
              },
              synth: {
                enabled: true,
                expectError: false,
                expectedMessage: 'some message',
                args: {
                  quiet: true,
                  exclusively: true,
                  validation: true,
                },
              },
              destroy: {
                enabled: true,
                expectError: false,
                expectedMessage: 'some message',
                args: {
                  force: true,
                  exclusively: true,
                },
              },
            },
            hooks: {
              preDeploy: ['yarn test'],
              postDeploy: ['some other command'],
              preDestroy: ['command1', 'command2'],
              postDestroy: ['command3', 'command4'],
            },
            diffAssets: true,
            allowDestroy: ['AWS::IAM::Role'],
            region: ['us-east-1', 'us-east-2'],
          },
        },
      });
    });
  });

  test('invalid input', () => {
    expect(() => {
      validate({
        version: Manifest.version(),
        testCases: {
          stacks: true,
        },
      });
    }).toThrow(/instance\.testCases\.stacks is not of a type\(s\) object/);
  });

  test('without command options', () => {
    expect(() => {
      validate({
        version: Manifest.version(),
        testCases: {
          testCase1: {
            stacks: ['stack1', 'stack2'],
            stackUpdateWorkflow: true,
            hooks: {
              preDeploy: ['yarn test'],
            },
            diffAssets: true,
          },
        },
      });
    });
  });
});

function validate(manifest: any) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'integ.test.'));
  const filePath = path.join(dir, 'manifest.json');
  fs.writeFileSync(filePath, JSON.stringify(manifest, undefined, 2));
  try {
    Manifest.loadIntegManifest(filePath);
  } finally {
    fs.unlinkSync(filePath);
    fs.rmdirSync(dir);
  }
}
