import { Test, testCase } from 'nodeunit';
import { filteredSpecification, resourceTypes, specification } from '../lib/index';
import { validateSpecification } from './spec-validators';

const tests: any = {
  'filteredSpecification(/^AWS::S3::.*/)'(test: Test) {
    const filteredSpec = filteredSpecification(/^AWS::S3::.*/);
    test.notDeepEqual(filteredSpec, specification, `The filteredSpecification result is not the whole specification`);
    test.notDeepEqual(filteredSpec.ResourceTypes, {}, `The filtered spec is not empty`);
    test.done();
  },
  'filteredSpecification(s => s.startsWith("AWS::S3::")'(test: Test) {
    const filteredSpec = filteredSpecification(s => s.startsWith('AWS::S3::'));
    test.notDeepEqual(filteredSpec, specification, `The filteredSpecification result is not the whole specification`);
    test.notDeepEqual(filteredSpec.ResourceTypes, {}, `The filtered spec is not empty`);
    test.done();
  }
};

for (const name of resourceTypes.sort()) {
  tests[`filteredSpecification(${JSON.stringify(name)})`] = (test: Test) => {
    const filteredSpec = filteredSpecification(name);
    test.notDeepEqual(filteredSpec, specification, `The filteredSpecification result is not the whole specification`);
    test.notDeepEqual(filteredSpec.ResourceTypes, {}, `The filtered spec is not empty`);
    // Validate the spec is conform & coherent.
    validateSpecification(test, filteredSpec);
    test.done();
  };
}

export = testCase(tests);
