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
  $T,
  Statement,
} from '@cdklabs/typewriter';
import {
  CUSTOM_RESOURCE_PROVIDER,
  CUSTOM_RESOURCE_RUNTIME_FAMILY,
  CUSTOM_RESOURCE_SINGLETON,
  CUSTOM_RESOURCE_SINGLETON_LOG_GROUP,
  CUSTOM_RESOURCE_SINGLETON_LOG_RETENTION,
  Runtime,
} from './config';
import { HandlerFrameworkModule } from './framework';
import {
  PATH_MODULE,
  CONSTRUCTS_MODULE,
  LAMBDA_MODULE,
  CORE_MODULE,
} from './modules';
import { toLambdaRuntime } from './utils/framework-utils';

const CORE_INTERNAL_STACK_IMPORT_PATH = '../../stack';
const CORE_INTERNAL_CUSTOM_RESOURCE_PROVIDER_IMPORT_PATH = '../../custom-resource-provider';
const ALPHA_MODULE_LAMBDA_IMPORT_PATH = 'aws-cdk-lib/aws-lambda';

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

  /**
   * These statements are added to the constructor body in the order they appear in this property.
   *
   * @default undefined
   */
  readonly statements?: Statement[];
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

interface BuildRuntimePropertyOptions {
  readonly runtime?: Runtime;
  readonly isCustomResourceProvider?: boolean;
  readonly isEvalNodejsProvider?: boolean;
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

