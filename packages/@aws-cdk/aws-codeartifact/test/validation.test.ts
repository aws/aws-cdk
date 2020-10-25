import '@aws-cdk/assert/jest';
import { validate } from '../lib/validation';

test('Is undefined and value is empty', () => {
  validate('test', {}, undefined);
});

test('Is Required and value is empty', () => {
  testValidate('Is required and cannot be empty', { required: true }, undefined);
  testValidate('Is required and cannot be empty', { required: true }, '');
});

test('Does not match pattern', () => {
  testValidate('must match pattern 0-9', { pattern: /0-9/ }, 'a');
});

test('Less than min length', () => {
  testValidate('must be at least 2 characters long', { minLength: 2 }, 'a');
});

test('Less than max length', () => {
  testValidate('must be less than 2 characters long', { maxLength: 2 }, 'aaa');
});

function testValidate(
  expectedMessage : string,
  rule : { required?: boolean, pattern? : RegExp, minLength? : number, maxLength?: number },
  value?: string) {

  try {
    validate('test', rule, value);
  } catch (e) {
    expect(e.message).toBe(`test: ${expectedMessage}`);
  }
}
