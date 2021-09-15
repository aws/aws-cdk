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

  public evaluateCfnExpression(cfnExpression: any): any {
    if (cfnExpression == null) {
      return cfnExpression;
    }

    if (Array.isArray(cfnExpression)) {
      return cfnExpression.map(expr => this.evaluateCfnExpression(expr));
    }

    if (typeof cfnExpression === 'object') {
      const intrinsic = this.parseIntrinsic(cfnExpression);
      if (intrinsic) {
        return this.evaluateIntrinsic(intrinsic);
      } else {
        const ret: { [key: string]: any } = {};
        for (const key of Object.keys(cfnExpression)) {
          ret[key] = this.evaluateCfnExpression(cfnExpression[key]);
        }
        return ret;
      }
    }

    return cfnExpression;
  }

  'Fn::Join'(separator: string, args: string[]): string {
    return this.evaluateCfnExpression(args).map((expr: any) => this.evaluateCfnExpression(expr)).join(separator);
  }

  'Fn::Split'(separator: string, args: string): string {
    return this.evaluateCfnExpression(args).split(separator);
  }

  'Fn::Select'(index: number, args: string[]): string {
    return this.evaluateCfnExpression(args).map((expr: any) => this.evaluateCfnExpression(expr))[index];
  }

  'Ref'(logicalId: string): string {
    if (logicalId in this.context) {
      return this.context[logicalId];
    } else {
      throw new Error(`Reference target '${logicalId}' was not found`);
    }
  }

  'Fn::GetAtt'(logicalId: string, attributeName: string): string {
    // ToDo handle the 'logicalId.attributeName' form of Fn::GetAtt
    const key = `${logicalId}.${attributeName}`;
    if (key in this.context) {
      return this.context[key];
    } else {
      throw new Error(`Trying to evaluate Fn::GetAtt of '${key}' but not in context!`);
    }
  }

  'Fn::Sub'(template: string, explicitPlaceholders?: { [variable: string]: string }): string {
    const placeholders = explicitPlaceholders
      ? { ...this.context, ...this.evaluateCfnExpression(explicitPlaceholders) }
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
}

interface Intrinsic {
  readonly name: string;
  readonly args: any;
}
