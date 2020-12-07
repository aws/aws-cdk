import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { DefaultSelection } from '../../lib/api/cxapp/cloud-assembly';
import { registerContextProvider } from '../../lib/context-providers';
import { MockCloudExecutable } from '../util';

describe('AWS::CDK::Metadata', () => {
  test('is generated for relocatable stacks', async () => {
    const cx = await testCloudExecutable({ env: `aws://${cxapi.UNKNOWN_ACCOUNT}/${cxapi.UNKNOWN_REGION}`, versionReporting: true });
    const cxasm = await cx.synthesize();

    const result = cxasm.stackById('withouterrors').firstStack;
    const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
    expect(metadata).toEqual({
      Type: 'AWS::CDK::Metadata',
      Properties: {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Modules: `${require('../../package.json').name}=${require('../../package.json').version}`,
      },
      Condition: 'CDKMetadataAvailable',
    });

    expect(result.template.Conditions?.CDKMetadataAvailable).toBeDefined();
  });

  test('is generated for stacks in supported regions', async () => {
    const cx = await testCloudExecutable({ env: 'aws://012345678912/us-east-1', versionReporting: true });
    const cxasm = await cx.synthesize();

    const result = cxasm.stackById('withouterrors').firstStack;
    const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
    expect(metadata).toEqual({
      Type: 'AWS::CDK::Metadata',
      Properties: {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Modules: `${require('../../package.json').name}=${require('../../package.json').version}`,
      },
    });
  });

  test('is not generated for stacks in unsupported regions', async () => {
    const cx = await testCloudExecutable({ env: 'aws://012345678912/bermuda-triangle-1337', versionReporting: true });
    const cxasm = await cx.synthesize();

    const result = cxasm.stackById('withouterrors').firstStack;
    const metadata = result.template.Resources && result.template.Resources.CDKMetadata;
    expect(metadata).toBeUndefined();
  });
});

test('stop executing if context providers are not making progress', async () => {
  registerContextProvider(cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER, class {
    public async getValue(_: { [key: string]: any }): Promise<any> {
      return 'foo';
    }
  });

  const cloudExecutable = new MockCloudExecutable({
    stacks: [{
      stackName: 'thestack',
      template: { resource: 'noerrorresource' },
    }],
    // Always return the same missing keys, synthesis should still finish.
    missing: [
      { key: 'abcdef', props: { account: '1324', region: 'us-east-1' }, provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER },
    ],
  });
  const cxasm = await cloudExecutable.synthesize();

  // WHEN
  await cxasm.selectStacks(['thestack'], { defaultBehavior: DefaultSelection.AllStacks });

  // THEN: the test finishes normally});
});

test('fails if lookups are disabled and missing context is synthesized', async () => {
  // GIVEN
  const cloudExecutable = new MockCloudExecutable({
    stacks: [{
      stackName: 'thestack',
      template: { resource: 'noerrorresource' },
    }],
    // Always return the same missing keys, synthesis should still finish.
    missing: [
      { key: 'abcdef', props: { account: '1324', region: 'us-east-1' }, provider: cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER },
    ],
  });
  cloudExecutable.configuration.settings.set(['lookups'], false);

  // WHEN
  await expect(cloudExecutable.synthesize()).rejects.toThrow(/Context lookups have been disabled/);
});


async function testCloudExecutable({ env, versionReporting = true }: { env?: string, versionReporting?: boolean } = {}) {
  const cloudExec = new MockCloudExecutable({
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
            type: cxschema.ArtifactMetadataEntryType.ERROR,
            data: 'this is an error',
          },
        ],
      },
    }],
  });
  cloudExec.configuration.settings.set(['versionReporting'], versionReporting);

  return cloudExec;
}
