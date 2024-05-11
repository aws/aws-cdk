/* eslint-disable import/no-extraneous-dependencies */
import {
  ClassType,
  stmt,
  expr,
  Type,
  Splat,
  PropertySpec,
  InterfaceSpec,
  InterfaceType,
  ObjectLiteral,
  MemberVisibility,
  SuperInitializer,
  Expression,
  ClassSpec,
} from '@cdklabs/typewriter';
import { Runtime } from './config';
import { HandlerFrameworkModule } from './framework';
import {
  PATH_MODULE,
  CONSTRUCTS_MODULE,
  LAMBDA_MODULE,
  CORE_MODULE,
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
   * The name of the method within your code that framework component calls.
   */
  readonly handler: string;

  /**
   * The runtime environment for the framework component.
   *
   * @default - the latest Lambda runtime available in the region.
   */
  readonly runtime?: Runtime;
}

export abstract class HandlerFrameworkClass extends ClassType {
  /**
   * Builds a code generated Lambda function class.
   */
  public static buildFunction(scope: HandlerFrameworkModule, props: HandlerFrameworkClassProps): HandlerFrameworkClass {
    return new (class Function extends HandlerFrameworkClass {
      public constructor() {
        super(scope, {
          name: props.name,
          extends: LAMBDA_MODULE.Function,
          export: true,
        });

        scope.registerImport(LAMBDA_MODULE);

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['code', expr.directCode(`lambda.Code.fromAsset(path.join(__dirname, '${props.codeDirectory}'))`)],
          ['handler', expr.lit(props.handler)],
          ['runtime', this.buildRuntimeProperty(scope, props.runtime)],
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
      public constructor() {
        super(scope, {
          name: props.name,
          extends: LAMBDA_MODULE.SingletonFunction,
          export: true,
        });

        scope.registerImport(LAMBDA_MODULE);

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
          ['runtime', this.buildRuntimeProperty(scope, props.runtime)],
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
      public constructor() {
        super(scope, {
          name: props.name,
          extends: CORE_MODULE.CustomResourceProviderBase,
          export: true,
        });

        if (scope.coreInternal) {
          scope.registerImport(CORE_MODULE, {
            targets: [CORE_MODULE.Stack.toString()],
            fromLocation: '../../stack',
          });
          scope.registerImport(CORE_MODULE, {
            targets: [CORE_MODULE.CustomResourceProviderBase.toString(), CORE_MODULE.CustomResourceProviderOptions.toString()],
            fromLocation: '../../custom-resource-provider',
          });
        } else {
          scope.registerImport(CORE_MODULE, {
            targets: [
              CORE_MODULE.Stack.toString(),
              CORE_MODULE.CustomResourceProviderBase.toString(),
              CORE_MODULE.CustomResourceProviderOptions.toString(),
            ],
          });
        }

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
          type: CORE_MODULE.CustomResourceProviderOptions,
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
          type: CORE_MODULE.CustomResourceProviderOptions,
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
          ['runtimeName', this.buildRuntimeProperty(scope, props.runtime, true)],
        ]);
        this.buildConstructor({
          constructorPropsType: CORE_MODULE.CustomResourceProviderOptions,
          superProps,
          constructorVisbility: MemberVisibility.Private,
          optionalConstructorProps: true,
        });
      }
    })();
  }

  protected constructor(scope: HandlerFrameworkModule, spec: ClassSpec) {
    super(scope, spec);
    scope.registerImport(PATH_MODULE);
    scope.registerImport(CONSTRUCTS_MODULE, {
      targets: [CONSTRUCTS_MODULE.Construct.toString()],
    });
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

  private buildRuntimeProperty(scope: HandlerFrameworkModule, runtime?: Runtime, isProvider: boolean = false) {
    if (runtime) {
      return isProvider ? expr.lit(runtime) : expr.directCode(toLambdaRuntime(runtime));
    }

    if (isProvider) {
      scope.registerImport(CORE_MODULE, {
        targets: [CORE_MODULE.determineLatestNodeRuntimeName.name],
        fromLocation: scope.coreInternal
          ? './runtime-determiner-core.generated'
          : '../../../core/lib/dist/core/runtime-determiner-core.generated',
      });
    } else {
      scope.registerImport(LAMBDA_MODULE, {
        targets: [LAMBDA_MODULE.determineLatestNodeRuntime.name],
        fromLocation: '../../../aws-lambda/lib/runtime-determiner-lambda.generated',
      });
    }

    const _scope = expr.ident('scope');
    return isProvider
      ? CORE_MODULE.determineLatestNodeRuntimeName.expr.call(_scope)
      : LAMBDA_MODULE.determineLatestNodeRuntime.expr.call(_scope);
  }
}
