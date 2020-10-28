import '@aws-cdk/assert/jest';
import { validate } from '../lib/validation';

const stub = { documentationLink: '' };

test('Is undefined and value is empty', () => {
  expect(() => validate('test', { ...stub }, undefined)).toThrow(/Is undefined and value is empty/);
});

test('Is Required and value is empty', () => {
  expect(() => validate('test', { ...stub, required: true }, undefined)).toThrow(/Is required and cannot be empty/);
  expect(() => validate('test', { ...stub, required: true }, '')).toThrow(/Is required and cannot be empty/);
});

test('Does not match pattern', () => {
  expect(() => validate('test', { ...stub, pattern: /0-9/ }, 'a')).toThrow(/must match pattern 0-9/);
});

test('Less than min length', () => {
  expect(() => validate('test', { ...stub, minLength: 2 }, 'a')).toThrow(/must be at least 2 characters long/);
});

test('Less than max length', () => {
  expect(() => validate('test', { ...stub, maxLength: 2 }, 'aaa')).toThrow(/must be less than 2 characters long/);
});