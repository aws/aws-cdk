import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, CfnResource, Lazy, Stack } from '../lib';
import { CfnJson } from '../lib/cfn-json';
import { CfnUtilsResourceType } from '../lib/private/cfn-utils-provider/consts';
import { handler } from '../lib/private/cfn-utils-provider/index';

nodeunitShim({

  'resolves to a fn::getatt'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'test');

    // WHEN
    const json = new CfnJson(stack, 'MyCfnJson', {
      value: {
        hello: 1234,
        world: { bar: 1234 },
      },
    });

    // THEN
    const template = app.synth().getStackArtifact(stack.artifactId).template;

    // input is stringified
    test.deepEqual(template.Resources.MyCfnJson248769BB.Properties.Value, '{"hello":1234,"world":{"bar":1234}}');

    // output is basically an Fn::GetAtt
    test.deepEqual(stack.resolve(json), { 'Fn::GetAtt': ['MyCfnJson248769BB', 'Value'] });

    test.done();
  },

  'tokens and intrinsics can be used freely in keys or values'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'test');
    const other = new CfnResource(stack, 'Other', { type: 'MyResource' });

    // WHEN
    new CfnJson(stack, 'MyCfnJson', {
      value: {
        [other.ref]: 1234,
        world: {
          bar: `this is a ${Lazy.string({ produce: () => 'I am lazy' })}`,
        },
      },
    });

    // THEN
    const template = app.synth().getStackArtifact(stack.artifactId).template;

    test.deepEqual(template.Resources.MyCfnJson248769BB.Properties.Value, {
      'Fn::Join': ['', ['{"', { Ref: 'Other' }, '":1234,"world":{"bar":"this is a I am lazy"}}']],
    });
    test.done();
  },

  'JSON.stringify() will return the CFN-stringified value to avoid circular references'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const res = new CfnResource(stack, 'MyResource', { type: 'Foo' });
    const cfnjson = new CfnJson(stack, 'MyCfnJson', {
      value: {
        [`ref=${res.ref}`]: `this is a ${Lazy.string({ produce: () => 'I am lazy' })}`,
      },
    });

    // WHEN
    const str = JSON.stringify(cfnjson);

    // THEN
    test.ok(typeof(str) === 'string');
    test.deepEqual(stack.resolve(str), {
      'Fn::Join': ['', ['"{"ref=', { Ref: 'MyResource' }, '":"this is a I am lazy"}"']],
    });

    test.done();
  },

  async 'resource provider simply parses json and reflects back as an attribute'(test: Test) {
    const input = { foo: 1234 };
    const response = await handler({
      ResourceType: CfnUtilsResourceType.CFN_JSON,
      ResourceProperties: {
        Value: JSON.stringify(input),
      },
    } as any);
    test.deepEqual(input, response.Data.Value);
    test.done();
  },
});
