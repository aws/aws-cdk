import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { DefaultSelection } from '../../lib/api/cxapp/cloud-assembly';
import { MockCloudExecutable } from '../util';

test('do not throw when selecting stack without errors', async () => {
  // GIVEN
  const cxasm = await testCloudAssembly();

  // WHEN
  const selected = await cxasm.selectStacks(['withouterrors'], {
    defaultBehavior: DefaultSelection.AllStacks,
  });
  selected.processMetadataMessages();

  // THEN
  expect(selected.firstStack.template.resource).toBe('noerrorresource');
});

test('do throw when selecting stack with errors', async () => {
  // GIVEN
  const cxasm = await testCloudAssembly();

  // WHEN
  const selected = await cxasm.selectStacks(['witherrors'], {
    defaultBehavior: DefaultSelection.AllStacks,
  });

  // THEN
  expect(() => selected.processMetadataMessages()).toThrow(/Found errors/);
});

test('select behavior: all', async () => {
  // GIVEN
  const cxasm = await testCloudAssembly();

  // WHEN
  const x = await cxasm.selectStacks([], { defaultBehavior: DefaultSelection.AllStacks });

  // THEN
  expect(x.stackCount).toBe(2);
});

test('select behavior: none', async () => {
  // GIVEN
  const cxasm = await testCloudAssembly();

  // WHEN
  const x = await cxasm.selectStacks([], { defaultBehavior: DefaultSelection.None });

  // THEN
  expect(x.stackCount).toBe(0);
});

test('select behavior: single', async () => {
  // GIVEN
  const cxasm = await testCloudAssembly();

  // WHEN
  await expect(cxasm.selectStacks([], { defaultBehavior: DefaultSelection.OnlySingle }))
    .rejects.toThrow('Since this app includes more than a single stack, specify which stacks to use (wildcards are supported) or specify `--all`');
});

test('select behavior: repeat', async () => {
  // GIVEN
  const cxasm = await testCloudAssembly();

  // WHEN
  const x = await cxasm.selectStacks(['withouterrors', 'withouterrors'], {
    defaultBehavior: DefaultSelection.AllStacks,
  });

  // THEN
  expect(x.stackCount).toBe(1);
});

async function testCloudAssembly({ env }: { env?: string, versionReporting?: boolean } = {}) {
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

  return cloudExec.synthesize();
}
