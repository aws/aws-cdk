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
   * resource, and it won't be accessible from getNestedStack().
   *
   * If you include a stack here with an ID that isn't in the template,
   * template creation will fail and an error will be thrown.
   *
   * If you include an ID here that exists in the template but isn't in the template,
   * template creation will fail and an error will be thrown.
   */
  readonly nestedStacks?: { [stackName: string]: CfnIncludeProps };
}

/**
 * Returned by getNestedStack(). Contains both the NestedStack and
 * CfnInclude representations of the template.
 */
export interface IncludedNestedStack {
  /**
   * The NestedStack object that represents your template.
   */
  readonly stack: core.NestedStack;
  /**
   * The CfnInclude that respresents your template.
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
  private readonly resources: { [logicalId: string]: core.CfnResource } = {};
  private readonly parameters: { [logicalId: string]: core.CfnParameter } = {};
  private readonly outputs: { [logicalId: string]: core.CfnOutput } = {};
  private readonly nestedStackTemplates: { [logicalId: string]: CfnInclude } = {};
  private readonly nestedStacks: { [logicalId: string]: core.NestedStack } = {};
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
    for (const conditionName of Object.keys(this.template.Conditions || {})) {
      this.createCondition(conditionName);
    }

    // instantiate all nested stacks specified before the resources,
    // so duplicate resources aren't made.
    for (const nestedStackId of Object.keys(props.nestedStacks || {})) {
      this.createNestedStack(nestedStackId, props);
    }

    // instantiate all resources as CDK L1 objects
    for (const logicalId of Object.keys(this.template.Resources || {})) {
      this.getOrCreateResource(logicalId);
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
   * For a nested stack to be returned by this method, it must be specified in the CfnIncludeProps.
   * @param logicalId the ID of the stack to retrieve, as it appears in its template.
   */
  public getNestedStack(logicalId: string): IncludedNestedStack {
    if (!this.nestedStacks[logicalId] || !this.nestedStackTemplates[logicalId]) {
      if (!this.template.Resources[logicalId]) {
        throw new Error(`Nested Stack with logical ID '${logicalId}' was not found in the template`);
      } else if (this.template.Resources[logicalId].Type !== 'AWS::CloudFormation::Stack') {
        throw new Error(`Resource with logical ID '${logicalId}' is not a CloudFormation Stack`);
      }

      throw new Error(`Nested Stack with logical ID '${logicalId}' was not specified in the CfnInclude props`);
    }
    const ret: IncludedNestedStack = {
      stack: this.nestedStacks[logicalId],
      includedTemplate: this.nestedStackTemplates[logicalId],
    };

    return ret;
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

        throw new Error(`Output with name '${logicalId}' refers to a Condition with name\
 '${outputAttributes.Condition}' which was not found in this template`);
      })(),
    });

    cfnOutput.overrideLogicalId(logicalId);
    this.outputs[logicalId] = cfnOutput;
  }

  private createCondition(conditionName: string): void {
    // ToDo condition expressions can refer to other conditions -
    // will be important when implementing preserveLogicalIds=false
    const expression = new cfn_parse.CfnParser({
      finder: {
        findResource() { throw new Error('Using GetAtt in Condition definitions is not allowed'); },
        findRefTarget() { throw new Error('Using Ref expressions in Condition definitions is not allowed'); },
        // ToDo handle one Condition referencing another using the { Condition: "ConditionName" } syntax
        findCondition() { return undefined; },
      },
    }).parseValue(this.template.Conditions[conditionName]);
    const cfnCondition = new core.CfnCondition(this, conditionName, {
      expression,
    });
    // ToDo handle renaming of the logical IDs of the conditions
    cfnCondition.overrideLogicalId(conditionName);
    this.conditions[conditionName] = cfnCondition;
  }

  private createNestedStack(nestedStackId: string, props?: CfnIncludeProps): void {
    if (nestedStackId in this.template.Resources) {
      if (this.template.Resources[nestedStackId].Type === 'AWS::CloudFormation::Stack' && props?.nestedStacks) {
        const nestedStackScope = new core.NestedStack(this, 'Nested' + nestedStackId, {
          parameters: this.template.Resources[nestedStackId].Properties.Parameters,
          notificationArns: this.template.Resources[nestedStackId].Properties.NotificationArns,
          timeout: this.template.Resources[nestedStackId].Properties.Timeout,
        });

        if (nestedStackScope.nestedStackResource) {
          if (this.preserveLogicalIds) {
            // override the logical ID to match the original template
            nestedStackScope.nestedStackResource.overrideLogicalId(nestedStackId);
          }

          // add this stack to our template's resources, so it doesn't get added again when creating resources
          this.resources[nestedStackId] = nestedStackScope.nestedStackResource;
        }

        this.nestedStacks[nestedStackId] = nestedStackScope;

        this.nestedStackTemplates[nestedStackId] = new CfnInclude(nestedStackScope, nestedStackId, {
          templateFile: props.nestedStacks[nestedStackId].templateFile,
          nestedStacks: props?.nestedStacks[nestedStackId].nestedStacks,
        });
      } else {
        throw new Error(`Nested Stack with logical ID '${nestedStackId}' is not an AWS::CloudFormation::Stack resource`);
      }
    } else {
      throw new Error(`Nested Stack with logical ID '${nestedStackId}' was not found in the template`);
    }
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
    const l1Instance = jsClassFromModule.fromCloudFormation(this, logicalId, resourceAttributes, options);

    if (this.preserveLogicalIds) {
      // override the logical ID to match the original template
      l1Instance.overrideLogicalId(logicalId);
    }

    this.resources[logicalId] = l1Instance;
    return l1Instance;
  }
}
