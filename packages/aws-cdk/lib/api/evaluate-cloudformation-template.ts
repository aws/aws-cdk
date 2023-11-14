import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ISDK } from './aws-auth';
import { NestedStackNames } from './nested-stack-helpers';

export interface ListStackResources {
  listStackResources(): Promise<AWS.CloudFormation.StackResourceSummary[]>;
}

export class LazyListStackResources implements ListStackResources {
  private stackResources: Promise<AWS.CloudFormation.StackResourceSummary[]> | undefined;

  constructor(private readonly sdk: ISDK, private readonly stackName: string) {
  }

  public async listStackResources(): Promise<AWS.CloudFormation.StackResourceSummary[]> {
    if (this.stackResources === undefined) {
      this.stackResources = this.getStackResources(undefined);
    }
    return this.stackResources;
  }

  private async getStackResources(nextToken: string | undefined): Promise<AWS.CloudFormation.StackResourceSummary[]> {
    const ret = new Array<AWS.CloudFormation.StackResourceSummary>();
    return this.sdk.cloudFormation().listStackResources({
      StackName: this.stackName,
      NextToken: nextToken,
    }).promise().then(async stackResourcesResponse => {
      ret.push(...(stackResourcesResponse.StackResourceSummaries ?? []));
      if (stackResourcesResponse.NextToken) {
        ret.push(...await this.getStackResources(stackResourcesResponse.NextToken));
      }
      return ret;
    });
  }
}

export interface LookupExport {
  lookupExport(name: string): Promise<AWS.CloudFormation.Export | undefined>;
}

export class LookupExportError extends Error { }

export class LazyLookupExport implements LookupExport {
  private cachedExports: { [name: string]: AWS.CloudFormation.Export } = {}

  constructor(private readonly sdk: ISDK) { }

  async lookupExport(name: string): Promise<AWS.CloudFormation.Export | undefined> {
    if (this.cachedExports[name]) {
      return this.cachedExports[name];
    }

    for await (const cfnExport of this.listExports()) {
      if (!cfnExport.Name) {
        continue; // ignore any result that omits a name
      }
      this.cachedExports[cfnExport.Name] = cfnExport;

      if (cfnExport.Name === name) {
        return cfnExport;
      }

    }

    return undefined; // export not found
  }

  private async * listExports() {
    let nextToken: string | undefined = undefined;
    while (true) {
      const response: PromiseResult<AWS.CloudFormation.ListExportsOutput, AWS.AWSError> = await this.sdk.cloudFormation().listExports({
        NextToken: nextToken,
      }).promise();

      for (const cfnExport of response.Exports ?? []) {
        yield cfnExport;
      }

      if (!response.NextToken) {
        return;
      }
      nextToken = response.NextToken;
    }
  }
}

export class CfnEvaluationException extends Error { }

export interface ResourceDefinition {
  readonly LogicalId: string;
  readonly Type: string;
  readonly Properties: { [p: string]: any };
}

export interface EvaluateCloudFormationTemplateProps {
  readonly stackName: string;
  readonly template: Template;
  readonly parameters: { [parameterName: string]: string };
  readonly account: string;
  readonly region: string;
  readonly partition: string;
  readonly urlSuffix: (region: string) => string;
  readonly sdk: ISDK;
  readonly nestedStackNames?: { [nestedStackLogicalId: string]: NestedStackNames };
}

export class EvaluateCloudFormationTemplate {
  private readonly stackName: string;
  private readonly template: Template;
  private readonly context: { [k: string]: any };
  private readonly account: string;
  private readonly region: string;
  private readonly partition: string;
  private readonly urlSuffix: (region: string) => string;
  private readonly sdk: ISDK;
  private readonly nestedStackNames: { [nestedStackLogicalId: string]: NestedStackNames };
  private readonly stackResources: ListStackResources;
  private readonly lookupExport: LookupExport;

  private cachedUrlSuffix: string | undefined;

