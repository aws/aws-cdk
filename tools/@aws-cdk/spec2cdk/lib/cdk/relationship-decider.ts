import type { Property, RelationshipRef, Resource, SpecDatabase } from '@aws-cdk/service-spec-types';
import { RichProperty } from '@aws-cdk/service-spec-types';
import type { Module } from '@cdklabs/typewriter';
import { SelectiveModuleImport, Type } from '@cdklabs/typewriter';
import * as naming from '../naming';
import { CDK_INTERFACES } from './cdk';
import { ResourceReference } from './reference-props';
import { log } from '../util';

/**
 * Represents a cross-service property relationship that enables references
 * between resources from different AWS services.
 */
export interface Relationship {
  /** The TypeScript interface type that provides the reference (e.g. "IRoleRef") */
  readonly refType: Type;
  /** Human friendly name of the reference type for error generation (e.g. "iam.IRoleRef") */
  readonly refTypeDisplayName: string;
  /** The property name on the reference interface that holds the reference object (e.g. "roleRef") */
  readonly refPropStructName: string;
  /** The property to extract from the reference object (e.g. "roleArn") */
  readonly refPropName: string;
}

export interface RelationshipDeciderProps {
  /**
   * Render relationships
   */
  readonly enableRelationships: boolean;

  /**
   * We currently disable the relationship on the properties of types because they would create a backwards incompatible change
   * by broadening the output type as types are used both in input and output. This represents:
   * Relationship counts:
   *   Resource-level (non-nested): 598
   *   Type-level (nested):         483 <- these are disabled by this flag
   *   Total:                       1081
   * Properties with relationships:
   *   Resource-level (non-nested): 493
   *   Type-level (nested):         358
   *   Total:                       851
   */
  readonly enableNestedRelationships: boolean;

  /**
   * The location to import reference interfaces from.
   */
  readonly refsImportLocation: string;
}

/**
 * Extracts resource relationship information from the database for cross-service property references.
 */
export class RelationshipDecider {
  public readonly enableRelationships: boolean;
  public readonly enableNestedRelationships: boolean;
  private readonly refsImportLocation: string;

  constructor(
    readonly resource: Resource,
    private readonly db: SpecDatabase,
    props: RelationshipDeciderProps,
  ) {
    this.enableRelationships = props.enableRelationships;
    this.enableNestedRelationships = props.enableNestedRelationships;
    this.refsImportLocation = props.refsImportLocation;
  }

  /**
   * Retrieves the target resource for a relationship.
   * Returns undefined if the target property cannot be found in the reference
   * properties as a relationship can only target a primary identifier or arn
   */
  private findTargetResource(sourcePropName: string, relationship: RelationshipRef) {
    if (!this.enableRelationships) {
      return undefined;
    }
    const targetResource = this.db.lookup('resource', 'cloudFormationType', 'equals', relationship.cloudFormationType).only();
    const refProps = new ResourceReference(targetResource).referenceProps;
    const expectedPropName = naming.referencePropertyName(relationship.propertyName, targetResource.name);
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

  public parseRelationship(targetModule: Module, sourcePropName: string, relationships?: RelationshipRef[]) {
    const parsedRelationships: Relationship[] = [];
    if (!relationships) {
      return parsedRelationships;
    }
    for (const relationship of relationships) {
      const targetResource = this.findTargetResource(sourcePropName, relationship);
      if (!targetResource) {
        continue;
      }

      // import the ref module
      const refsAlias = naming.interfaceModuleImportName(targetResource);
      const selectiveImport = new SelectiveModuleImport(CDK_INTERFACES, this.refsImportLocation, [
        [naming.submoduleSymbolFromResource(targetResource), refsAlias],
      ]);
      targetModule.addImport(selectiveImport);

      // Ignore the suffix part because it's an edge case that happens only for one module
      const interfaceName = naming.referenceInterfaceName(targetResource.name);
      const referenceType = Type.fromName(targetModule, `${refsAlias}.${interfaceName}`);
      const referenceTypeDisplayName = `${naming.typeAliasPrefixFromResource(targetResource).toLowerCase()}.${interfaceName}`;
      const refPropStructName = naming.referenceInterfaceAttributeName(targetResource.name);

      parsedRelationships.push({
        refType: referenceType,
        refTypeDisplayName: referenceTypeDisplayName,
        refPropStructName: refPropStructName,
        refPropName: naming.referencePropertyName(relationship.propertyName, targetResource.name),
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
    if (!this.enableNestedRelationships) {
      return false;
    }
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
