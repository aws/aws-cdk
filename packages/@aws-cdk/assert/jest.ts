import { Stack } from "@aws-cdk/core";
import cxapi = require("@aws-cdk/cx-api");
import { HaveResourceAssertion, ResourcePart } from "./lib/assertions/have-resource";
import { MatchStyle, matchTemplate } from "./lib/assertions/match-template";
import { expect as ourExpect } from './lib/expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchTemplate(template: any,
                      matchStyle?: MatchStyle): R;

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
  toMatchTemplate(
    actual: cxapi.CloudFormationStackArtifact | Stack,
    template: any,
    matchStyle?: MatchStyle) {

    const assertion = matchTemplate(template, matchStyle);
    const inspector = ourExpect(actual);
    const pass = assertion.assertUsing(inspector);
    if (pass) {
      return {
        pass,
        message: () => `Not ` + assertion.description
      };
    } else {
      return {
        pass,
        message: () => assertion.description
      };
    }
  },

  toHaveResource(
      actual: cxapi.CloudFormationStackArtifact | Stack,
      resourceType: string,
      properties?: any,
      comparison?: ResourcePart) {

    const assertion = new HaveResourceAssertion(resourceType, properties, comparison, false);
    return assertHaveResource(assertion, actual);
  },
  toHaveResourceLike(
      actual: cxapi.CloudFormationStackArtifact | Stack,
      resourceType: string,
      properties?: any,
      comparison?: ResourcePart) {

    const assertion = new HaveResourceAssertion(resourceType, properties, comparison, true);
    return assertHaveResource(assertion, actual);
  }
});

function assertHaveResource(assertion: HaveResourceAssertion, actual: cxapi.CloudFormationStackArtifact | Stack) {
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