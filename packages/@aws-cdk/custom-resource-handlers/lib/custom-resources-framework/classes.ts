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
import { CdkCustomResourceModule } from './framework';
import {
  CONSTRUCTS_MODULE,
  LAMBDA_MODULE,
  CORE_MODULE,
  CORE_INTERNAL,
  PATH_MODULE,
} from './modules';
import { Runtime } from './runtime';

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
 * Initialization properties used to build a `CdkHandlerFrameworkClass` instance.
 */
export interface CdkCustomResourceClassProps {
  /**
   * The name of the component class.
   */
  readonly name: string;

  /**
   * A local file system directory with the provider's code. The code will be
   * bundled into a zip asset and wired to the provider's AWS Lambda function.
   */
  readonly codeDirectory: string;

  /**
   * The runtime environment for the Lambda function.
   */
  readonly runtime: Runtime;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  readonly entrypoint: string;
}

export abstract class CdkCustomResourceClass extends ClassType {
  /**
   * Builds a `CdkFunction` class.
   */
  public static buildCdkFunction(scope: CdkCustomResourceModule, props: CdkCustomResourceClassProps): CdkCustomResourceClass {
    return new (class CdkFunction extends CdkCustomResourceClass {
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
          ['handler', expr.lit(props.entrypoint)],
          ['runtime', expr.directCode(props.runtime.toLambdaRuntime())],
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
   * Builds a `CdkSingletonFunction` class.
   */
  public static buildCdkSingletonFunction(scope: CdkCustomResourceModule, props: CdkCustomResourceClassProps): CdkCustomResourceClass {
    return new (class CdkSingletonFunction extends CdkCustomResourceClass {
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
          name: 'CdkSingletonFunctionProps',
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
          ['handler', expr.lit(props.entrypoint)],
          ['runtime', expr.directCode(props.runtime.toLambdaRuntime())],
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
   * Builds a `CdkCustomResourceProvider` class.
   */
  public static buildCdkCustomResourceProvider(scope: CdkCustomResourceModule, props: CdkCustomResourceClassProps): CdkCustomResourceClass {
    return new (class CdkCustomResourceProvider extends CdkCustomResourceClass {
      protected readonly externalModules: ExternalModule[] = [PATH_MODULE, CONSTRUCTS_MODULE];

      public constructor() {
        super(scope, {
          name: props.name,
          extends: scope.coreInternal
            ? CORE_INTERNAL.CustomResourceProviderBase
            : CORE_MODULE.CustomResourceProviderBase,
          export: true,
        });

        this.externalModules.push(scope.coreInternal ? CORE_INTERNAL : CORE_MODULE);
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
            ? CORE_INTERNAL.CustomResourceProviderOptions
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
            ? CORE_INTERNAL.CustomResourceProviderOptions
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
          ['runtimeName', expr.lit(props.runtime.name)],
        ]);
        this.buildConstructor({
          constructorPropsType: scope.coreInternal
            ? CORE_INTERNAL.CustomResourceProviderOptions
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

  private importExternalModulesInto(scope: CdkCustomResourceModule) {
    for (const module of this.externalModules) {
      if (!scope.hasExternalModule(module)) {
        scope.addExternalModule(module);
        this.importExternalModuleInto(scope, module);
      }
    }
  }

  private importExternalModuleInto(scope: CdkCustomResourceModule, module: ExternalModule) {
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
      case CORE_INTERNAL.fqn: {
        CORE_INTERNAL.importSelective(scope, [
          'Stack',
          'CustomResourceProviderBase',
          'CustomResourceProviderOptions',
        ]);
        return;
      }
      case LAMBDA_MODULE.fqn: {
        LAMBDA_MODULE.import(scope, 'lambda');
        return;
      }
    }
  }

  private getOrCreateInterface(scope: CdkCustomResourceModule, spec: InterfaceSpec) {
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

// function toLambdaRuntime(runtime: Runtime) {
//   switch (runtime.name) {
//     case Runtime.NODEJS_16_X.name: {
//       return 'lambda.Runtime.NODEJS_16_X';
//     }
//     case Runtime.NODEJS_18_X.name: {
//       return 'lambda.Runtime.NODEJS_18_X';
//     }
//     case Runtime.PYTHON_3_9.name: {
//       return 'lambda.Runtime.PYTHON_3_9';
//     }
//     case Runtime.PYTHON_3_10.name: {
//       return 'lambda.Runtime.PYTHON_3_10';
//     }
//   }
//   throw new Error('Unable to convert runtime to lambda runtime');
// }
