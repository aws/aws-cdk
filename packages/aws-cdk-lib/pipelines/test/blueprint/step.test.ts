import { ManualApprovalStep, ShellStep } from '../../lib';

describe('Step.primaryOutput', () => {
  test('is undefined for a step that produces no output', () => {
    const step = new ManualApprovalStep('Approve');

    expect(step.primaryOutput).toBeUndefined();
  });

  test('is populated when a ShellStep declares a primaryOutputDirectory', () => {
    const step = new ShellStep('Build', {
      commands: ['true'],
      primaryOutputDirectory: 'dist',
    });

    expect(step.primaryOutput).toBeDefined();
  });

  test('is populated lazily by primaryOutputDirectory() after construction', () => {
    const step = new ShellStep('Build', { commands: ['true'] });
    expect(step.primaryOutput).toBeUndefined();

    const fileSet = step.primaryOutputDirectory('dist');

    expect(step.primaryOutput).toBe(fileSet);
  });
});
