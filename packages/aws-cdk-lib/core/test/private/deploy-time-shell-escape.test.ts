import { CfnParameter, Stack } from '../../lib';
import {
  posixShellDecodeDeployTimeArgument,
  posixShellEscapeDeployTimeValuesInCommandLine,
  powershellDecodeDeployTimeArgument,
  powershellEscapeDeployTimeValuesInCommandLine,
} from '../../lib/private/deploy-time-shell-escape';

/**
 * Resolve `text` and fill in parameter values the way CloudFormation would,
 * including `Fn::Base64`.
 */
function renderAsDeployed(stack: Stack, text: string, values: Record<string, string>): string {
  const evaluate = (e: any): string => {
    if (typeof e === 'string') { return e; }
    if (e['Fn::Join']) { return e['Fn::Join'][1].map(evaluate).join(e['Fn::Join'][0]); }
    if (e['Fn::Base64'] !== undefined) { return Buffer.from(evaluate(e['Fn::Base64'])).toString('base64'); }
    if (e.Ref) { return values[e.Ref]; }
    throw new Error(`unexpected ${JSON.stringify(e)}`);
  };
  return evaluate(stack.resolve(text));
}

describe('posixShellDecodeDeployTimeArgument', () => {
  test('decodes a deploy-time value inside double quotes', () => {
    const stack = new Stack();
    const value = new CfnParameter(stack, 'P').valueAsString;

    expect(renderAsDeployed(stack, posixShellDecodeDeployTimeArgument(value), { P: 'prod' }))
      .toEqual("\"$(printf %s 'cHJvZA==' | base64 -d)\"");
  });
});

describe('posixShellEscapeDeployTimeValuesInCommandLine', () => {
  test('keeps a command line without deploy-time values as written', () => {
    const commandLine = "--verbose -y $HOME * 'a b' 'c'";

    expect(posixShellEscapeDeployTimeValuesInCommandLine(commandLine)).toEqual(commandLine);
  });

  test('decodes each deploy-time value in place, keeping the text around it', () => {
    const stack = new Stack();
    const value = new CfnParameter(stack, 'P').valueAsString;

    expect(renderAsDeployed(stack, posixShellEscapeDeployTimeValuesInCommandLine(`--env ${value} -f "${value}"`), { P: 'prod' }))
      .toEqual("--env ${0+\"$(printf %s 'cHJvZA==' | base64 -d)\"} -f \"${0+\"$(printf %s 'cHJvZA==' | base64 -d)\"}\"");
  });

  test('drops single quotes around a lone deploy-time value only', () => {
    const stack = new Stack();
    const value = new CfnParameter(stack, 'P').valueAsString;

    const rendered = renderAsDeployed(stack, posixShellEscapeDeployTimeValuesInCommandLine(`-f '${value}' 'lit' 'pre ${value}'`), { P: 'x' });

    expect(rendered).toEqual("-f ${0+\"$(printf %s 'eA==' | base64 -d)\"} 'lit' 'pre ${0+\"$(printf %s 'eA==' | base64 -d)\"}'");
  });
});

describe('powershellDecodeDeployTimeArgument', () => {
  test('decodes a deploy-time value', () => {
    const stack = new Stack();
    const value = new CfnParameter(stack, 'P').valueAsString;

    expect(renderAsDeployed(stack, powershellDecodeDeployTimeArgument(value), { P: 'prod' }))
      .toEqual("([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('cHJvZA==')))");
  });
});

describe('powershellEscapeDeployTimeValuesInCommandLine', () => {
  test('keeps a command line without deploy-time values as written', () => {
    const commandLine = "-Verbose -Name 'a b' $env:TEMP";

    expect(powershellEscapeDeployTimeValuesInCommandLine(commandLine)).toEqual(commandLine);
  });

  test('decodes each deploy-time value in place and drops single quotes around a lone value', () => {
    const stack = new Stack();
    const value = new CfnParameter(stack, 'P').valueAsString;
    const decode = "$(([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('eA=='))))";

    expect(renderAsDeployed(stack, powershellEscapeDeployTimeValuesInCommandLine(`-A ${value} -B '${value}' -C 'lit'`), { P: 'x' }))
      .toEqual(`-A ${decode} -B ${decode} -C 'lit'`);
  });
});
