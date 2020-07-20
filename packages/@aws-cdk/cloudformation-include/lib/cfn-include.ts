import * as core from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/cfn-parse';
import * as cfn_type_to_l1_mapping from './cfn-type-to-l1-mapping';
import * as futils from './file-utils';

/**
 * Construction properties of {@link CfnInclude}.
 */
export interface CfnIncludeProps {
  /**
   * Path to the template file.
   *
   * Both JSON and YAML template formats are supported.
   */
  readonly templateFile: string;

  /**
   * Specifies the template files that define nested stacks that should be included.
   *
   * If your template specifies a stack that isn't included here, it won't be created as a NestedStack
   * resource, and it won't be accessible from {@link CfnInclude.getNestedStack}.
   *
   * If you include a stack here with an ID that isn't in the template,
   * or is in the template but is not a nested stack,
   * template creation will fail and an error will be thrown.
   */
  readonly nestedStacks?: { [stackName: string]: CfnIncludeProps };
}

/**
 * The type returned from {@link CfnInclude.getNestedStack}.
 * Contains both the NestedStack object and
 * CfnInclude representations of the child stack.
 */
export interface IncludedNestedStack {
  /**
   * The NestedStack object which respresents the scope of the template.
   */
  readonly stack: core.NestedStack;

  /**
   * The CfnInclude that respresents the template, which can
   * be used to access Resources and other template elements.
   */
  readonly includedTemplate: CfnInclude;
}

/**
 * Construct to import an existing CloudFormation template file into a CDK application.
 * All resources defined in the template file can be retrieved by calling the {@link getResource} method.
 * Any modifications made on the returned resource objects will be reflected in the resulting CDK template.
 */
export class CfnInclude extends core.CfnElement {
  private readonly conditions: { [conditionName: string]: core.CfnCondition } = {};
  private readonly conditionsScope: core.Construct;
  private readonly resources: { [logicalId: string]: core.CfnResource } = {};
  private readonly parameters: { [logicalId: string]: core.CfnParameter } = {};
  private readonly outputs: { [logicalId: string]: core.CfnOutput } = {};
  private readonly nestedStacks: { [logicalId: string]: IncludedNestedStack } = {};
  private readonly nestedStacksToInclude: { [name: string]: CfnIncludeProps };
  private readonly template: any;
  private readonly preserveLogicalIds: boolean;

  constructor(scope: core.Construct, id: string, props: CfnIncludeProps) {
    super(scope, id);

    // read the template into a JS object
    this.template = futils.readYamlSync(props.templateFile);

    // ToDo implement preserveLogicalIds=false
    this.preserveLogicalIds = true;

    // instantiate all parameters
    for (const logicalId of Object.keys(this.template.Parameters || {})) {
      this.createParameter(logicalId);
    }

    // instantiate the conditions
    this.conditionsScope = new core.Construct(this, '$Conditions');
    for (const conditionName of Object.keys(this.template.Conditions || {})) {
      this.getOrCreateCondition(conditionName);
    }

    this.nestedStacksToInclude = props.nestedStacks || {};

    // instantiate all resources as CDK L1 objects
    for (const logicalId of Object.keys(this.template.Resources || {})) {
      this.getOrCreateResource(logicalId);
    }

    // verify that all nestedStacks have been instantiated
    for (const nestedStackId of Object.keys(props.nestedStacks || {})) {
      if (!(nestedStackId in this.resources)) {
        throw new Error(`Nested Stack with logical ID '${nestedStackId}' was not found in the template`);
      }
    }

    const outputScope = new core.Construct(this, '$Ouputs');

    for (const logicalId of Object.keys(this.template.Outputs || {})) {
      this.createOutput(logicalId, outputScope);
    }
  }

  /**
   * Returns the low-level CfnResource from the template with the given logical ID.
   * Any modifications performed on that resource will be reflected in the resulting CDK template.
   *
   * The returned object will be of the proper underlying class;
   * you can always cast it to the correct type in your code:
   *
   *     // assume the template contains an AWS::S3::Bucket with logical ID 'Bucket'
   *     const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;
   *     // cfnBucket is of type s3.CfnBucket
   *
   * If the template does not contain a resource with the given logical ID,
   * an exception will be thrown.
   *
   * @param logicalId the logical ID of the resource in the CloudFormation template file
   */
  public getResource(logicalId: string): core.CfnResource {
    const ret = this.resources[logicalId];
    if (!ret) {
      throw new Error(`Resource with logical ID '${logicalId}' was not found in the template`);
    }
    return ret;
  }

