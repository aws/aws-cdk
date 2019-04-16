import { Test } from 'nodeunit';
import { CfnResource, Stack } from '../lib';
import { ISerializable, ISerializationContext } from '../lib/serialization';
import { Unicorn } from './unicorn';

export = {
  'exportString'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.exportString('MyExportName', 'MyExportValue');

    // THEN
    test.deepEqual(stack._toCloudFormation(), {
      Outputs: {
        StackExports27613D471EFDoooMyExportNameE0B62460: { Value: 'MyExportValue', Export: { Name: 'MyExportName' } }
      }
    });
    test.done();
  },

  'exportString: description'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.exportString('MyExportName', 'MyExportValue', {
      description: 'hello hello'
    });

    // THEN
    test.deepEqual(stack._toCloudFormation(), {
      Outputs: {
        StackExports27613D471EFDoooMyExportNameE0B62460: {
          Description: 'hello hello',
          Value: 'MyExportValue',
          Export: { Name: 'MyExportName' }
        }
      }
    });
    test.done();
  },

  'exportString: fail if export twice under the same name with a different value'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.exportString('foo', 'bar');

    // THEN
    test.throws(() => stack.exportString('foo', 'again?'),
      /Trying to export "again\?" under the export name foo, but "bar" is already exported under this name/);
    test.done();
  },

  'importString: resolve=synth, weak=false (default)'(test: Test) {
    // GIVEN
    const stack = new TestStack();

    // WHEN
    const x = stack.importString('ExportMyExport');
    new CfnResource(stack, 'MyResource', {
      type: 'AWS::Resource::Type',
      properties: {
        Input: x
      }
    });

    // THEN
    test.deepEqual(x, 'dummy-imported-value-for-ExportMyExport');
    test.deepEqual(stack._toCloudFormation(), {
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
    new CfnResource(stack, 'MyResource', {
      type: 'AWS::Resource::Type',
      properties: {
        Input: x
      }
    });

    // THEN
    test.deepEqual(stack._toCloudFormation(), {
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
    test.deepEqual(stack._toCloudFormation(), {
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
    test.deepEqual(stack._toCloudFormation(), {
      Outputs: {
        StackExports27613D471EFDoooBoomBoomk1D8D0F933: { Value: 'v1', Export: { Name: 'BoomBoom-k1' } },
        StackExports27613D471EFDoooBoomBoomk2CD914571: { Value: 'v2||v3', Export: { Name: 'BoomBoom-k2' } },
        StackExports27613D471EFDoooBoomBoomk3k4BD7C3E1E: {
          Description: 'desc of k4',
          Value: 'v4',
          Export: { Name: 'BoomBoom-k3-k4' }
        }
      }
    });
    test.done();
  },

  'end-to-end ser/deser of a construct'(test: Test) {
    const stack = new TestStack();

    const bobo = new Unicorn(stack, 'bobo', {
      name: 'bobo',
      colors: [ 'yellow', 'green', 'red' ]
    });

    const gigi = new Unicorn(stack, 'gigi', {
      name: 'gigi',
      friend: bobo
    });

    stack.exportObject('BoboUnicorn', bobo);
    stack.exportObject('GigiUnicorn', gigi);

    test.deepEqual(stack._toCloudFormation(), {
      Outputs: {
        StackExports27613D471EFDoooBoboUnicornname69033C4D: {
          Value: "bobo",
          Export: {
            Name: "BoboUnicorn-name"
          }
        },
        StackExports27613D471EFDoooBoboUnicorncolors13FE600D: {
          Value: "yellow||green||red",
          Export: {
            Name: "BoboUnicorn-colors"
          }
        },
        StackExports27613D471EFDoooGigiUnicornname6699504B: {
          Value: "gigi",
          Export: {
            Name: "GigiUnicorn-name"
          }
        },
        StackExports27613D471EFDoooGigiUnicornfriendname56070668: {
          Value: "bobo",
          Export: {
            Name: "GigiUnicorn-friend-name"
          }
        },
        StackExports27613D471EFDoooGigiUnicornfriendcolorsF185A5E6: {
          Value: "yellow||green||red",
          Export: {
            Name: "GigiUnicorn-friend-colors"
          }
        }
      }
    });
    test.done();
  }

};

class TestStack extends Stack {
  constructor() {
    super(undefined, 'test-stack', { env: {
      account: '11111', region: 'us-east-1'
    }});
  }
}
