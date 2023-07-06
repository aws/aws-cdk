import { Resource, ResourceAugmentation, ResourceMetric, SpecDatabase } from '@aws-cdk/service-spec-types';
import {
  $E,
  ClassType,
  expr,
  InterfaceType,
  Module,
  MonkeyPatchedType,
  Splat,
  MemberType,
  stmt,
  Type,
} from '@cdklabs/typewriter';
import { CDK_CLOUDWATCH, CONSTRUCTS } from './cdk';
import { ResourceClass } from './resource-class';

/**
 * Generate augmentation methods for the given types
 *
 * Augmentation consists of two parts:
 *
 * - Adding method declarations to an interface (IBucket)
 * - Adding implementations for those methods to the base class (BucketBase)
 *
 * The augmentation file must be imported in `index.ts`.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * import <Class>Base from './<class>-base';
 *
 * declare module './<class>-base' {
 *   interface <IClass> {
 *     method(...): Type;
 *   }
 *   interface <ClassBase> {
 *     method(...): Type;
 *   }
 * }
 *
 * <ClassBase>.prototype.<method> = // ...impl...
 * ```
 *
 * This code may not have been factored the best in terms of how it should
 * be modeled in typewriter.
 */
export class AugmentationsModule extends Module {
  private _hasAugmentations: boolean = false;

  /**
   * Modules that contain classes that are normally handwritten
   */
  public readonly supportModules = new Array<Module>();

  constructor(private readonly db: SpecDatabase, serviceName: string, cloudWatchModuleImport?: string) {
    super(`${serviceName}.augmentations`);

    this.documentation.push(
      `Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`,
    );

    CDK_CLOUDWATCH.import(this, 'cw', {
      fromLocation: cloudWatchModuleImport,
    });
  }

  public get hasAugmentations() {
    return this._hasAugmentations;
  }

  public augmentResource(resource: Resource, resourceClass: ResourceClass) {
    for (const { entity: aug } of this.db.follow('isAugmented', resource)) {
      if (aug.metrics) {
        this._hasAugmentations = true;
        new ResourceGenerator(resource, resourceClass, aug, this.supportModules).emit(this);
      }
    }
  }
}

class ResourceGenerator {
  private readonly interfaceFile: string;
  private readonly classFile: string;
  private readonly interfaceName: string;
  private readonly className: string;

  constructor(
    private readonly resource: Resource,
    resourceClass: ResourceClass,
    private readonly aug: ResourceAugmentation,
    private readonly supportModules: Module[],
  ) {
    const l2ClassName = resourceClass.name.replace(/^Cfn/, '');
    const l2KebabName = l2ClassName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    this.classFile = `./${aug.baseClassFile ?? `${l2KebabName}-base`}`;
    this.className = aug.baseClass ?? `${l2ClassName}Base`;
    this.interfaceFile = aug.interfaceFile ? `./${aug.interfaceFile}` : this.classFile;
    this.interfaceName = aug.interface ?? `I${l2ClassName}`;
  }

  public emit(into: Module) {
    const interfaceModule = new Module(this.interfaceFile);
    const classModule = this.classFile === this.interfaceFile ? interfaceModule : new Module(this.classFile);
    this.supportModules.push(...new Set([interfaceModule, classModule]));

    classModule.importSelective(into, [this.className]);

    const externalInterfaceType = new InterfaceType(interfaceModule, { name: this.interfaceName, export: true });
    const externalClassType = this.generateClassType(classModule);

    this.emitPatches(into, externalInterfaceType);
    this.emitPatches(into, externalClassType);
  }

  /**
   * Generate a ClassType representing the L2 class that we're augmenting
   *
   * We didn't need this class at all, in principle, but if we want to be able to
   * generate the code and compile it independent of the human-written code we're
   * going to integrate it into later, we need a representation of this class with
   * the right attributes so that the compiler can do some sensible type checking.
   *
   * This class will only be written to disk if that is explicitly requested during
   * code generation.
   */
  private generateClassType(classModule: Module) {
    CONSTRUCTS.importSelective(classModule, ['Construct']);

    const type = new ClassType(classModule, {
      name: this.className,
      export: true,
      extends: CONSTRUCTS.Construct,
    });
    for (const attrName of Object.values(this.aug.metrics?.dimensions ?? {})) {
      type.addProperty({
        name: attrName,
        type: Type.STRING,
        immutable: true,
        initializer: expr.lit('dummy'),
      });
    }

    return type;
  }

  /**
   * Emit the interface declarations of our mixins
   *
   * The declarations will be emitted as an interface, and TypeScript will
   * combine them with existing declarations, of either an interface or class type.
   */
  private emitPatches(into: Module, targetType: MemberType) {
    const iface = new MonkeyPatchedType(into, targetType);
    this.emitGenericMethod(iface);

    for (const metric of this.aug.metrics?.metrics ?? []) {
      this.emitSpecificMethod(iface, metric);
    }
  }

  private emitGenericMethod(type: MemberType): void {
    const meth = type.addMethod({
      name: 'metric',
      docs: {
        summary: `Return the given named metric for this ${this.resource.name}`,
      },
      returnType: CDK_CLOUDWATCH.Metric,
    });

    const metricName = meth.addParameter({ name: 'metricName', type: Type.STRING });
    const props = meth.addParameter({ name: 'props', type: CDK_CLOUDWATCH.MetricOptions, optional: true });

    const $this = $E(expr.this_());

    meth.addBody(
      stmt.ret(
        new CDK_CLOUDWATCH.Metric(
          expr.object(
            {
              namespace: expr.lit(this.aug.metrics?.namespace),
              metricName,
              dimensionsMap: expr.object(
                Object.entries(this.aug.metrics?.dimensions ?? {}).map(
                  ([name, attrName]) => [name, $this[attrName]] as const,
                ),
              ),
            },
            new Splat(props),
          ),
        ).attachTo($this),
      ),
    );
  }

  private emitSpecificMethod(iface: MemberType, metric: ResourceMetric) {
    const meth = iface.addMethod({
      name: metricFunctionName(metric),
      docs: {
        summary: metric.documentation,
        remarks: `${metricStatistic(metric)} over 5 minutes`,
      },
      returnType: CDK_CLOUDWATCH.Metric,
    });

    const props = meth.addParameter({
      name: 'props',
      type: CDK_CLOUDWATCH.MetricOptions,
      optional: true,
    });

    const $this = $E(expr.this_());
    meth.addBody(
      stmt.ret(
        $this.metric(
          expr.lit(metric.name),
          expr.object(
            {
              statistic: expr.lit(metricStatistic(metric)),
            },
            new Splat(props),
          ),
        ),
      ),
    );
  }
}

function metricFunctionName(metric: ResourceMetric): string {
  return `metric${metric.name.replace(/[^a-zA-Z0-9]/g, '')}`;
}

function metricStatistic(metric: ResourceMetric): string {
  switch (metric.type) {
    case 'attrib':
    case undefined:
      return 'Average';

    case 'count':
      return 'Sum';

    case 'gauge':
      return 'Maximum';
  }
}
