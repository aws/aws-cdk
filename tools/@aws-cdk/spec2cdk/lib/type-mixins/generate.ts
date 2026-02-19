import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Resource, SpecDatabase, TypeDefinition } from '@aws-cdk/service-spec-types';
import { EnumType, Module, ClassType, Type, TypeScriptRenderer, RichScope } from '@cdklabs/typewriter';
import { CDK_CORE } from '../cdk/cdk';
import { RelationshipDecider } from '../cdk/relationship-decider';
import { TypeConverter } from '../cdk/type-converter';
import { loadPatchedSpec } from '../generate';

/**
 * Options for generating a type-based mixin.
 */
export interface TypeMixinGenerationRequest {
  /** CloudFormation resource type, e.g. 'AWS::S3::Bucket' */
  readonly resourceType: string;
  /** TypeDefinition name to generate (plus transitive deps) */
  readonly typeName: string;
  /** Output file path relative to outputPath */
  readonly outputFile: string;
  /** The TypeMixin class to instantiate and build */
  readonly mixinClass: new (scope: Module, resource: Resource, db: SpecDatabase, rootType: TypeDefinition) => TypeMixin;
}

export interface GenerateTypeMixinsOptions {
  readonly outputPath: string;
  readonly requests: TypeMixinGenerationRequest[];
  /** Module FQN for the generated output, e.g. 'aws-cdk-lib/aws-s3/mixins' */
  readonly moduleFqn?: string;
}

/**
 * Base class for type-based mixins generated from the CloudFormation spec.
 *
 * Subclasses extend ClassType and populate themselves in `build()`,
 * following the same pattern as `L1PropsMixin` and `ResourceClass`.
 */
export abstract class TypeMixin extends ClassType {
  protected readonly rootType: TypeDefinition;
  protected readonly resource: Resource;
  protected readonly db: SpecDatabase;
  protected converter!: TypeConverter;

  constructor(
    scope: Module,
    resource: Resource,
    db: SpecDatabase,
    rootType: TypeDefinition,
    classSpec: ConstructorParameters<typeof ClassType>[1],
  ) {
    super(scope, classSpec);
    this.resource = resource;
    this.db = db;
    this.rootType = rootType;
  }

  /**
   * Initialize the type converter and convert the root type definition.
   * Call this at the start of `build()`.
   */
  protected convertTypes() {
    const relationshipDecider = new RelationshipDecider(this.resource, this.db, {
      enableRelationships: true,
      enableNestedRelationships: true,
      refsImportLocation: 'aws-cdk-lib/interfaces',
    });

    const enumCache = new Map<string, Type>();
    this.converter = TypeConverter.forSingleType({
      db: this.db,
      resource: this.resource,
      resourceClass: this,
      relationshipDecider,
      structNamer: (td) => td.name,
      scope: this,
      enumConverter: (allowedValues) => {
        const key = allowedValues.join(',');
        if (enumCache.has(key)) return enumCache.get(key)!;

        const enumName = deriveEnumName(this.rootType, allowedValues, this.db);
        const enumType = new EnumType(this, {
          export: true,
          name: enumName,
          docs: { summary: `Allowed values for \`${enumName}\`.` },
        });
        for (const value of allowedValues) {
          enumType.addMember({ name: toEnumMemberName(value), value, docs: value });
        }

        const unionType = Type.unionOf(enumType.type, Type.STRING);
        enumCache.set(key, unionType);
        return unionType;
      },
    });

    this.converter.convertTypeDefinitionType(this.rootType);
  }

  /**
   * Find the generated root struct type after `convertTypes()`.
   */
  protected findRootStruct(): Type | undefined {
    return new RichScope(this).tryFindTypeByName(this.rootType.name)?.type;
  }

  /**
   * Build the class body: types, constructor, supports, applyTo.
   */
  public abstract build(): void;
}

/**
 * Generate type-based mixins from the CloudFormation spec.
 */
export async function generateTypeMixins(options: GenerateTypeMixinsOptions) {
  const db = await loadPatchedSpec();
  const renderer = new TypeScriptRenderer();

  for (const req of options.requests) {
    const resource = db.lookup('resource', 'cloudFormationType', 'equals', req.resourceType).only();
    const typeDefs = db.follow('usesType', resource).map(x => x.entity);
    const rootType = typeDefs.find(td => td.name === req.typeName);
    if (!rootType) {
      throw new Error(`TypeDefinition '${req.typeName}' not found for resource '${req.resourceType}'`);
    }

    const moduleFqn = options.moduleFqn ?? 'aws-cdk-lib/generated';
    const module = new Module(moduleFqn);
    CDK_CORE.import(module, 'cdk');

    const mixin = new req.mixinClass(module, resource, db, rootType);
    mixin.build();

    const output = renderer.render(module);
    const filePath = path.join(options.outputPath, req.outputFile);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, output);
  }
}

function deriveEnumName(rootType: any, allowedValues: string[], db: any): string {
  const visited = new Set<string>();
  return findPropName(rootType, allowedValues, visited, db) ?? 'AllowedValues';
}

function findPropName(td: any, allowedValues: string[], visited: Set<string>, db: any): string | undefined {
  if (visited.has(td.name)) return undefined;
  visited.add(td.name);
  for (const [propName, prop] of Object.entries(td.properties) as any) {
    if (matchAllowedValues(prop.type, allowedValues)) return propName;
    if (prop.type.type === 'ref') {
      const found = findPropName(db.get('typeDefinition', prop.type.reference.$ref), allowedValues, visited, db);
      if (found) return found;
    }
  }
  return undefined;
}

function matchAllowedValues(type: any, allowedValues: string[]): boolean {
  if (type.type === 'string' && type.allowedValues) return type.allowedValues.join(',') === allowedValues.join(',');
  if (type.type === 'array') return matchAllowedValues(type.element, allowedValues);
  return false;
}

function toEnumMemberName(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '_').replace(/^(\d)/, '_$1').toUpperCase();
}
