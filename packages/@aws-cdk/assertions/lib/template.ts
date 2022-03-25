import * as path from 'path';
import { Stack, Stage } from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { Match } from './match';
import { Matcher } from './matcher';
import { findConditions, hasCondition } from './private/conditions';
import { checkTemplateForCyclicDependencies } from './private/cyclic';
import { findMappings, hasMapping } from './private/mappings';
import { findOutputs, hasOutput } from './private/outputs';
import { findParameters, hasParameter } from './private/parameters';
import { countResources, findResources, hasResource, hasResourceProperties } from './private/resources';
import { Template as TemplateType } from './private/template';

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

  private readonly template: TemplateType;

  private constructor(template: { [key: string]: any }) {
    this.template = template as TemplateType;
    checkTemplateForCyclicDependencies(this.template);
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
    const counted = countResources(this.template, type);
    if (counted !== count) {
      throw new Error(`Expected ${count} resources of type ${type} but found ${counted}`);
    }
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
    const matchError = hasResourceProperties(this.template, type, props);
    if (matchError) {
      throw new Error(matchError);
    }
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
    const matchError = hasResource(this.template, type, props);
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
  public findResources(type: string, props: any = {}): { [key: string]: { [key: string]: any } } {
    return findResources(this.template, type, props);
  }

  /**
   * Assert that a Parameter with the given properties exists in the CloudFormation template.
   * By default, performs partial matching on the parameter, via the `Match.objectLike()`.
   * To configure different behavior, use other matchers in the `Match` class.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props the parameter as should be expected in the template.
   */
  public hasParameter(logicalId: string, props: any): void {
    const matchError = hasParameter(this.template, logicalId, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching Parameters that match the given properties in the CloudFormation template.
   * @param logicalId the name of the parameter. Provide `'*'` to match all parameters in the template.
   * @param props by default, matches all Parameters in the template.
   * When a literal object is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findParameters(logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
    return findParameters(this.template, logicalId, props);
  }

  /**
   * Assert that an Output with the given properties exists in the CloudFormation template.
   * By default, performs partial matching on the resource, via the `Match.objectLike()`.
   * To configure different behavour, use other matchers in the `Match` class.
   * @param logicalId the name of the output. Provide `'*'` to match all outputs in the template.
   * @param props the output as should be expected in the template.
   */
  public hasOutput(logicalId: string, props: any): void {
    const matchError = hasOutput(this.template, logicalId, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching Outputs that match the given properties in the CloudFormation template.
   * @param logicalId the name of the output. Provide `'*'` to match all outputs in the template.
   * @param props by default, matches all Outputs in the template.
   * When a literal object is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findOutputs(logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
    return findOutputs(this.template, logicalId, props);
  }

  /**
   * Assert that a Mapping with the given properties exists in the CloudFormation template.
   * By default, performs partial matching on the resource, via the `Match.objectLike()`.
   * To configure different behavour, use other matchers in the `Match` class.
   * @param logicalId the name of the mapping. Provide `'*'` to match all mappings in the template.
   * @param props the output as should be expected in the template.
   */
  public hasMapping(logicalId: string, props: any): void {
    const matchError = hasMapping(this.template, logicalId, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching Mappings that match the given properties in the CloudFormation template.
   * @param logicalId the name of the mapping. Provide `'*'` to match all mappings in the template.
   * @param props by default, matches all Mappings in the template.
   * When a literal object is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findMappings(logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
    return findMappings(this.template, logicalId, props);
  }

  /**
   * Assert that a Condition with the given properties exists in the CloudFormation template.
   * By default, performs partial matching on the resource, via the `Match.objectLike()`.
   * To configure different behavour, use other matchers in the `Match` class.
   * @param logicalId the name of the mapping. Provide `'*'` to match all conditions in the template.
   * @param props the output as should be expected in the template.
   */
  public hasCondition(logicalId: string, props: any): void {
    const matchError = hasCondition(this.template, logicalId, props);
    if (matchError) {
      throw new Error(matchError);
    }
  }

  /**
   * Get the set of matching Conditions that match the given properties in the CloudFormation template.
   * @param logicalId the name of the condition. Provide `'*'` to match all conditions in the template.
   * @param props by default, matches all Conditions in the template.
   * When a literal object is provided, performs a partial match via `Match.objectLike()`.
   * Use the `Match` APIs to configure a different behaviour.
   */
  public findConditions(logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
    return findConditions(this.template, logicalId, props);
  }

  /**
   * Assert that the CloudFormation template matches the given value
   * @param expected the expected CloudFormation template as key-value pairs.
   */
  public templateMatches(expected: any): void {
    const matcher = Matcher.isMatcher(expected) ? expected : Match.objectLike(expected);
    const result = matcher.test(this.template);

    if (result.hasFailed()) {
      throw new Error([
        'Template did not match as expected. The following mismatches were found:',
        ...result.toHumanStrings().map(s => `\t${s}`),
      ].join('\n'));
    }
  }
}

function toTemplate(stack: Stack): any {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage or an App');
  }

  const assembly = root.synth();
  if (stack.nestedStackParent) {
    // if this is a nested stack (it has a parent), then just read the template as a string
    return JSON.parse(fs.readFileSync(path.join(assembly.directory, stack.templateFile)).toString('utf-8'));
  }
  return assembly.getStackArtifact(stack.artifactId).template;
}