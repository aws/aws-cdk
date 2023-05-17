/// !cdk-integ *
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';

const app = new cdk.App();

/// !show

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
new UseStack(app, 'UseStack', { key: keyStack.key });
/// !hide

app.synth();
