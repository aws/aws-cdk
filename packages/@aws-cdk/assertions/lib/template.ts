import { Stack, Stage } from '@aws-cdk/core';
import { Match } from './match';
import { Matcher } from './matcher';
import { findResources, hasResource } from './private/resource';
import * as assert from './vendored/assert';

/**
 * Suite of assertions that can be run on a CDK stack.
 * Typically used, as part of unit tests, to validate that the rendered
 * CloudFormation template has expected resources and properties.
 */
export class Template {

  /**
   * Base your assertions on the CloudFormation template synthesized by a CDK `Stack`.
   * @param stack the CDK Stack to run assertions on
   */
  public static fromStack(stack: Stack): Template {
    return new Template(toTemplate(stack));
  }

  /**
   * Base your assertions from an existing CloudFormation template formatted as an in-memory
   * JSON object.
   * @param template the CloudFormation template formatted as a nested set of records
   */
  public static fromJSON(template: { [key: string] : any }): Template {
    return new Template(template);
  }

  /**
   * Base your assertions from an existing CloudFormation template formatted as a
   * JSON string.
   * @param template the CloudFormation template in
   */
  public static fromString(template: string): Template {
    return new Template(JSON.parse(template));
  }

  private readonly template: { [key: string]: any };
  private readonly inspector: assert.StackInspector;

  private constructor(template: { [key: string]: any }) {
    this.template = template;
    this.inspector = new assert.StackInspector(template);
  }

  /**
   * The CloudFormation template deserialized into an object.
   */
  public toJSON(): { [key: string]: any } {
    return this.template;
  }

  /**
   * Assert that the given number of resources of the given type exist in the
   * template.
   * @param type the resource type; ex: `AWS::S3::Bucket`
   * @param count number of expected instances
   */
  public resourceCountIs(type: string, count: number): void {
    const assertion = assert.countResources(type, count);
    assertion.assertOrThrow(this.inspector);
  }

  /**
   * Assert that a resource of the given type and properties exists in the
   * CloudFormation template.
   * By default, performs partial matching on the `Properties` key of the resource, via the
   * `Match.objectLike()`. To configure different behavour, use other matchers in the `Match` class.
   * @param type the resource type; ex: `AWS::S3::Bucket`
   * @param props the 'Properties' section of the resource as should be expected in the template.
   */
  public hasResourceProperties(type: string, props: any): void {
    this.hasResource(type, Match.objectLike({
      Properties: Matcher.isMatcher(props) ? props : Match.objectLike(props),
    }));
  }

  /**
   * Assert that a resource of the given type and given definition exists in the
   * CloudFormation template.
   * By default, performs partial matching on the resource, via the `Match.objectLike()`.
   * To configure different behavour, use other matchers in the `Match` class.
   * @param type the resource type; ex: `AWS::S3::Bucket`
   * @param props the entire defintion of the resource as should be expected in the template.
   */
  public hasResource(type: string, props: any): void {
    const matchError = hasResource(this.inspector, type, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching resources of a given type and properties in the CloudFormation template.
   * @param type the type to match in the CloudFormation template
   * @param props by default, matches all resources with the given type.
   * When a literal is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findResources(type: string, props: any = {}): { [key: string]: any }[] {
    return findResources(this.inspector, type, props);
  }

  /**
   * Assert that the CloudFormation template matches the given value
   * @param expected the expected CloudFormation template as key-value pairs.
   */
  public templateMatches(expected: {[key: string]: any}): void {
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