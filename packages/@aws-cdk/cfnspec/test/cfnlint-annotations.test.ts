import * as cfnspec from '../lib';

test('spot-check Bucket statefulness', () => {
  const anno = cfnspec.cfnLintAnnotations('AWS::S3::Bucket');
  expect(anno.stateful).toBeTruthy();
  expect(anno.mustBeEmptyToDelete).toBeTruthy();
});

test('spot-check Table statefulness', () => {
  const anno = cfnspec.cfnLintAnnotations('AWS::DynamoDB::Table');
  expect(anno.stateful).toBeTruthy();
  expect(anno.mustBeEmptyToDelete).toBeFalsy();
});

test('spot-check MediaStore metrics', () => {
  const anno = cfnspec.cfnLintAnnotations('AWS::MediaStore::Thingy');
  expect(anno.stateful).toBeFalsy();
});

