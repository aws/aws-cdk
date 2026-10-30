import { CfnParameter, Stack } from '../../lib';
import {
  posixShellDecodeDeployTimeArgument,
  posixShellEscapeDeployTimeValuesInCommandLine,
  powershellDecodeDeployTimeArgument,
  powershellEscapeDeployTimeValuesInCommandLine,
} from '../../lib/private/deploy-time-shell-escape';

describe('posixShellDecodeDeployTimeArgument', () => {
  test('decodes a deploy-time value inside double quotes', () => {
    const stack = new Stack();
    const environment = new CfnParameter(stack, 'Environment').valueAsString;

    expect(stack.resolve(posixShellDecodeDeployTimeArgument(environment))).toEqual({
      'Fn::Join': ['', ["\"$(printf %s '", { 'Fn::Base64': { Ref: 'Environment' } }, "' | base64 -d)\""]],
    });
  });
});

describe('posixShellEscapeDeployTimeValuesInCommandLine', () => {
  test('keeps a command line without deploy-time values as written', () => {
    expect(posixShellEscapeDeployTimeValuesInCommandLine("--verbose -y $HOME * 'a b' 'c'"))
      .toEqual("--verbose -y $HOME * 'a b' 'c'");
  });

  test('decodes each deploy-time value in place, keeping the text around it', () => {
    const stack = new Stack();
    const environment = new CfnParameter(stack, 'Environment').valueAsString;
    const path = new CfnParameter(stack, 'Path').valueAsString;

    expect(stack.resolve(posixShellEscapeDeployTimeValuesInCommandLine(`--env ${environment} -f "${path}"`))).toEqual({
      'Fn::Join': ['', [
        "--env ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Environment' } },
        "' | base64 -d)\"} -f \"${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Path' } },
        "' | base64 -d)\"}\"",
      ]],
    });
  });

  test('drops single quotes around a lone deploy-time value only', () => {
    const stack = new Stack();
    const path = new CfnParameter(stack, 'Path').valueAsString;
    const label = new CfnParameter(stack, 'Label').valueAsString;

    expect(stack.resolve(posixShellEscapeDeployTimeValuesInCommandLine(`-f '${path}' 'lit' 'pre ${label}'`))).toEqual({
      'Fn::Join': ['', [
        "-f ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Path' } },
        "' | base64 -d)\"} 'lit' 'pre ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Label' } },
        "' | base64 -d)\"}'",
      ]],
    });
  });
});

describe('powershellDecodeDeployTimeArgument', () => {
  test('decodes a deploy-time value', () => {
    const stack = new Stack();
    const environment = new CfnParameter(stack, 'Environment').valueAsString;

    expect(stack.resolve(powershellDecodeDeployTimeArgument(environment))).toEqual({
      'Fn::Join': ['', [
        "([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('", { 'Fn::Base64': { Ref: 'Environment' } },
        "')))",
      ]],
    });
  });
});

describe('powershellEscapeDeployTimeValuesInCommandLine', () => {
  test('keeps a command line without deploy-time values as written', () => {
    expect(powershellEscapeDeployTimeValuesInCommandLine("-Verbose -Name 'a b' $env:TEMP"))
      .toEqual("-Verbose -Name 'a b' $env:TEMP");
  });

  test('decodes each deploy-time value in place and drops single quotes around a lone value', () => {
    const stack = new Stack();
    const environment = new CfnParameter(stack, 'Environment').valueAsString;
    const path = new CfnParameter(stack, 'Path').valueAsString;

    expect(stack.resolve(powershellEscapeDeployTimeValuesInCommandLine(`-A ${environment} -B '${path}' -C 'lit'`))).toEqual({
      'Fn::Join': ['', [
        "-A $(([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('", { 'Fn::Base64': { Ref: 'Environment' } },
        "')))) -B $(([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('", { 'Fn::Base64': { Ref: 'Path' } },
        "')))) -C 'lit'",
      ]],
    });
  });
});
