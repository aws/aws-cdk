import * as cxapi from '@aws-cdk/cx-api';
import { SDK } from '../../lib';
import { AppStacks, DefaultSelection } from '../../lib/api/cxapp/stacks';
import { registerContextProvider } from '../../lib/context-providers';
import { Configuration } from '../../lib/settings';
import { testAssembly } from '../util';

test('do not throw when selecting stack without errors', async () => {
  // GIVEN
  const stacks = testStacks();

  // WHEN
  const selected = await stacks.selectStacks(['withouterrors'], {
    defaultBehavior: DefaultSelection.AllStacks
  });
  stacks.processMetadata(selected);

  // THEN
  expect(selected[0].template.resource).toBe('noerrorresource');
});

test('do throw when selecting stack with errors', async () => {
  // GIVEN
  const stacks = testStacks();

  // WHEN
  const selected = await stacks.selectStacks(['witherrors'], {
    defaultBehavior: DefaultSelection.AllStacks
  });

  // THEN
  expect(() => stacks.processMetadata(selected)).toThrow(/Found errors/);
});

test('select behavior: all', async () => {
  // GIVEN
  const stacks = testStacks();

  // WHEN
  const x = await stacks.selectStacks([], { defaultBehavior: DefaultSelection.AllStacks });

  // THEN
  expect(x.length).toBe(2);
});

test('select behavior: none', async () => {
  // GIVEN
  const stacks = testStacks();

  // WHEN
  const x = await stacks.selectStacks([], { defaultBehavior: DefaultSelection.None });

  // THEN
  expect(x.length).toBe(0);
});

test('select behavior: single', async () => {
  // GIVEN
  const stacks = testStacks();

  // WHEN
  await expect(stacks.selectStacks([], { defaultBehavior: DefaultSelection.OnlySingle }))
    .rejects.toThrow('Since this app includes more than a single stack, specify which stacks to use (wildcards are supported)');
});

describe('AWS::CDK::Metadata', () => {
  test('is generated for relocatable stacks', async () => {
    const stacks = testStacks({ env: `aws://${cxapi.UNKNOWN_ACCOUNT}/${cxapi.UNKNOWN_REGION}`, versionReporting: true });

    const result = await stacks.synthesizeStack('withouterrors');
    const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
    expect(metadata).toEqual({
      Type: 'AWS::CDK::Metadata',
      Properties: {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Modules: `${require('../../package.json').name}=${require('../../package.json').version}`
      },
      Condition: 'CDKMetadataAvailable',
    });

    expect(result.template.Conditions?.CDKMetadataAvailable).toBeDefined();
  });

  test('is generated for stacks in supported regions', async () => {
    const stacks = testStacks({ env: 'aws://012345678912/us-east-1', versionReporting: true });

    const result = await stacks.synthesizeStack('withouterrors');
    const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
    expect(metadata).toEqual({
      Type: 'AWS::CDK::Metadata',
      Properties: {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Modules: `${require('../../package.json').name}=${require('../../package.json').version}`
      }
    });
  });

  test('is not generated for stacks in unsupported regions', async () => {
    const stacks = testStacks({ env: 'aws://012345678912/bermuda-triangle-1337', versionReporting: true });

    const result = await stacks.synthesizeStack('withouterrors');
    const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
    expect(metadata).toBeUndefined();
  });
});

test('stop executing if context providers are not making progress', async () => {
  registerContextProvider('testprovider', class {
    public async getValue(_: { [key: string]: any }): Promise<any> {
      return 'foo';
    }
  });

  const stacks = new AppStacks({
    configuration: new Configuration(),
    aws: new SDK({ userAgent: 'aws-cdk/jest' }),
    synthesizer: async () => testAssembly({
      stacks: [{
        stackName: 'thestack',
        template: { resource: 'noerrorresource' },
      }],
      // Always return the same missing keys, synthesis should still finish.
      missing: [
        { key: 'abcdef', props: {}, provider: 'testprovider' }
      ]
    }),
  });

  // WHEN
  await stacks.selectStacks(['thestack'], { defaultBehavior: DefaultSelection.AllStacks });

  // THEN: the test finishes normally});
});

function testStacks({ env, versionReporting = true }: { env?: string, versionReporting?: boolean } = {}) {
  const configuration = new Configuration();
  configuration.settings.set(['versionReporting'], versionReporting);

  return new AppStacks({
    configuration,
    aws: new SDK({ userAgent: 'aws-cdk/jest' }),
    synthesizer: async () => testAssembly({
      stacks: [{
        stackName: 'withouterrors',
        env,
        template: { resource: 'noerrorresource' },
      },
      {
        stackName: 'witherrors',
        env,
        template: { resource: 'errorresource' },
        metadata: {
          '/resource': [
            {
              type: cxapi.ERROR_METADATA_KEY,
              data: 'this is an error'
            }
          ]
        },
      }]
    }),
  });
}
