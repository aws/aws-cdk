import { schema } from '@aws-cdk/cfnspec';
import { CodeMaker } from 'codemaker';
import * as genspec from './genspec';
import { itemTypeNames, PropertyAttributeName, scalarTypeNames, SpecName } from './spec-utils';
import { upcaseFirst } from './util';

const CORE = genspec.CORE_NAMESPACE;
const CFN_PARSE = genspec.CFN_PARSE_NAMESPACE;
const RESOURCE_BASE_CLASS = `${CORE}.CfnResource`; // base class for all resources
const CONSTRUCT_CLASS = `${CORE}.Construct`;
const TAG_TYPE = `${CORE}.TagType`;
const TAG_MANAGER = `${CORE}.TagManager`;

enum TreeAttributes {
  CFN_TYPE = 'aws:cdk:cloudformation:type',
  CFN_PROPS = 'aws:cdk:cloudformation:props'
}

interface Dictionary<T> { [key: string]: T; }

export interface CodeGeneratorOptions {
  /**
   * How to import the core library.
   *
   * @default '@aws-cdk/core'
   */
  readonly coreImport?: string;
}

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
  constructor(moduleName: string, private readonly spec: schema.Specification, private readonly affix: string, options: CodeGeneratorOptions = {}) {
    this.outputFile = `${moduleName}.generated.ts`;
    this.code.openFile(this.outputFile);
    const coreImport = options.coreImport ?? '@aws-cdk/core';

    const meta = {
      generated: new Date(),
      fingerprint: spec.Fingerprint,
    };

    this.code.line(`// Copyright 2012-${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved.`);
    this.code.line('// Generated from the AWS CloudFormation Resource Specification');
    this.code.line('// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html');
    this.code.line(`// @cfn2ts:meta@ ${JSON.stringify(meta)}`);
    this.code.line();
    this.code.line('// tslint:disable:max-line-length | This is generated code - line lengths are difficult to control');
    this.code.line();
    this.code.line(`import * as ${CORE} from '${coreImport}';`);
    // explicitly import the cfn-parse.ts file from @core, which is not part of the public API of the module
    this.code.line(`import * as ${CFN_PARSE} from '${coreImport}/${coreImport === '.' ? '' : 'lib/'}cfn-parse';`);
  }

  public emitCode(): void {
    for (const name of Object.keys(this.spec.ResourceTypes).sort()) {
      const resourceType = this.spec.ResourceTypes[name];

      const cfnName = SpecName.parse(name);
      const resourceName = genspec.CodeName.forCfnResource(cfnName, this.affix);
      this.code.line();

      this.emitResourceType(resourceName, resourceType);
      this.emitPropertyTypes(name, resourceName);
    }
  }

  /**
   * Saves the generated file.
   */
  public async save(dir: string): Promise<string[]> {
    this.code.closeFile(this.outputFile);
    return await this.code.save(dir);
  }

  /**
   * Emits classes for all property types
   */
  private emitPropertyTypes(resourceName: string, resourceClass: genspec.CodeName): void {
    const prefix = `${resourceName}.`;
    for (const name of Object.keys(this.spec.PropertyTypes).sort()) {
      if (!name.startsWith(prefix)) { continue; }
      const cfnName = PropertyAttributeName.parse(name);
      const propTypeName = genspec.CodeName.forPropertyType(cfnName, resourceClass);
      const type = this.spec.PropertyTypes[name];
      if (schema.isRecordType(type)) {
        this.emitPropertyType(resourceClass, propTypeName, type);
      }
    }
  }

  private openClass(name: genspec.CodeName, superClasses?: string): string {
    const extendsPostfix = superClasses ? ` extends ${superClasses}` : '';
    const implementsPostfix = ` implements ${CORE}.IInspectable`;
    this.code.openBlock(`export class ${name.className}${extendsPostfix}${implementsPostfix}`);
    return name.className;
  }

  private closeClass(_name: genspec.CodeName) {
    this.code.closeBlock();
  }

  private emitPropsType(resourceContext: genspec.CodeName, spec: schema.ResourceType): genspec.CodeName | undefined {
    if (!spec.Properties || Object.keys(spec.Properties).length === 0) { return; }
    const name = genspec.CodeName.forResourceProperties(resourceContext);

    this.docLink(spec.Documentation,
      `Properties for defining a \`${resourceContext.specName!.fqn}\``,
      '',
      '@stability external');
    this.code.openBlock(`export interface ${name.className}`);

    const conversionTable = this.emitPropsTypeProperties(resourceContext, spec.Properties, Container.Interface);

    this.code.closeBlock();

    this.code.line();
    this.emitValidator(resourceContext, name, spec.Properties, conversionTable);
    this.code.line();
    this.emitCloudFormationMapper(resourceContext, name, spec.Properties, conversionTable);
    this.emitFromCfnFactoryFunction(resourceContext, name, spec.Properties, conversionTable, false);

    return name;
  }

  /**
   * Emit TypeScript for each of the CloudFormation properties, while renaming
   *
   * Return a mapping of { originalName -> newName }.
   */
  private emitPropsTypeProperties(
    resource: genspec.CodeName,
    propertiesSpec: { [name: string]: schema.Property },
    container: Container): Dictionary<string> {
    const propertyMap: Dictionary<string> = {};

    Object.keys(propertiesSpec).sort(propertyComparator).forEach(propName => {
      this.code.line();
      const propSpec = propertiesSpec[propName];
      const additionalDocs = resource.specName!.relativeName(propName).fqn;
      const newName = this.emitProperty({
        context: resource,
        propName,
        spec: propSpec,
        additionalDocs: quoteCode(additionalDocs)},
      container,
      );
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

  private emitResourceType(resourceName: genspec.CodeName, spec: schema.ResourceType): void {
    this.beginNamespace(resourceName);

    const cfnName = resourceName.specName!.fqn;

    //
    // Props Bag for this Resource
    //

    const propsType = this.emitPropsType(resourceName, spec);
    if (propsType) {
      this.code.line();
    }

    //
    // The class declaration representing this Resource
    //

    this.docLink(spec.Documentation,
      `A CloudFormation \`${cfnName}\``,
      '',
      `@cloudformationResource ${cfnName}`,
      '@stability external');
    this.openClass(resourceName, RESOURCE_BASE_CLASS);

    //
    // Static inspectors.
    //

    const cfnResourceTypeName = `${JSON.stringify(cfnName)}`;
    this.code.line('/**');
    this.code.line(' * The CloudFormation resource type name for this resource class.');
    this.code.line(' */');
    this.code.line(`public static readonly CFN_RESOURCE_TYPE_NAME = ${cfnResourceTypeName};`);

    if (spec.RequiredTransform) {
      this.code.line('/**');
      this.code.line(' * The `Transform` a template must use in order to use this resource');
      this.code.line(' */');
      this.code.line(`public static readonly REQUIRED_TRANSFORM = ${JSON.stringify(spec.RequiredTransform)};`);
    }

    //
    // The static fromCloudFormation() method,
    // used in the @aws-cdk/cloudformation-include module
    //

    this.code.line();
    this.code.line('/**');
    this.code.line(' * A factory method that creates a new instance of this class from an object');
    this.code.line(' * containing the CloudFormation properties of this resource.');
    this.code.line(' * Used in the @aws-cdk/cloudformation-include module.');
    this.code.line(' *');
    this.code.line(' * @experimental');
    this.code.line(' */');
    this.code.openBlock(`public static fromCloudFormation(scope: ${CONSTRUCT_CLASS}, id: string, resourceAttributes: any, options: ${CORE}.FromCloudFormationOptions): ` +
      `${resourceName.className}`);
    this.code.line('resourceAttributes = resourceAttributes || {};');
    if (propsType) {
      // translate the template properties to CDK objects
      this.code.line(`const resourceProperties = ${CFN_PARSE}.FromCloudFormation.parseValue(resourceAttributes.Properties);`);
      // translate to props, using a (module-private) factory function
      this.code.line(`const props = ${genspec.fromCfnFactoryName(propsType).fqn}(resourceProperties);`);
      // finally, instantiate the resource class
      this.code.line(`const ret = new ${resourceName.className}(scope, id, props);`);
    } else {
      // no props type - we simply instantiate the construct without the third argument
      this.code.line(`const ret = new ${resourceName.className}(scope, id);`);
    }
    // handle all non-property attributes
    // (retention policies, conditions, metadata, etc.)
    this.code.line('const cfnOptions = ret.cfnOptions;');
    this.code.line(`cfnOptions.deletionPolicy = ${CFN_PARSE}.FromCloudFormation.parseDeletionPolicy(resourceAttributes.DeletionPolicy);`);
    this.code.line(`cfnOptions.updateReplacePolicy = ${CFN_PARSE}.FromCloudFormation.parseDeletionPolicy(resourceAttributes.UpdateReplacePolicy);`);
    this.code.line(`cfnOptions.metadata = ${CFN_PARSE}.FromCloudFormation.parseValue(resourceAttributes.Metadata);`);

    // handle DependsOn
    this.code.line('// handle DependsOn');
    // DependsOn can be either a single string, or an array of strings
    this.code.line('resourceAttributes.DependsOn = resourceAttributes.DependsOn ?? [];');
    this.code.line('const dependencies: string[] = Array.isArray(resourceAttributes.DependsOn) ? resourceAttributes.DependsOn : [resourceAttributes.DependsOn];');
    this.code.openBlock('for (const dep of dependencies)');
    this.code.line('const depResource = options.finder.findResource(dep);');
    this.code.openBlock('if (!depResource)');
    this.code.line("throw new Error(`Resource '${id}' depends on '${dep}' that doesn't exist`);");
    this.code.closeBlock();
    this.code.line('ret.node.addDependency(depResource);');
    this.code.closeBlock();

    // ToDo handle:
    // 1. Condition
    // 2. CreationPolicy
    // 3. UpdatePolicy

    this.code.line('return ret;');
    this.code.closeBlock();

    //
    // Attributes
    //

    const attributes = new Array<genspec.Attribute>();

    if (spec.Attributes) {
      for (const attributeName of Object.keys(spec.Attributes).sort()) {
        const attributeSpec = spec.Attributes![attributeName];

        this.code.line();

        this.docLink(undefined, `@cloudformationAttribute ${attributeName}`);
        const attr = genspec.attributeDefinition(attributeName, attributeSpec);

        this.code.line(`public readonly ${attr.propertyName}: ${attr.attributeType};`);

        attributes.push(attr);
      }
    }

    //
    // Set class properties to match CloudFormation Properties spec
    //

    let propMap;
    if (propsType) {
      propMap = this.emitPropsTypeProperties(resourceName, spec.Properties!, Container.Class);
    }

    //
    // Constructor
    //

    this.code.line();
    this.code.line('/**');
    this.code.line(` * Create a new ${quoteCode(resourceName.specName!.fqn)}.`);
    this.code.line(' *');
    this.code.line(' * @param scope - scope in which this resource is defined');
    this.code.line(' * @param id    - scoped id of the resource');
    this.code.line(' * @param props - resource properties');
    this.code.line(' */');
    const optionalProps = spec.Properties && !Object.values(spec.Properties).some(p => p.Required || false);
    const propsArgument = propsType ? `, props: ${propsType.className}${optionalProps ? ' = {}' : ''}` : '';
    this.code.openBlock(`constructor(scope: ${CONSTRUCT_CLASS}, id: string${propsArgument})`);
    this.code.line(`super(scope, id, { type: ${resourceName.className}.CFN_RESOURCE_TYPE_NAME${propsType ? ', properties: props' : ''} });`);
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
      this.code.line('// Automatically add the required transform');
      this.code.line(`this.stack.addTransform(${resourceName.className}.REQUIRED_TRANSFORM);`);
    }

    // initialize all attribute properties
    for (const at of attributes) {
      if (at.attributeType === 'string') {
        this.code.line(`this.${at.propertyName} = ${CORE}.Token.asString(${at.constructorArguments});`);
      } else if (at.attributeType === 'string[]') {
        this.code.line(`this.${at.propertyName} = ${CORE}.Token.asList(${at.constructorArguments});`);
      } else if (at.attributeType === 'number') {
        this.code.line(`this.${at.propertyName} = ${CORE}.Token.asNumber(${at.constructorArguments});`);
      } else if (at.attributeType === genspec.TOKEN_NAME.fqn) {
        this.code.line(`this.${at.propertyName} = ${at.constructorArguments};`);
      }
    }

    // initialize all property class members
    if (propsType && propMap) {
      this.code.line();
      for (const prop of Object.values(propMap)) {
        if (schema.isTagPropertyName(upcaseFirst(prop)) && schema.isTaggableResource(spec)) {
          this.code.line(`this.tags = new ${TAG_MANAGER}(${tagType(spec)}, ${cfnResourceTypeName}, props.${prop}, { tagPropertyName: '${prop}' });`);
        } else {
          this.code.line(`this.${prop} = props.${prop};`);
        }
      }
    }
    this.code.closeBlock();

    this.code.line();
    this.emitTreeAttributes(resourceName);

    // setup render properties
    if (propsType && propMap) {
      this.code.line();
      this.emitCloudFormationProperties(propsType, propMap, schema.isTaggableResource(spec));
    }

    this.closeClass(resourceName);

    this.endNamespace(resourceName);
  }

  /**
   * We resolve here.
   *
   * Since resolve() deep-resolves, we only need to do this once.
   */
  private emitCloudFormationProperties(propsType: genspec.CodeName, propMap: Dictionary<string>, taggable: boolean): void {
    this.code.openBlock('protected get cfnProperties(): { [key: string]: any } ');
    this.code.indent('return {');
    for (const prop of Object.values(propMap)) {
      // handle tag rendering because of special cases
      if (taggable && schema.isTagPropertyName(upcaseFirst(prop))) {
        this.code.line(`${prop}: this.tags.renderTags(),`);
        continue;
      }
      this.code.line(`${prop}: this.${prop},`);
    }
    this.code.unindent('};');
    this.code.closeBlock();
    this.code.openBlock('protected renderProperties(props: {[key: string]: any}): { [key: string]: any } ');
    this.code.line(`return ${genspec.cfnMapperName(propsType).fqn}(props);`);
    this.code.closeBlock();
  }

  /**
   * Emit the function that is going to implement the IInspectable interface.
   *
   * The generated code looks like this:
   * public inspect(inspector: cdk.TreeInspector) {
   *     inspector.addAttribute("aws:cdk:cloudformation:type", CfnManagedPolicy.CFN_RESOURCE_TYPE_NAME);
   *     inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
   * }
   *
   */
  private emitTreeAttributes(resource: genspec.CodeName): void {
    this.code.line('/**');
    this.code.line(' * Examines the CloudFormation resource and discloses attributes.');
    this.code.line(' *');
    this.code.line(' * @param inspector - tree inspector to collect and process attributes');
    this.code.line(' *');
    this.code.line(' * @stability experimental');
    this.code.line(' */');
    this.code.openBlock(`public inspect(inspector: ${CORE}.TreeInspector)`);
    this.code.line(`inspector.addAttribute("${TreeAttributes.CFN_TYPE}", ${resource.className}.CFN_RESOURCE_TYPE_NAME);`);
    this.code.line(`inspector.addAttribute("${TreeAttributes.CFN_PROPS}", this.cfnProperties);`);
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
  private emitCloudFormationMapper(
    resource: genspec.CodeName,
    typeName: genspec.CodeName,
    propSpecs: { [name: string]: schema.Property },
    nameConversionTable: Dictionary<string>) {
    const mapperName = genspec.cfnMapperName(typeName);

    this.code.line('/**');
    this.code.line(` * Renders the AWS CloudFormation properties of an ${quoteCode(typeName.specName!.fqn)} resource`);
    this.code.line(' *');
    this.code.line(` * @param properties - the TypeScript properties of a ${quoteCode(typeName.className)}`);
    this.code.line(' *');
    this.code.line(` * @returns the AWS CloudFormation properties of an ${quoteCode(typeName.specName!.fqn)} resource.`);
    this.code.line(' */');
    this.code.line('// @ts-ignore TS6133');
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

      const mapperExpression = genspec.typeDispatch<string>(resource, propSpec, {
        visitAtom(type: genspec.CodeName) {
          const specType = type.specName && self.spec.PropertyTypes[type.specName.fqn];
          if (specType && !schema.isRecordType(specType)) {
            return genspec.typeDispatch(resource, specType, this);
          }
          return genspec.cfnMapperName(type).fqn;
        },
        visitAtomUnion(types: genspec.CodeName[]) {
          const validators = types.map(type => genspec.validatorName(type).fqn);
          const mappers = types.map(type => this.visitAtom(type));
          return `${CORE}.unionMapper([${validators.join(', ')}], [${mappers.join(', ')}])`;
        },
        visitList(itemType: genspec.CodeName) {
          return `${CORE}.listMapper(${this.visitAtom(itemType)})`;
        },
        visitUnionList(itemTypes: genspec.CodeName[]) {
          const validators = itemTypes.map(type => genspec.validatorName(type).fqn);
          const mappers = itemTypes.map(type => this.visitAtom(type));
          return `${CORE}.listMapper(${CORE}.unionMapper([${validators.join(', ')}], [${mappers.join(', ')}]))`;
        },
        visitMap(itemType: genspec.CodeName) {
          return `${CORE}.hashMapper(${this.visitAtom(itemType)})`;
        },
        visitUnionMap(itemTypes: genspec.CodeName[]) {
          const validators = itemTypes.map(type => genspec.validatorName(type).fqn);
          const mappers = itemTypes.map(type => this.visitAtom(type));
          return `${CORE}.hashMapper(${CORE}.unionMapper([${validators.join(', ')}], [${mappers.join(', ')}]))`;
        },
        visitListOrAtom(types: genspec.CodeName[], itemTypes: genspec.CodeName[]) {
          const validatorNames = types.map(type => genspec.validatorName(type).fqn).join(', ');
          const itemValidatorNames = itemTypes.map(type => genspec.validatorName(type).fqn).join(', ');

          const scalarValidator = `${CORE}.unionValidator(${validatorNames})`;
          const listValidator = `${CORE}.listValidator(${CORE}.unionValidator(${itemValidatorNames}))`;
          const scalarMapper = `${CORE}.unionMapper([${validatorNames}], [${types.map(type => this.visitAtom(type)).join(', ')}])`;
          // tslint:disable-next-line:max-line-length
          const listMapper = `${CORE}.listMapper(${CORE}.unionMapper([${itemValidatorNames}], [${itemTypes.map(type => this.visitAtom(type)).join(', ')}]))`;

          return `${CORE}.unionMapper([${scalarValidator}, ${listValidator}], [${scalarMapper}, ${listMapper}])`;
        },
      });

      self.code.line(`  ${cfnName}: ${mapperExpression}(properties.${propName}),`);
    });
    this.code.line('};');
    this.code.closeBlock();
  }

  /**
   * Generates a function that converts from a pure CloudFormation value taken from a template
   * to an instance of the given CDK struct.
   * This involves changing the casing of the properties,
   * from UpperCamelCase used by CloudFormation,
   * to lowerCamelCase used by the CDK,
   * and also translating things like IResolvable into strings, numbers or string arrays,
   * depending on the type of the L1 property.
   */
  private emitFromCfnFactoryFunction(
    resource: genspec.CodeName,
    typeName: genspec.CodeName,
    propSpecs: { [name: string]: schema.Property },
    nameConversionTable: Dictionary<string>,
    allowReturningIResolvable: boolean) {

    const factoryName = genspec.fromCfnFactoryName(typeName);

    this.code.line();
    // Do not error out if this function is unused.
    // Some types are declared in the CFN schema,
    // but never used as types of properties,
    // and in those cases this function will never be called.
    this.code.line('// @ts-ignore TS6133');
    this.code.openBlock(`function ${factoryName.functionName}(properties: any): ${typeName.fqn}` +
      (allowReturningIResolvable ? ` | ${CORE}.IResolvable` : ''));

    if (allowReturningIResolvable) {
      this.code.openBlock(`if (${CORE}.isResolvableObject(properties))`);
      this.code.line('return properties;');
      this.code.closeBlock();
    }

    this.code.line('properties = properties || {};');
    // Generate the return object
    this.code.indent('return {');
    const self = this;

    // class used for the visitor
    class FromCloudFormationFactoryVisitor implements genspec.PropertyVisitor<string> {
      constructor(
        private readonly baseExpression: string,
        private readonly optionalProperty: boolean,
        private readonly cfnPropName: string,
        private readonly depth: number = 1) {
      }

      public visitAtom(type: genspec.CodeName): string {
        const specType = type.specName && self.spec.PropertyTypes[type.specName.fqn];
        if (specType && !schema.isRecordType(specType)) {
          return genspec.typeDispatch(resource, specType, this);
        } else {
          const optionalPreamble = this.optionalProperty
            ? `${this.baseExpression} == null ? undefined : `
            : '';
          const suffix = schema.isTagPropertyName(this.cfnPropName)
            // Properties that have names considered to denote tags
            // have their type generated without a union with IResolvable.
            // However, we can't possibly know that when generating the factory
            // for that struct, and (in theory, at least)
            // the same type can be used as the value of multiple properties,
            // some of which do not have a tag-compatible name,
            // so there is no way to pass allowReturningIResolvable=false correctly.
            // Do the simple thing in that case, and just cast to any.
            ? ' as any'
            : '';
          return `${optionalPreamble}${genspec.fromCfnFactoryName(type).fqn}(${this.baseExpression})${suffix}`;
        }
      }

      public visitList(itemType: genspec.CodeName): string {
        const arg = `prop${this.depth}`;
        return itemType.className === 'string'
          // an array of strings is a special case,
          // because it might need to be encoded as a Token directly
          // (and not an array of tokens), for example,
          // when a Ref expression references a parameter of type CommaDelimitedList
          ? `${CFN_PARSE}.FromCloudFormation.getStringArray(${this.baseExpression})`
          : `${CFN_PARSE}.FromCloudFormation.getArray(${this.baseExpression}, (${arg}: any) => ` +
            `${this.deeperCopy(arg).visitAtom(itemType)})`;
      }

      public visitMap(itemType: genspec.CodeName): string {
        const arg = `prop${this.depth}`;
        return `${CFN_PARSE}.FromCloudFormation.getMap(${this.baseExpression}, (${arg}: any) => ` +
          `${this.deeperCopy(arg).visitAtom(itemType)})`;
      }

      public visitAtomUnion(_types: genspec.CodeName[]): string {
        return this.baseExpression;
      }

      public visitListOrAtom(_scalarTypes: genspec.CodeName[], _itemTypes: genspec.CodeName[]): any {
        return this.baseExpression;
      }

      public visitUnionList(_itemTypes: genspec.CodeName[]): string {
        return this.baseExpression;
      }

      public visitUnionMap(_itemTypes: genspec.CodeName[]): string {
        return this.baseExpression;
      }

      private deeperCopy(baseExpression: string): FromCloudFormationFactoryVisitor {
        return new FromCloudFormationFactoryVisitor(baseExpression, false, this.cfnPropName, this.depth + 1);
      }
    }

    Object.keys(nameConversionTable).forEach(cfnName => {
      const propName = nameConversionTable[cfnName];
      const propSpec = propSpecs[cfnName];

      const simpleCfnPropAccessExpr = `properties.${cfnName}`;
      const mapperExpression = genspec.typeDispatch<string>(resource, propSpec,
        new FromCloudFormationFactoryVisitor(simpleCfnPropAccessExpr, !propSpec.Required, cfnName));

      self.code.line(`${propName}: ${mapperExpression},`);
    });
    // close the return object brace
    this.code.unindent('};');

    // close the function brace
    this.code.closeBlock();
  }

  /**
   * Emit a function that will validate whether the given property bag matches the schema of this complex type
   *
   * Generated as a top-level function outside any namespace so we can hide it from library consumers.
   */
  private emitValidator(
    resource: genspec.CodeName,
    typeName: genspec.CodeName,
    propSpecs: { [name: string]: schema.Property },
    nameConversionTable: Dictionary<string>): void {
    const validatorName = genspec.validatorName(typeName);

    this.code.line('/**');
    this.code.line(` * Determine whether the given properties match those of a ${quoteCode(typeName.className)}`);
    this.code.line(' *');
    this.code.line(` * @param properties - the TypeScript properties of a ${quoteCode(typeName.className)}`);
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
        visitAtom(type: genspec.CodeName) {
          const specType = type.specName && self.spec.PropertyTypes[type.specName.fqn];
          if (specType && !schema.isRecordType(specType)) {
            return genspec.typeDispatch(resource, specType, this);
          }
          return genspec.validatorName(type).fqn;
        },
        visitAtomUnion(types: genspec.CodeName[]) {
          return `${CORE}.unionValidator(${types.map(type => this.visitAtom(type)).join(', ')})`;
        },
        visitList(itemType: genspec.CodeName) {
          return `${CORE}.listValidator(${this.visitAtom(itemType)})`;
        },
        visitUnionList(itemTypes: genspec.CodeName[]) {
          return `${CORE}.listValidator(${CORE}.unionValidator(${itemTypes.map(type => this.visitAtom(type)).join(', ')}))`;
        },
        visitMap(itemType: genspec.CodeName) {
          return `${CORE}.hashValidator(${this.visitAtom(itemType)})`;
        },
        visitUnionMap(itemTypes: genspec.CodeName[]) {
          return `${CORE}.hashValidator(${CORE}.unionValidator(${itemTypes.map(type => this.visitAtom(type)).join(', ')}))`;
        },
        visitListOrAtom(types: genspec.CodeName[], itemTypes: genspec.CodeName[]) {
          const scalarValidator = `${CORE}.unionValidator(${types.map(type => this.visitAtom(type)).join(', ')})`;
          const listValidator = `${CORE}.listValidator(${CORE}.unionValidator(${itemTypes.map(type => this.visitAtom(type)).join(', ')}))`;

          return `${CORE}.unionValidator(${scalarValidator}, ${listValidator})`;
        },
      });
      self.code.line(`errors.collect(${CORE}.propertyValidator('${propName}', ${validatorExpression})(properties.${propName}));`);
    });

    this.code.line(`return errors.wrap('supplied properties not correct for "${typeName.className}"');`);

    this.code.closeBlock();
  }

  private emitInterfaceProperty(props: EmitPropertyProps): string {
    const javascriptPropertyName = genspec.cloudFormationToScriptName(props.propName);

    this.docLink(props.spec.Documentation, props.additionalDocs);
    const line = `: ${this.findNativeType(props.context, props.spec, props.propName)};`;

    const question = props.spec.Required ? '' : '?';
    this.code.line(`readonly ${javascriptPropertyName}${question}${line}`);
    return javascriptPropertyName;
  }

  private emitClassProperty(props: EmitPropertyProps): string {
    const javascriptPropertyName = genspec.cloudFormationToScriptName(props.propName);

    this.docLink(props.spec.Documentation, props.additionalDocs);
    const question = props.spec.Required ? ';' : ' | undefined;';
    const line = `: ${this.findNativeType(props.context, props.spec, props.propName)}${question}`;
    if (schema.isTagPropertyName(props.propName) && schema.isTagProperty(props.spec)) {
      this.code.line(`public readonly tags: ${TAG_MANAGER};`);
    } else {
      this.code.line(`public ${javascriptPropertyName}${line}`);
    }
    return javascriptPropertyName;
  }

  private emitProperty(props: EmitPropertyProps, container: Container): string {
    switch (container) {
      case Container.Class:
        return this.emitClassProperty(props);
      case Container.Interface:
        return this.emitInterfaceProperty(props);
      default:
        throw new Error(`Unsupported container ${container}`);
    }

  }

  private beginNamespace(type: genspec.CodeName): void {
    if (type.namespace) {
      const parts = type.namespace.split('.');
      for (const part of parts) {
        this.code.openBlock(`export namespace ${part}`);
      }
    }
  }

  private endNamespace(type: genspec.CodeName): void {
    if (type.namespace) {
      const parts = type.namespace.split('.');
      for (const _ of parts) {
        this.code.closeBlock();
      }
    }
  }

  private emitPropertyType(resourceContext: genspec.CodeName, typeName: genspec.CodeName, propTypeSpec: schema.RecordProperty): void {
    this.code.line();
    this.beginNamespace(typeName);

    this.docLink(propTypeSpec.Documentation, '@stability external');
    if (!propTypeSpec.Properties || Object.keys(propTypeSpec.Properties).length === 0) {
      this.code.line('// tslint:disable-next-line:no-empty-interface | A genuine empty-object type');
    }
    this.code.openBlock(`export interface ${typeName.className}`);
    const conversionTable: Dictionary<string> = {};
    if (propTypeSpec.Properties) {
      Object.keys(propTypeSpec.Properties).forEach(propName => {
        const propSpec = propTypeSpec.Properties[propName];
        const additionalDocs = quoteCode(`${typeName.fqn}.${propName}`);
        const newName = this.emitInterfaceProperty({
          context: resourceContext,
          propName,
          spec: propSpec,
          additionalDocs,
        });
        conversionTable[propName] = newName;
      });
    }

    this.code.closeBlock();
    this.endNamespace(typeName);

    this.code.line();
    this.emitValidator(resourceContext, typeName, propTypeSpec.Properties, conversionTable);
    this.code.line();
    this.emitCloudFormationMapper(resourceContext, typeName, propTypeSpec.Properties, conversionTable);
    this.emitFromCfnFactoryFunction(resourceContext, typeName, propTypeSpec.Properties, conversionTable, true);
  }

  /**
   * Return the native type expression for the given propSpec
   */
  private findNativeType(resourceContext: genspec.CodeName, propSpec: schema.Property, propName?: string): string {
    const alternatives: string[] = [];

    // render the union of all item types
    if (schema.isCollectionProperty(propSpec)) {
      // render the union of all item types
      const itemTypes = genspec.specTypesToCodeTypes(resourceContext, itemTypeNames(propSpec));

      // 'tokenizableType' operates at the level of rendered type names in TypeScript, so stringify
      // the objects.
      const renderedTypes = itemTypes.map(t => this.renderCodeName(resourceContext, t));
      if (!tokenizableType(renderedTypes) && !schema.isTagPropertyName(propName)) {
        // Always accept a token in place of any list element (unless the list elements are tokenizable)
        itemTypes.push(genspec.TOKEN_NAME);
      }

      const union = this.renderTypeUnion(resourceContext, itemTypes);

      if (schema.isMapProperty(propSpec)) {
        alternatives.push(`{ [key: string]: (${union}) }`);
      } else {
        // To make TSLint happy, we have to either emit: SingleType[] or Array<Alt1 | Alt2>
        if (union.indexOf('|') !== -1) {
          alternatives.push(`Array<${union}>`);
        } else {
          alternatives.push(`${union}[]`);
        }
      }
    }

    // Yes, some types can be both collection and scalar. Looking at you, SAM.
    if (schema.isScalarProperty(propSpec)) {
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
    if (!tokenizableType(alternatives) && !schema.isTagPropertyName(propName)) {
      alternatives.push(genspec.TOKEN_NAME.fqn);
    }
    return alternatives.join(' | ');
  }

  /**
   * Render a CodeName to a string representation of it in TypeScript
   */
  private renderCodeName(context: genspec.CodeName, type: genspec.CodeName): string {
    const rel = type.relativeTo(context);
    const specType = rel.specName && this.spec.PropertyTypes[rel.specName.fqn];
    if (!specType || schema.isRecordType(specType)) {
      return rel.fqn;
    }
    return this.findNativeType(context, specType);
  }

  private renderTypeUnion(context: genspec.CodeName, types: genspec.CodeName[]): string {
    return types.map(t => this.renderCodeName(context, t)).join(' | ');
  }

  private docLink(link: string | undefined, ...before: string[]): void {
    if (!link && before.length === 0) { return; }
    this.code.line('/**');
    before.forEach(line => this.code.line(` * ${line}`.trimRight()));
    if (link) {
      this.code.line(` * @see ${link}`);
    }
    this.code.line(' */');
    return;
  }
}