  constructor(props: EvaluateCloudFormationTemplateProps) {
    this.stackName = props.stackName;
    this.template = props.template;
    this.context = {
      'AWS::AccountId': props.account,
      'AWS::Region': props.region,
      'AWS::Partition': props.partition,
      ...props.parameters,
    };
    this.account = props.account;
    this.region = props.region;
    this.partition = props.partition;
    this.urlSuffix = props.urlSuffix;
    this.sdk = props.sdk;

    // We need names of nested stack so we can evaluate cross stack references
    this.nestedStackNames = props.nestedStackNames ?? {};

    // The current resources of the Stack.
    // We need them to figure out the physical name of a resource in case it wasn't specified by the user.
    // We fetch it lazily, to save a service call, in case all hotswapped resources have their physical names set.
    this.stackResources = new LazyListStackResources(this.sdk, this.stackName);

    // CloudFormation Exports lookup to be able to resolve Fn::ImportValue intrinsics in template
    this.lookupExport = new LazyLookupExport(this.sdk);
  }

  // clones current EvaluateCloudFormationTemplate object, but updates the stack name
  public async createNestedEvaluateCloudFormationTemplate(
    stackName: string,
    nestedTemplate: Template,
    nestedStackParameters: { [parameterName: string]: any },
  ) {
    const evaluatedParams = await this.evaluateCfnExpression(nestedStackParameters);
    return new EvaluateCloudFormationTemplate({
      stackName,
      template: nestedTemplate,
      parameters: evaluatedParams,
      account: this.account,
      region: this.region,
      partition: this.partition,
      urlSuffix: this.urlSuffix,
      sdk: this.sdk,
      nestedStackNames: this.nestedStackNames,
    });
  }

  public async establishResourcePhysicalName(logicalId: string, physicalNameInCfnTemplate: any): Promise<string | undefined> {
    if (physicalNameInCfnTemplate != null) {
      try {
        return await this.evaluateCfnExpression(physicalNameInCfnTemplate);
      } catch (e) {
        // If we can't evaluate the resource's name CloudFormation expression,
        // just look it up in the currently deployed Stack
        if (!(e instanceof CfnEvaluationException)) {
          throw e;
        }
      }
    }
    return this.findPhysicalNameFor(logicalId);
  }

  public async findPhysicalNameFor(logicalId: string): Promise<string | undefined> {
    const stackResources = await this.stackResources.listStackResources();
    return stackResources.find(sr => sr.LogicalResourceId === logicalId)?.PhysicalResourceId;
  }

  public async findLogicalIdForPhysicalName(physicalName: string): Promise<string | undefined> {
    const stackResources = await this.stackResources.listStackResources();
    return stackResources.find(sr => sr.PhysicalResourceId === physicalName)?.LogicalResourceId;
  }

  public findReferencesTo(logicalId: string): Array<ResourceDefinition> {
    const ret = new Array<ResourceDefinition>();
    for (const [resourceLogicalId, resourceDef] of Object.entries(this.template?.Resources ?? {})) {
      if (logicalId !== resourceLogicalId && this.references(logicalId, resourceDef)) {
        ret.push({
          ...(resourceDef as any),
          LogicalId: resourceLogicalId,
        });
      }
    }
    return ret;
  }

