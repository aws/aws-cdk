/* eslint-disable import/no-extraneous-dependencies */
import {
  ClassType,
  stmt,
  expr,
  Type,
  Splat,
  ExternalModule,
  PropertySpec,
  InterfaceSpec,
  InterfaceType,
  ObjectLiteral,
  MemberVisibility,
  SuperInitializer,
  Expression,
} from '@cdklabs/typewriter';
import { Runtime } from './config';
import { HandlerFrameworkModule } from './framework';
import {
  CONSTRUCTS_MODULE,
  LAMBDA_MODULE,
  CORE_MODULE,
  CORE_INTERNAL_STACK,
  CORE_INTERNAL_CR_PROVIDER,
  PATH_MODULE,
} from './modules';
import { toLambdaRuntime } from './utils/framework-utils';

/**
 * Initialization properties for a class constructor.
 */
interface ConstructorBuildProps {
  /**
   * The props type used to create an instance of this class.
   */
  readonly constructorPropsType: Type;

  /**
   * Properties to pass up to the parent class.
   */
  readonly superProps: ObjectLiteral;

  /**
   * Whether the class constructor props are optional.
   *
   * @default false
   */
  readonly optionalConstructorProps?: boolean;

  /**
   * Visbility for the constructor.
   *
   * @default MemberVisbility.Public
   */
  readonly constructorVisbility?: MemberVisibility;
}

/**
 * Initialization properties used to build a `HandlerFrameworkClass` instance.
 */
export interface HandlerFrameworkClassProps {
  /**
   * The name of the framework component class.
   */
  readonly name: string;

  /**
   * A local file system directory with the framework component's code.
   */
  readonly codeDirectory: string;

  /**
   * The runtime environment for the framework component.
   */
  readonly runtime: Runtime;

  /**
   * The name of the method within your code that framework component calls.
   */
  readonly handler: string;
}

