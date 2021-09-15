import * as cxapi from '@aws-cdk/cx-api';
import { ListStackResources } from './common';

export interface CloudFormationExecutableTemplateProps {
  readonly stackArtifact: cxapi.CloudFormationStackArtifact;
  readonly parameters: { [parameterName: string]: string };
  readonly account: string;
  readonly region: string;
  // readonly partition: string;
  readonly urlSuffix: string;

  readonly listStackResources: ListStackResources;
}

export class CloudFormationExecutableTemplate {
  public readonly stackResources: ListStackResources;

  readonly template: { [section: string]: { [headings: string]: any } };
  private readonly context: { [k: string]: string };

  constructor(props: CloudFormationExecutableTemplateProps) {
    this.stackResources = props.listStackResources;
    this.template = props.stackArtifact.template;
    this.context = {
      'AWS::Region': props.region,
      'AWS::AccountId': props.account,
      'AWS::URLSuffix': props.urlSuffix,
      ...props.parameters,
    };
  }

  public async evaluateCfnExpression(cfnExpression: any): Promise<any> {
    if (cfnExpression == null) {
      return cfnExpression;
    }

    if (Array.isArray(cfnExpression)) {
      return Promise.all(cfnExpression.map(expr => this.evaluateCfnExpression(expr)));
    }

    if (typeof cfnExpression === 'object') {
      const intrinsic = this.parseIntrinsic(cfnExpression);
      if (intrinsic) {
        return this.evaluateIntrinsic(intrinsic);
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

  async 'Fn::Join'(separator: string, args: any[]): Promise<string> {
    const evaluatedArgs = await this.evaluateCfnExpression(args);
    return evaluatedArgs.join(separator);
  }

  async 'Fn::Split'(separator: string, args: any): Promise<string> {
    const evaluatedArgs = await this.evaluateCfnExpression(args);
    return evaluatedArgs.split(separator);
  }

  async 'Fn::Select'(index: number, args: any[]): Promise<string> {
    const evaluatedArgs = await this.evaluateCfnExpression(args);
    return evaluatedArgs[index];
  }

  async 'Ref'(logicalId: string): Promise<string> {
    const refTarget = await this.findRefTarget(logicalId);
    if (refTarget) {
      return refTarget;
    } else {
      throw new Error(`Reference target '${logicalId}' was not found`);
    }
  }

  async 'Fn::GetAtt'(logicalId: string, attributeName: string): Promise<string> {
    // ToDo handle the 'logicalId.attributeName' form of Fn::GetAtt
    const key = `${logicalId}.${attributeName}`;
    if (key in this.context) {
      return this.context[key];
    } else {
      throw new Error(`Trying to evaluate Fn::GetAtt of '${key}' but not in context!`);
    }
  }

  async 'Fn::Sub'(template: string, explicitPlaceholders?: { [variable: string]: string }): Promise<string> {
    const placeholders = explicitPlaceholders
      ? { ...this.context, ...(await this.evaluateCfnExpression(explicitPlaceholders)) }
      : this.context;

    return template.replace(/\${([^}]*)}/g, (_: string, key: string) => {
      if (key in placeholders) {
        return placeholders[key];
      } else {
        throw new Error(`Fn::Sub target '${key}' was not found`);
      }
    });
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

  private evaluateIntrinsic(intrinsic: Intrinsic): any {
    const intrinsicFunc = (this as any)[intrinsic.name];
    if (!intrinsicFunc) {
      throw new Error(`CloudFormation function ${intrinsic.name} is not supported`);
    }

    const argsAsArray = Array.isArray(intrinsic.args) ? intrinsic.args : [intrinsic.args];

    return intrinsicFunc.apply(this, argsAsArray);
  }

  private async findRefTarget(logicalId: string): Promise<string | undefined> {
    // first, check to see if the Ref is a Parameter who's value we have
    const parameterTarget = this.context[logicalId];
    if (parameterTarget) {
      return parameterTarget;
    }

    // if it's not a Parameter, we need to search in the current Stack resources
    const stackResources = await this.stackResources.listStackResources();
    const foundResource = stackResources.find(sr => sr.LogicalResourceId === logicalId);
    // ToDo this needs to be more sophisticated, and do different things based on the resource type
    // (as the PhysicalId can also be other things, like an ARN)
    return foundResource?.PhysicalResourceId;
  }
}

interface Intrinsic {
  readonly name: string;
  readonly args: any;
}
