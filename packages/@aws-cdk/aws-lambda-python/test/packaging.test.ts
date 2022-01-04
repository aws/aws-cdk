import * as path from 'path';
import { Packaging } from '../lib/packaging';

test('Packging with no dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler-nodeps');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.NONE);
});

test('Packging with requirements.txt', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.PIP);
});

test('Packging with pipenv', () => {
  const entry = path.join(__dirname, 'lambda-handler-pipenv');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.PIPENV);
});

test('Packging with poetry', () => {
  const entry = path.join(__dirname, 'lambda-handler-poetry');
  const packaging = Packaging.fromEntry(entry);

  // pip packaging identified.
  expect(packaging).toEqual(Packaging.POETRY);
});
