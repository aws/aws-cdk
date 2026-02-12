import type { IConstruct } from 'constructs';
import * as cxapi from '../../../cx-api/index';
import type { IEnvironmentAware } from '../../../interfaces';
import type { CfnResource } from '../cfn-resource';
import { ValidationError } from '../errors';
import { FeatureFlags } from '../feature-flags';

interface ITraitFactory<T> {
  forResource(resource: CfnResource): T;
}

export class Traits<
  Trait extends object,
  Factory extends ITraitFactory<Trait>,
> {
  private instances = new WeakMap<IEnvironmentAware, Trait>();

  public constructor(
    private readonly sym: symbol,
    private readonly defaultFactoryFor: (type: string) => Factory | undefined) {
  }

  public of(resource: CfnResource): Trait | undefined {
    const cached = this.instances.get(resource);
    if (cached != null) {
      return cached;
    }

    let factory = this.lookupFactory(resource);
    if (factory == null) {
      if (!FeatureFlags.of(resource).isEnabled(cxapi.AUTOMATIC_L1_TRAITS)) {
        const msg = `Couldn't find trait for ${resource}, install one explicitly or enable the feature flag '${cxapi.AUTOMATIC_L1_TRAITS}'`;
        throw new ValidationError(msg, resource);
      }
      factory = this.defaultFactoryFor(resource.cfnResourceType);
    }
    if (factory != null) {
      const trait = factory.forResource(resource);
      this.instances.set(resource, trait);
      return trait;
    }
    return undefined;
  }

  public register(scope: IConstruct, cfnType: string, factory: Factory, sym: symbol) {
    let factoryMap = (scope as any)[sym] as Map<string, Factory>;
    if (!factoryMap) {
      factoryMap = new Map<string, Factory>();

      Object.defineProperty(scope, sym, {
        value: factoryMap,
        configurable: false,
        enumerable: false,
      });
    }

    factoryMap.set(cfnType, factory);
  }

  private lookupFactory(scope: CfnResource): Factory | undefined {
    for (
      let current: any = scope;
      current != null;
      current = (current.node && current.node.scope) ? current.node.scope : undefined
    ) {
      const factoryMap = current[this.sym];
      if (factoryMap) {
        const factory = factoryMap.get(scope.cfnResourceType);
        if (factory) {
          return factory;
        }
      }
    }

    return undefined;
  }
}
