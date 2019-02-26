import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import { join } from 'path';
import { Function as LambdaFunction, PartialFunctionProps } from '../function';
import { Runtime } from '../runtime';
import { LambdaBuilderCode } from './lambda-builder';

export interface JvmCodeProps {
  path: string;

  /**
   * @default inferred from project structure (pom.xml or maven, build.gradle for gradle)
   */
  dependencyManager?: string;
}

export class JvmCode extends LambdaBuilderCode {
  constructor(props: JvmCodeProps) {
    const language = 'java';
    let dependencyManager = props.dependencyManager;
    let manifestName: string;

    if (dependencyManager) {
      switch (dependencyManager) {
        case 'maven':
          manifestName = 'pom.xml';
          break;
        case 'gradle':
          manifestName = 'build.gradle';
          break;
        default:
          throw new Error(`unsupported java dependency manager: '${dependencyManager}'`);
      }
    } else {
      // infer from project structure - TODO: move to aws-lambda-builders. See https://github.com/awslabs/aws-lambda-builders/pull/88
      if (fs.existsSync(join(props.path, 'pom.xml'))) {
        manifestName = 'pom.xml';
        dependencyManager = 'maven';
      } else if (fs.existsSync(join(props.path, 'build.gradle'))) {
        manifestName = 'build.gradle';
        dependencyManager = 'gradle';
      } else {
        throw new Error('could not determine dependency manager for java project, no pom.xml or build.gradle file exists in root');
      }
    }

    super({
      path: props.path,
      runtime: Runtime.Java8,
      language,
      dependencyManager,
      manifestName
    });
  }
}

export class JvmVersion {
  public static readonly Java8 = new JvmVersion(Runtime.Java8);

  private constructor(public readonly runtime: Runtime) {}
}
export interface JvmHandler {
  className: string;
  methodName: string;
}
export interface JvmFunctionProps extends PartialFunctionProps {
  path: string;
  handler: JvmHandler;
  version?: JvmVersion;
  dependencyManager?: string;
}
export class JvmFunction extends LambdaFunction {
  constructor(scope: cdk.Construct, id: string, props: JvmFunctionProps) {
    super(scope, id, {
      ...props,
      code: new JvmCode({
        path: props.path,
        dependencyManager: props.dependencyManager
      }),
      handler: `${props.handler.className}:${props.handler.methodName}`,
      runtime: props.version !== undefined ? props.version.runtime : Runtime.Java8
    });
  }
}