        if (scope.isAlphaModule) {
          scope.registerImport(LAMBDA_MODULE, { fromLocation: ALPHA_MODULE_LAMBDA_IMPORT_PATH });
        } else {
          scope.registerImport(LAMBDA_MODULE);
        }

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['code', $T(LAMBDA_MODULE.Code).fromAsset(
            PATH_MODULE.join.call(expr.directCode(`__dirname, '${props.codeDirectory}'`)),
          )],
          ['handler', expr.lit(props.handler)],
          ['runtime', this.buildRuntimeProperty(scope, { runtime: props.runtime })],
        ]);
        const metadataStatements: Statement[] = [
          expr.directCode(`this.node.addMetadata('${CUSTOM_RESOURCE_RUNTIME_FAMILY}', this.runtime.family)`),
        ];
        this.buildConstructor({
          constructorPropsType: LAMBDA_MODULE.FunctionOptions,
          superProps,
          optionalConstructorProps: true,
          constructorVisbility: MemberVisibility.Public,
          statements: metadataStatements,
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

        if (scope.isAlphaModule) {
          scope.registerImport(LAMBDA_MODULE, { fromLocation: ALPHA_MODULE_LAMBDA_IMPORT_PATH });
        } else {
          scope.registerImport(LAMBDA_MODULE);
        }

        const isEvalNodejsProvider = this.fqn.includes('eval-nodejs-provider');

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
        const properties = [uuid, lambdaPurpose];
        // eval nodejs provider is a one off scenario where the provider makes its runtime property configurable - to maintain this
        // functionality we need to expose it as well
        if (isEvalNodejsProvider) {
          const runtime: PropertySpec = {
            name: 'runtime',
            type: LAMBDA_MODULE.Runtime,
            immutable: true,
            optional: true,
            docs: {
              summary: 'The runtime that this Lambda will use.',
              docTags: {
                default: '- the latest Lambda node runtime available in your region.',
              },
            },
          };
          properties.push(runtime);
        }
        const _interface = this.getOrCreateInterface(scope, {
          name: `${this.name}Props`,
          export: true,
          extends: [LAMBDA_MODULE.FunctionOptions],
          properties,
          docs: {
            summary: `Initialization properties for ${this.name}`,
          },
        });

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['code', $T(LAMBDA_MODULE.Code).fromAsset(
            PATH_MODULE.join.call(expr.directCode(`__dirname, '${props.codeDirectory}'`)),
          )],
          ['handler', expr.lit(props.handler)],
          ['runtime', this.buildRuntimeProperty(scope, { runtime: props.runtime, isEvalNodejsProvider })],
        ]);
        const metadataStatements: Statement[] = [
          expr.directCode(`this.addMetadata('${CUSTOM_RESOURCE_SINGLETON}', true)`),
          expr.directCode(`this.addMetadata('${CUSTOM_RESOURCE_RUNTIME_FAMILY}', this.runtime.family)`),
          expr.directCode(`if (props?.logGroup) { this.logGroup.node.addMetadata('${CUSTOM_RESOURCE_SINGLETON_LOG_GROUP}', true) }`),
          // We need to access the private `_logRetention` custom resource, the only public property - `logGroup` - provides an ARN reference to the resource, instead of the resource itself.
          expr.directCode(`if (props?.logRetention) { ((this as any).lambdaFunction as lambda.Function)._logRetention?.node.addMetadata('${CUSTOM_RESOURCE_SINGLETON_LOG_RETENTION}', true) }`),
        ];
        this.buildConstructor({
          constructorPropsType: _interface.type,
          superProps,
          constructorVisbility: MemberVisibility.Public,
          statements: metadataStatements,
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

        if (scope.isCoreInternal) {
          scope.registerImport(CORE_MODULE, {
            targets: [CORE_MODULE.Stack],
            fromLocation: CORE_INTERNAL_STACK_IMPORT_PATH,
          });
          scope.registerImport(CORE_MODULE, {
            targets: [
              CORE_MODULE.CustomResourceProviderBase,
              CORE_MODULE.CustomResourceProviderOptions,
            ],
            fromLocation: CORE_INTERNAL_CUSTOM_RESOURCE_PROVIDER_IMPORT_PATH,
          });
        } else {
          scope.registerImport(CORE_MODULE, {
            targets: [
              CORE_MODULE.Stack,
              CORE_MODULE.CustomResourceProviderBase,
              CORE_MODULE.CustomResourceProviderOptions,
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
        const _scope = getOrCreateProviderMethod.addParameter({
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
          stmt.constVar(expr.ident('stack'), $T(CORE_MODULE.Stack).of(expr.directCode(_scope.spec.name))),
          stmt.constVar(expr.ident('existing'), expr.directCode(`stack.node.tryFindChild(id) as ${this.type}`)),
          stmt.ret(expr.directCode(`existing ?? new ${this.name}(stack, id, props)`)),
        );

        const superProps = new ObjectLiteral([
          new Splat(expr.ident('props')),
          ['codeDirectory', PATH_MODULE.join.call(expr.directCode(`__dirname, '${props.codeDirectory}'`))],
          ['runtimeName', this.buildRuntimeProperty(scope, {
            runtime: props.runtime,
            isCustomResourceProvider: true,
          })],
        ]);
        const metadataStatements: Statement[] = [expr.directCode(`this.node.addMetadata('${CUSTOM_RESOURCE_PROVIDER}', true)`)];
        this.buildConstructor({
          constructorPropsType: CORE_MODULE.CustomResourceProviderOptions,
          superProps,
          constructorVisbility: MemberVisibility.Private,
          optionalConstructorProps: true,
          statements: metadataStatements,
        });
      }
    })();
  }

  protected constructor(scope: HandlerFrameworkModule, spec: ClassSpec) {
    super(scope, spec);
    scope.registerImport(PATH_MODULE);
    scope.registerImport(CONSTRUCTS_MODULE, {
      targets: [CONSTRUCTS_MODULE.Construct],
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
    if (props.statements) {
      for (const statement of props.statements) {
        init.addBody(statement);
      }
    }
  }

  private buildRuntimeProperty(scope: HandlerFrameworkModule, options: BuildRuntimePropertyOptions = {}) {
    const { runtime, isCustomResourceProvider, isEvalNodejsProvider } = options;

    if (runtime) {
      return isCustomResourceProvider ? expr.lit(runtime) : expr.directCode(toLambdaRuntime(runtime));
    }

    if (isCustomResourceProvider) {
      scope.registerImport(CORE_MODULE, {
        targets: [CORE_MODULE.determineLatestNodeRuntimeName],
        fromLocation: scope.isCoreInternal
          ? CORE_INTERNAL_CUSTOM_RESOURCE_PROVIDER_IMPORT_PATH
          : CORE_MODULE.fqn,
      });
    }

    const _scope = expr.ident('scope');
    const call = isCustomResourceProvider
      ? CORE_MODULE.determineLatestNodeRuntimeName.call(_scope)
      : LAMBDA_MODULE.determineLatestNodeRuntime.call(_scope);

    return isEvalNodejsProvider
      ? expr.cond(expr.directCode('props.runtime'), expr.directCode('props.runtime'), call)
      : call;
  }
}