  public async evaluateCfnExpression(cfnExpression: any): Promise<any> {
    const self = this;
    /**
     * Evaluates CloudFormation intrinsic functions
     *
     * Note that supported intrinsic functions are documented in README.md -- please update
     * list of supported functions when adding new evaluations
     *
     * See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
     */
    class CfnIntrinsics {
      public evaluateIntrinsic(intrinsic: Intrinsic): any {
        const intrinsicFunc = (this as any)[intrinsic.name];
        if (!intrinsicFunc) {
          throw new CfnEvaluationException(`CloudFormation function ${intrinsic.name} is not supported`);
        }

        const argsAsArray = Array.isArray(intrinsic.args) ? intrinsic.args : [intrinsic.args];

        return intrinsicFunc.apply(this, argsAsArray);
      }

      async 'Fn::Join'(separator: string, args: any[]): Promise<string> {
        const evaluatedArgs = await self.evaluateCfnExpression(args);
        return evaluatedArgs.join(separator);
      }

      async 'Fn::Split'(separator: string, args: any): Promise<string> {
        const evaluatedArgs = await self.evaluateCfnExpression(args);
        return evaluatedArgs.split(separator);
      }

      async 'Fn::Select'(index: number, args: any[]): Promise<string> {
        const evaluatedArgs = await self.evaluateCfnExpression(args);
        return evaluatedArgs[index];
      }

      async 'Ref'(logicalId: string): Promise<string> {
        const refTarget = await self.findRefTarget(logicalId);
        if (refTarget) {
          return refTarget;
        } else {
          throw new CfnEvaluationException(`Parameter or resource '${logicalId}' could not be found for evaluation`);
        }
      }

      async 'Fn::GetAtt'(logicalId: string, attributeName: string): Promise<string> {
        // ToDo handle the 'logicalId.attributeName' form of Fn::GetAtt
        const attrValue = await self.findGetAttTarget(logicalId, attributeName);
        if (attrValue) {
          return attrValue;
        } else {
          throw new CfnEvaluationException(`Attribute '${attributeName}' of resource '${logicalId}' could not be found for evaluation`);
        }
      }

      async 'Fn::Sub'(template: string, explicitPlaceholders?: { [variable: string]: string }): Promise<string> {
        const placeholders = explicitPlaceholders
          ? await self.evaluateCfnExpression(explicitPlaceholders)
          : {};

        return asyncGlobalReplace(template, /\${([^}]*)}/g, key => {
          if (key in placeholders) {
            return placeholders[key];
          } else {
            const splitKey = key.split('.');
            return splitKey.length === 1
              ? this.Ref(key)
              : this['Fn::GetAtt'](splitKey[0], splitKey.slice(1).join('.'));
          }
        });
      }

      async 'Fn::ImportValue'(name: string): Promise<string> {
        const exported = await self.lookupExport.lookupExport(name);
        if (!exported) {
          throw new CfnEvaluationException(`Export '${name}' could not be found for evaluation`);
        }
        if (!exported.Value) {
          throw new CfnEvaluationException(`Export '${name}' exists without a value`);
        }
        return exported.Value;
      }
    }

    if (cfnExpression == null) {
      return cfnExpression;
    }

    if (Array.isArray(cfnExpression)) {
      return Promise.all(cfnExpression.map(expr => this.evaluateCfnExpression(expr)));
    }

    if (typeof cfnExpression === 'object') {
      const intrinsic = this.parseIntrinsic(cfnExpression);
      if (intrinsic) {
        return new CfnIntrinsics().evaluateIntrinsic(intrinsic);
      } else {
        const ret: { [key: string]: any } = {};
        for (const [key, val] of Object.entries(cfnExpression)) {
          ret[key] = await this.evaluateCfnExpression(val);
        }
        return ret;
      }
    }