/**
 * Quotes a code name for inclusion in a JSDoc comment, so it will render properly
 * in the Markdown output.
 *
 * @param code a code name to be quoted.
 *
 * @returns the code name surrounded by double backticks.
 */
function quoteCode(code: string): string {
  return '`' + code + '`';
}

function tokenizableType(alternatives: string[]): boolean {
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

  if (type === 'number') {
    return true;
  }

  return false;
}

function tagType(resource: schema.TaggableResource): string {
  for (const name of Object.keys(resource.Properties)) {
    if (!schema.isTagPropertyName(name)) {
      continue;
    }
    if (schema.isTagPropertyStandard(resource.Properties[name])) {
      return `${TAG_TYPE}.STANDARD`;
    }
    if (schema.isTagPropertyAutoScalingGroup(resource.Properties[name])) {
      return `${TAG_TYPE}.AUTOSCALING_GROUP`;
    }
    if (schema.isTagPropertyJson(resource.Properties[name]) ||
      schema.isTagPropertyStringMap(resource.Properties[name])) {
      return `${TAG_TYPE}.MAP`;
    }
  }
  return `${TAG_TYPE}.NOT_TAGGABLE`;
}

enum Container {
  Interface = 'INTERFACE',
  Class = 'CLASS',
}

interface EmitPropertyProps {
  context: genspec.CodeName;
  propName: string;
  spec: schema.Property;
  additionalDocs: string;
}
