import type { Tag } from '../../lib/api/tags';
import { Command, commandLineArgumentsToSettings } from '../../lib/cli/user-configuration';

test('can parse string context from command line arguments', () => {
  // GIVEN
  const settings1 = commandLineArgumentsToSettings({ context: ['foo=bar'], _: [Command.DEPLOY] });
  const settings2 = commandLineArgumentsToSettings({ context: ['foo='], _: [Command.DEPLOY] });

  // THEN
  expect(settings1.get(['context']).foo).toEqual( 'bar');
  expect(settings2.get(['context']).foo).toEqual( '');
});

test('can parse string context from command line arguments with equals sign in value', () => {
  // GIVEN
  const settings1 = commandLineArgumentsToSettings({ context: ['foo==bar='], _: [Command.DEPLOY] });
  const settings2 = commandLineArgumentsToSettings({ context: ['foo=bar='], _: [Command.DEPLOY] });

  // THEN
  expect(settings1.get(['context']).foo).toEqual( '=bar=');
  expect(settings2.get(['context']).foo).toEqual( 'bar=');
});

test('can parse tag values from command line arguments', () => {
  // GIVEN
  const settings1 = commandLineArgumentsToSettings({ tags: ['foo=bar'], _: [Command.DEPLOY] });
  const settings2 = commandLineArgumentsToSettings({ tags: ['foo='], _: [Command.DEPLOY] });

  // THEN
  expect(settings1.get(['tags']).find((tag: Tag) => tag.Key === 'foo').Value).toEqual('bar');
  expect(settings2.get(['tags']).find((tag: Tag) => tag.Key === 'foo').Value).toEqual('');
});

test('can parse tag values from command line arguments with equals sign in value', () => {
  // GIVEN
  const settings1 = commandLineArgumentsToSettings({ tags: ['foo==bar='], _: [Command.DEPLOY] });
  const settings2 = commandLineArgumentsToSettings({ tags: ['foo=bar='], _: [Command.DEPLOY] });

  // THEN
  expect(settings1.get(['tags']).find((tag: Tag) => tag.Key === 'foo').Value).toEqual('=bar=');
  expect(settings2.get(['tags']).find((tag: Tag) => tag.Key === 'foo').Value).toEqual('bar=');
});

test('bundling stacks defaults to an empty list', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.LIST],
  });

  // THEN
  expect(settings.get(['bundlingStacks'])).toEqual([]);
});

test('bundling stacks defaults to ** for deploy', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.DEPLOY],
  });

  // THEN
  expect(settings.get(['bundlingStacks'])).toEqual(['**']);
});

test('bundling stacks defaults to ** for watch', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.WATCH],
  });

  // THEN
  expect(settings.get(['bundlingStacks'])).toEqual(['**']);
});

test('bundling stacks with deploy exclusively', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.DEPLOY],
    exclusively: true,
    STACKS: ['cool-stack'],
  });

  // THEN
  expect(settings.get(['bundlingStacks'])).toEqual(['cool-stack']);
});

test('bundling stacks with watch exclusively', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.WATCH],
    exclusively: true,
    STACKS: ['cool-stack'],
  });

  // THEN
  expect(settings.get(['bundlingStacks'])).toEqual(['cool-stack']);
});

test('should include outputs-file in settings', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.DEPLOY],
    outputsFile: 'my-outputs-file.json',
  });

  // THEN
  expect(settings.get(['outputsFile'])).toEqual('my-outputs-file.json');
});

test('providing a build arg', () => {
  // GIVEN
  const settings = commandLineArgumentsToSettings({
    _: [Command.SYNTH],
    build: 'mvn package',
  });

  // THEN
  expect(settings.get(['build'])).toEqual('mvn package');
});
