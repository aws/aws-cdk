import cdk = require('@aws-cdk/cdk');
import { Function as LambdaFunction, PartialFunctionProps } from '../function';
import { Runtime } from '../runtime';
import { LambdaBuilderCode } from './lambda-builder';

export class NodeVersion {
  public static readonly NodeJS = new NodeVersion(Runtime.NodeJS);
  public static readonly NodeJS43 = new NodeVersion(Runtime.NodeJS43);
  public static readonly NodeJS610 = new NodeVersion(Runtime.NodeJS610);
  public static readonly NodeJS810 = new NodeVersion(Runtime.NodeJS810);

  private constructor(public readonly runtime: Runtime) {
    // nothing to do
  }
}
export interface NodeCodeProps {
  path: string;
  version: NodeVersion;
}
export class NodeCode extends LambdaBuilderCode {
  constructor(props: NodeCodeProps) {
    super({
      path: props.path,
      language: 'nodejs',
      dependencyManager: 'npm',
      manifestName: 'package.json',
      runtime: props.version.runtime
    });
  }
}
export interface NodeFunctionProps extends PartialFunctionProps {
  path: string;

  version: NodeVersion;
  /**
   * @default index.handle
   */
  handler?: string;
}
export class NodeFunction extends LambdaFunction {
  constructor(scope: cdk.Construct, id: string, props: NodeFunctionProps) {
    super(scope, id, {
      ...props,
      handler: props.handler || 'index.handle',
      code: new NodeCode({
        path: props.path,
        version: props.version
      }),
      runtime: props.version.runtime
    });
  }
}