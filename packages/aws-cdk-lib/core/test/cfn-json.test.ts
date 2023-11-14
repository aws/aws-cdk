import { App, CfnResource, Lazy, Stack } from '../lib';
import { CfnJson } from '../lib/cfn-json';

describe('cfn json', () => {

  test('resolves to a fn::getatt', () => {
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
    expect(template.Resources.MyCfnJson248769BB.Properties.Value).toEqual('{"hello":1234,"world":{"bar":1234}}');

    // output is basically an Fn::GetAtt
    expect(stack.resolve(json)).toEqual({ 'Fn::GetAtt': ['MyCfnJson248769BB', 'Value'] });
  });

  test('tokens and intrinsics can be used freely in keys or values', () => {
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

    expect(template.Resources.MyCfnJson248769BB.Properties.Value).toEqual({
      'Fn::Join': ['', ['{"', { Ref: 'Other' }, '":1234,"world":{"bar":"this is a I am lazy"}}']],
    });
  });

  test('JSON.stringify() will return the CFN-stringified value to avoid circular references', () => {
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
    expect(typeof(str)).toEqual('string');
    expect(stack.resolve(str)).toEqual({
      'Fn::Join': ['', ['"{"ref=', { Ref: 'MyResource' }, '":"this is a I am lazy"}"']],
    });
  });
});
