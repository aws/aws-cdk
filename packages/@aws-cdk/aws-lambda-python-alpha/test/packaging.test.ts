import * as path from 'path';
import { Packaging } from '../lib/packaging';

test('Packaging with no dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler-nodeps');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.withNoPackaging());
});

test('Packaging with requirements.txt', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.withPip());
});

test('Packaging with pipenv', () => {
  const entry = path.join(__dirname, 'lambda-handler-pipenv');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.withPipenv());
});

test('Packaging with poetry', () => {
  const entry = path.join(__dirname, 'lambda-handler-poetry');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.withPoetry());
});