    return cfnExpression;
  }

  private references(logicalId: string, templateElement: any): boolean {
    if (typeof templateElement === 'string') {
      return logicalId === templateElement;
    }

    if (templateElement == null) {
      return false;
    }

    if (Array.isArray(templateElement)) {
      return templateElement.some(el => this.references(logicalId, el));
    }

    if (typeof templateElement === 'object') {
      return Object.values(templateElement).some(el => this.references(logicalId, el));
    }

    return false;
  }

  private parseIntrinsic(x: any): Intrinsic | undefined {
    const keys = Object.keys(x);
    if (keys.length === 1 && (keys[0].startsWith('Fn::') || keys[0] === 'Ref')) {
      return {
        name: keys[0],
        args: x[keys[0]],
      };
    }
    return undefined;
  }

  private async findRefTarget(logicalId: string): Promise<string | undefined> {
    // first, check to see if the Ref is a Parameter who's value we have
    if (logicalId === 'AWS::URLSuffix') {
      if (!this.cachedUrlSuffix) {
        this.cachedUrlSuffix = this.urlSuffix(this.region);
      }

      return this.cachedUrlSuffix;
    }

    // Try finding the ref in the passed in parameters
    const parameterTarget = this.context[logicalId];
    if (parameterTarget) {
      return parameterTarget;
    }

    // If not in the passed in parameters, see if there is a default value in the template parameter that was not passed in
    const defaultParameterValue = this.template.Parameters?.[logicalId]?.Default;
    if (defaultParameterValue) {
      return defaultParameterValue;
    }

    // if it's not a Parameter, we need to search in the current Stack resources
    return this.findGetAttTarget(logicalId);
  }

  private async findGetAttTarget(logicalId: string, attribute?: string): Promise<string | undefined> {

    // Handle case where the attribute is referencing a stack output (used in nested stacks to share parameters)
    // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-cloudformation.html#w2ab1c17c23c19b5
    if (logicalId === 'Outputs' && attribute) {
      return this.evaluateCfnExpression(this.template.Outputs[attribute]?.Value);
    }

    const stackResources = await this.stackResources.listStackResources();
    const foundResource = stackResources.find(sr => sr.LogicalResourceId === logicalId);
    if (!foundResource) {
      return undefined;
    }

    if (foundResource.ResourceType == 'AWS::CloudFormation::Stack' && attribute?.startsWith('Outputs.')) {
      // need to resolve attributes from another stack's Output section
      const dependantStackName = this.nestedStackNames[logicalId]?.nestedStackPhysicalName;
      if (!dependantStackName) {
        //this is a newly created nested stack and cannot be hotswapped
        return undefined;
      }
      const dependantStackTemplate = this.template.Resources[logicalId];
      const evaluateCfnTemplate = await this.createNestedEvaluateCloudFormationTemplate(
        dependantStackName,
        dependantStackTemplate?.Properties?.NestedTemplate,
        dependantStackTemplate.newValue?.Properties?.Parameters);

      // Split Outputs.<refName> into 'Outputs' and '<refName>' and recursively call evaluate
      return evaluateCfnTemplate.evaluateCfnExpression({ 'Fn::GetAtt': attribute.split(/\.(.*)/s) });
    }
    // now, we need to format the appropriate identifier depending on the resource type,
    // and the requested attribute name
    return this.formatResourceAttribute(foundResource, attribute);
  }

  private formatResourceAttribute(resource: AWS.CloudFormation.StackResourceSummary, attribute: string | undefined): string | undefined {
    const physicalId = resource.PhysicalResourceId;

    // no attribute means Ref expression, for which we use the physical ID directly
    if (!attribute) {
      return physicalId;
    }

    const resourceTypeFormats = RESOURCE_TYPE_ATTRIBUTES_FORMATS[resource.ResourceType];
    if (!resourceTypeFormats) {
      throw new CfnEvaluationException(`We don't support attributes of the '${resource.ResourceType}' resource. This is a CDK limitation. ` +
        'Please report it at https://github.com/aws/aws-cdk/issues/new/choose');
    }
    const attributeFmtFunc = resourceTypeFormats[attribute];
    if (!attributeFmtFunc) {
      throw new CfnEvaluationException(`We don't support the '${attribute}' attribute of the '${resource.ResourceType}' resource. This is a CDK limitation. ` +
        'Please report it at https://github.com/aws/aws-cdk/issues/new/choose');
    }
    const service = this.getServiceOfResource(resource);
    const resourceTypeArnPart = this.getResourceTypeArnPartOfResource(resource);
    return attributeFmtFunc({
      partition: this.partition,
      service,
      region: this.region,
      account: this.account,
      resourceType: resourceTypeArnPart,
      resourceName: physicalId!,
    });
  }

  private getServiceOfResource(resource: AWS.CloudFormation.StackResourceSummary): string {
    return resource.ResourceType.split('::')[1].toLowerCase();
  }

  private getResourceTypeArnPartOfResource(resource: AWS.CloudFormation.StackResourceSummary): string {
    const resourceType = resource.ResourceType;
    const specialCaseResourceType = RESOURCE_TYPE_SPECIAL_NAMES[resourceType]?.resourceType;
    return specialCaseResourceType
      ? specialCaseResourceType
      // this is the default case
      : resourceType.split('::')[2].toLowerCase();
  }
}

export type Template = { [section: string]: { [headings: string]: any } };

