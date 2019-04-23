import { Stack } from "@aws-cdk/cdk";
import { SynthesizedStack } from "@aws-cdk/cx-api";
import { haveResource, ResourcePart } from "./lib/assertions/have-resource";
import { expect as ourExpect } from './lib/expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveResource(resourceType: string,
                     properties?: any,
                     comparison?: ResourcePart,
                     allowValueExtension?: boolean): R;
    }
  }
}

expect.extend({
  toHaveResource(actual: SynthesizedStack | Stack,
                 resourceType: string,
                 properties?: any,
                 comparison?: ResourcePart,
                 allowValueExtension: boolean = false) {

    const assertion = haveResource(resourceType, properties, comparison, allowValueExtension);
    const inspector = ourExpect(actual);
    const pass = assertion.assertUsing(inspector);
    if (pass) {
      return {
        pass,
        message: `Expected ${JSON.stringify(inspector.value, null, 2)} not to match ${assertion.description}`,
      };
    } else {
      return {
        pass,
        message: `Expected ${JSON.stringify(inspector.value, null, 2)} to match ${assertion.description}`,
      };
    }
  }
});