import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as kms from '../lib';

const app = new cdk.App();

/**
 * Stack that defines the key
 */
class KeyStack extends cdk.Stack {
  public readonly key: kms.Key;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'MyKey', { removalPolicy: cdk.RemovalPolicy.DESTROY });
  }
}

interface UseStackProps extends cdk.StackProps {
  key: kms.IKey; // Use IKey here
}

/**
 * Stack that uses the key
 */
class UseStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: UseStackProps) {
    super(scope, id, props);

    // Use the IKey object here.
    new kms.Alias(this, 'Alias', {
      aliasName: 'alias/foo',
      targetKey: props.key,
    });
  }
}

const keyStack = new KeyStack(app, 'KeyStack');

new IntegTest(app, 'cdk-integ-key-sharing', {
  testCases: [new UseStack(app, 'UseStack', { key: keyStack.key })],
});
