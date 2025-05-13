import { Construct, IConstruct, Node } from 'constructs';
import { InjectionContext, IPropertyInjector, PropertyInjectors } from '../prop-injectors';

/**
 * This symbol is needed to identify PropertyInjectors.
 */
export const PROPERTY_INJECTORS_SYMBOL = Symbol.for('@aws-cdk/core.PropertyInjectors');

/**
 * This is called by the constructor to find and apply the PropertyInjector for that Construct.
 * @param uniqueId - uniqueId of the Construct
 * @param originalProps - original constructor properties
 * @param context - context of the injection
 * @returns a new props with default values.
 */
export function applyInjectors(uniqueId: string, originalProps: any, context: InjectionContext): any {
  const injector = findInjectorFromConstruct(context.scope, uniqueId);
  if (injector === undefined) {
    // no injector found
    return originalProps;
  }
  return injector.inject(originalProps, {
    scope: context.scope,
    id: context.id,
  });
}

/**
 * This function finds the PropertyInjectors in the scope by walking up the scope tree.
 * It then returns the Injector associated with uniqueId, or undefined if it is not found.
 * Borrowed logic from Stack.of.
 */
export function findInjectorFromConstruct(scope: IConstruct, uniqueId: string): IPropertyInjector | undefined {
  const result = _lookup(scope);
  if (result === undefined) {
    return undefined;
  }
  const injectors = _getInjectorsFromConstruct(result) as unknown as PropertyInjectors;

  const propsInjector = injectors.for(uniqueId);
  if (!propsInjector) {
    const parent = Node.of(scope).scope;
    if (parent) {
      return findInjectorFromConstruct(parent, uniqueId);
    }
  }
  return propsInjector;

  function _getInjectorsFromConstruct(c: any): any {
    type ObjKey = keyof typeof c;
    const k = PROPERTY_INJECTORS_SYMBOL as unknown as ObjKey;
    return c[k];
  }

  function _lookup(c: Construct): PropertyInjectors | undefined {
    if (PropertyInjectors.hasPropertyInjectors(c)) {
      return c;
    }

    const n = Node.of(c);
    if (n === undefined) {
      return undefined;
    }
    const _scope = n.scope;
    if (!_scope) {
      // not more scope to check, so return undefined
      return undefined;
    }

    return _lookup(_scope);
  }
}

