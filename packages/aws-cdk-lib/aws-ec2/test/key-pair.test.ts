import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import {
  KeyPair,
  KeyPairFormat,
  KeyPairType,
  OperatingSystemType,
} from '../lib';

describe('Key Pair', () => {
  test('basic test', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new KeyPair(stack, 'KeyPair');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::EC2::KeyPair', 1);
  });

  it('automatically generates a name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = new KeyPair(stack, 'TestKeyPair');

    // THEN
    expect(keyPair.keyPairName).toBeTruthy();
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::KeyPair', {
      KeyName: Match.stringLikeRegexp('\\w{1,255}'),
    });
  });

  it('defaults to RSA type', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = new KeyPair(stack, 'TestKeyPair');

    // THEN
    expect(keyPair.type).toBe(KeyPairType.RSA);
  });

  it('correctly renders RSA', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new KeyPair(stack, 'TestKeyPair', {
      type: KeyPairType.RSA,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::KeyPair', {
      KeyType: 'rsa',
    });
  });

  it('correctly renders ED25519', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new KeyPair(stack, 'TestKeyPair', {
      type: KeyPairType.ED25519,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::KeyPair', {
      KeyType: 'ed25519',
    });
  });

  it('correctly renders PEM', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new KeyPair(stack, 'TestKeyPair', {
      format: KeyPairFormat.PEM,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::KeyPair', {
      KeyFormat: 'pem',
    });
  });

  it('correctly renders PPK', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new KeyPair(stack, 'TestKeyPair', {
      format: KeyPairFormat.PPK,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::KeyPair', {
      KeyFormat: 'ppk',
    });
  });

  it('asserts unknown type is compatible with all OSes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = KeyPair.fromKeyPairName(stack, 'KeyPair', 'KeyPairName');

    // THEN
    expect(keyPair._isOsCompatible(OperatingSystemType.LINUX)).toBe(true);
    expect(keyPair._isOsCompatible(OperatingSystemType.WINDOWS)).toBe(true);
    expect(keyPair._isOsCompatible(OperatingSystemType.UNKNOWN)).toBe(true);
  });

  it('asserts RSA keys are compatible with all OSes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = new KeyPair(stack, 'KeyPair', {
      type: KeyPairType.RSA,
    });

    // THEN
    expect(keyPair._isOsCompatible(OperatingSystemType.LINUX)).toBe(true);
    expect(keyPair._isOsCompatible(OperatingSystemType.WINDOWS)).toBe(true);
    expect(keyPair._isOsCompatible(OperatingSystemType.UNKNOWN)).toBe(true);
  });

  it('aserts ED25519 keys are incompatible with Windows', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = new KeyPair(stack, 'KeyPair', {
      type: KeyPairType.ED25519,
    });

    // THEN
    expect(keyPair._isOsCompatible(OperatingSystemType.WINDOWS)).toBe(false);
  });

  it('forbids specifying both publicKeyMaterial and type', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    expect(() => new KeyPair(stack, 'KeyPair', {
      publicKeyMaterial: 'ssh-ed25519 AAAAAAAAAAAAAAAAAAAAAA',
      type: KeyPairType.ED25519,
    })).toThrow('Cannot specify \'type\' for keys with imported material');
  });

  it('returns a reference to SSM parameter for non-imported keys', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = new KeyPair(stack, 'TestKeyPair');
    new cdk.CfnOutput(stack, 'TestOutput', {
      value: keyPair.privateKey.parameterName,
    });

    // THEN
    expect(keyPair.privateKey).toBeTruthy();
    Template.fromStack(stack).hasOutput('TestOutput', {
      Value: stack.resolve(`/ec2/keypair/${keyPair.keyPairId}`),
    });
  });

  it('throws an error when accessing the SSM parameter for an imported key', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const keyPair = new KeyPair(stack, 'TestKeyPair', {
      publicKeyMaterial: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIB7jpNzG+YG0s+xIGWbxrxIZiiozHOEuzIJacvASP0mq',
    });

    // THEN
    expect(() => keyPair.privateKey).toThrow('An SSM parameter with private key material is not created for imported keys');
  });
});
