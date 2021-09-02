import * as core from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { JestFriendlyAssertion } from './lib/assertion';
import { countResources, countResourcesLike } from './lib/assertions/count-resources';
import { haveOutput, HaveOutputProperties } from './lib/assertions/have-output';
import { HaveResourceAssertion, ResourcePart } from './lib/assertions/have-resource';
import { MatchStyle, matchTemplate } from './lib/assertions/match-template';
import { expect as ourExpect } from './lib/expect';
import { StackInspector } from './lib/inspector';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Used to check that the synthesized stack template looks like the given template, or is a superset of it.
       * These functions match logical IDs and all properties of a resource.
       *
       * @param template
       * @param matchStyle
       */
      toMatchTemplate(
        template: any,
        matchStyle?: MatchStyle): R;

      /**
       * Used to check that a resource of a particular type exists **within the provided stack** (regardless of its logical identifier),
       * and that some of its properties are set to specific values.
       *
       * @param resourceType
       * @param properties
       * @param comparison
       */
      toHaveResource(
        resourceType: string,
        properties?: any,
        comparison?: ResourcePart): R;

      /**
       * Used to check that a resource of a particular type exists **within the provided stack or any nested stacks** (regardless of its logical
       * identifier), and that some of its properties are set to specific values.
       *
       * @param resourceType
       * @param properties
       * @param comparison
       */
      toHaveResourceLike(
        resourceType: string,
        properties?: any,
        comparison?: ResourcePart): R;

      /**
       * Used to check that a stack contains specific output. Parameters to check against can be.
       *
       * @param props
       */
      toHaveOutput(props: HaveOutputProperties): R;

      /**
       * Used to check that n number of resources of a particular type exist, with or without specific properties.
       *
       * @param resourceType
       * @param count
       */
      toCountResources(resourceType: string, count: number): R;

      /**
       * Used to check that n number of resources of a particular type exist, with or without specific properties.
       *
       * @param resourceType
       * @param count
       * @param properties
       */
      toCountResourcesLike(resourceType: string, count: number, properties: any): R;
    }
  }
}

expect.extend({
  toMatchTemplate(
    actual: cxapi.CloudFormationStackArtifact | core.Stack,
    template: any,
    matchStyle?: MatchStyle) {

    const assertion = matchTemplate(template, matchStyle);
    const inspector = ourExpect(actual);
    const pass = assertion.assertUsing(inspector);
    if (pass) {
      return {
        pass,
        message: () => 'Not ' + assertion.description,
      };
    } else {
      return {
        pass,
        message: () => assertion.description,
      };
    }
  },

  toHaveResource(
    actual: cxapi.CloudFormationStackArtifact | core.Stack,
    resourceType: string,
    properties?: any,
    comparison?: ResourcePart) {

    const assertion = new HaveResourceAssertion(resourceType, properties, comparison, false);
    return applyAssertion(assertion, actual);
  },

  toHaveResourceLike(
    actual: cxapi.CloudFormationStackArtifact | core.Stack,
    resourceType: string,
    properties?: any,
    comparison?: ResourcePart) {

    const assertion = new HaveResourceAssertion(resourceType, properties, comparison, true);
    return applyAssertion(assertion, actual);
  },

  toHaveOutput(
    actual: cxapi.CloudFormationStackArtifact | core.Stack,
    props: HaveOutputProperties) {

    return applyAssertion(haveOutput(props), actual);
  },

  toCountResources(
    actual: cxapi.CloudFormationStackArtifact | core.Stack,
    resourceType: string,
    count = 1) {

    return applyAssertion(countResources(resourceType, count), actual);
  },

  toCountResourcesLike(
    actual: cxapi.CloudFormationStackArtifact | core.Stack,
    resourceType: string,
    properties: any,
    count = 1) {

    return applyAssertion(countResourcesLike(resourceType, count, properties), actual);
  },
});

function applyAssertion(assertion: JestFriendlyAssertion<StackInspector>, actual: cxapi.CloudFormationStackArtifact | core.Stack) {
  const inspector = ourExpect(actual);
  const pass = assertion.assertUsing(inspector);
  if (pass) {
    return {
      pass,
      message: () => 'Not ' + assertion.generateErrorMessage(),
    };
  } else {
    return {
      pass,
      message: () => assertion.generateErrorMessage(),
    };
  }
}
