import { Stack, Stage } from '@aws-cdk/core';
import * as fs from 'fs-extra';
import * as assert from './assert-internal';

/**
 * A number of options to customize the `StackAssertions.assertResource()` API.
 */
export interface AssertResourceOptionsBeta1 {
  /**
   * The part of the CloudFormation Resource that the assertion should match against.
   * @default ResourcePart.PROPERTIES
   */
  readonly part?: ResourcePartBeta1;
}

/**
 * See `AssertResourceOptions.part`
 */
export enum ResourcePartBeta1 {
  /** The entire resource definition in the template, excluding the 'Type' */
  COMPLETE_BETA1,
  /** The 'Properties' section of the resource definition in the template */
  PROPERTIES_BETA1,
}

/**
 * Suite of assertions that can be run on a CDK stack.
 * Typically used, as part of unit tests, to validate that the rendered
 * CloudFormation template has expected resources and properties.
 */
export class StackAssertionsBeta1 {

  /**
   * Base your assertions on the CloudFormation template synthesized by a CDK `Stack`.
   */
  public static fromStackBeta1(stack: Stack) {
    return new StackAssertionsBeta1(toTemplate(stack));
  }

  /**
   * Base your assertions from an existing CloudFormation template file.
   */
  public static fromTemplateFileBeta1(file: string) {
    const contents = fs.readFileSync(file);
    return new StackAssertionsBeta1(contents);
  }

  private readonly inspector: assert.StackInspector;

  private constructor(template: any) {
    this.inspector = new assert.StackInspector(template);
  }

  /**
   * Assert that the given number of resources of the given type exist in the
   * template.
   * @param type the resource type; ex: `AWS::S3::Bucket`
   * @param count number of expected instances
   */
  public assertResourceCountBeta1(type: string, count: number): void {
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
  public assertResourceBeta1(type: string, props: any, options?: AssertResourceOptionsBeta1): void {
    const part = assertResourcePart(options?.part ?? ResourcePartBeta1.PROPERTIES_BETA1);
    const assertion = assert.haveResource(type, props, part);
    assertion.assertOrThrow(this.inspector);
  }

  public assertMatchTemplateBeta1(expected: {[key: string]: any}) {
    const assertion = assert.matchTemplate(expected);
    assertion.assertOrThrow(this.inspector);
  }
}

function toTemplate(stack: Stack): any {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage or an App');
  }
  const assembly = root.synth();
  return assembly.getStackArtifact(stack.artifactId).template;
}

function assertResourcePart(part: ResourcePartBeta1) {
  switch (part) {
    case ResourcePartBeta1.PROPERTIES_BETA1:
      return assert.ResourcePart.Properties;
    case ResourcePartBeta1.COMPLETE_BETA1:
      return assert.ResourcePart.CompleteDefinition;
    default:
      throw new Error(`unexpected: unrecognized resource part type [${part}]`);
  }
}