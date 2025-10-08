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
      });
    }
    return parsedRelationships;
  }

  /**
   * Extracts the reference ID from a property's type, for direct refs and array element refs.
   */
  private getRefId(prop: Property) {
    // Need to check for previous types because they are the one being used
    const type = prop.previousTypes?.at(0) ?? prop.type;
    if (type.type === 'ref') {
      return type.reference.$ref;
    } else if (type.type === 'array' && type.element.type === 'ref') {
      return type.element.reference.$ref;
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

    const refId = this.getRefId(prop);
    if (!refId) {
      return false;
    }

    if (visited.has(refId)) {
      return false;
    }
    visited.add(refId);

    const referencedTypeDef = this.db.get('typeDefinition', refId);
    for (const [nestedPropName, nestedProp] of Object.entries(referencedTypeDef.properties)) {
      if (this.needsFlatteningFunction(nestedPropName, nestedProp, visited)) {
        return true;
      }
    }
    return false;
  }
}