  /**
   * Returns the CfnCondition object from the 'Conditions'
   * section of the CloudFormation template with the given name.
   * Any modifications performed on that object will be reflected in the resulting CDK template.
   *
   * If a Condition with the given name is not present in the template,
   * throws an exception.
   *
   * @param conditionName the name of the Condition in the CloudFormation template file
   */
  public getCondition(conditionName: string): core.CfnCondition {
    const ret = this.conditions[conditionName];
    if (!ret) {
      throw new Error(`Condition with name '${conditionName}' was not found in the template`);
    }
    return ret;
  }

  /**
   * Returns the CfnParameter object from the 'Parameters'
   * section of the included template
   * Any modifications performed on that object will be reflected in the resulting CDK template.
   *
   * If a Parameter with the given name is not present in the template,
   * throws an exception.
   *
   * @param parameterName the name of the parameter to retrieve
   */
  public getParameter(parameterName: string): core.CfnParameter {
    const ret = this.parameters[parameterName];
    if (!ret) {
      throw new Error(`Parameter with name '${parameterName}' was not found in the template`);
    }
    return ret;
  }

  /**
   * Returns the CfnOutput object from the 'Outputs'
   * section of the included template
   * Any modifications performed on that object will be reflected in the resulting CDK template.
   *
   * If an Output with the given name is not present in the template,
   * throws an exception.
   *
   * @param logicalId the name of the output to retrieve
   */
  public getOutput(logicalId: string): core.CfnOutput {
    const ret = this.outputs[logicalId];
    if (!ret) {
      throw new Error(`Output with logical ID '${logicalId}' was not found in the template`);
    }
    return ret;
  }

  /**
   * Returns the NestedStack with name logicalId.
   * For a nested stack to be returned by this method, it must be specified in the {@link CfnIncludeProps.nestedStacks}
   * @param logicalId the ID of the stack to retrieve, as it appears in the template.
   */
  public getNestedStack(logicalId: string): IncludedNestedStack {
    if (!this.nestedStacks[logicalId]) {
      if (!this.template.Resources[logicalId]) {
        throw new Error(`Nested Stack with logical ID '${logicalId}' was not found in the template`);
      } else if (this.template.Resources[logicalId].Type !== 'AWS::CloudFormation::Stack') {
        throw new Error(`Resource with logical ID '${logicalId}' is not a CloudFormation Stack`);
      } else {
        throw new Error(`Nested Stack '${logicalId}' was not included in the nestedStacks property when including the parent template`);
      }
    }
    return this.nestedStacks[logicalId];
  }

  /** @internal */
  public _toCloudFormation(): object {
    const ret: { [section: string]: any } = {};

    for (const section of Object.keys(this.template)) {
      // render all sections of the template unchanged,
      // except Conditions, Resources, Parameters, and Outputs which will be taken care of by the created L1s
      if (section !== 'Conditions' && section !== 'Resources' && section !== 'Parameters' && section !== 'Outputs') {
        ret[section] = this.template[section];
      }
    }

    return ret;
  }

  private createParameter(logicalId: string): void {
    const expression = new cfn_parse.CfnParser({
      finder: {
        findResource() { throw new Error('Using GetAtt expressions in Parameter definitions is not allowed'); },
        findRefTarget() { throw new Error('Using Ref expressions in Parameter definitions is not allowed'); },
        findCondition() { throw new Error('Referring to Conditions in Parameter definitions is not allowed'); },
      },
    }).parseValue(this.template.Parameters[logicalId]);
    const cfnParameter = new core.CfnParameter(this, logicalId, {
      type: expression.Type,
      default: expression.Default,
      allowedPattern: expression.AllowedPattern,
      constraintDescription: expression.ConstraintDescription,
      description: expression.Description,
      maxLength: expression.MaxLength,
      maxValue: expression.MaxValue,
      minLength: expression.MinLength,
      minValue: expression.MinValue,
      noEcho: expression.NoEcho,
    });

    cfnParameter.overrideLogicalId(logicalId);
    this.parameters[logicalId] = cfnParameter;
  }

