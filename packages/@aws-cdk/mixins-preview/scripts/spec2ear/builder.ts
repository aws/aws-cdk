import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { naming } from '@aws-cdk/spec2cdk';
import { CDK_CORE, CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import type { Method } from '@cdklabs/typewriter';
import { Module, ExternalModule, ClassType, Stability, Type, expr, stmt, ThingSymbol, $this, CallableProxy, $T } from '@cdklabs/typewriter';
import { MIXINS_CORE, MIXINS_KMS, type EncryptionProperty, type EncryptionResourceConfig, type EncryptionAtRestData } from './helpers';
import type { ServiceSubmoduleProps, LocatedModule } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import { BaseServiceSubmodule, relativeImportPath } from '@aws-cdk/spec2cdk/lib/cdk/service-submodule';
import type { AddServiceProps, LibraryBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import { LibraryBuilder } from '@aws-cdk/spec2cdk/lib/cdk/library-builder';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Load encryption data at module level
const encryptionDataPath = path.join(__dirname, 'data.json');
const ENCRYPTION_DATA: EncryptionAtRestData = JSON.parse(fs.readFileSync(encryptionDataPath, 'utf-8'));

class EncryptionAtRestServiceModule extends BaseServiceSubmodule {
  public readonly constructLibModule: ExternalModule;

  public constructor(props: ServiceSubmoduleProps) {
    super(props);
    this.constructLibModule = new ExternalModule(`aws-cdk-lib/${props.submoduleName}`);
  }
}

export interface EncryptionAtRestBuilderProps extends LibraryBuilderProps {
}

export class EncryptionAtRestBuilder extends LibraryBuilder<EncryptionAtRestServiceModule> {
  private readonly filePattern: string;

  public constructor(props: EncryptionAtRestBuilderProps) {
    super(props);
    this.filePattern = '%moduleName%/encryption-at-rest-mixins.generated.ts';
  }

  protected createServiceSubmodule(service: Service, submoduleName: string): EncryptionAtRestServiceModule {
    return new EncryptionAtRestServiceModule({
      submoduleName,
      service,
    });
  }

  protected addResourceToSubmodule(submodule: EncryptionAtRestServiceModule, resource: Resource, _props?: AddServiceProps): void {
    const config = ENCRYPTION_DATA[resource.cloudFormationType];
    if (!config) {
      return; // No encryption config for this resource
    }

    // Skip SAM/Serverless resources (no CDK modules)
    if (resource.cloudFormationType.startsWith('AWS::Serverless::') || resource.cloudFormationType.startsWith('AWS::SAM::')) {
      return;
    }

    const serviceRelation = this.db.incoming('hasResource', resource);
    if (!serviceRelation || serviceRelation.length === 0) {
      return;
    }
    const service = serviceRelation.only().entity;
    const earModule = this.obtainEncryptionModule(submodule, service);

    const mixin = new EncryptionAtRestMixin(earModule.module, this.db, resource, submodule.constructLibModule, config);
    submodule.registerResource(`${resource.cloudFormationType}EncryptionAtRest`, mixin);

    mixin.build();
  }

  private obtainEncryptionModule(submodule: EncryptionAtRestServiceModule, service: Service): LocatedModule<Module> {
    const mod = this.createEncryptionModule(submodule, service);
    if (this.modules.has(mod.filePath)) {
      return {
        module: this.modules.get(mod.filePath)!,
        filePath: mod.filePath,
      };
    }

    return this.rememberModule(mod);
  }

  private createEncryptionModule(submodule: EncryptionAtRestServiceModule, service: Service): LocatedModule<Module> {
    const module = new Module(`@aws-cdk/mixins-preview/${submodule.submoduleName}/encryption`);
    const filePath = this.pathFor(this.filePattern, submodule.submoduleName, service);

    submodule.registerModule({ module, filePath });

    CDK_CORE.import(module, 'cdk');
    CONSTRUCTS.import(module, 'constructs');
    MIXINS_CORE.import(module, 'core', { fromLocation: relativeImportPath(filePath, '../core') });
    submodule.constructLibModule.import(module, 'service');

    // Check if any resource in this service needs KMS
    const serviceResources = Object.keys(ENCRYPTION_DATA).filter(cfnType => {
      const match = cfnType.match(/^AWS::(\w+)::/);
      return match && `aws-${match[1].toLowerCase()}` === submodule.submoduleName;
    });
    const needsKms = serviceResources.some(cfnType => {
      const config = ENCRYPTION_DATA[cfnType];
      return config.properties.some(p => p.purpose === 'kms-key-id');
    });
    if (needsKms) {
      MIXINS_KMS.import(module, 'kms');
    }

    return { module, filePath };
  }
}

interface EncryptionTreeNode {
  isArray: boolean;
  children: Map<string, EncryptionTreeNode>;
  values: Array<{ value: string; conditionalOn?: string }>;
}

class EncryptionAtRestMixin extends ClassType {
  private readonly resourceType: Type;
  private readonly kmsKeyProperty?: EncryptionProperty;
  private readonly enableFlagProperty?: EncryptionProperty;
  private readonly encryptionTypeProperty?: EncryptionProperty;

  constructor(
    scope: Module,
    public readonly db: SpecDatabase,
    private readonly resource: Resource,
    constructLibModule: ExternalModule,
    config: EncryptionResourceConfig,
  ) {
    super(scope, {
      export: true,
      name: `${naming.classNameFromResource(resource)}EncryptionAtRestMixin`,
      implements: [MIXINS_CORE.IMixin],
      extends: MIXINS_CORE.Mixin,
      docs: {
        summary: `Encryption at rest mixin for ${resource.cloudFormationType}`,
        remarks: [config.defaultBehavior, config.notes].filter(Boolean).join('\n\n'),
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

    // Find key properties
    this.kmsKeyProperty = config.properties.find(p => p.purpose === 'kms-key-id' && p.type === 'string');
    this.enableFlagProperty = config.properties.find(p => p.purpose === 'enable-flag');
    this.encryptionTypeProperty = config.properties.find(p => p.purpose === 'encryption-type');
  }

  public build() {
    this.makeConstructor();
    const supports = this.makeSupportsMethod();
    this.makeApplyToMethod(supports);
  }

  private makeConstructor() {
    // Determine if KMS key is supported and if it's required
    const supportsKmsKey = !!this.kmsKeyProperty;
    const kmsKeyRequired = this.kmsKeyProperty?.required ?? false;

    const init = this.addInitializer({
      docs: {
        summary: `Create a mixin to enable encryption at rest for \`${this.resource.cloudFormationType}\`.`,
      },
    });

    if (supportsKmsKey) {
      this.addProperty({
        name: 'kmsKey',
        type: MIXINS_KMS.IKey,
        protected: true,
        immutable: true,
        optional: !kmsKeyRequired,
      });

      const kmsKey = init.addParameter({
        name: 'kmsKey',
        type: MIXINS_KMS.IKey,
        optional: !kmsKeyRequired,
        documentation: kmsKeyRequired
          ? 'KMS key for encryption. Required for this resource type.'
          : 'Optional KMS key for customer-managed encryption. If not provided, uses AWS managed key.',
      });

      init.addBody(
        expr.sym(new ThingSymbol('super', this.scope)).call(),
        stmt.assign($this.kmsKey, kmsKey),
      );
    } else {
      init.addBody(
        expr.sym(new ThingSymbol('super', this.scope)).call(),
      );
    }
  }

  private makeSupportsMethod(): Method {
    const method = this.addMethod({
      name: 'supports',
      returnType: Type.ambient(`construct is service.${this.resourceType.symbol}`),
      docs: {
        summary: 'Check if this mixin supports the given construct',
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
        summary: 'Apply encryption at rest configuration to the construct',
      },
    });

    const construct = method.addParameter({
      name: 'construct',
      type: CONSTRUCTS.IConstruct,
    });

    const bodyStatements: any[] = [
      stmt.if_(expr.not(CallableProxy.fromMethod(supports).invoke(construct))).then(stmt.block(stmt.ret())),
    ];

    // Generate property assignments based on the config
    const assignments = this.generatePropertyAssignments();
    bodyStatements.push(...assignments);

    method.addBody(...bodyStatements);
  }

  /**
   * Parse a path segment and determine if it's an array (has [] suffix)
   * Returns { name: string, isArray: boolean }
   */
  private parsePathSegment(segment: string): { name: string; isArray: boolean } {
    const isArray = segment.endsWith('[]');
    const name = isArray ? segment.slice(0, -2) : segment;
    return { name, isArray };
  }

  private generatePropertyAssignments(): any[] {
    const statements: any[] = [];

    // Group properties by their root path to build nested objects properly
    const propertyAssignments: Array<{ path: string; value: string; conditionalOn?: string }> = [];

    // Handle enable flag if present
    if (this.enableFlagProperty) {
      const propPath = this.enableFlagProperty.path || this.enableFlagProperty.name;
      propertyAssignments.push({ path: propPath, value: 'true' });
    }

    // Handle encryption type if present
    if (this.encryptionTypeProperty) {
      const propPath = this.encryptionTypeProperty.path || this.encryptionTypeProperty.name;
      if (this.encryptionTypeProperty.keyTypeValues) {
        const { customerManaged, awsManaged } = this.encryptionTypeProperty.keyTypeValues;
        const cmkExpr = customerManaged !== undefined
          ? (typeof customerManaged === 'boolean' ? String(customerManaged) : `'${customerManaged}'`)
          : undefined;
        const amkExpr = awsManaged !== undefined
          ? (typeof awsManaged === 'boolean' ? String(awsManaged) : `'${awsManaged}'`)
          : undefined;

        if (cmkExpr && amkExpr && this.kmsKeyProperty && !this.kmsKeyProperty.required) {
          // Both values present and KMS key is optional — select based on whether a key was provided
          propertyAssignments.push({ path: propPath, value: `this.kmsKey ? ${cmkExpr} : ${amkExpr}` });
        } else if (cmkExpr) {
          // Only customerManaged present, or KMS key is required — always use customerManaged
          propertyAssignments.push({ path: propPath, value: cmkExpr });
        } else if (amkExpr) {
          // Only awsManaged present — always use awsManaged
          propertyAssignments.push({ path: propPath, value: amkExpr });
        }
      } else if (this.encryptionTypeProperty.type === 'boolean') {
        propertyAssignments.push({ path: propPath, value: 'true' });
      }
    }

    // Handle KMS key if present
    if (this.kmsKeyProperty) {
      const propPath = this.kmsKeyProperty.path || this.kmsKeyProperty.name;
      const kmsKeyRequired = this.kmsKeyProperty.required ?? false;

      if (kmsKeyRequired) {
        propertyAssignments.push({ path: propPath, value: 'this.kmsKey.keyArn' });
      } else {
        // For optional KMS key, wrap in conditional check
        propertyAssignments.push({ path: propPath, value: 'this.kmsKey.keyArn', conditionalOn: 'this.kmsKey' });
      }
    }

    // Generate assignments - group by root property for nested paths
    const rootGroups = new Map<string, { isArray: boolean; assignments: Array<{ path: string; value: string; conditionalOn?: string }> }>();

    for (const assignment of propertyAssignments) {
      const parts = assignment.path.split('.');
      const { name: rootName, isArray: rootIsArray } = this.parsePathSegment(parts[0]);

      if (parts.length === 1) {
        // Direct property assignment
        const propName = naming.propertyNameFromCloudFormation(rootName);
        if (assignment.conditionalOn) {
          statements.push(expr.directCode(`if (${assignment.conditionalOn}) { construct.${propName} = ${assignment.value}; }`));
        } else {
          statements.push(expr.directCode(`construct.${propName} = ${assignment.value}`));
        }
      } else {
        // Nested property - group by root
        if (!rootGroups.has(rootName)) {
          rootGroups.set(rootName, { isArray: rootIsArray, assignments: [] });
        }
        rootGroups.get(rootName)!.assignments.push(assignment);
      }
    }

    // Generate nested object assignments
    for (const [root, { isArray: rootIsArray, assignments }] of rootGroups) {
      const rootPropName = naming.propertyNameFromCloudFormation(root);

      // Build the nested structure using a tree approach to properly merge properties
      const nestedCode = this.buildMergedNestedObject(assignments);

      if (rootIsArray) {
        statements.push(expr.directCode(
          `construct.${rootPropName} = [{ ${nestedCode} }]`,
        ));
      } else {
        statements.push(expr.directCode(
          `construct.${rootPropName} = { ...construct.${rootPropName} as object, ${nestedCode} }`,
        ));
      }
    }

    return statements;
  }

  /**
   * Build a merged nested object from multiple assignments that may share common path prefixes.
   * This properly handles arrays and conditional properties.
   */
  private buildMergedNestedObject(assignments: Array<{ path: string; value: string; conditionalOn?: string }>): string {
    const root: EncryptionTreeNode = { isArray: false, children: new Map(), values: [] };

    // Build the tree from all assignments
    for (const assignment of assignments) {
      const parts = assignment.path.split('.');
      // Skip the root (first part) since we're already grouped by root
      const nestedParts = parts.slice(1);

      let current = root;
      for (let i = 0; i < nestedParts.length; i++) {
        const { name, isArray } = this.parsePathSegment(nestedParts[i]);

        if (!current.children.has(name)) {
          current.children.set(name, { isArray, children: new Map(), values: [] });
        }
        current = current.children.get(name)!;

        // If this is the last part, add the value
        if (i === nestedParts.length - 1) {
          current.values.push({ value: assignment.value, conditionalOn: assignment.conditionalOn });
        }
      }
    }

    // Convert tree to code string
    return this.treeToCode(root);
  }

  private treeToCode(node: EncryptionTreeNode): string {
    const props: string[] = [];

    for (const [name, child] of node.children) {
      const propName = naming.propertyNameFromCloudFormation(name);

      if (child.children.size > 0) {
        // Has nested children
        const nestedCode = this.treeToCode(child);
        if (child.isArray) {
          props.push(`${propName}: [{ ${nestedCode} }]`);
        } else {
          props.push(`${propName}: { ${nestedCode} }`);
        }
      } else {
        // Leaf node with values
        const unconditionalValues = child.values.filter((v: { conditionalOn?: string }) => !v.conditionalOn);
        const conditionalValues = child.values.filter((v: { conditionalOn?: string }) => v.conditionalOn);

        if (unconditionalValues.length > 0 && conditionalValues.length > 0) {
          // Mix of conditional and unconditional - need to merge them
          // For leaf values, the conditional should override the unconditional
          const unconditionalValue = unconditionalValues[0].value;
          const conditionalValue = conditionalValues[0].value;
          const condition = conditionalValues[0].conditionalOn;

          if (child.isArray) {
            props.push(`${propName}: [${condition} ? ${conditionalValue} : ${unconditionalValue}]`);
          } else {
            props.push(`${propName}: ${condition} ? ${conditionalValue} : ${unconditionalValue}`);
          }
        } else if (unconditionalValues.length > 0) {
          const value = unconditionalValues[0].value;
          if (child.isArray) {
            props.push(`${propName}: [${value}]`);
          } else {
            props.push(`${propName}: ${value}`);
          }
        } else if (conditionalValues.length > 0) {
          const { value, conditionalOn } = conditionalValues[0];
          if (child.isArray) {
            props.push(`...(${conditionalOn} && { ${propName}: [${value}] })`);
          } else {
            props.push(`...(${conditionalOn} && { ${propName}: ${value} })`);
          }
        }
      }
    }

    return props.join(', ');
  }
}
