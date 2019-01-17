import { Test } from 'nodeunit';
import cdk = require('../lib');
import { ISerializable, ISerializationContext, ResolveType } from '../lib';

export = {
  'exportString'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    stack.exportString('MyExportName', 'MyExportValue');

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Outputs: {
        ExportsMyExportName4397ED14: { Value: 'MyExportValue', Export: { Name: 'MyExportName' } }
      }
    });
    test.done();
  },

  'exportString: description'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    stack.exportString('MyExportName', 'MyExportValue', {
      description: 'hello hello'
    });

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Outputs: {
        ExportsMyExportName4397ED14: {
          Description: 'hello hello',
          Value: 'MyExportValue',
          Export: { Name: 'MyExportName' }
        }
      }
    });
    test.done();
  },

  'importString: resolve=synth, weak=false (default)'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    // WHEN
    const x = stack.importString('ExportMyExport');
    new cdk.Resource(stack, 'MyResource', {
      type: 'AWS::Resource::Type',
      properties: {
        Input: x
      }
    });

    // THEN
    test.deepEqual(x, 'dummy-imported-value-for-ExportMyExport');
    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        StrongReferences8A180F: {
          Type: 'AWS::CloudFormation::WaitCondition',
          Metadata: { ExportMyExport: { 'Fn::ImportValue': 'ExportMyExport' } }
        },
        MyResource: {
          Type: 'AWS::Resource::Type',
          Properties: {
            Input: 'dummy-imported-value-for-ExportMyExport'
          }
        }
      }
    });
    test.deepEqual(stack.missingContext, {
      'cloudformation-import:account=11111:exportName=ExportMyExport:region=us-east-1': {
        provider: 'cloudformation-import',
        props: {
          account: stack.env.account,
          region: stack.env.region,
          exportName: 'ExportMyExport'
        }
      }
    });
    test.done();
  },

  'importString: resolve=synth, weak=true'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    // WHEN
    const x = stack.importString('ExportMyExport', { weak: true });
    new cdk.Resource(stack, 'MyResource', {
      type: 'AWS::Resource::Type',
      properties: {
        Input: x
      }
    });

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        MyResource: {
          Type: 'AWS::Resource::Type',
          Properties: {
            Input: 'dummy-imported-value-for-ExportMyExport'
          }
        }
      }
    });
    test.deepEqual(stack.missingContext, {
      'cloudformation-import:account=11111:exportName=ExportMyExport:region=us-east-1': {
        provider: 'cloudformation-import',
        props: {
          account: stack.env.account,
          region: stack.env.region,
          exportName: 'ExportMyExport'
        }
      }
    });
    test.done();
  },

  'importString: resolve=deploy, weak=false'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    // WHEN
    const x = stack.importString('ExportMyExport', { resolve: cdk.ResolveType.Deployment });
    new cdk.Resource(stack, 'MyResource', {
      type: 'AWS::Resource::Type',
      properties: {
        Input: x
      }
    });

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        MyResource: {
          Type: 'AWS::Resource::Type',
          Properties: {
            Input: { 'Fn::ImportValue': 'ExportMyExport' }
          }
        }
      }
    });
    test.deepEqual(stack.missingContext, {});
    test.done();
  },

  'importString: resolve=deploy, weak=true (error)'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    // WHEN/THEN
    test.throws(() =>
      stack.importString('ExportMyExport', { resolve: cdk.ResolveType.Deployment, weak: true }),
      /Deployment-time import resolution cannot be "weak"/);

    test.done();
  },

  'importObject (synth + strong): readString, readStringArray, readObject'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    // WHEN
    const ctx = stack.importObject('ObjectExportName');
    const value1 = ctx.readString('key1');
    const value2 = ctx.readString('key2');
    const subobj = ctx.readObject('key3');
    const value4 = subobj.readString('key4');
    const value5 = subobj.readStringList('key5');

    // THEN
    test.deepEqual(value1, 'dummy-imported-value-for-ObjectExportName-key1');
    test.deepEqual(value2, 'dummy-imported-value-for-ObjectExportName-key2');
    test.deepEqual(value4, 'dummy-imported-value-for-ObjectExportName-key3-key4');
    test.deepEqual(value5, [ 'dummy-imported-value-for-ObjectExportName-key3-key5' ]);

    // since the default is a strong reference, we expect a wait condition with
    // import values for all the keys.
    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        StrongReferences8A180F: {
          Type: 'AWS::CloudFormation::WaitCondition',
          Metadata: {
            'ObjectExportName-key1': { 'Fn::ImportValue': 'ObjectExportName-key1' },
            'ObjectExportName-key2': { 'Fn::ImportValue': 'ObjectExportName-key2' },
            'ObjectExportName-key3-key4': { 'Fn::ImportValue': 'ObjectExportName-key3-key4' },
            'ObjectExportName-key3-key5': { 'Fn::ImportValue': 'ObjectExportName-key3-key5' }
          }
        }
      }
    });

    test.done();
  },

  'exportObject: writeString, writeStringList, writeObject'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    const myObj: ISerializable = {
      serialize: (ctx: ISerializationContext) => {
        ctx.writeString('k1', 'v1');
        ctx.writeStringList('k2', [ 'v2', 'v3' ]);
        ctx.writeObject('k3', {
          serialize: ctx2 => {
            ctx2.writeString('k4', 'v4', { description: 'desc of k4' });
          }
        });
      }
    };

    // WHEN
    stack.exportObject('BoomBoom', myObj);

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Outputs: {
        ExportsBoomBoomk1B31E94EE: { Value: 'v1', Export: { Name: 'BoomBoom-k1' } },
        ExportsBoomBoomk277969FC7: { Value: 'v2||v3', Export: { Name: 'BoomBoom-k2' } },
        ExportsBoomBoomk3k48482CDA1: {
          Description: 'desc of k4',
          Value: 'v4',
          Export: { Name: 'BoomBoom-k3-k4' }
        }
      }
    });
    test.done();
  },

  'importObject: deploy-time resolution with allowUnresolved true/false'(test: Test) {
    // GIVEN
    const stack = new TestStack();
    const obj = stack.importObject('MyExportName', { resolve: ResolveType.Deployment });

    // WHEN/THEN

    // readString succeeds because "allowUnresolved" is defaulted to "true" here
    obj.readString('alright');

    // readString with "allowUnresolved=false" will fail
    test.throws(() => obj.readString('boom', { allowUnresolved: false }),
      /Imported value for export "MyExportName-boom" is an unresolved token and "allowUnresolved" is false/);

    // readStringList fails because "allowUnresolved" is always false
    test.throws(() => obj.readStringList('error'),
      /Cannot deserialize a string list for export "MyExportName-error" using deploy-time resolution/);

    // can't force it to true, sorry!
    test.throws(() => obj.readStringList('error', { allowUnresolved: true }),
      /Cannot deserialize a string list for export "MyExportName-error" using deploy-time resolution/);

    test.done();
  }
};

class TestStack extends cdk.Stack {
  constructor() {
    super(undefined, 'test-stack', { env: {
      account: '11111', region: 'us-east-1'
    }});
  }
}