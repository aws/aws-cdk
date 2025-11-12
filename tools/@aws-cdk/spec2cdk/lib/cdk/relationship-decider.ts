import { Property, RelationshipRef, Resource, RichProperty, SpecDatabase } from '@aws-cdk/service-spec-types';
import * as naming from '../naming';
import { namespaceFromResource, referenceInterfaceName, referenceInterfaceAttributeName, referencePropertyName, typeAliasPrefixFromResource } from '../naming';
import { getReferenceProps } from './reference-props';
import { log } from '../util';

// For now we want relationships to be applied only for these services
export const RELATIONSHIP_SERVICES: string[] = [];

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
  /** Human friendly name of the reference type for error generation (e.g. "iam.IRoleRef") */
  readonly typeDisplayName: string;
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
    const moduleName = naming.modulePartsFromNamespace(namespace).moduleName;
    const moduleImport = this.imports.find(i => i.moduleName === moduleName);
    if (!moduleImport) {
      this.imports.push({
        moduleName,
        types: [{ originalType, aliasedType }],
      });
    } else {
      if (!moduleImport.types.find(t =>
        t.originalType === originalType && t.aliasedType === aliasedType,
      )) {
        moduleImport.types.push({ originalType, aliasedType });
      }
    }
  }

  /**
   * Retrieves the target resource for a relationship.
   * Returns undefined if the target property cannot be found in the reference
   * properties as a relationship can only target a primary identifier or arn
   */
  private findTargetResource(sourcePropName: string, relationship: RelationshipRef) {
    if (!RELATIONSHIP_SERVICES.some(s => this.resource.cloudFormationType.toLowerCase().startsWith(`aws::${s}::`))) {
      return undefined;
    }
    const targetResource = this.db.lookup('resource', 'cloudFormationType', 'equals', relationship.cloudFormationType).only();
    const refProps = getReferenceProps(targetResource);
    const expectedPropName = referencePropertyName(relationship.propertyName, targetResource.name);
    const prop = refProps.find(p => p.declaration.name === expectedPropName);
    if (!prop) {
      log.debug(
        'Could not find target prop for relationship:',
        `${this.resource.cloudFormationType} ${sourcePropName}`,
        `=> ${targetResource.cloudFormationType} ${relationship.propertyName}`,
      );
      return undefined;
    }
    return targetResource;
  }

  public parseRelationship(sourcePropName: string, relationships?: RelationshipRef[]) {
    const parsedRelationships: Relationship[] = [];
    if (!relationships) {
      return parsedRelationships;
    }
    for (const relationship of relationships) {
      const targetResource = this.findTargetResource(sourcePropName, relationship);
      if (!targetResource) {
        continue;
      }
      // Ignore the suffix part because it's an edge case that happens only for one module
      const interfaceName = referenceInterfaceName(targetResource.name);
      const refPropStructName = referenceInterfaceAttributeName(targetResource.name);

      const targetNamespace = namespaceFromResource(targetResource);
      let aliasedTypeName = undefined;
      if (this.namespace !== targetNamespace) {
        // If this is not in our namespace we need to alias the import type
        aliasedTypeName = `${typeAliasPrefixFromResource(targetResource)}${interfaceName}`;
        this.registerRequiredImport({ namespace: targetNamespace, originalType: interfaceName, aliasedType: aliasedTypeName });
      }
      parsedRelationships.push({
        referenceType: aliasedTypeName ?? interfaceName,
        referenceName: refPropStructName,
        propName: referencePropertyName(relationship.propertyName, targetResource.name),
        typeDisplayName: `${typeAliasPrefixFromResource(targetResource).toLowerCase()}.${interfaceName}`,
      });
    }
    return parsedRelationships;
  }

  /**
   * Extracts the referenced type from a property's type, for direct refs and array element refs.
   */
  private getReferencedType(prop: Property) {
    // Use the oldest type for backwards compatibility
    const type = new RichProperty(prop).types()[0];
    if (type.type === 'ref') {
      return this.db.get('typeDefinition', type.reference.$ref);
    } else if (type.type === 'array' && type.element.type === 'ref') {
      return this.db.get('typeDefinition', type.element.reference.$ref);
    }
    return undefined;
  }

  private hasValidRelationships(sourcePropName: string, relationships?: RelationshipRef[]): boolean {
    if (!relationships) {
      return false;
    }
    return relationships.some(rel => this.findTargetResource(sourcePropName, rel) !== undefined);
  }

  /**
   * Checks if a given property needs a flattening function or not
   */
  public needsFlatteningFunction(propName: string, prop: Property, visited = new Set<string>()): boolean {
    if (this.hasValidRelationships(propName, prop.relationshipRefs)) {
      return true;
    }

    const referencedTypeDef = this.getReferencedType(prop);
    if (!referencedTypeDef) {
      return false;
    }

    if (visited.has(referencedTypeDef.$id)) {
      return false;
    }
    visited.add(referencedTypeDef.$id);

    for (const [nestedPropName, nestedProp] of Object.entries(referencedTypeDef.properties)) {
      if (this.needsFlatteningFunction(nestedPropName, nestedProp, visited)) {
        return true;
      }
    }
    return false;
  }
}