export abstract class HandlerFrameworkClass extends ClassType {
  /**
   * Builds a code generated Lambda function class.
   */
  public static buildFunction(scope: HandlerFrameworkModule, props: HandlerFrameworkClassProps): HandlerFrameworkClass {
    return new (class Function extends HandlerFrameworkClass {
      protected readonly externalModules = [PATH_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: LAMBDA_MODULE.Function,
          export: true,
        });

        this.importExternalModulesInto(scope);

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['code', expr.directCode(`lambda.Code.fromAsset(path.join(__dirname, '${props.codeDirectory}'))`)],
          ['handler', expr.lit(props.handler)],
          ['runtime', expr.directCode(toLambdaRuntime(props.runtime))],
        ]);
        this.buildConstructor({
          constructorPropsType: LAMBDA_MODULE.FunctionOptions,
          superProps,
          optionalConstructorProps: true,
          constructorVisbility: MemberVisibility.Public,
        });
      }
    })();
  }

  /**
   * Builds a code generated Lambda singleton function class.
   */
  public static buildSingletonFunction(scope: HandlerFrameworkModule, props: HandlerFrameworkClassProps): HandlerFrameworkClass {
    return new (class SingletonFunction extends HandlerFrameworkClass {
      protected readonly externalModules = [PATH_MODULE, CONSTRUCTS_MODULE, LAMBDA_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: LAMBDA_MODULE.SingletonFunction,
          export: true,
        });

        this.importExternalModulesInto(scope);

        const uuid: PropertySpec = {
          name: 'uuid',
          type: Type.STRING,
          immutable: true,
          docs: {
            summary: 'A unique identifier to identify this Lambda.\n\nThe identifier should be unique across all custom resource providers.\nWe recommend generating a UUID per provider.',
          },
        };
        const lambdaPurpose: PropertySpec = {
          name: 'lambdaPurpose',
          type: Type.STRING,
          immutable: true,
          optional: true,
          docs: {
            summary: 'A descriptive name for the purpose of this Lambda.\n\nIf the Lambda does not have a physical name, this string will be\nreflected in its generated name. The combination of lambdaPurpose\nand uuid must be unique.',
            docTags: {
              default: 'SingletonLambda',
            },
          },
        };
        const _interface = this.getOrCreateInterface(scope, {
          name: `${this.name}Props`,
          export: true,
          extends: [LAMBDA_MODULE.FunctionOptions],
          properties: [uuid, lambdaPurpose],
          docs: {
            summary: `Initialization properties for ${this.name}`,
          },
        });

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['code', expr.directCode(`lambda.Code.fromAsset(path.join(__dirname, '${props.codeDirectory}'))`)],
          ['handler', expr.lit(props.handler)],
          ['runtime', expr.directCode(toLambdaRuntime(props.runtime))],
        ]);
        this.buildConstructor({
          constructorPropsType: _interface.type,
          superProps,
          constructorVisbility: MemberVisibility.Public,
        });
      }
    })();
  }

  /**
   * Builds a code generated custom resource provider class.
   */
  public static buildCustomResourceProvider(scope: HandlerFrameworkModule, props: HandlerFrameworkClassProps): HandlerFrameworkClass {
    return new (class CustomResourceProvider extends HandlerFrameworkClass {
      protected readonly externalModules: ExternalModule[] = [PATH_MODULE, CONSTRUCTS_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: scope.coreInternal
            ? CORE_INTERNAL_CR_PROVIDER.CustomResourceProviderBase
            : CORE_MODULE.CustomResourceProviderBase,
          export: true,
        });

        if (scope.coreInternal) {
          this.externalModules.push(...[CORE_INTERNAL_STACK, CORE_INTERNAL_CR_PROVIDER]);
        } else {
          this.externalModules.push(CORE_MODULE);
        }
        this.importExternalModulesInto(scope);

        const getOrCreateMethod = this.addMethod({
          name: 'getOrCreate',
          static: true,
          returnType: Type.STRING,
          docs: {
            summary: 'Returns a stack-level singleton ARN (service token) for the custom resource provider.',
          },
        });
        getOrCreateMethod.addParameter({
          name: 'scope',
          type: CONSTRUCTS_MODULE.Construct,
        });
        getOrCreateMethod.addParameter({
          name: 'uniqueid',
          type: Type.STRING,
        });
        getOrCreateMethod.addParameter({
          name: 'props',
          type: scope.coreInternal
            ? CORE_INTERNAL_CR_PROVIDER.CustomResourceProviderOptions
            : CORE_MODULE.CustomResourceProviderOptions,
          optional: true,
        });
        getOrCreateMethod.addBody(
          stmt.ret(expr.directCode('this.getOrCreateProvider(scope, uniqueid, props).serviceToken')),
        );

        const getOrCreateProviderMethod = this.addMethod({
          name: 'getOrCreateProvider',
          static: true,
          returnType: this.type,
          docs: {
            summary: 'Returns a stack-level singleton for the custom resource provider.',
          },
        });
        getOrCreateProviderMethod.addParameter({
          name: 'scope',
          type: CONSTRUCTS_MODULE.Construct,
        });
        getOrCreateProviderMethod.addParameter({
          name: 'uniqueid',
          type: Type.STRING,
        });
        getOrCreateProviderMethod.addParameter({
          name: 'props',
          type: scope.coreInternal
            ? CORE_INTERNAL_CR_PROVIDER.CustomResourceProviderOptions
            : CORE_MODULE.CustomResourceProviderOptions,
          optional: true,
        });
        getOrCreateProviderMethod.addBody(
          stmt.constVar(expr.ident('id'), expr.directCode('`${uniqueid}CustomResourceProvider`')),
          stmt.constVar(expr.ident('stack'), expr.directCode('Stack.of(scope)')),
          stmt.constVar(expr.ident('existing'), expr.directCode(`stack.node.tryFindChild(id) as ${this.type}`)),
          stmt.ret(expr.directCode(`existing ?? new ${this.name}(stack, id, props)`)),
        );

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['codeDirectory', expr.directCode(`path.join(__dirname, '${props.codeDirectory}')`)],
          ['runtimeName', expr.lit(props.runtime)],
        ]);
        this.buildConstructor({
          constructorPropsType: scope.coreInternal
            ? CORE_INTERNAL_CR_PROVIDER.CustomResourceProviderOptions
            : CORE_MODULE.CustomResourceProviderOptions,
          superProps,
          constructorVisbility: MemberVisibility.Private,
          optionalConstructorProps: true,
        });
      }
    })();
  }

  /**
   * External modules that this class depends on.
   */
  protected abstract readonly externalModules: ExternalModule[];

  private importExternalModulesInto(scope: HandlerFrameworkModule) {
    for (const module of this.externalModules) {
      if (!scope.hasExternalModule(module)) {
        scope.addExternalModule(module);
        this.importExternalModuleInto(scope, module);
      }
    }
  }

  private importExternalModuleInto(scope: HandlerFrameworkModule, module: ExternalModule) {
    switch (module.fqn) {
      case PATH_MODULE.fqn: {
        PATH_MODULE.import(scope, 'path');
        return;
      }
      case CONSTRUCTS_MODULE.fqn: {
        CONSTRUCTS_MODULE.importSelective(scope, ['Construct']);
        return;
      }
      case CORE_MODULE.fqn: {
        CORE_MODULE.importSelective(scope, [
          'Stack',
          'CustomResourceProviderBase',
          'CustomResourceProviderOptions',
        ]);
        return;
      }
      case CORE_INTERNAL_CR_PROVIDER.fqn: {
        CORE_INTERNAL_CR_PROVIDER.importSelective(scope, [
          'CustomResourceProviderBase',
          'CustomResourceProviderOptions',
        ]);
        return;
      }
      case CORE_INTERNAL_STACK.fqn: {
        CORE_INTERNAL_STACK.importSelective(scope, ['Stack']);
        return;
      }
      case LAMBDA_MODULE.fqn: {
        LAMBDA_MODULE.import(scope, 'lambda');
        return;
      }
    }
  }

  private getOrCreateInterface(scope: HandlerFrameworkModule, spec: InterfaceSpec) {
    const existing = scope.getInterface(spec.name);
    if (existing) {
      return existing;
    }

    const _interface = new InterfaceType(scope, { ...spec });
    scope.registerInterface(_interface);
    return _interface;
  }

  private buildConstructor(props: ConstructorBuildProps) {
    const init = this.addInitializer({
      visibility: props.constructorVisbility,
    });
    const scope = init.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    const id = init.addParameter({
      name: 'id',
      type: Type.STRING,
    });
    init.addParameter({
      name: 'props',
      type: props.constructorPropsType,
      optional: props.optionalConstructorProps,
    });

    const superInitializerArgs: Expression[] = [scope, id, props.superProps];
    init.addBody(new SuperInitializer(...superInitializerArgs));
  }
}
