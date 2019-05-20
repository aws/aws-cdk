import { Stack } from "@aws-cdk/cdk";
import { SynthesizedStack } from "@aws-cdk/cx-api";
import { HaveResourceAssertion, ResourcePart } from "./lib/assertions/have-resource";
import { expect as ourExpect } from './lib/expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveResource(resourceType: string,
                     properties?: any,
                     comparison?: ResourcePart): R;

      toHaveResourceLike(resourceType: string,
                         properties?: any,
                         comparison?: ResourcePart): R;
    }
  }
}

expect.extend({
  toHaveResource(
      actual: SynthesizedStack | Stack,
      resourceType: string,
      properties?: any,
      comparison?: ResourcePart) {

    const assertion = new HaveResourceAssertion(resourceType, properties, comparison, false);
    return assertHaveResource(assertion, actual);
  },
  toHaveResourceLike(
      actual: SynthesizedStack | Stack,
      resourceType: string,
      properties?: any,
      comparison?: ResourcePart) {

    const assertion = new HaveResourceAssertion(resourceType, properties, comparison, true);
    return assertHaveResource(assertion, actual);
  }
});

function assertHaveResource(assertion: HaveResourceAssertion, actual: SynthesizedStack | Stack) {
  const inspector = ourExpect(actual);
  const pass = assertion.assertUsing(inspector);
  if (pass) {
    return {
      pass,
      message: () => `Not ` + assertion.generateErrorMessage(),
    };
  } else {
    return {
      pass,
      message: () => assertion.generateErrorMessage(),
    };
  }
}