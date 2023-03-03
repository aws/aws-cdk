import { validateSpecification } from './spec-validators';
import { filteredSpecification, resourceTypes, specification } from '../lib/index';

test('filteredSpecification(/^AWS::S3::.*/)', () => {
  const filteredSpec = filteredSpecification(/^AWS::S3::.*/);
  expect(filteredSpec).not.toEqual(specification);
  expect(filteredSpec.ResourceTypes).not.toEqual({});
});

test('filteredSpecification(s => s.startsWith("AWS::S3::")', () => {
  const filteredSpec = filteredSpecification(s => s.startsWith('AWS::S3::'));
  expect(filteredSpec).not.toEqual(specification);
  expect(filteredSpec.ResourceTypes).not.toEqual({});
});

for (const name of resourceTypes().sort()) {
  describe(`filteredSpecification(${JSON.stringify(name)})`, () => {
    const filteredSpec = filteredSpecification(name);
    expect(filteredSpec).not.toEqual(specification);
    expect(filteredSpec.ResourceTypes).not.toEqual({});
    // Validate the spec is conform & coherent.
    validateSpecification(filteredSpec);
  });
}
