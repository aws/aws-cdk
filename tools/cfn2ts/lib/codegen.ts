import { schema } from '@aws-cdk/cfnspec';
import { CodeMaker } from 'codemaker';
import fs = require('fs-extra');
import path = require('path');
import genspec = require('./genspec');
import { itemTypeNames, PropertyAttributeName, scalarTypeNames, SpecName } from './spec-utils';

const CORE = genspec.CORE_NAMESPACE;
const RESOURCE_BASE_CLASS = `${CORE}.Resource`; // base class for all resources
const CONSTRUCT_CLASS = `${CORE}.Construct`;
const TAG_TYPE = `${CORE}.TagType`;
const TAG_MANAGER = `${CORE}.TagManager`;

interface Dictionary<T> { [key: string]: T; }

/**
 * Emits classes for all resource types
 */
export default class CodeGenerator {
  public readonly outputFile: string;

  private code = new CodeMaker();

  /**
   * Creates the code generator.
   * @param moduleName the name of the module (used to determine the file name).
   * @param spec     CloudFormation resource specification
   */
  constructor(moduleName: string, private readonly spec: schema.Specification) {
    this.outputFile = `${moduleName}.generated.ts`;
    this.code.openFile(this.outputFile);

    const meta = {
      generated: new Date(),
      fingerprint: spec.Fingerprint
    };

    this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
    this.code.line('// Generated from the AWS CloudFormation Resource Specification');
    this.code.line('// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html');
    this.code.line(`// @cfn2ts:meta@ ${JSON.stringify(meta)}`);
    this.code.line();
    this.code.line('// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control');
    this.code.line();
    this.code.line(`import ${CORE} = require('@aws-cdk/cdk');`);
  }

