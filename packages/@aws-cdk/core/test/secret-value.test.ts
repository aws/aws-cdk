import { CfnDynamicReference, CfnDynamicReferenceService, CfnParameter, SecretValue, Stack, Token } from '../lib';

describe('secret value', () => {
  test('plainText', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.plainText('this just resolves to a string');

    // THEN
    expect(stack.resolve(v)).toEqual('this just resolves to a string');

  });

  test('secretsManager', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.secretsManager('secret-id', {
      jsonField: 'json-key',
      versionStage: 'version-stage',
    });

    // THEN
    expect(stack.resolve(v)).toEqual('{{resolve:secretsmanager:secret-id:SecretString:json-key:version-stage:}}');

  });

  test('secretsManager with secret-id from token', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.secretsManager(Token.asString({ Ref: 'secret-id' }), {
      jsonField: 'json-key',
      versionStage: 'version-stage',
    });

    // THEN
    expect(stack.resolve(v)).toEqual({
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          { Ref: 'secret-id' },
          ':SecretString:json-key:version-stage:}}',
        ],
      ],
    });

  });

  test('secretsManager with defaults', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.secretsManager('secret-id');

    // THEN
    expect(stack.resolve(v)).toEqual('{{resolve:secretsmanager:secret-id:SecretString:::}}');

  });

  test('secretsManager with defaults, secret-id from token', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.secretsManager(Token.asString({ Ref: 'secret-id' }));

    // THEN
    expect(stack.resolve(v)).toEqual({
      'Fn::Join': [
        '',
        [
          '{{resolve:secretsmanager:',
          { Ref: 'secret-id' },
          ':SecretString:::}}',
        ],
      ],
    });

  });

  test('secretsManager with an empty ID', () => {
    expect(() => SecretValue.secretsManager('')).toThrow(/secretId cannot be empty/);

  });

  test('secretsManager with versionStage and versionId', () => {
    expect(() => {
      SecretValue.secretsManager('secret-id',
        {
          versionStage: 'version-stage',
          versionId: 'version-id',
        });
    }).toThrow(/were both provided but only one is allowed/);


  });

  test('secretsManager with a non-ARN ID that has colon', () => {
    expect(() => SecretValue.secretsManager('not:an:arn')).toThrow(/is not an ARN but contains ":"/);

  });

  test('ssmSecure', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.ssmSecure('param-name', 'param-version');

    // THEN
    expect(stack.resolve(v)).toEqual('{{resolve:ssm-secure:param-name:param-version}}');

  });

  test('ssmSecure without version', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.ssmSecure('param-name');

    // THEN
    expect(stack.resolve(v)).toEqual('{{resolve:ssm-secure:param-name:}}');
  });

  test('cfnDynamicReference', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.cfnDynamicReference(new CfnDynamicReference(CfnDynamicReferenceService.SSM, 'foo:bar'));

    // THEN
    expect(stack.resolve(v)).toEqual('{{resolve:ssm:foo:bar}}');

  });

  test('cfnParameter (with NoEcho)', () => {
    // GIVEN
    const stack = new Stack();
    const p = new CfnParameter(stack, 'MyParam', { type: 'String', noEcho: true });

    // WHEN
    const v = SecretValue.cfnParameter(p);

    // THEN
    expect(stack.resolve(v)).toEqual({ Ref: 'MyParam' });

  });

  test('fails if cfnParameter does not have NoEcho', () => {
    // GIVEN
    const stack = new Stack();
    const p = new CfnParameter(stack, 'MyParam', { type: 'String' });

    // THEN
    expect(() => SecretValue.cfnParameter(p)).toThrow(/CloudFormation parameter must be configured with "NoEcho"/);

  });
});
