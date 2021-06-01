import { Stack, Stage } from '@aws-cdk/core';
import * as assert from './assert-internal';

/**
 * A number of options to customize the `StackAssertions.assertResource()` API.
 */
export interface AssertResourceOptions {
  /**
   * The part of the CloudFormation Resource that the assertion should match against.
   * @default ResourcePart.PROPERTIES
   */
  readonly part?: ResourcePart;
}

/**
 * See `AssertResourceOptions.part`
 */
export enum ResourcePart {
  /** The entire resource definition in the template, excluding the 'Type' */
  COMPLETE,
  /** The 'Properties' section of the resource definition in the template */
  PROPERTIES,
}

/**
 * Suite of assertions that can be run on a CDK stack.
 * Typically used, as part of unit tests, to validate that the rendered
 * CloudFormation template has expected resources and properties.
 */
export class StackAssertions {
  private readonly inspector: assert.StackInspector;

  constructor(stack: Stack) {
    this.inspector = new assert.StackInspector(template(stack));
  }

  /**
   * Assert that the given number of resources of the given type exist in the
   * template.
   * @param type the resource type; ex: `AWS::S3::Bucket`
   * @param count number of expected instances
   */
  public assertResourceCount(type: string, count: number): void {
    const assertion = assert.countResources(type, count);
    assertion.assertOrThrow(this.inspector);
  }

  /**
   * Assert that a resource of the given type and properties exists in the
   * CloudFormation template.
   * @param type the resource type; ex: `AWS::S3::Bucket`
   * @param props the properties of the resource
   * @param options customize how the matching should be performed
   */
  public assertResource(type: string, props: any, options?: AssertResourceOptions): void {
    const part = assertResourcePart(options?.part ?? ResourcePart.PROPERTIES);
    const assertion = assert.haveResource(type, props, part);
    assertion.assertOrThrow(this.inspector);
  }

  public assertMatchTemplate(expected: {[key: string]: any}) {
    const assertion = assert.matchTemplate(expected);
    assertion.assertOrThrow(this.inspector);
  }
}

function template(stack: Stack): any {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage or an App');
  }
  const assembly = root.synth();
  return assembly.getStackArtifact(stack.artifactId).template;
}

function assertResourcePart(part: ResourcePart) {
  switch (part) {
    case ResourcePart.PROPERTIES:
      return assert.ResourcePart.Properties;
    case ResourcePart.COMPLETE:
      return assert.ResourcePart.CompleteDefinition;
    default:
      throw new Error(`unexpected: unrecognized resource part type [${part}]`);
  }
}