  public async upToDate(outPath: string): Promise<boolean> {
    const fullPath = path.join(outPath, this.outputFile);
    if (!await fs.pathExists(fullPath)) {
      return false;
    }
    const data = await fs.readFile(fullPath, { encoding: 'utf-8' });
    const comment = data.match(/^\s*[/]{2}\s*@cfn2ts:meta@(.+)$/m);
    if (comment) {
      try {
        const meta = JSON.parse(comment[1]);
        if (meta.fingerprint === this.spec.Fingerprint) {
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }

  public emitCode() {
    for (const name of Object.keys(this.spec.ResourceTypes).sort()) {
      const resourceType = this.spec.ResourceTypes[name];

      this.validateRefKindPresence(name, resourceType);

      const cfnName = SpecName.parse(name);
      const resourceName = genspec.CodeName.forCfnResource(cfnName);
      this.code.line();

      this.emitResourceType(resourceName, resourceType);
      this.emitPropertyTypes(name, resourceName);
    }
  }

  /**
   * Saves the generated file.
   */
  public async save(dir: string) {
    this.code.closeFile(this.outputFile);
    return await this.code.save(dir);
  }

  /**
   * Emits classes for all property types
   */
  private emitPropertyTypes(resourceName: string, resourceClass: genspec.CodeName) {
    const prefix = `${resourceName}.`;
    for (const name of Object.keys(this.spec.PropertyTypes).sort()) {
      if (!name.startsWith(prefix)) { continue; }
      const cfnName = PropertyAttributeName.parse(name);
      const propTypeName = genspec.CodeName.forPropertyType(cfnName, resourceClass);
      this.emitPropertyType(resourceClass, propTypeName, this.spec.PropertyTypes[name]);
    }
  }

  private openClass(name: genspec.CodeName, docLink?: string, superClasses?: string, deprecation?: string) {
    const extendsPostfix = superClasses ? ` extends ${superClasses}` : '';
    const before = deprecation ? [ `@deprecated ${deprecation}` ] : [ ];
    this.docLink(docLink, ...before);
    this.code.openBlock(`export class ${name.className}${extendsPostfix}`);
    return name.className;
  }

  private closeClass(_name: genspec.CodeName) {
    this.code.closeBlock();
  }

  private emitPropsType(resourceContext: genspec.CodeName, spec: schema.ResourceType): genspec.CodeName | undefined {
    if (!spec.Properties || Object.keys(spec.Properties).length === 0) { return; }
    const name = genspec.CodeName.forResourceProperties(resourceContext);

    this.docLink(spec.Documentation);
    this.code.openBlock(`export interface ${name.className}`);

    const conversionTable = this.emitPropsTypeProperties(resourceContext, spec.Properties);

    this.code.closeBlock();

    this.code.line();
    this.emitValidator(resourceContext, name, spec.Properties, conversionTable);
    this.code.line();
    this.emitCloudFormationMapper(resourceContext, name, spec.Properties, conversionTable);

    return name;
  }

  /**
   * Emit TypeScript for each of the CloudFormation properties, while renaming
   *
   * Return a mapping of { originalName -> newName }.
   */
  private emitPropsTypeProperties(resource: genspec.CodeName, propertiesSpec: { [name: string]: schema.Property }): Dictionary<string> {
    const propertyMap: Dictionary<string> = {};

    Object.keys(propertiesSpec).sort(propertyComparator).forEach(propName => {
      const propSpec = propertiesSpec[propName];
      const additionalDocs = resource.specName!.relativeName(propName).fqn;
      const newName = this.emitProperty(resource, propName, propSpec, quoteCode(additionalDocs));
      propertyMap[propName] = newName;
    });
    return propertyMap;

    /**
     * A comparator that places required properties before optional properties,
     * and sorts properties alphabetically.
     * @param l the left property name.
     * @param r the right property name.
     */
    function propertyComparator(l: string, r: string): number {
      const lp = propertiesSpec[l];
      const rp = propertiesSpec[r];
      if (lp.Required === rp.Required) {
        return l.localeCompare(r);
      } else if (lp.Required) {
        return -1;
      }
      return 1;
    }
  }

  private emitResourceType(resourceName: genspec.CodeName, spec: schema.ResourceType, deprecated?: genspec.CodeName): void {
    this.beginNamespace(resourceName);

    //
    // Props Bag for this Resource
    //

    const propsType = this.emitPropsType(resourceName, spec);
    if (propsType) {
      this.code.line();
    }

    const deprecation = deprecated &&
      `"cloudformation.${resourceName.fqn}" will be deprecated in a future release ` +
      `in favor of "${deprecated.fqn}" (see https://github.com/awslabs/aws-cdk/issues/878)`;

    this.openClass(resourceName, spec.Documentation, RESOURCE_BASE_CLASS, deprecation);

    //
    // Static inspectors.
    //

    const resourceTypeName = `${JSON.stringify(resourceName.specName!.fqn)}`;
    this.code.line('/**');
    this.code.line(` * The CloudFormation resource type name for this resource class.`);
    this.code.line(' */');
    this.code.line(`public static readonly resourceTypeName = ${resourceTypeName};`);

    if (spec.RequiredTransform) {
      this.code.line('/**');
      this.code.line(' * The ``Transform`` a template must use in order to use this resource');
      this.code.line(' */');
      this.code.line(`public static readonly requiredTransform = ${JSON.stringify(spec.RequiredTransform)};`);
    }

    //
    // Attributes
    //

    const attributes = new Array<genspec.Attribute>();

    if (spec.Attributes) {
      for (const attributeName of Object.keys(spec.Attributes).sort()) {
        const attributeSpec = spec.Attributes![attributeName];

        this.code.line();

        this.docLink(undefined, `@cloudformation_attribute ${attributeName}`);
        const attr = genspec.attributeDefinition(resourceName, attributeName, attributeSpec);

        this.code.line(`public readonly ${attr.propertyName}: ${attr.attributeType};`);

        attributes.push(attr);
      }
    }

    //
    // Ref attribute
    //
    if (spec.RefKind !== schema.SpecialRefKind.None) {
      const refAttribute = genspec.refAttributeDefinition(resourceName, spec.RefKind!);

      // If there's already an attribute with the same name, ref is not needed
      if (!attributes.some(a => a.propertyName === refAttribute.propertyName)) {
        this.code.line(`public readonly ${refAttribute.propertyName}: ${refAttribute.attributeType};`);
        attributes.push(refAttribute);
      }
    }
    // set the TagType to help format tags later
    const tagEnum = tagType(spec);
    if (tagEnum !== `${TAG_TYPE}.NotTaggable`) {
      this.code.line();
      this.code.line('/**');
      this.code.line(' * The ``TagManager`` handles setting, removing and formatting tags');
      this.code.line(' *');
      this.code.line(' * Tags should be managed either passing them as properties during');
      this.code.line(' * initiation or by calling methods on this object. If both techniques are');
      this.code.line(' * used only the tags from the TagManager will be used. ``Tag`` (aspect)');
      this.code.line(' * will use the manager.');
      this.code.line(' */');
      this.code.line(`public readonly tags = new ${TAG_MANAGER}(${tagEnum}, ${resourceTypeName});`);
    }

    //
    // Constructor
    //

    this.code.line();
    this.code.line('/**');
    this.code.line(` * Creates a new ${quoteCode(resourceName.specName!.fqn)}.`);
    this.code.line(' *');
    this.code.line(` * @param scope scope in which this resource is defined`);
    this.code.line(` * @param id    scoped id of the resource`);
    this.code.line(` * @param props resource properties`);
    this.code.line(' */');
    const optionalProps = spec.Properties && !Object.values(spec.Properties).some(p => p.Required);
    const propsArgument = propsType ? `, props${optionalProps ? '?' : ''}: ${propsType.className}` : '';
    this.code.openBlock(`constructor(scope: ${CONSTRUCT_CLASS}, id: string${propsArgument})`);
    this.code.line(`super(scope, id, { type: ${resourceName.className}.resourceTypeName${propsType ? ', properties: props' : ''} });`);
    // verify all required properties
    if (spec.Properties) {
      for (const propName of Object.keys(spec.Properties)) {
        const prop = spec.Properties[propName];
        if (prop.Required) {
          this.code.line(`${CORE}.requireProperty(props, '${genspec.cloudFormationToScriptName(propName)}', this);`);
        }
      }
    }
    if (spec.RequiredTransform) {
      const transformField = `${resourceName.className}.requiredTransform`;
      this.code.line('// If a different transform than the required one is in use, this resource cannot be used');
      this.code.openBlock(`if (this.node.stack.templateOptions.transform && this.node.stack.templateOptions.transform !== ${transformField})`);
      // tslint:disable-next-line:max-line-length
      this.code.line(`throw new Error(\`The \${JSON.stringify(${transformField})} transform is required when using ${resourceName.className}, but the \${JSON.stringify(this.node.stack.templateOptions.transform)} is used.\`);`);
      this.code.closeBlock();
      this.code.line('// Automatically configure the required transform');
      this.code.line(`this.node.stack.templateOptions.transform = ${resourceName.className}.requiredTransform;`);
    }

    // initialize all attribute properties
    for (const at of attributes) {
      if (at.attributeType === 'string') {
        this.code.line(`this.${at.propertyName} = ${at.constructorArguments}.toString();`);
      } else if (at.attributeType === 'string[]') {
        this.code.line(`this.${at.propertyName} = ${at.constructorArguments}.toList();`);
      } else if (at.attributeType === genspec.TOKEN_NAME.fqn) {
        this.code.line(`this.${at.propertyName} = ${at.constructorArguments};`);
      }
    }

    if (deprecated) {
      this.code.line(`this.node.addWarning('DEPRECATION: ${deprecation}');`);
    }

    this.code.closeBlock();

    //
    // propertyOverrides
    //

    if (propsType) {
      this.code.line();
      this.emitCloudFormationPropertiesOverride(propsType);
    }

    this.closeClass(resourceName);

    this.endNamespace(resourceName);
  }

  /**
   * We resolve here.
   *
   * Since resolve() deep-resolves, we only need to do this once.
   */
  private emitCloudFormationPropertiesOverride(propsType: genspec.CodeName) {
    this.code.openBlock(`public get propertyOverrides(): ${propsType.className}`);
    this.code.line(`return this.untypedPropertyOverrides;`);
    this.code.closeBlock();

    this.code.openBlock('protected renderProperties(properties: any): { [key: string]: any } ');
    this.code.line(`return ${genspec.cfnMapperName(propsType).fqn}(this.node.resolve(properties));`);
    this.code.closeBlock();
  }

  /**
   * Emit the function that is going to map the generated TypeScript object back into the schema that CloudFormation expects
   *
   * The generated code looks like this:
   *
   *  function bucketPropsToCloudFormation(properties: any): any {
   *    if (!cdk.canInspect(properties)) return properties;
   *    BucketPropsValidator(properties).assertSuccess();
   *    return {
   *      AccelerateConfiguration: bucketAccelerateConfigurationPropertyToCloudFormation(properties.accelerateConfiguration),
   *      AccessControl: cdk.stringToCloudFormation(properties.accessControl),
   *      AnalyticsConfigurations: cdk.listMapper(bucketAnalyticsConfigurationPropertyToCloudFormation)
   *                                          (properties.analyticsConfigurations),
   *      // ...
   *    };
   *  }
   *
   * Generated as a top-level function outside any namespace so we can hide it from library consumers.
   */
  private emitCloudFormationMapper(resource: genspec.CodeName,
                                   typeName: genspec.CodeName,
                                   propSpecs: { [name: string]: schema.Property },
                                   nameConversionTable: Dictionary<string>) {
    const mapperName = genspec.cfnMapperName(typeName);

    this.code.line('/**');
    this.code.line(` * Renders the AWS CloudFormation properties of an ${quoteCode(typeName.specName!.fqn)} resource`);
    this.code.line(' *');
    this.code.line(` * @param properties the TypeScript properties of a ${quoteCode(typeName.className)}`);
    this.code.line(' *');
    this.code.line(` * @returns the AWS CloudFormation properties of an ${quoteCode(typeName.specName!.fqn)} resource.`);
    this.code.line(' */');

    this.code.openBlock(`function ${mapperName.functionName}(properties: any): any`);

    // It might be that this value is 'null' or 'undefined', and that that's OK. Simply return
    // the falsey value, the upstream struct is in a better position to know whether this is required or not.
    this.code.line(`if (!${CORE}.canInspect(properties)) { return properties; }`);

    // Do a 'type' check first
    const validatorName = genspec.validatorName(typeName);
    this.code.line(`${validatorName.fqn}(properties).assertSuccess();`);

    // Generate the return object
    this.code.line('return {');

    const self = this;
    Object.keys(nameConversionTable).forEach(cfnName => {
      const propName = nameConversionTable[cfnName];
      const propSpec = propSpecs[cfnName];

      const mapperExpression = genspec.typeDispatch(resource, propSpec, {
        visitScalar(type: genspec.CodeName) {
          return mapperNames([type]);
        },
        visitUnionScalar(types: genspec.CodeName[]) {
          return `${CORE}.unionMapper([${validatorNames(types)}], [${mapperNames(types)}])`;
        },
        visitList(itemType: genspec.CodeName) {
          return `${CORE}.listMapper(${mapperNames([itemType])})`;
        },
        visitUnionList(itemTypes: genspec.CodeName[]) {
          return `${CORE}.listMapper(${CORE}.unionMapper([${validatorNames(itemTypes)}], [${mapperNames(itemTypes)}]))`;
        },
        visitMap(itemType: genspec.CodeName) {
          return `${CORE}.hashMapper(${mapperNames([itemType])})`;
        },
        visitUnionMap(itemTypes: genspec.CodeName[]) {
          return `${CORE}.hashMapper(${CORE}.unionMapper([${validatorNames(itemTypes)}], [${mapperNames(itemTypes)}]))`;
        },
        visitListOrScalar(types: genspec.CodeName[], itemTypes: genspec.CodeName[]) {
          const scalarValidator = `${CORE}.unionValidator(${validatorNames(types)})`;
          const listValidator = `${CORE}.listValidator(${CORE}.unionValidator(${validatorNames(itemTypes)}))`;
          const scalarMapper = `${CORE}.unionMapper([${validatorNames(types)}], [${mapperNames(types)}])`;
          const listMapper = `${CORE}.listMapper(${CORE}.unionMapper([${validatorNames(itemTypes)}], [${mapperNames(itemTypes)}]))`;

          return `${CORE}.unionMapper([${scalarValidator}, ${listValidator}], [${scalarMapper}, ${listMapper}])`;
        },
      });

      self.code.line(`  ${cfnName}: ${mapperExpression}(properties.${propName}),`);
    });
    this.code.line('};');
    this.code.closeBlock();
  }

  /**
   * Emit a function that will validate whether the given property bag matches the schema of this complex type
   *
   * Generated as a top-level function outside any namespace so we can hide it from library consumers.
   */
  private emitValidator(resource: genspec.CodeName,
                        typeName: genspec.CodeName,
                        propSpecs: { [name: string]: schema.Property },
                        nameConversionTable: Dictionary<string>) {
    const validatorName = genspec.validatorName(typeName);

    this.code.line('/**');
    this.code.line(` * Determine whether the given properties match those of a ${quoteCode(typeName.className)}`);
    this.code.line(' *');
    this.code.line(` * @param properties the TypeScript properties of a ${quoteCode(typeName.className)}`);
    this.code.line(' *');
    this.code.line(' * @returns the result of the validation.');
    this.code.line(' */');
    this.code.openBlock(`function ${validatorName.functionName}(properties: any): ${CORE}.ValidationResult`);
    this.code.line(`if (!${CORE}.canInspect(properties)) { return ${CORE}.VALIDATION_SUCCESS; }`);

    this.code.line(`const errors = new ${CORE}.ValidationResults();`);

    Object.keys(propSpecs).forEach(cfnPropName => {
      const propSpec = propSpecs[cfnPropName];
      const propName = nameConversionTable[cfnPropName];

      if (propSpec.Required) {
        this.code.line(`errors.collect(${CORE}.propertyValidator('${propName}', ${CORE}.requiredValidator)(properties.${propName}));`);
      }

      const self = this;
      const validatorExpression = genspec.typeDispatch<string>(resource, propSpec, {
        visitScalar(type: genspec.CodeName) {
          return  validatorNames([type]);
        },
        visitUnionScalar(types: genspec.CodeName[]) {
          return `${CORE}.unionValidator(${validatorNames(types)})`;
        },
        visitList(itemType: genspec.CodeName) {
          return `${CORE}.listValidator(${validatorNames([itemType])})`;
        },
        visitUnionList(itemTypes: genspec.CodeName[]) {
          return `${CORE}.listValidator(${CORE}.unionValidator(${validatorNames(itemTypes)}))`;
        },
        visitMap(itemType: genspec.CodeName) {
          return `${CORE}.hashValidator(${validatorNames([itemType])})`;
        },
        visitUnionMap(itemTypes: genspec.CodeName[]) {
          return `${CORE}.hashValidator(${CORE}.unionValidator(${validatorNames(itemTypes)}))`;
        },
        visitListOrScalar(types: genspec.CodeName[], itemTypes: genspec.CodeName[]) {
          const scalarValidator = `${CORE}.unionValidator(${validatorNames(types)})`;
          const listValidator = `${CORE}.listValidator(${CORE}.unionValidator(${validatorNames(itemTypes)}))`;

          return `${CORE}.unionValidator(${scalarValidator}, ${listValidator})`;
        },
      });
      self.code.line(`errors.collect(${CORE}.propertyValidator('${propName}', ${validatorExpression})(properties.${propName}));`);
    });

    this.code.line(`return errors.wrap('supplied properties not correct for "${typeName.className}"');`);

    this.code.closeBlock();
  }

  private emitProperty(context: genspec.CodeName, propName: string, spec: schema.Property, additionalDocs: string): string {
    const question = spec.Required ? '' : '?';
    const javascriptPropertyName = genspec.cloudFormationToScriptName(propName);

    this.docLink(spec.Documentation, additionalDocs);
    this.code.line(`${javascriptPropertyName}${question}: ${this.findNativeType(context, spec)};`);

    return javascriptPropertyName;
  }
  private beginNamespace(type: genspec.CodeName) {
    if (type.namespace) {
      const parts = type.namespace.split('.');
      for (const part of parts) {
        this.code.openBlock(`export namespace ${part}`);
      }
    }
  }

  private endNamespace(type: genspec.CodeName) {
    if (type.namespace) {
      const parts = type.namespace.split('.');
      for (const _ of parts) {
        this.code.closeBlock();
      }
    }
  }

  private emitPropertyType(resourceContext: genspec.CodeName, typeName: genspec.CodeName, propTypeSpec: schema.PropertyType) {
    this.code.line();
    this.beginNamespace(typeName);

    this.docLink(propTypeSpec.Documentation);
    if (!propTypeSpec.Properties || Object.keys(propTypeSpec.Properties).length === 0) {
      this.code.line(`// tslint:disable-next-line:no-empty-interface | A genuine empty-object type`);
    }
    this.code.openBlock(`export interface ${typeName.className}`);
    const conversionTable: Dictionary<string> = {};
    if (propTypeSpec.Properties) {
      Object.keys(propTypeSpec.Properties).forEach(propName => {
        const propSpec = propTypeSpec.Properties[propName];
        const additionalDocs = quoteCode(`${typeName.fqn}.${propName}`);
        const newName = this.emitProperty(resourceContext, propName, propSpec, additionalDocs);
        conversionTable[propName] = newName;
      });
    }

    this.code.closeBlock();
    this.endNamespace(typeName);

    this.code.line();
    this.emitValidator(resourceContext, typeName, propTypeSpec.Properties, conversionTable);
    this.code.line();
    this.emitCloudFormationMapper(resourceContext, typeName, propTypeSpec.Properties, conversionTable);
  }

  /**
   * Return the native type expression for the given propSpec
   */
  private findNativeType(resourceContext: genspec.CodeName, propSpec: schema.Property): string {
    const alternatives: string[] = [];

    if (schema.isCollectionProperty(propSpec)) {
      // render the union of all item types
      const itemTypes = genspec.specTypesToCodeTypes(resourceContext, itemTypeNames(propSpec));
      // Always accept a token in place of any list element
      itemTypes.push(genspec.TOKEN_NAME);

      const union = this.renderTypeUnion(resourceContext, itemTypes);

      if (schema.isMapProperty(propSpec)) {
        alternatives.push(`{ [key: string]: (${union}) }`);
      } else {
        // To make TSLint happy, we have to either emit: SingleType[] or Array<Alt1 | Alt2>

        if (union.indexOf('|') !== -1) {
          alternatives.push(`Array<${union}>`);
        } else {
          alternatives.push(`(${union})[]`);
        }
      }
    }

    // Yes, some types can be both collection and scalar. Looking at you, SAM.
    if (schema.isScalarPropery(propSpec)) {
      // Scalar type
      const typeNames = scalarTypeNames(propSpec);
      const types = genspec.specTypesToCodeTypes(resourceContext, typeNames);
      alternatives.push(this.renderTypeUnion(resourceContext, types));
    }

    // Only if this property is not of a "tokenizable type" (string, string[],
    // number in the future) we add a type union for `cdk.Token`. We rather
    // everything to be tokenizable because there are languages that do not
    // support union types (i.e. Java, .NET), so we lose type safety if we have
    // a union.
    if (!tokenizableType(alternatives)) {
      alternatives.push(genspec.TOKEN_NAME.fqn);
    }

    return alternatives.join(' | ');
  }

  private renderTypeUnion(context: genspec.CodeName, types: genspec.CodeName[]) {
    return types.map((type) => type.relativeTo(context).fqn).join(' | ');
  }

  private docLink(link: string | undefined, ...before: string[]) {
    if (!link && before.length === 0) { return; }
    this.code.line('/**');
    before.forEach(line => this.code.line(` * ${line}`));
    if (link) {
      this.code.line(` * @link ${link}`);
    }
    this.code.line(' */');
    return;
  }

  private validateRefKindPresence(name: string, resourceType: schema.ResourceType): any {
    if (!resourceType.RefKind) { // Both empty string and undefined
      throw new Error(`Resource ${name} does not have a RefKind; please annotate this new resources in @aws-cdk/cfnspec`);
    }
  }
}

/**
 * Return a comma-separated list of validator functions for the given types
 */
function validatorNames(types: genspec.CodeName[]): string {
  return types.map(type => genspec.validatorName(type).fqn).join(', ');
}

/**
 * Return a comma-separated list of mapper functions for the given types
 */
function mapperNames(types: genspec.CodeName[]): string {
  return types.map(type => genspec.cfnMapperName(type).fqn).join(', ');
}

/**
 * Quotes a code name for inclusion in a JSDoc comment, so it will render properly
 * in the Sphinx output.
 *
 * @param code a code name to be quoted.
 *
 * @returns the code name surrounded by double backticks.
 */
function quoteCode(code: string): string {
  return '``' + code + '``';
}

function tokenizableType(alternatives: string[]) {
  if (alternatives.length > 1) {
    return false;
  }

  const type = alternatives[0];
  if (type === 'string') {
    return true;
  }

  if (type === 'string[]') {
    return true;
  }

  // TODO: number

  return false;
}

function tagType(resource: schema.ResourceType): string {
  if (schema.isTaggableResource(resource)) {
    const prop = resource.Properties.Tags;
    if (schema.isTagPropertyStandard(prop)) {
      return `${TAG_TYPE}.Standard`;
    }
    if (schema.isTagPropertyAutoScalingGroup(prop)) {
      return `${TAG_TYPE}.AutoScalingGroup`;
    }
    if (schema.isTagPropertyJson(prop) || schema.isTagPropertyStringMap(prop)) {
      return `${TAG_TYPE}.Map`;
    }
  }
  return `${TAG_TYPE}.NotTaggable`;
}
