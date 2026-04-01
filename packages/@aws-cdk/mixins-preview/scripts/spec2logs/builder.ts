import type { Resource, Service, SpecDatabase, VendedLogs } from '@aws-cdk/service-spec-types';
import { naming, util } from '@aws-cdk/spec2cdk';
import { CDK_CORE, CDK_INTERFACES, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import type { Method } from '@cdklabs/typewriter';
import { Module, ExternalModule, ClassType, Stability, Type, expr, stmt, ThingSymbol, $this, CallableProxy, NewExpression, $E, $T, EnumType, InterfaceType } from '@cdklabs/typewriter';
import { MIXINS_LOGS_DELIVERY } from './helpers';
import type { ServiceSubmoduleProps, LocatedModule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
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
    CDK_INTERFACES.import(module, 'interfaces');
    CONSTRUCTS.import(module, 'constructs');
    MIXINS_LOGS_DELIVERY.import(module, 'logsDelivery', { fromLocation: '../aws-logs/logs-delivery' });
    submodule.constructLibModule.import(module, 'service');

    return { module, filePath };
  }
}

class LogsDelivery {
  public scope: Module;
  public readonly mixin: LogsMixin;
  private readonly helpers: LogsHelper[] = [];

  constructor(
    scope: Module,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    constructLibModule: ExternalModule,
  ) {
    this.scope = scope;

    for (const log of this.resource.vendedLogs || []) {
      const logClass = new LogsHelper(this.scope,
        `${naming.classNameFromResource(this.resource)}${log.logType.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join('')}`,
        this.resource, log,
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
  private readonly log: VendedLogs;

  constructor(
    scope: Module,
    name: string,
    resource: Resource,
    log: VendedLogs,
  ) {
    super(scope, {
      export: true,
      name: name,
      docs: {
        summary: `Builder for ${naming.classNameFromResource(resource)}LogsMixin to generate ${log.logType} for ${naming.classNameFromResource(resource)}`,
        stability: Stability.External,
        docTags: {
          cloudformationResource: resource.cloudFormationType,
          logType: log.logType,
        },
      },
    });
    this.log = log;
  }

  public build(mixin: LogsMixin) {
    const logsNamespace = new ClassType(this.scope, {
      name: `${this.name}OutputFormat`,
      export: true,
      docs: {
        summary: `Output Format options for each destination of ${this.name}.`,
      },
    });

    let recordFields: EnumType | undefined;
    if (this.log.optionalFields || this.log.mandatoryFields) {
      recordFields = new EnumType(this.scope, {
        name: `${this.name}RecordFields`,
        export: true,
      });
      if (this.log.optionalFields && this.log.optionalFields.length > 0) {
        populateRecordFieldsEnum(this.log.optionalFields, recordFields);
      }

      if (this.log.mandatoryFields && this.log.mandatoryFields.length > 0) {
        populateRecordFieldsEnum(this.log.mandatoryFields, recordFields);
      }
    }
    for (const dest of this.log.destinations) {
      switch (dest.destinationType) {
        case 'S3':
          const toS3 = this.addMethod({
            name: `to${dest.destinationType}`,
            returnType: mixin.type,
            docs: {
              summary: 'Send logs to an S3 Bucket',
            },
          });

          const paramS3 = toS3.addParameter({
            name: 'bucket',
            type: CDK_INTERFACES.IBucketRef,
          });

          const s3Props = new InterfaceType(this.scope, {
            name: `${this.name}S3Props`,
            export: true,
            properties: [{
              name: 'encryptionKey',
              type: CDK_INTERFACES.IKeyRef,
              optional: true,
              immutable: true,
              docs: {
                summary: 'Encrpytion key for your delivery bucket',
              },
            }],
          });

          if (dest.outputFormats && dest.outputFormats.length > 0) {
            const s3OutputFormat = new EnumType(logsNamespace, {
              name: 'S3',
              export: true,
            });
            for (const format of dest.outputFormats) {
              s3OutputFormat.addMember({ name: format.toUpperCase(), value: format });
            }

            s3Props.addProperty({
              name: 'outputFormat',
              type: s3OutputFormat.type,
              optional: true,
              immutable: true,
              docs: {
                summary: `Format for log output, options are ${dest.outputFormats.join(',')}`,
              },
            });
          }

          if (recordFields) {
            s3Props.addProperty({
              name: 'recordFields',
              type: Type.arrayOf(recordFields.type),
              optional: true,
              immutable: true,
              docs: {
                summary: 'Record fields that can be provided to a log delivery',
              },
            });
          }

          toS3.addParameter({
            name: 'props',
            type: s3Props.type,
            optional: true,
            documentation: 'Additional properties that are optionally used in log delivery for S3 destinations',
          });

          const permissions = this.log.permissionsVersion === 'V2' ? MIXINS_LOGS_DELIVERY.S3LogsDeliveryPermissionsVersion.V2 : MIXINS_LOGS_DELIVERY.S3LogsDeliveryPermissionsVersion.V1;
          toS3.addBody(stmt.block(
            stmt.ret(
              mixin.newInstance(expr.str(this.log.logType), new NewExpression(MIXINS_LOGS_DELIVERY.S3LogsDelivery, paramS3,
                expr.object({
                  permissionsVersion: permissions,
                  kmsKey: expr.directCode('props?.encryptionKey'),
                  outputFormat: expr.directCode('props?.outputFormat'),
                  providedFields: recordFields ? expr.directCode('props?.recordFields') : expr.UNDEFINED,
                  mandatoryFields: this.log.mandatoryFields ? expr.directCode(JSON.stringify(this.log.mandatoryFields)) : expr.UNDEFINED,
                }))),
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
            type: CDK_INTERFACES.ILogGroupRef,
          });

          const hasLogGroupOutputFormats = dest.outputFormats && dest.outputFormats.length > 0;
          const hasLogGroupProps = hasLogGroupOutputFormats || recordFields;

          if (hasLogGroupProps) {
            const logGroupProps = new InterfaceType(this.scope, {
              name: `${this.name}LogGroupProps`,
              export: true,
            });

            if (hasLogGroupOutputFormats) {
              const lgOutputFormat = new EnumType(logsNamespace, {
                name: 'LogGroup',
                export: true,
              });
              for (const format of dest.outputFormats!) {
                lgOutputFormat.addMember({ name: format.toUpperCase(), value: format });
              }

              logGroupProps.addProperty({
                name: 'outputFormat',
                type: lgOutputFormat.type,
                optional: true,
                immutable: true,
                docs: {
                  summary: `Format for log output, options are ${dest.outputFormats.join(',')}`,
                },
              });
            }

            if (recordFields) {
              logGroupProps.addProperty({
                name: 'recordFields',
                type: Type.arrayOf(recordFields.type),
                optional: true,
                immutable: true,
                docs: {
                  summary: 'Record fields that can be provided to a log delivery',
                },
              });
            }

            toCWL.addParameter({
              name: 'props',
              type: logGroupProps.type,
              optional: true,
              documentation: 'Additional properties that are optionally used in log delivery for Log Group destinations',
            });
          }

          toCWL.addBody(stmt.block(
            stmt.ret(
              mixin.newInstance(expr.str(this.log.logType), new NewExpression(MIXINS_LOGS_DELIVERY.LogGroupLogsDelivery, paramCWL,
                expr.object({
                  outputFormat: expr.directCode('props?.outputFormat'),
                  providedFields: recordFields ? expr.directCode('props?.recordFields') : expr.UNDEFINED,
                  mandatoryFields: this.log.mandatoryFields ? expr.directCode(JSON.stringify(this.log.mandatoryFields)) : expr.UNDEFINED,
                }),
              )),
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
            type: CDK_INTERFACES.IDeliveryStreamRef,
          });

          const hasFirehoseOutputFormats = dest.outputFormats && dest.outputFormats.length > 0;
          const hasFirehoseProps = hasFirehoseOutputFormats || recordFields;

          if (hasFirehoseProps) {
            const firehoseProps = new InterfaceType(this.scope, {
              name: `${this.name}FirehoseProps`,
              export: true,
            });

            if (hasFirehoseOutputFormats) {
              const fhOutputFormat = new EnumType(logsNamespace, {
                name: 'Firehose',
                export: true,
              });

              for (const format of dest.outputFormats!) {
                fhOutputFormat.addMember({ name: format.toUpperCase(), value: format });
              }

              firehoseProps.addProperty({
                name: 'outputFormat',
                type: fhOutputFormat.type,
                optional: true,
                immutable: true,
                docs: {
                  summary: `Format for log output, options are ${dest.outputFormats.join(',')}`,
                },
              });
            }

            if (recordFields) {
              firehoseProps.addProperty({
                name: 'recordFields',
                type: Type.arrayOf(recordFields.type),
                optional: true,
                immutable: true,
                docs: {
                  summary: 'Record fields that can be provided to a log delivery',
                },
              });
            }

            toFH.addParameter({
              name: 'props',
              type: firehoseProps.type,
              optional: true,
              documentation: 'Additional properties that are optionally used in log delivery for Firehose destinations',
            });
          }

          toFH.addBody(stmt.block(
            stmt.ret(
              mixin.newInstance(expr.str(this.log.logType), new NewExpression(MIXINS_LOGS_DELIVERY.FirehoseLogsDelivery, paramFH,
                expr.object({
                  outputFormat: expr.directCode('props?.outputFormat'),
                  providedFields: recordFields ? expr.directCode('props?.recordFields') : expr.UNDEFINED,
                  mandatoryFields: this.log.mandatoryFields ? expr.directCode(JSON.stringify(this.log.mandatoryFields)) : expr.UNDEFINED,
                }),
              )),
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

          if (recordFields) {
            const xrayProps = new InterfaceType(this.scope, {
              name: `${this.name}XRayProps`,
              export: true,
            });

            xrayProps.addProperty({
              name: 'recordFields',
              type: Type.arrayOf(recordFields.type),
              optional: true,
              immutable: true,
              docs: {
                summary: 'Record fields that can be provided to a log delivery',
              },
            });

            toXRAY.addParameter({
              name: 'props',
              type: xrayProps.type,
              optional: true,
              documentation: 'Additional properties that are optionally used in log delivery for XRay destinations',
            });
          }

          toXRAY.addBody(stmt.block(
            stmt.ret(
              mixin.newInstance(expr.str(this.log.logType), new NewExpression(MIXINS_LOGS_DELIVERY.XRayLogsDelivery,
                expr.object({
                  providedFields: recordFields ? expr.directCode('props?.recordFields') : expr.UNDEFINED,
                  mandatoryFields: this.log.mandatoryFields ? expr.directCode(JSON.stringify(this.log.mandatoryFields)) : expr.UNDEFINED,
                }),
              )),
            ),
          ));
          break;
      }
    }
    const toDest = this.addMethod({
      name: 'toDestination',
      returnType: mixin.type,
      docs: {
        summary: 'Delivers logs to a pre-created delivery destination',
        remarks: `Supported destinations are ${this.log.destinations.map(d => d.destinationType).join(', ')}\n` +
        'You are responsible for setting up the correct permissions for your delivery destination, toDestination() does not set up any permissions for you.\n' +
        'Delivery destinations that are imported from another stack using CfnDeliveryDestination.fromDeliveryDestinationArn() or CfnDeliveryDestination.fromDeliveryDestinationName() are supported by toDestination().',
      },
    });

    const paramDest = toDest.addParameter({
      name: 'destination',
      type: CDK_INTERFACES.IDeliveryDestinationRef,
    });

    if (recordFields) {
      const destProps = new InterfaceType(this.scope, {
        name: `${this.name}DestProps`,
        export: true,
      });

      destProps.addProperty({
        name: 'recordFields',
        type: Type.arrayOf(recordFields.type),
        optional: true,
        immutable: true,
        docs: {
          summary: 'Record fields that can be provided to a log delivery',
        },
      });

      toDest.addParameter({
        name: 'props',
        type: destProps.type,
        optional: true,
        documentation: 'Additional properties that are optionally used in log delivery for destinations',
      });
    }

    toDest.addBody(stmt.block(
      stmt.ret(
        mixin.newInstance(expr.str(this.log.logType), new NewExpression(MIXINS_LOGS_DELIVERY.DestLogsDelivery, paramDest,
          expr.object({
            providedFields: recordFields ? expr.directCode('props?.recordFields') : expr.UNDEFINED,
            mandatoryFields: this.log.mandatoryFields ? expr.directCode(JSON.stringify(this.log.mandatoryFields)) : expr.UNDEFINED,
          }),
        )),
      ),
    ));

    mixin.addProperty({
      name: this.log.logType,
      type: this.type,
      static: true,
      immutable: true,
      initializer: expr.directCode(`new ${this.name}()`),
    });
  }
}

class LogsMixin extends ClassType {
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
      implements: [CONSTRUCTS.IMixin],
      extends: CDK_CORE.Mixin,
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
      documentation: 'Object in charge of setting up the delivery source, delivery destination, and delivery connection',
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
          $T(this.resourceType)[`is${this.resourceType.symbol}`](construct),
        ),
      ),
    );

    return method;
  }

  private makeApplyToMethod(supports: Method) {
    const method = this.addMethod({
      name: 'applyTo',
      returnType: Type.VOID,
      docs: {
        summary: 'Apply vended logs configuration to the construct',
      },
    });

    const resource = method.addParameter({
      name: 'resource',
      type: CONSTRUCTS.IConstruct,
    });

    const sourceArn = expr.ident('sourceArn');
    const arnBuilder = $E(expr.sym(this.resourceType.symbol!)).callMethod(`arnFor${this.resource.name}`, resource);

    method.addBody(
      stmt
        .if_(expr.not(CallableProxy.fromMethod(supports).invoke(resource)))
        .then(stmt.block(stmt.ret())),

      stmt.constVar(sourceArn, arnBuilder),
      $this.logDelivery.callMethod('bind', resource, $this.logType, sourceArn),
    );
  }
}

function populateRecordFieldsEnum(fieldArray: string[], recordFields: EnumType) {
  for (let field of fieldArray) {
    // field names must be valid typescript identifiers, which means they cannot have a number as their first character and the only special character they can have are $ or _
    const fieldName = field.match(/^(\d+)/) ? '_' + field : field;
    recordFields.addMember({ name: fieldName.split(/[^a-zA-Z0-9$_]+/).join('_').toUpperCase(), value: field });
  }
}
