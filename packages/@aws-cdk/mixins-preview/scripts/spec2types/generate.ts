import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { loadPatchedSpec } from '@aws-cdk/spec2cdk';
import { TypeConverter } from '@aws-cdk/spec2cdk/lib/cdk/type-converter';
import { RelationshipDecider } from '@aws-cdk/spec2cdk/lib/cdk/relationship-decider';
import { CDK_CORE } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import type { SpecDatabase, Resource } from '@aws-cdk/service-spec-types';
import { EnumType, Module, ClassType, Type, TypeScriptRenderer, RichScope } from '@cdklabs/typewriter';

/**
 * Context provided to the mixin builder callback.
 */
export interface MixinBuilderContext {
  /** The module being generated into */
  readonly module: Module;
  /** The mixin class (also the namespace for generated types) */
  readonly mixinClass: ClassType;
  /** The root struct type that was generated */
  readonly rootStruct: Type;
  /** Name of the generated flatten function for the root type */
  readonly flattenFunctionName: string;
  /** The spec resource */
  readonly resource: Resource;
  /** The spec database */
  readonly db: SpecDatabase;
}

export interface TypeGenerationRequest {
  /** CloudFormation resource type, e.g. 'AWS::S3::Bucket' */
  readonly resourceType: string;
  /** TypeDefinition name to generate (plus transitive deps) */
  readonly typeName: string;
  /** Output file path relative to outputPath */
  readonly outputFile: string;
  /** Name for the generated class (also acts as namespace for types) */
  readonly mixinClassName: string;
  /** Additional spec for the mixin class (extends, implements, docs) */
  readonly classSpec?: Record<string, any>;
  /** Build the mixin class body (constructor, supports, applyTo) */
  readonly buildMixin: (ctx: MixinBuilderContext) => void;
}

export interface GenerateTypesOptions {
  readonly outputPath: string;
  readonly requests: TypeGenerationRequest[];
}

export async function generateTypes(options: GenerateTypesOptions) {
  const db = await loadPatchedSpec();
  const renderer = new TypeScriptRenderer();

  for (const req of options.requests) {
    const resource = db.lookup('resource', 'cloudFormationType', 'equals', req.resourceType).only();
    const typeDefs = db.follow('usesType', resource).map(x => x.entity);
    const rootType = typeDefs.find(td => td.name === req.typeName);
    if (!rootType) {
      throw new Error(`TypeDefinition '${req.typeName}' not found for resource '${req.resourceType}'`);
    }

    const module = new Module('@aws-cdk/mixins-preview/generated');
    CDK_CORE.import(module, 'cdk');

    // The class acts as the namespace for generated types
    const mixinClass = new ClassType(module, { export: true, name: req.mixinClassName, ...req.classSpec });

    const relationshipDecider = new RelationshipDecider(resource, db, {
      enableRelationships: true,
      enableNestedRelationships: true,
      refsImportLocation: 'aws-cdk-lib/interfaces',
    });

    const enumCache = new Map<string, Type>();
    const converter = TypeConverter.forSingleType({
      db,
      resource,
      resourceClass: mixinClass,
      relationshipDecider,
      structNamer: (td) => td.name,
      scope: mixinClass,
      enumConverter: (allowedValues) => {
        const key = allowedValues.join(',');
        if (enumCache.has(key)) return enumCache.get(key)!;

        const enumName = deriveEnumName(rootType, allowedValues, db);
        const enumType = new EnumType(mixinClass, {
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

    converter.convertTypeDefinitionType(rootType);

    const rootStruct = new RichScope(mixinClass).tryFindTypeByName(req.typeName);
    if (rootStruct) {
      req.buildMixin({
        module,
        mixinClass,
        rootStruct: rootStruct.type,
        flattenFunctionName: `flatten${req.mixinClassName}${req.typeName}`,
        resource,
        db,
      });
    }

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
