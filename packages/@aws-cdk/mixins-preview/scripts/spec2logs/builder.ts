import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { naming, util } from '@aws-cdk/spec2cdk';
import { CDK_CORE, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import type { Method } from '@cdklabs/typewriter';
import { Module, ExternalModule, ClassType, Stability, Type, expr, stmt, ThingSymbol, $this, CallableProxy, NewExpression, $E } from '@cdklabs/typewriter';
import { CDK_AWS_LOGS, MIXINS_LOGS_DELIVERY, REF_INTERFACES } from './helpers';
import type { ServiceSubmoduleProps, SelectiveImport, LocatedModule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule, relativeImportPath } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { MIXINS_CORE } from '../spec2mixins/helpers';
import { ResourceReference } from '@aws-cdk/spec2cdk/lib/cdk/reference-props';

class LogsDeliveryBuilderServiceModule extends BaseServiceSubmodule {
  public readonly constructLibModule: ExternalModule;

  public constructor(props: ServiceSubmoduleProps) {
    super(props);
    this.constructLibModule = new ExternalModule(`aws-cdk-lib/${props.submoduleName}`);
  }
}

export interface LogsDeliveryBuilderProps extends LibraryBuilderProps {
}

export class LogsDeliveryBuilder extends LibraryBuilder<LogsDeliveryBuilderServiceModule> {
  private readonly filePattern: string;

  public constructor(props: LogsDeliveryBuilderProps) {
    super(props);
    this.filePattern = '%moduleName%/logs-delivery-mixins.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): LogsDeliveryBuilderServiceModule {
    return new LogsDeliveryBuilderServiceModule({
      submoduleName,
      service,
    });
  }

  protected addResourceToSubmodule(submodule: LogsDeliveryBuilderServiceModule, resource: Resource, _props?: AddServiceProps): void {
    const resourceReference = new ResourceReference(resource);
    if (resource.vendedLogs && resourceReference.hasArnGetter) {
      const service = this.db.incoming('hasResource', resource).only().entity;
      const logsModule = this.obtainLogsDeliveryModule(submodule, service);

      const vendedLogsMixin = new LogsDelivery(logsModule.module, this.db, resource, submodule.constructLibModule);
      submodule.registerResource(`${resource.cloudFormationType}VendedLogs`, vendedLogsMixin.mixin);

      vendedLogsMixin.build();

      submodule.registerSelectiveImports(...vendedLogsMixin.imports);
    }
  }

  private obtainLogsDeliveryModule(submodule: LogsDeliveryBuilderServiceModule, service: Service): LocatedModule<Module> {
    const mod = this.createLogsDeliveryModule(submodule, service);
    if (this.modules.has(mod.filePath)) {
      return {
        module: this.modules.get(mod.filePath)!,
        filePath: mod.filePath,
      };
    }

    return this.rememberModule(mod);
  }

  private createLogsDeliveryModule(submodule: LogsDeliveryBuilderServiceModule, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/logs`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    submodule.registerModule({ module, filePath });

    CDK_CORE.import(module, 'cdk');
    REF_INTERFACES.import(module, 'interfaces');
    CONSTRUCTS.import(module, 'constructs');
    CDK_AWS_LOGS.import(module, 'logs');
    MIXINS_CORE.import(module, 'core', { fromLocation: relativeImportPath(filePath, '../core') });
    MIXINS_LOGS_DELIVERY.import(module, 'logsDelivery', { fromLocation: '../aws-logs/logs-delivery' });
    submodule.constructLibModule.import(module, 'service');

    return { module, filePath };
  }
}

class LogsDelivery {
  public scope: Module;
  public readonly imports = new Array<SelectiveImport>();
  public readonly mixin: LogsMixin;
  private readonly helpers: LogsHelper[] = [];

  constructor(
    scope: Module,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    constructLibModule: ExternalModule,
  ) {
    this.scope = scope;

    for (const logType of this.resource.vendedLogs?.logTypes || []) {
      const logClass = new LogsHelper(this.scope,
        `${naming.classNameFromResource(this.resource)}${logType.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join('')}`,
        this.resource, logType,
      );
      this.helpers.push(logClass);
    }

    this.mixin = new LogsMixin(scope, db, resource, constructLibModule);
  }

  public build() {
    this.mixin.build();
    for (const helper of this.helpers) {
      helper.build(this.mixin);
    }
  }
}

class LogsHelper extends ClassType {
  private readonly resource: Resource;
  private readonly logType: string;

  constructor(
    scope: Module,
    name: string,
    resource: Resource,
    logType: string,
  ) {
    super(scope, {
      export: true,
      name: name,
      docs: {
        summary: `Builder for ${naming.classNameFromResource(resource)}LogsMixin to generate ${logType} for ${naming.classNameFromResource(resource)}`,
        stability: Stability.External,
        docTags: {
          cloudformationResource: resource.cloudFormationType,
          logType: logType,
        },
      },
    });
    this.resource = resource;
    this.logType = logType;
  }

  public build(mixin: LogsMixin) {
    for (const dest of this.resource.vendedLogs!.destinations) {
      if ((dest === 'XRAY' && this.logType === 'TRACES') || (dest !== 'XRAY' && this.logType !== 'TRACES')) {
        switch (dest) {
          case 'S3':
            const toS3 = this.addMethod({
              name: `to${dest}`,
              returnType: mixin.type,
              docs: {
                summary: 'Send logs to an S3 Bucket',
              },
            });

            const paramS3 = toS3.addParameter({
              name: 'bucket',
              type: REF_INTERFACES.IBucketRef,
            });

            const permissions = this.resource.vendedLogs!.permissionsVersion === 'V2' ? MIXINS_LOGS_DELIVERY.S3LogsDeliveryPermissionsVersion.V2 : MIXINS_LOGS_DELIVERY.S3LogsDeliveryPermissionsVersion.V1;
            toS3.addBody(stmt.block(
              stmt.ret(
                mixin.newInstance(expr.str(this.logType), new NewExpression(MIXINS_LOGS_DELIVERY.S3LogsDelivery, paramS3,
                  expr.object({ permissionsVersion: permissions }))),
              ),
            ));
            break;
          case 'CWL':
            const toCWL = this.addMethod({
              name: 'toLogGroup',
              returnType: mixin.type,
              docs: {
                summary: 'Send logs to a CloudWatch Log Group',
              },
            });

            const paramCWL = toCWL.addParameter({
              name: 'logGroup',
              type: REF_INTERFACES.ILogGroupRef,
            });

            toCWL.addBody(stmt.block(
              stmt.ret(
                mixin.newInstance(expr.str(this.logType), new NewExpression(MIXINS_LOGS_DELIVERY.LogGroupLogsDelivery, paramCWL)),
              ),
            ));
            break;
          case 'FH':
            const toFH = this.addMethod({
              name: 'toFirehose',
              returnType: mixin.type,
              docs: {
                summary: 'Send logs to a Firehose Delivery Stream',
              },
            });

            const paramFH = toFH.addParameter({
              name: 'deliveryStream',
              type: REF_INTERFACES.IDeliveryStreamRef,
            });

            toFH.addBody(stmt.block(
              stmt.ret(
                mixin.newInstance(expr.str(this.logType), new NewExpression(MIXINS_LOGS_DELIVERY.FirehoseLogsDelivery, paramFH)),
              ),
            ));
            break;
          default:
            const toXRAY = this.addMethod({
              name: 'toXRay',
              returnType: mixin.type,
              docs: {
                summary: 'Send traces to X-Ray',
              },
            });

            toXRAY.addBody(stmt.block(
              stmt.ret(
                mixin.newInstance(expr.str(this.logType), new NewExpression(MIXINS_LOGS_DELIVERY.XRayLogsDelivery)),
              ),
            ));
            break;
        }
      }
    }

    mixin.addProperty({
      name: this.logType,
      type: this.type,
      static: true,
      immutable: true,
      initializer: expr.directCode(`new ${this.name}()`),
    });
  }
}

class LogsMixin extends ClassType {
  public readonly imports = new Array<SelectiveImport>();
  private readonly resourceType: Type;

  constructor(
    scope: Module,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    constructLibModule: ExternalModule,
  ) {
    super(scope, {
      export: true,
      name: `${naming.classNameFromResource(resource)}LogsMixin`,
      implements: [MIXINS_CORE.IMixin],
      extends: MIXINS_CORE.Mixin,
      docs: {
        summary: `Mixin to implement vended logs for ${resource.cloudFormationType}`,
        ...util.splitDocumentation(resource.documentation),
        stability: Stability.External,
        docTags: {
          cloudformationResource: resource.cloudFormationType,
          mixin: 'true',
        },
        see: naming.cloudFormationDocLink({
          resourceType: resource.cloudFormationType,
        }),
      },
    });

    this.resourceType = Type.fromName(constructLibModule, naming.classNameFromResource(this.resource));
  }

  /**
   * Build the elements of the VendedLogsMixin Class
   */
  public build() {
    this.makeConstructor();
    const supports = this.makeSupportsMethod();
    this.makeApplyToMethod(supports);
  }

  private makeConstructor() {
    this.addProperty({
      name: 'logType',
      type: Type.STRING,
      protected: true,
      immutable: true,
    });

    this.addProperty({
      name: 'logDelivery',
      type: MIXINS_LOGS_DELIVERY.ILogsDelivery,
      protected: true,
      immutable: true,
    });

    const init = this.addInitializer({
      docs: {
        summary: `Create a mixin to enable vended logs for \`${this.resource.cloudFormationType}\`.`,
      },
    });

    const logType = init.addParameter({
      name: 'logType',
      type: Type.STRING,
      documentation: 'Type of logs that are getting vended',
    });

    const delivery = init.addParameter({
      name: 'logDelivery',
      type: MIXINS_LOGS_DELIVERY.ILogsDelivery,
      documentation: 'Object in charge of setting up the delivery destination and delivery connection',
    });

    init.addBody(
      expr.sym(new ThingSymbol('super', this.scope)).call(),
      stmt.assign($this.logType, logType),
      stmt.assign($this.logDelivery, delivery),
    );
  }

  private makeSupportsMethod(): Method {
    const method = this.addMethod({
      name: 'supports',
      returnType: Type.ambient(`construct is service.${this.resourceType.symbol}`),
      docs: {
        summary: 'Check if this mixin supports the given construct (has vendedLogs property)',
      },
    });

    const construct = method.addParameter({
      name: 'construct',
      type: CONSTRUCTS.IConstruct,
    });

    method.addBody(
      stmt.ret(
        expr.binOp(
          CallableProxy.fromName('CfnResource.isCfnResource', CDK_CORE).invoke(construct),
          '&&',
          expr.eq(expr.get(construct, 'cfnResourceType'), expr.lit(this.resource.cloudFormationType)),
        ),
      ),
    );

    return method;
  }

  private makeApplyToMethod(supports: Method) {
    const method = this.addMethod({
      name: 'applyTo',
      returnType: CONSTRUCTS.IConstruct,
      docs: {
        summary: 'Apply vended logs configuration to the construct',
      },
    });

    const resource = method.addParameter({
      name: 'resource',
      type: CONSTRUCTS.IConstruct,
      documentation: 'Some configuration may be required on the source resource to get Vended Logs to function properly.' +
        `\nSee Vended Logs documentation specific to ${this.resource.cloudFormationType} for more information.`,
    });

    const sourceArn = expr.ident('sourceArn');
    const arnBuilder = $E(expr.sym(this.resourceType.symbol!)).callMethod(`arnFor${this.resource.name}`, resource);

    const prefix = `${this.resource.name}Source-`;
    const newCfnDeliverySource = CDK_AWS_LOGS.CfnDeliverySource.newInstance(
      resource,
      expr.strConcat(expr.str('CdkSource'), CDK_CORE.uniqueId(resource)),
      expr.object({
        name: expr.strConcat(expr.str(prefix), CDK_CORE.uniqueResourceName(resource, expr.object({
          maxLength: expr.binOp(expr.num(60 - (prefix.length + 1)), '-', $this.logType.prop('length')),
        })), expr.str('-'), $this.logType),
        resourceArn: sourceArn,
        logType: $this.logType,
      }),
    );
    const deliverySource = expr.ident('deliverySource');

    method.addBody(
      stmt
        .if_(expr.not(CallableProxy.fromMethod(supports).invoke(resource)))
        .then(stmt.block(stmt.ret(resource))),

      stmt.constVar(sourceArn, arnBuilder),
      stmt.constVar(deliverySource, newCfnDeliverySource),
      $this.logDelivery.callMethod('bind', resource, deliverySource, sourceArn),

      stmt.ret(resource),
    );
  }
}
