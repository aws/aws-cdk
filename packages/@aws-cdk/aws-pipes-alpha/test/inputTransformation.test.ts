import { App, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { TestSource, TestTarget } from './test-classes';
import { DynamicInput, Pipe } from '../lib';
import { InputTransformation } from '../lib/inputTransformation';

describe('InputTransformation', () => {
  let stack: Stack;
  let pipe: Pipe;

  beforeEach(() => {
    stack = new Stack(new App(), 'Stack');
    pipe = new Pipe(stack, 'TestPipe', {
      source: new TestSource(),
      target: new TestTarget(),
    });
  } );

  describe('fromText', () => {
    it('should return the input string', () => {
      // GIVEN
      const result = InputTransformation.fromText('some text').bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('some text');
    });

    it('should keep quotes of the input string when variables are present', () => {
      // GIVEN
      const result = InputTransformation.fromText(`pipe name: "${DynamicInput.pipeName}"`).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('pipe name: "<aws.pipes.pipe-name>"');
    });

    it('should keep quotes of the input string when eventPath is present', () => {
      // GIVEN
      const result = InputTransformation.fromText(`some body: "${DynamicInput.fromEventPath('$.body')}"`).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('some body: "<$.body>"');
    });

    it('should return string with intrinsic function', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      const result = InputTransformation.fromText(`role-name ${role.roleName} text`).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual({ 'Fn::Join': ['', ['role-name ', { Ref: 'Role1ABCC5F0' }, ' text']] });
    });
  });

  describe('fromEventPath', () => {
    it('should return the event path', () => {
      // GIVEN
      const result = InputTransformation.fromEventPath('$.foo.bar').bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('<$.foo.bar>');
    });

    it('should throw an error if the jsonPath does not start with "$."', () => {
      // GIVEN
      let expectedError;
      try {
        InputTransformation.fromEventPath('foo.bar');
      } catch (error) {
        expectedError = error;
      }

      // THEN
      expect(expectedError).toEqual(new Error('jsonPathExpression start with "$."'));
    });
  });

  describe('fromObject', () => {
    it('should return the input object', () => {
      // GIVEN
      const result = InputTransformation.fromObject({
        foo: 'bar',
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('{"foo":"bar"}');
    });

    it('should return object with intrinsic function', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      const result = InputTransformation.fromObject({
        roleName: role.roleName,
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual({ 'Fn::Join': ['', ['{"roleName":"', { Ref: 'Role1ABCC5F0' }, '"}']] });
    });

    it('should return object with event path', () => {
      // GIVEN
      const result = InputTransformation.fromObject({
        foo: DynamicInput.fromEventPath('$.foo.bar'),
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('{"foo":<$.foo.bar>}');
    });

    it('should return object with event path and intrinsic function', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      const result = InputTransformation.fromObject({
        foo: DynamicInput.fromEventPath('$.foo.bar'),
        roleName: role.roleName,
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual({ 'Fn::Join': ['', ['{"foo":<$.foo.bar>,"roleName":"', { Ref: 'Role1ABCC5F0' }, '"}']] });
    });

    it('should return object with pipe variable', () => {
      // GIVEN
      const result = InputTransformation.fromObject({
        pipeName: DynamicInput.pipeName,
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('{"pipeName":<aws.pipes.pipe-name>}');
    } );

    it('should return object with pipe variable and intrinsic function', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      const result = InputTransformation.fromObject({
        pipeName: DynamicInput.pipeName,
        roleName: role.roleName,
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual({ 'Fn::Join': ['', ['{"pipeName":<aws.pipes.pipe-name>,"roleName":"', { Ref: 'Role1ABCC5F0' }, '"}']] });
    } );

    it('should return object with pipe variable and event path', () => {
      // GIVEN
      const result = InputTransformation.fromObject({
        pipeName: DynamicInput.pipeName,
        foo: DynamicInput.fromEventPath('$.foo.bar'),
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('{"pipeName":<aws.pipes.pipe-name>,"foo":<$.foo.bar>}');
    });

    it('should return object with pipe variable, event path and intrinsic function', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      });

      const result = InputTransformation.fromObject({
        pipeName: DynamicInput.pipeName,
        foo: DynamicInput.fromEventPath('$.foo.bar'),
        roleName: role.roleName,
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual({ 'Fn::Join': ['', ['{"pipeName":<aws.pipes.pipe-name>,"foo":<$.foo.bar>,"roleName":"', { Ref: 'Role1ABCC5F0' }, '"}']] });
    });

    it('should return unquoted string if dynamic value is set manually', () => {
      // GIVEN
      const result = InputTransformation.fromObject({
        pipeName: '<aws.pipes.pipe-name>',
        path: '<$.foo.bar>',
      }).bind(pipe);

      // WHEN
      const resolvedResult = stack.resolve(result);

      // THEN
      expect(resolvedResult.inputTemplate).toEqual('{"pipeName":<aws.pipes.pipe-name>,"path":<$.foo.bar>}');
    });
  },
  );

});
