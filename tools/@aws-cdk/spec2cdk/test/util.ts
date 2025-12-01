import { Resource } from '@aws-cdk/service-spec-types';
import { Method, TypeScriptRenderer } from '@cdklabs/typewriter';
import { AwsCdkLibBuilder, AwsCdkLibBuilderProps } from '../lib/cdk/aws-cdk-lib';

export function moduleForResource(resource: Resource, props: AwsCdkLibBuilderProps) {
  const ast = new AwsCdkLibBuilder(props);
  const info = ast.addResource(resource);
  return info.resourcesMod.module;
}

export class TestRenderer extends TypeScriptRenderer {
  public renderMethod(method: Method) {
    this.withScope(method.scope.scope, () => {
      super.renderMethod(method, 'class');
    });
    // @ts-ignore
    return this.emitter.toString();
  }
}