interface ArnParts {
  readonly partition: string;
  readonly service: string;
  readonly region: string;
  readonly account: string;
  readonly resourceType: string;
  readonly resourceName: string;
}

/**
 * Usually, we deduce the names of the service and the resource type used to format the ARN from the CloudFormation resource type.
 * For a CFN type like AWS::Service::ResourceType, the second segment becomes the service name, and the third the resource type
 * (after converting both of them to lowercase).
 * However, some resource types break this simple convention, and we need to special-case them.
 * This map is for storing those cases.
 */
const RESOURCE_TYPE_SPECIAL_NAMES: { [type: string]: { resourceType: string } } = {
  'AWS::Events::EventBus': {
    resourceType: 'event-bus',
  },
};

const RESOURCE_TYPE_ATTRIBUTES_FORMATS: { [type: string]: { [attribute: string]: (parts: ArnParts) => string } } = {
  'AWS::IAM::Role': { Arn: iamArnFmt },
  'AWS::IAM::User': { Arn: iamArnFmt },
  'AWS::IAM::Group': { Arn: iamArnFmt },
  'AWS::S3::Bucket': { Arn: s3ArnFmt },
  'AWS::Lambda::Function': { Arn: stdColonResourceArnFmt },
  'AWS::Events::EventBus': {
    Arn: stdSlashResourceArnFmt,
    // the name attribute of the EventBus is the same as the Ref
    Name: parts => parts.resourceName,
  },
  'AWS::DynamoDB::Table': { Arn: stdSlashResourceArnFmt },
  'AWS::AppSync::GraphQLApi': { ApiId: appsyncGraphQlApiApiIdFmt },
  'AWS::AppSync::FunctionConfiguration': { FunctionId: appsyncGraphQlFunctionIDFmt },
  'AWS::AppSync::DataSource': { Name: appsyncGraphQlDataSourceNameFmt },
};

function iamArnFmt(parts: ArnParts): string {
  // we skip region for IAM resources
  return `arn:${parts.partition}:${parts.service}::${parts.account}:${parts.resourceType}/${parts.resourceName}`;
}

function s3ArnFmt(parts: ArnParts): string {
  // we skip account, region and resourceType for S3 resources
  return `arn:${parts.partition}:${parts.service}:::${parts.resourceName}`;
}

function stdColonResourceArnFmt(parts: ArnParts): string {
  // this is a standard format for ARNs like: arn:aws:service:region:account:resourceType:resourceName
  return `arn:${parts.partition}:${parts.service}:${parts.region}:${parts.account}:${parts.resourceType}:${parts.resourceName}`;
}

function stdSlashResourceArnFmt(parts: ArnParts): string {
  // this is a standard format for ARNs like: arn:aws:service:region:account:resourceType/resourceName
  return `arn:${parts.partition}:${parts.service}:${parts.region}:${parts.account}:${parts.resourceType}/${parts.resourceName}`;
}

function appsyncGraphQlApiApiIdFmt(parts: ArnParts): string {
  // arn:aws:appsync:us-east-1:111111111111:apis/<apiId>
  return parts.resourceName.split('/')[1];
}

function appsyncGraphQlFunctionIDFmt(parts: ArnParts): string {
  // arn:aws:appsync:us-east-1:111111111111:apis/<apiId>/functions/<functionId>
  return parts.resourceName.split('/')[3];
}

function appsyncGraphQlDataSourceNameFmt(parts: ArnParts): string {
  // arn:aws:appsync:us-east-1:111111111111:apis/<apiId>/datasources/<name>
  return parts.resourceName.split('/')[3];
}

interface Intrinsic {
  readonly name: string;
  readonly args: any;
}

async function asyncGlobalReplace(str: string, regex: RegExp, cb: (x: string) => Promise<string>): Promise<string> {
  if (!regex.global) { throw new Error('Regex must be created with /g flag'); }

  const ret = new Array<string>();
  let start = 0;
  while (true) {
    const match = regex.exec(str);
    if (!match) { break; }

    ret.push(str.substring(start, match.index));
    ret.push(await cb(match[1]));

    start = regex.lastIndex;
  }
  ret.push(str.slice(start));

  return ret.join('');
}
