import { existingType, IType } from './type';
import { InstalledModule } from './source-module';
import { litVal } from './value';
import { interleave, IRenderable, CM2 } from './cm2';

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

export const CONSTRUCT = withMembers(existingType('Construct', new InstalledModule('constructs')));
export const RESOURCE = withMembers(existingType('Resource', new InstalledModule('@aws-cdk/core')));
export const STACK = withMembers(existingType('Stack', new InstalledModule('@aws-cdk/core')));
export const IRESOURCE = existingType('IResource', new InstalledModule('@aws-cdk/core'));
export const DURATION = withMembers(existingType('Duration', new InstalledModule('@aws-cdk/core')));
export const ARN = withMembers(existingType('Arn', new InstalledModule('@aws-cdk/core')));
export const ARN_FORMAT = withMembers(existingType('ArnFormat', new InstalledModule('@aws-cdk/core')));
export const LAZY = withMembers(existingType('Lazy', new InstalledModule('@aws-cdk/core')));
export const FN = withMembers(existingType('Fn', new InstalledModule('@aws-cdk/core')));
export const TOKENIZATION = withMembers(existingType('Tokenization', new InstalledModule('@aws-cdk/core')));

export function factoryFunction(type: IType): IType {
  return {
    definingModule: type.definingModule,
    toString: () => `() => ${type}`,
    typeRefName: `() => ${type}`,
    render: (code) => {
      code.add('() => ', type);
    },
  };
}
