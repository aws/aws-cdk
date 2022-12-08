import { existingType, IType } from './type';
import { InstalledModule } from './source-module';
import { litVal } from './value';
import { interleave, IRenderable, CM2, renderable } from './cm2';

export abstract class WithMembers implements IRenderable {
  public propExp(propName: string): IRenderable {
    return litVal([this, '.', propName]);
  }

  public callExp(fnName: string) {
    return (...args: IRenderable[]): IRenderable => litVal([this, '.', fnName, '(', ...interleave(', ', args), ')']);
  }

  public abstract render(code: CM2): void;
}

export function withMembers<A extends IRenderable>(x: A): A & WithMembers {
  return Object.create(x, Object.getOwnPropertyDescriptors(WithMembers.prototype));
}

export const NO_EXAMPLE = () => renderable(['???']);

export const CONSTRUCT = withMembers(existingType('Construct', new InstalledModule('constructs'), () => renderable(['this'])));
export const RESOURCE = withMembers(existingType('Resource', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE));
export const STACK = withMembers(existingType('Stack', new InstalledModule('@aws-cdk/core'), () => renderable(['Stack.of(this)'])));
export const IRESOURCE = existingType('IResource', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE);
export const DURATION = withMembers(existingType('Duration', new InstalledModule('@aws-cdk/core'), () => renderable(['Duration.seconds(123)'])));
export const ARN = withMembers(existingType('Arn', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE));
export const ARN_FORMAT = withMembers(existingType('ArnFormat', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE));
export const LAZY = withMembers(existingType('Lazy', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE));
export const FN = withMembers(existingType('Fn', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE));
export const TOKENIZATION = withMembers(existingType('Tokenization', new InstalledModule('@aws-cdk/core'), NO_EXAMPLE));

export function factoryFunction(type: IType): IType {
  return {
    definingModule: type.definingModule,
    toString: () => `() => ${type}`,
    typeRefName: `() => ${type}`,
    render: (code) => {
      code.add('() => ', type);
    },
    exampleValue: (name) => renderable(['() => ', type.exampleValue(name)]),
  };
}