  private createOutput(logicalId: string, scope: core.Construct): void {
    const self = this;
    const outputAttributes = new cfn_parse.CfnParser({
      finder: {
        findResource(lId): core.CfnResource | undefined {
          return self.resources[lId];
        },
        findRefTarget(elementName: string): core.CfnElement | undefined {
          return self.resources[elementName] ?? self.parameters[elementName];
        },
        findCondition(): undefined {
          return undefined;
        },
      },
    }).parseValue(this.template.Outputs[logicalId]);
    const cfnOutput = new core.CfnOutput(scope, logicalId, {
      value: outputAttributes.Value,
      description: outputAttributes.Description,
      exportName: outputAttributes.Export ? outputAttributes.Export.Name : undefined,
      condition: (() => {
        if (!outputAttributes.Condition) {
          return undefined;
        } else if (this.conditions[outputAttributes.Condition]) {
          return self.getCondition(outputAttributes.Condition);
        }

        throw new Error(`Output with name '${logicalId}' refers to a Condition with name ` +
          `'${outputAttributes.Condition}' which was not found in this template`);
      })(),
    });

    cfnOutput.overrideLogicalId(logicalId);
    this.outputs[logicalId] = cfnOutput;
  }

  private getOrCreateCondition(conditionName: string): core.CfnCondition {
    if (conditionName in this.conditions) {
      return this.conditions[conditionName];
    }

    const self = this;
    const cfnParser = new cfn_parse.CfnParser({
      finder: {
        findResource() { throw new Error('Using GetAtt in Condition definitions is not allowed'); },
        findRefTarget(elementName: string): core.CfnElement | undefined {
          // only Parameters can be referenced in the 'Conditions' section
          return self.parameters[elementName];
        },
        findCondition(cName: string): core.CfnCondition | undefined {
          return cName in (self.template.Conditions || {})
            ? self.getOrCreateCondition(cName)
            : undefined;
        },
      },
      context: cfn_parse.CfnParsingContext.CONDITIONS,
    });
    const cfnCondition = new core.CfnCondition(this.conditionsScope, conditionName, {
      expression: cfnParser.parseValue(this.template.Conditions[conditionName]),
    });

    // ToDo handle renaming of the logical IDs of the conditions
    cfnCondition.overrideLogicalId(conditionName);
    this.conditions[conditionName] = cfnCondition;
    return cfnCondition;
  }

  private getOrCreateResource(logicalId: string): core.CfnResource {
    const ret = this.resources[logicalId];
    if (ret) {
      return ret;
    }

    const resourceAttributes: any = this.template.Resources[logicalId];
    const l1ClassFqn = cfn_type_to_l1_mapping.lookup(resourceAttributes.Type);
    if (!l1ClassFqn) {
      // currently, we only handle types we know the L1 for -
      // in the future, we might construct an instance of CfnResource instead
      throw new Error(`Unrecognized CloudFormation resource type: '${resourceAttributes.Type}'`);
    }
    // fail early for resource attributes we don't support yet
    const knownAttributes = [
      'Type', 'Properties', 'Condition', 'DependsOn', 'Metadata',
      'CreationPolicy', 'UpdatePolicy', 'DeletionPolicy', 'UpdateReplacePolicy',
    ];
    for (const attribute of Object.keys(resourceAttributes)) {
      if (!knownAttributes.includes(attribute)) {
        throw new Error(`The ${attribute} resource attribute is not supported by cloudformation-include yet. ` +
          'Either remove it from the template, or use the CdkInclude class from the core package instead.');
      }
    }

    const [moduleName, ...className] = l1ClassFqn.split('.');
    const module = require(moduleName);  // eslint-disable-line @typescript-eslint/no-require-imports
    const jsClassFromModule = module[className.join('.')];
    const self = this;
    const finder: core.ICfnFinder = {
      findCondition(conditionName: string): core.CfnCondition | undefined {
        return self.conditions[conditionName];
      },

      findResource(lId: string): core.CfnResource | undefined {
        if (!(lId in (self.template.Resources || {}))) {
          return undefined;
        }
        return self.getOrCreateResource(lId);
      },

      findRefTarget(elementName: string): core.CfnElement | undefined {
        if (elementName in self.parameters) {
          return self.parameters[elementName];
        }

        return this.findResource(elementName);
      },
    };
    const options: core.FromCloudFormationOptions = {
      finder,
    };

    const l1Instance = this.nestedStacksToInclude[logicalId]
      ? this.createNestedStack(logicalId, finder)
      : jsClassFromModule.fromCloudFormation(this, logicalId, resourceAttributes, options);

    if (this.preserveLogicalIds) {
      // override the logical ID to match the original template
      l1Instance.overrideLogicalId(logicalId);
    }

    this.resources[logicalId] = l1Instance;
    return l1Instance;
  }

