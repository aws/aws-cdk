import { Property, RelationshipRef, Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import { namespaceFromResource, referenceInterfaceName, referenceInterfaceAttributeName, referencePropertyName, typeAliasPrefixFromResource } from '../naming';
import { getReferenceProps } from './reference-props';
import { createModuleDefinitionFromCfnNamespace } from '../cfn2ts/pkglint';
import { log } from '../util';

/**
 * Represents a cross-service property relationship that enables references
 * between resources from different AWS services.
 */
export interface Relationship {
  /** The TypeScript interface type that provides the reference (e.g. "IRoleRef") */
  readonly referenceType: string;
  /** The property name on the reference interface that holds the reference object (e.g. "roleRef") */
  readonly referenceName: string;
  /** The property to extract from the reference object (e.g. "roleArn") */
  readonly propName: string;
}

/**
 * Represents a selective import statement for cross-module type references.
 * Used to import specific types from other CDK modules when relationships
 * are between different modules.
 */
export interface SelectiveImport {
  /** The module name to import from */
  readonly moduleName: string;
  /** Array of types that need to be imported */
  readonly types: {
    /** The original type name in the source module */
    originalType: string;
    /** The aliased name to avoid naming conflicts */
    aliasedType: string;
  }[];
}

/**
 * Extracts resource relationship information from the database for cross-service property references.
 */
export class RelationshipDecider {
  private readonly namespace: string;
  public readonly imports = new Array<SelectiveImport>();

  constructor(readonly resource: Resource, private readonly db: SpecDatabase) {
    this.namespace = namespaceFromResource(resource);
  }

  private registerRequiredImport({ namespace, originalType, aliasedType }: {
    namespace: string;
    originalType: string;
    aliasedType: string;
  }) {
    const moduleName = createModuleDefinitionFromCfnNamespace(namespace).moduleName;
    const moduleImport = this.imports.find(i => i.moduleName === moduleName);
    if (!moduleImport) {
      this.imports.push({
        moduleName,
        types: [{ originalType: originalType, aliasedType: aliasedType }],
      });
    } else {
      if (!moduleImport.types.find(t =>
        t.originalType === originalType && t.aliasedType === aliasedType,
      )) {
        moduleImport.types.push({ originalType: originalType, aliasedType: aliasedType });
      }
    }
  }

  public parseRelationship(sourcePropName: string, relationships?: RelationshipRef[]) {
    const parsedRelationships: Relationship[] = [];
    if (!relationships) {
      return parsedRelationships;
    }
    for (const relationship of relationships) {
      const targetResource = this.db.lookup('resource', 'cloudFormationType', 'equals', relationship.typeName).only();

      // Find the target prop
      const refProps = getReferenceProps(targetResource);
      const expectedPropName = referencePropertyName(relationship.propertyName, targetResource.name);
      const prop = refProps.find(p => p.declaration.name === expectedPropName);
      if (!prop) {
        log.debug(
          'Could not find target prop for relationship:',
          `${this.resource.cloudFormationType} ${sourcePropName}`,
          `=> ${targetResource.cloudFormationType} ${relationship.propertyName}`,
        );
        continue;
      }
      // Ignore the suffix part because it's an edge case that happens only for one module
      const interfaceName = referenceInterfaceName(targetResource.name);
      const originalTypeName = interfaceName;
      const refPropStructName = referenceInterfaceAttributeName(targetResource.name);

      const namespace = namespaceFromResource(targetResource);
      let aliasedTypeName = undefined;
      if (this.namespace !== namespace) {
        // If this is not in our namespace we need to alias the import type
        aliasedTypeName = `${typeAliasPrefixFromResource(targetResource)}${interfaceName}`;
        this.registerRequiredImport({ namespace, originalType: originalTypeName, aliasedType: aliasedTypeName });
      }
      parsedRelationships.push({
        referenceType: aliasedTypeName ?? originalTypeName,
        referenceName: refPropStructName,
        propName: expectedPropName,
      });
    }
    return parsedRelationships;
  }

  /**
   * Checks if a given property needs a flattening function or not
   */
  public needsFlatteningFunction(prop: Property, visited = new Set<string>()): boolean {
    if (prop.relationshipRefs && prop.relationshipRefs.length > 0) {
      return true;
    }
    const type = prop.previousTypes?.at(0) ?? prop.type;
    if (type.type === 'ref' || (type.type === 'array' && type.element.type === 'ref')) {
      let refId: string;
      if (type.type === 'ref') {
        refId = type.reference.$ref;
      } else if (type.type === 'array' && type.element.type === 'ref') {
        refId = type.element.reference.$ref;
      } else {
        return false;
      }

      if (visited.has(refId)) {
        return false;
      }
      visited.add(refId);

      const referencedTypeDef = this.db.get('typeDefinition', refId);

      // Check if any property in the referenced type has relationships
      for (const [propName, nestedProp] of Object.entries(referencedTypeDef.properties)) {
        const relationships = this.parseRelationship(propName, nestedProp.relationshipRefs);
        if (relationships.length > 0) {
          return true;
        }

        if (this.needsFlatteningFunction(nestedProp, visited)) {
          return true;
        }
      }
    }
    return false;
  }
}
