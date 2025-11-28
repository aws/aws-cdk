import { App, Stack, CfnResource } from '../lib';
import { NestedStack } from '../lib/nested-stack';
import { ITemplateTransform, TemplateTransforms } from '../lib/template-transform';

describe('TemplateTransforms', () => {
  describe('registration', () => {
    test('can register transforms via App.addTemplateTransform()', () => {
      const app = new App();
      const transform: ITemplateTransform = {
        transformTemplate: jest.fn(),
      };

      app.addTemplateTransform(transform);

      expect(TemplateTransforms.of(app).all).toContain(transform);
    });

    test('can register transforms via TemplateTransforms.of()', () => {
      const app = new App();
      const transform: ITemplateTransform = {
        transformTemplate: jest.fn(),
      };

      TemplateTransforms.of(app).add(transform);

      expect(TemplateTransforms.of(app).all).toContain(transform);
    });

    test('transforms are returned in registration order', () => {
      const app = new App();
      const transform1: ITemplateTransform = { transformTemplate: jest.fn() };
      const transform2: ITemplateTransform = { transformTemplate: jest.fn() };
      const transform3: ITemplateTransform = { transformTemplate: jest.fn() };

      app.addTemplateTransform(transform1);
      app.addTemplateTransform(transform2);
      app.addTemplateTransform(transform3);

      expect(TemplateTransforms.of(app).all).toEqual([transform1, transform2, transform3]);
    });

    test('TemplateTransforms.of() returns same instance for same app', () => {
      const app = new App();
      const transforms1 = TemplateTransforms.of(app);
      const transforms2 = TemplateTransforms.of(app);

      expect(transforms1).toBe(transforms2);
    });

    test('TemplateTransforms.of() on stack returns app transforms', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const transform: ITemplateTransform = { transformTemplate: jest.fn() };

      app.addTemplateTransform(transform);

      expect(TemplateTransforms.of(stack).all).toContain(transform);
    });
  });

  describe('hasAny', () => {
    test('returns false when no transforms registered', () => {
      const app = new App();

      expect(TemplateTransforms.hasAny(app)).toBe(false);
    });

    test('returns true when transforms are registered', () => {
      const app = new App();
      app.addTemplateTransform({ transformTemplate: jest.fn() });

      expect(TemplateTransforms.hasAny(app)).toBe(true);
    });

    test('does not create singleton when checking empty app', () => {
      const app = new App();

      // hasAny should not create the singleton
      TemplateTransforms.hasAny(app);

      // Verify singleton was not created by checking that of() creates a new one with empty array
      // If hasAny had created it, all would still be empty, but we verify the symbol isn't set
      const TEMPLATE_TRANSFORMS_SYMBOL = Symbol.for('@aws-cdk/core.TemplateTransforms');
      expect((app as any)[TEMPLATE_TRANSFORMS_SYMBOL]).toBeUndefined();
    });

    test('works when called on stack scope', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      app.addTemplateTransform({ transformTemplate: jest.fn() });

      expect(TemplateTransforms.hasAny(stack)).toBe(true);
    });
  });

  describe('invocation', () => {
    test('transforms are invoked during synthesis', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      const transformFn = jest.fn();
      app.addTemplateTransform({ transformTemplate: transformFn });

      app.synth();

      expect(transformFn).toHaveBeenCalledTimes(1);
      expect(transformFn).toHaveBeenCalledWith(
        stack,
        expect.objectContaining({
          Resources: expect.objectContaining({
            Resource: expect.objectContaining({ Type: 'AWS::Test::Resource' }),
          }),
        }),
      );
    });

    test('transforms are invoked in registration order', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      const order: number[] = [];
      app.addTemplateTransform({ transformTemplate: () => { order.push(1); } });
      app.addTemplateTransform({ transformTemplate: () => { order.push(2); } });
      app.addTemplateTransform({ transformTemplate: () => { order.push(3); } });

      app.synth();

      expect(order).toEqual([1, 2, 3]);
    });

    test('transforms can mutate template in place', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      app.addTemplateTransform({
        transformTemplate(_stack, template) {
          template.Metadata = { Custom: 'Value' };
        },
      });

      const assembly = app.synth();
      const template = assembly.getStackByName('Stack').template;

      expect(template.Metadata).toEqual({ Custom: 'Value' });
    });

    test('transforms can return a new template', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      app.addTemplateTransform({
        transformTemplate(_stack, template) {
          return {
            ...template,
            Metadata: { Replaced: true },
          };
        },
      });

      const assembly = app.synth();
      const template = assembly.getStackByName('Stack').template;

      expect(template.Metadata).toEqual({ Replaced: true });
    });

    test('transform returning null is ignored (original template used)', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      app.addTemplateTransform({
        transformTemplate(_stack, template) {
          template.Metadata = { Modified: true };
          return null as any; // explicitly return null
        },
      });

      const assembly = app.synth();
      const template = assembly.getStackByName('Stack').template;

      // In-place mutation should still apply, but null return is treated like undefined
      expect(template.Metadata).toEqual({ Modified: true });
    });

    test('synthesis succeeds with no transforms registered', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      // No transforms registered
      expect(TemplateTransforms.of(app).all).toHaveLength(0);

      const assembly = app.synth();
      const template = assembly.getStackByName('Stack').template;

      expect(template.Resources.Resource.Type).toBe('AWS::Test::Resource');
    });

    test('later transforms see changes from earlier transforms', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      app.addTemplateTransform({
        transformTemplate(_stack, template) {
          template.Metadata = { Step: 1 };
        },
      });
      app.addTemplateTransform({
        transformTemplate(_stack, template) {
          template.Metadata.Step = 2;
        },
      });

      const assembly = app.synth();
      const template = assembly.getStackByName('Stack').template;

      expect(template.Metadata).toEqual({ Step: 2 });
    });

    test('transforms are invoked for multiple stacks', () => {
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const stack2 = new Stack(app, 'Stack2');
      new CfnResource(stack1, 'Resource', { type: 'AWS::Test::Resource' });
      new CfnResource(stack2, 'Resource', { type: 'AWS::Test::Resource' });

      const stacks: Stack[] = [];
      app.addTemplateTransform({
        transformTemplate(stack) {
          stacks.push(stack);
        },
      });

      app.synth();

      expect(stacks).toHaveLength(2);
      expect(stacks).toContain(stack1);
      expect(stacks).toContain(stack2);
    });

    test('transforms are invoked for nested stacks', () => {
      const app = new App();
      const parentStack = new Stack(app, 'ParentStack');
      const nestedStack = new NestedStack(parentStack, 'NestedStack');
      new CfnResource(nestedStack, 'Resource', { type: 'AWS::Test::Resource' });

      const stacks: Array<{ stack: Stack; nested: boolean }> = [];
      app.addTemplateTransform({
        transformTemplate(stack) {
          stacks.push({ stack, nested: stack.nested });
        },
      });

      app.synth();

      expect(stacks).toContainEqual({ stack: parentStack, nested: false });
      expect(stacks).toContainEqual({ stack: nestedStack, nested: true });
    });

    test('transform can distinguish nested stacks', () => {
      const app = new App();
      const parentStack = new Stack(app, 'ParentStack');
      const nestedStack = new NestedStack(parentStack, 'NestedStack');
      new CfnResource(nestedStack, 'Resource', { type: 'AWS::Test::Resource' });

      app.addTemplateTransform({
        transformTemplate(stack, template) {
          if (stack.nested) {
            template.Metadata = { IsNested: true };
          } else {
            template.Metadata = { IsNested: false };
          }
        },
      });

      const assembly = app.synth();
      const parentTemplate = assembly.getStackByName('ParentStack').template;

      expect(parentTemplate.Metadata).toEqual({ IsNested: false });
      // Nested stack template is embedded as an asset, harder to verify directly
    });
  });

  describe('error handling', () => {
    test('synthesis fails if transform throws', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      app.addTemplateTransform({
        transformTemplate() {
          throw new Error('Validation failed: policy violation');
        },
      });

      expect(() => app.synth()).toThrow('Validation failed: policy violation');
    });

    test('first failing transform stops execution', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', { type: 'AWS::Test::Resource' });

      const secondTransform = jest.fn();

      app.addTemplateTransform({
        transformTemplate() {
          throw new Error('First transform failed');
        },
      });
      app.addTemplateTransform({
        transformTemplate: secondTransform,
      });

      expect(() => app.synth()).toThrow('First transform failed');
      expect(secondTransform).not.toHaveBeenCalled();
    });
  });

  describe('template content', () => {
    test('transforms receive fully resolved template (no tokens)', () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      new CfnResource(stack, 'Resource', {
        type: 'AWS::Test::Resource',
        properties: {
          StackName: stack.stackName,
        },
      });

      let receivedTemplate: any;
      app.addTemplateTransform({
        transformTemplate(_stack, template) {
          receivedTemplate = template;
        },
      });

      app.synth();

      // Verify the template is resolved (stackName should be a string, not a token)
      const resource = receivedTemplate.Resources.Resource;
      expect(typeof resource.Properties.StackName).toBe('string');
      expect(resource.Properties.StackName).toBe('Stack');
    });
  });
});
