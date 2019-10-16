import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import { App, CfnOutput, Construct, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Alias } from '../lib/alias';
import { IKey, Key } from '../lib/key';

/* eslint-disable quote-props */

export = {
  'default alias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');
    const key = new Key(stack, 'Key');

    new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

    expect(stack).to(haveResource('AWS::KMS::Alias', {
      AliasName: 'alias/foo',
      TargetKeyId: { 'Fn::GetAtt': [ 'Key961B73FD', 'Arn' ] }
    }));

    test.done();
  },

  'add "alias/" prefix if not given.'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'Key', {
      enableKeyRotation: true,
      enabled: false
    });

    new Alias(stack, 'Alias', {
      aliasName: 'foo',
      targetKey: key
    });

    expect(stack).to(haveResource('AWS::KMS::Alias', {
      AliasName: 'alias/foo',
      TargetKeyId: { 'Fn::GetAtt': [ 'Key961B73FD', 'Arn' ] }
    }));

    test.done();
  },

  'can create alias directly while creating the key'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    new Key(stack, 'Key', {
      enableKeyRotation: true,
      enabled: false,
      alias: 'foo',
    });

    expect(stack).to(haveResource('AWS::KMS::Alias', {
      AliasName: 'alias/foo',
      TargetKeyId: { 'Fn::GetAtt': [ 'Key961B73FD', 'Arn' ] }
    }));

    test.done();
  },

  'fails if alias is "alias/" (and nothing more)'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/',
      targetKey: key
    }));

    test.done();
  },

  'fails if alias contains illegal characters'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/@Nope',
      targetKey: key
    }), 'a-zA-Z0-9:/_-');

    test.done();
  },

  'fails if alias starts with "alias/aws/"'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new Alias(stack, 'Alias1', {
      aliasName: 'alias/aws/',
      targetKey: key
    }), /Alias cannot start with alias\/aws\/: alias\/aws\//);

    test.throws(() => new Alias(stack, 'Alias2', {
      aliasName: 'alias/aws/Awesome',
      targetKey: key
    }), /Alias cannot start with alias\/aws\/: alias\/aws\/Awesome/);

    test.throws(() => new Alias(stack, 'Alias3', {
      aliasName: 'alias/AWS/awesome',
      targetKey: key
    }), /Alias cannot start with alias\/aws\/: alias\/AWS\/awesome/);

    test.done();
  },

  'can be used wherever a key is expected'(test: Test) {
    const stack = new Stack();

    const myKey = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });
    const myAlias = new Alias(stack, 'MyAlias', {
      targetKey: myKey,
      aliasName: 'alias/myAlias',
    });

    class MyConstruct extends Construct {
      constructor(scope: Construct, id: string, key: IKey) {
        super(scope, id);

        new CfnOutput(stack, 'OutId', {
          value: key.keyId,
        });
        new CfnOutput(stack, 'OutArn', {
          value: key.keyArn,
        });
      }
    }

    new MyConstruct(stack, 'MyConstruct', myAlias);

    const template = SynthUtils.synthesize(stack).template.Outputs;

    test.deepEqual(template, {
      "OutId": {
        "Value": "alias/myAlias",
      },
      "OutArn": {
        "Value": {
          "Fn::Join": ["", [
            "arn:",
            { Ref: "AWS::Partition" },
            ":kms:",
            { Ref: "AWS::Region" },
            ":",
            { Ref: "AWS::AccountId" },
            ":alias/myAlias",
          ]],
        },
      },
    });

    test.done();
  },
};