  private createNestedStack(nestedStackId: string, finder: core.ICfnFinder): core.CfnResource {
    const templateResources = this.template.Resources || {};
    const nestedStackAttributes = templateResources[nestedStackId] || {};

    if (nestedStackAttributes.Type !== 'AWS::CloudFormation::Stack') {
      throw new Error(`Nested Stack with logical ID '${nestedStackId}' is not an AWS::CloudFormation::Stack resource`);
    }
    if (nestedStackAttributes.CreationPolicy) {
      throw new Error('CreationPolicy is not supported by the AWS::CloudFormation::Stack resource');
    }
    if (nestedStackAttributes.UpdatePolicy) {
      throw new Error('UpdatePolicy is not supported by the AWS::CloudFormation::Stack resource');
    }

    const cfnParser = new cfn_parse.CfnParser({
      finder,
    });
    const nestedStackProps = cfnParser.parseValue(nestedStackAttributes.Properties);
    const nestedStack = new core.NestedStack(this, nestedStackId, {
      parameters: nestedStackProps.Parameters,
      notificationArns: nestedStackProps.NotificationArns,
      timeout: nestedStackProps.Timeout,
    });

    // we know this is never undefined for nested stacks
    const nestedStackResource: core.CfnResource = nestedStack.nestedStackResource!;
    // handle resource attributes
    const cfnOptions = nestedStackResource.cfnOptions;
    cfnOptions.metadata = cfnParser.parseValue(nestedStackAttributes.Metadata);
    cfnOptions.deletionPolicy = cfnParser.parseDeletionPolicy(nestedStackAttributes.DeletionPolicy);
    cfnOptions.updateReplacePolicy = cfnParser.parseDeletionPolicy(nestedStackAttributes.UpdateReplacePolicy);
    // handle DependsOn
    nestedStackAttributes.DependsOn = nestedStackAttributes.DependsOn ?? [];
    const dependencies: string[] = Array.isArray(nestedStackAttributes.DependsOn) ?
      nestedStackAttributes.DependsOn : [nestedStackAttributes.DependsOn];
    for (const dep of dependencies) {
      const depResource = finder.findResource(dep);
      if (!depResource) {
        throw new Error(`nested stack '${nestedStackId}' depends on '${dep}' that doesn't exist`);
      }
      nestedStackResource.node.addDependency(depResource);
    }
    // handle Condition
    if (nestedStackAttributes.Condition) {
      const condition = finder.findCondition(nestedStackAttributes.Condition);
      if (!condition) {
        throw new Error(`nested stack '${nestedStackId}' uses Condition '${nestedStackAttributes.Condition}' that doesn't exist`);
      }
      cfnOptions.condition = condition;
    }

    const propStack = this.nestedStacksToInclude[nestedStackId];
    const template = new CfnInclude(nestedStack, nestedStackId, {
      templateFile: propStack.templateFile,
      nestedStacks: propStack.nestedStacks,
    });
    const includedStack: IncludedNestedStack = { stack: nestedStack, includedTemplate: template };
    this.nestedStacks[nestedStackId] = includedStack;

    return nestedStackResource;
  }
}
