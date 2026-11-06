import * as path from 'path';
import * as assets from '../../../aws-s3-assets';
import { Stack, Stage } from '../../../core';
import { ManualApprovalStep, ShellStep, StageDeployment } from '../../lib';
import { AppWithOutput, TestApp, TwoStackApp } from '../testhelpers/test-app';

test('"templateAsset" represents the CFN template of the stack', () => {
  // GIVEN
  const stage = new Stage(new TestApp(), 'MyStage');
  new Stack(stage, 'MyStack');

  // WHEN
  const sd = StageDeployment.fromStage(stage);

  // THEN
  expect(sd.stacks[0].templateAsset).not.toBeUndefined();
  expect(sd.stacks[0].templateAsset?.assetId).not.toBeUndefined();
  expect(sd.stacks[0].templateAsset?.assetManifestPath).not.toBeUndefined();
  expect(sd.stacks[0].templateAsset?.assetSelector).not.toBeUndefined();
  expect(sd.stacks[0].templateAsset?.assetType).toBe('file');
  expect(sd.stacks[0].templateAsset?.isTemplate).toBeTruthy();
});

describe('templateUrl', () => {
  test('includes the https:// s3 URL of the template file', () => {
    // GIVEN
    const stage = new Stage(new TestApp(), 'MyStage', { env: { account: '111', region: 'us-east-1' } });
    new Stack(stage, 'MyStack');

    // WHEN
    const sd = StageDeployment.fromStage(stage);

    // THEN
    expect(sd.stacks[0].templateUrl).toBe('https://cdk-hnb659fds-assets-111-us-east-1.s3.us-east-1.amazonaws.com/21fbb51d7b23f6a6c262b46a9caee79d744a3ac019fd45422d988b96d44b2a22.json');
  });

  test('without region', () => {
    // GIVEN
    const stage = new Stage(new TestApp(), 'MyStage', { env: { account: '111' } });
    new Stack(stage, 'MyStack');

    // WHEN
    const sd = StageDeployment.fromStage(stage);

    // THEN
    expect(sd.stacks[0].templateUrl).toBe('https://cdk-hnb659fds-assets-111-${AWS::Region}.s3.amazonaws.com/21fbb51d7b23f6a6c262b46a9caee79d744a3ac019fd45422d988b96d44b2a22.json');
  });
});

test('"requiredAssets" contain only assets that are not the template', () => {
  // GIVEN
  const stage = new Stage(new TestApp(), 'MyStage');
  const stack = new Stack(stage, 'MyStack');
  new assets.Asset(stack, 'Asset', { path: path.join(__dirname, 'fixtures') });

  // WHEN
  const sd = StageDeployment.fromStage(stage);

  // THEN
  expect(sd.stacks[0].assets.length).toBe(1);
  expect(sd.stacks[0].assets[0].assetType).toBe('file');
  expect(sd.stacks[0].assets[0].isTemplate).toBeFalsy();
});

describe('deployGate', () => {
  test('is empty by default', () => {
    const stage = new Stage(new TestApp(), 'MyStage');
    new Stack(stage, 'MyStack');
    expect(StageDeployment.fromStage(stage).deployGate).toEqual([]);
  });

  test('is retained on the StageDeployment when independent stacks are used', () => {
    const stage = new Stage(new TestApp(), 'MyStage');
    new Stack(stage, 'MyStack');
    const gate = new ManualApprovalStep('Approve');
    expect(StageDeployment.fromStage(stage, { deployGate: [gate] }).deployGate).toEqual([gate]);
  });

  test('throws DeployGateRequiresIndependentStacks when any two stacks depend on each other', () => {
    const stage = new TwoStackApp(new TestApp(), 'MyStage');
    expect(() => {
      StageDeployment.fromStage(stage, { deployGate: [new ManualApprovalStep('Approve')] });
    }).toThrow(/cannot use.*deployGate.*depend on other stacks/);
  });

  test('does not throw for dependent stacks when deployGate is not used', () => {
    const stage = new TwoStackApp(new TestApp(), 'MyStage');
    expect(() => StageDeployment.fromStage(stage)).not.toThrow();
  });

  test('throws DeployGateCannotConsumeStackOutputs when a gate step consumes a stack output', () => {
    const myApp = new AppWithOutput(new TestApp(), 'MyStage');
    const scriptStep = new ShellStep('Check', {
      envFromCfnOutputs: { BUCKET_NAME: myApp.theOutput },
      commands: ['echo $BUCKET_NAME'],
    });
    expect(() => {
      StageDeployment.fromStage(myApp, { deployGate: [scriptStep] });
    }).toThrow(/cannot use.*deployGate.*consume stack outputs/);
  });

  test('does not throw when a stack-output-consuming step is used as post instead', () => {
    const myApp = new AppWithOutput(new TestApp(), 'MyStage');
    const scriptStep = new ShellStep('Check', {
      envFromCfnOutputs: { BUCKET_NAME: myApp.theOutput },
      commands: ['echo $BUCKET_NAME'],
    });
    expect(() => StageDeployment.fromStage(myApp, { post: [scriptStep] })).not.toThrow();
  });

  test('addDeployGate() appends steps but bypasses fromStage() validation (documented behavior)', () => {
    // Passing deployGate via props to a stage with dependent stacks would throw,
    // but addDeployGate() after construction does not -- this is the documented tradeoff.
    const stage = new TwoStackApp(new TestApp(), 'MyStage');
    const sd = StageDeployment.fromStage(stage);
    const gate = new ManualApprovalStep('Approve');
    sd.addDeployGate(gate);
    expect(sd.deployGate).toEqual([gate]);
  });
});
