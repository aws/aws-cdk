import cdk = require('@aws-cdk/cdk');
import kms = require('../lib');

const app = new cdk.App();

/// !show

/**
 * Stack that defines the key
 */
class KeyStack extends cdk.Stack {
  public readonly key: kms.Key;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.key = new kms.Key(this, 'MyKey', { retain: false });
  }
}

interface UseStackProps extends cdk.StackProps {
  key: kms.IKey; // Use IEncryptionKey here
}

/**
 * Stack that uses the key
 */
class UseStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: UseStackProps) {
    super(scope, id, props);

    // Use the IEncryptionKey object here.
    props.key.addAlias('alias/foo');
  }
}

const keyStack = new KeyStack(app, 'KeyStack');
new UseStack(app, 'UseStack', { key: keyStack.key });
/// !hide

app.synth();
