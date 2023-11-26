"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker_1 = require("codemaker");
const genspec = require("./genspec");
const spec_utils_1 = require("./spec-utils");
const util_1 = require("./util");
const CONSTRUCTS = genspec.CONSTRUCTS_NAMESPACE;
const CORE = genspec.CORE_NAMESPACE;
const CFN_PARSE = genspec.CFN_PARSE_NAMESPACE;
const RESOURCE_BASE_CLASS = `${CORE}.CfnResource`; // base class for all resources
const CONSTRUCT_CLASS = `${CONSTRUCTS}.Construct`;
const TAG_TYPE = `${CORE}.TagType`;
const TAG_MANAGER = `${CORE}.TagManager`;
var TreeAttributes;
(function (TreeAttributes) {
    TreeAttributes["CFN_TYPE"] = "aws:cdk:cloudformation:type";
    TreeAttributes["CFN_PROPS"] = "aws:cdk:cloudformation:props";
})(TreeAttributes || (TreeAttributes = {}));
/**
 * Emits classes for all resource types
 */
class CodeGenerator {
    /**
     * Creates the code generator.
     * @param moduleName the name of the module (used to determine the file name).
     * @param spec     CloudFormation resource specification
     */
    constructor(moduleName, spec, affix, options = {}) {
        this.spec = spec;
        this.affix = affix;
        this.resources = {};
        this.code = new codemaker_1.CodeMaker();
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
        this.code.line('/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control');
        this.code.line();
        this.code.line(`import * as ${CONSTRUCTS} from 'constructs';`);
        this.code.line(`import * as ${CORE} from '${coreImport}';`);
        // import cfn-parse from an embedded folder inside @core, since it is not part of the public API of the module
        this.code.line(`import * as ${CFN_PARSE} from '${coreImport}/${coreImport === '.' ? '' : 'lib/'}helpers-internal';`);
    }
    emitCode() {
        for (const name of Object.keys(this.spec.ResourceTypes).sort()) {
            const resourceType = this.spec.ResourceTypes[name];
            const cfnName = spec_utils_1.SpecName.parse(name);
            const resourceName = genspec.CodeName.forCfnResource(cfnName, this.affix);
            this.code.line();
            this.resources[resourceName.specName.fqn] = resourceName.className;
            this.emitResourceType(resourceName, resourceType);
            this.emitPropertyTypes(name, resourceName);
        }
    }
    /**
     * Saves the generated file.
     */
    async save(dir) {
        this.code.closeFile(this.outputFile);
        return this.code.save(dir);
    }
    /**
     * Emits classes for all property types
     */
    emitPropertyTypes(resourceName, resourceClass) {
        const prefix = `${resourceName}.`;
        for (const name of Object.keys(this.spec.PropertyTypes).sort()) {
            if (!name.startsWith(prefix)) {
                continue;
            }
            const cfnName = spec_utils_1.PropertyAttributeName.parse(name);
            const propTypeName = genspec.CodeName.forPropertyType(cfnName, resourceClass);
            const type = this.spec.PropertyTypes[name];
            if (cfnspec_1.schema.isRecordType(type)) {
                this.emitPropertyType(resourceClass, propTypeName, type);
            }
        }
    }
    openClass(name, superClasses) {
        const extendsPostfix = superClasses ? ` extends ${superClasses}` : '';
        const implementsPostfix = ` implements ${CORE}.IInspectable`;
        this.code.openBlock(`export class ${name.className}${extendsPostfix}${implementsPostfix}`);
        return name.className;
    }
    closeClass(_name) {
        this.code.closeBlock();
    }
    emitPropsType(resourceContext, spec) {
        if (!spec.Properties || Object.keys(spec.Properties).length === 0) {
            return;
        }
        const name = genspec.CodeName.forResourceProperties(resourceContext);
        this.docLink(spec.Documentation, `Properties for defining a \`${resourceContext.className}\``, '', '@struct', // Make this interface ALWAYS be treated as a struct, event if it's named `IPSet...` or something...
        '@stability external');
        this.code.openBlock(`export interface ${name.className}`);
        const conversionTable = this.emitPropsTypeProperties(resourceContext, spec.Properties, Container.Interface);
        this.code.closeBlock();
        this.code.line();
        this.emitPropertiesValidator(resourceContext, name, spec.Properties, conversionTable);
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
    emitPropsTypeProperties(resource, propertiesSpec, container) {
        const propertyMap = {};
        const docs = (0, cfnspec_1.typeDocs)(resource.specName?.fqn ?? '');
        Object.keys(propertiesSpec).sort(propertyComparator).forEach(propName => {
            this.code.line();
            const propSpec = propertiesSpec[propName];
            const additionalDocs = docs.properties[propName] || quoteCode(resource.specName.relativeName(propName).fqn);
            const newName = this.emitProperty({
                context: resource,
                propName,
                spec: propSpec,
                additionalDocs,
            }, container);
            propertyMap[propName] = newName;
        });
        return propertyMap;
        /**
         * A comparator that places required properties before optional properties,
         * and sorts properties alphabetically.
         * @param l the left property name.
         * @param r the right property name.
         */
        function propertyComparator(l, r) {
            const lp = propertiesSpec[l];
            const rp = propertiesSpec[r];
            if (lp.Required === rp.Required) {
                return l.localeCompare(r);
            }
            else if (lp.Required) {
                return -1;
            }
            return 1;
        }
    }
    emitResourceType(resourceName, spec) {
        this.beginNamespace(resourceName);
        const cfnName = resourceName.specName.fqn;
        //
        // Props Bag for this Resource
        //
        const propsType = this.emitPropsType(resourceName, spec);
        if (propsType) {
            this.code.line();
        }
        const docs = (0, cfnspec_1.typeDocs)(cfnName);
        //
        // The class declaration representing this Resource
        //
        this.docLink(spec.Documentation, ...[
            `A CloudFormation \`${cfnName}\``,
            '',
            ...docs.description.split('\n'),
            '',
            `@cloudformationResource ${cfnName}`,
            '@stability external',
        ]);
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
        this.code.line(' * @internal');
        this.code.line(' */');
        // eslint-disable-next-line max-len
        this.code.openBlock(`public static _fromCloudFormation(scope: ${CONSTRUCT_CLASS}, id: string, resourceAttributes: any, options: ${CFN_PARSE}.FromCloudFormationOptions): ` +
            `${resourceName.className}`);
        this.code.line('resourceAttributes = resourceAttributes || {};');
        if (propsType) {
            // translate the template properties to CDK objects
            this.code.line('const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);');
            // translate to props, using a (module-private) factory function
            this.code.line(`const propsResult = ${genspec.fromCfnFactoryName(propsType).fqn}(resourceProperties);`);
            // finally, instantiate the resource class
            this.code.line(`const ret = new ${resourceName.className}(scope, id, propsResult.value);`);
            // save all keys from extraProperties in the resource using property overrides
            this.code.openBlock('for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) ');
            this.code.line('ret.addPropertyOverride(propKey, propVal);');
            this.code.closeBlock();
        }
        else {
            // no props type - we simply instantiate the construct without the third argument
            this.code.line(`const ret = new ${resourceName.className}(scope, id);`);
        }
        // handle all non-property attributes
        // (retention policies, conditions, metadata, etc.)
        this.code.line('options.parser.handleAttributes(ret, resourceAttributes, id);');
        this.code.line('return ret;');
        this.code.closeBlock();
        //
        // Attributes
        //
        const attributes = new Array();
        if (spec.Attributes) {
            for (const attributeName of Object.keys(spec.Attributes).sort()) {
                const attributeSpec = spec.Attributes[attributeName];
                this.code.line();
                this.docLink(undefined, docs.attributes?.[attributeName] ?? '', `@cloudformationAttribute ${attributeName}`);
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
            propMap = this.emitPropsTypeProperties(resourceName, spec.Properties, Container.Class);
        }
        //
        // Constructor
        //
        this.code.line();
        this.code.line('/**');
        this.code.line(` * Create a new ${quoteCode(resourceName.specName.fqn)}.`);
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
            }
            else if (at.attributeType === 'string[]') {
                this.code.line(`this.${at.propertyName} = ${CORE}.Token.asList(${at.constructorArguments});`);
            }
            else if (at.attributeType === 'number') {
                this.code.line(`this.${at.propertyName} = ${CORE}.Token.asNumber(${at.constructorArguments});`);
            }
            else if (at.attributeType === genspec.TOKEN_NAME.fqn) {
                this.code.line(`this.${at.propertyName} = ${at.constructorArguments};`);
            }
        }
        // initialize all property class members
        if (propsType && propMap) {
            this.code.line();
            for (const prop of Object.values(propMap)) {
                if (cfnspec_1.schema.isTagPropertyName((0, util_1.upcaseFirst)(prop)) && cfnspec_1.schema.isTaggableResource(spec)) {
                    this.code.line(`this.tags = new ${TAG_MANAGER}(${tagType(spec)}, ${cfnResourceTypeName}, props.${prop}, { tagPropertyName: '${prop}' });`);
                }
                else {
                    this.code.line(`this.${prop} = props.${prop};`);
                }
            }
        }
        //
        //  Validator
        //
        this.emitConstructValidator(resourceName);
        // End constructor
        this.code.closeBlock();
        this.code.line();
        this.emitTreeAttributes(resourceName);
        // setup render properties
        if (propsType && propMap) {
            this.code.line();
            this.emitCloudFormationProperties(propsType, propMap, cfnspec_1.schema.isTaggableResource(spec));
        }
        this.closeClass(resourceName);
        this.endNamespace(resourceName);
    }
    /**
     * We resolve here.
     *
     * Since resolve() deep-resolves, we only need to do this once.
     */
    emitCloudFormationProperties(propsType, propMap, taggable) {
        this.code.openBlock('protected override get cfnProperties(): { [key: string]: any } ');
        this.code.indent('return {');
        for (const prop of Object.values(propMap)) {
            // handle tag rendering because of special cases
            if (taggable && cfnspec_1.schema.isTagPropertyName((0, util_1.upcaseFirst)(prop))) {
                this.code.line(`${prop}: this.tags.renderTags(),`);
                continue;
            }
            this.code.line(`${prop}: this.${prop},`);
        }
        this.code.unindent('};');
        this.code.closeBlock();
        this.code.line();
        this.code.openBlock('protected override renderProperties(props: {[key: string]: any}): { [key: string]: any } ');
        this.code.line(`return ${genspec.cfnMapperName(propsType).fqn}(props);`);
        this.code.closeBlock();
    }
    /**
     * Add validations for the given construct
     *
     * The generated code looks like this:
     *
     * ```
     * this.node.addValidation({ validate: () => /* validation code * / });
     * }
     * ```
     */
    emitConstructValidator(resourceType) {
        const cfnLint = (0, cfnspec_1.cfnLintAnnotations)(resourceType.specName?.fqn ?? '');
        if (cfnLint.stateful) {
            // Do a statefulness check. A deletionPolicy is required (and in normal operation an UpdateReplacePolicy
            // would also be set if a user doesn't do complicated shenanigans, in which case they probably know what
            // they're doing.
            //
            // Only do this for L1s embedded in L2s (to force L2 authors to add a way to set this policy). If we did it for all L1s:
            //
            // - users working at the L1 level would start getting synthesis failures when we add this feature
            // - the `cloudformation-include` library that loads CFN templates to L1s would start failing when it loads
            //   templates that don't have DeletionPolicy set.
            this.code.openBlock(`if (this.node.scope && ${CORE}.Resource.isResource(this.node.scope))`);
            this.code.line('this.node.addValidation({ validate: () => this.cfnOptions.deletionPolicy === undefined');
            this.code.line(`  ? [\'\\\'${resourceType.specName?.fqn}\\\' is a stateful resource type, and you must specify a Removal Policy for it. Call \\\'resource.applyRemovalPolicy()\\\'.\']`);
            this.code.line('  : [] });');
            this.code.closeBlock();
        }
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
    emitTreeAttributes(resource) {
        this.code.line('/**');
        this.code.line(' * Examines the CloudFormation resource and discloses attributes.');
        this.code.line(' *');
        this.code.line(' * @param inspector - tree inspector to collect and process attributes');
        this.code.line(' *');
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
    emitCloudFormationMapper(resource, typeName, propSpecs, nameConversionTable) {
        const mapperName = genspec.cfnMapperName(typeName);
        this.code.line('/**');
        this.code.line(` * Renders the AWS CloudFormation properties of an ${quoteCode(typeName.specName.fqn)} resource`);
        this.code.line(' *');
        this.code.line(` * @param properties - the TypeScript properties of a ${quoteCode(typeName.className)}`);
        this.code.line(' *');
        this.code.line(` * @returns the AWS CloudFormation properties of an ${quoteCode(typeName.specName.fqn)} resource.`);
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
        this.code.indent('return {');
        const self = this;
        Object.keys(nameConversionTable).forEach(cfnName => {
            const propName = nameConversionTable[cfnName];
            const propSpec = propSpecs[cfnName];
            const mapperExpression = genspec.typeDispatch(resource, propSpec, {
                visitAtom(type) {
                    const specType = type.specName && self.spec.PropertyTypes[type.specName.fqn];
                    if (specType && !cfnspec_1.schema.isRecordType(specType)) {
                        return genspec.typeDispatch(resource, specType, this);
                    }
                    return genspec.cfnMapperName(type).fqn;
                },
                visitAtomUnion(types) {
                    const validators = types.map(type => genspec.validatorName(type).fqn);
                    const mappers = types.map(type => this.visitAtom(type));
                    return `${CORE}.unionMapper([${validators.join(', ')}], [${mappers.join(', ')}])`;
                },
                visitList(itemType) {
                    return `${CORE}.listMapper(${this.visitAtom(itemType)})`;
                },
                visitUnionList(itemTypes) {
                    const validators = itemTypes.map(type => genspec.validatorName(type).fqn);
                    const mappers = itemTypes.map(type => this.visitAtom(type));
                    return `${CORE}.listMapper(${CORE}.unionMapper([${validators.join(', ')}], [${mappers.join(', ')}]))`;
                },
                visitMap(itemType) {
                    return `${CORE}.hashMapper(${this.visitAtom(itemType)})`;
                },
                visitMapOfLists(itemType) {
                    return `${CORE}.hashMapper(${CORE}.listMapper(${this.visitAtom(itemType)}))`;
                },
                visitUnionMap(itemTypes) {
                    const validators = itemTypes.map(type => genspec.validatorName(type).fqn);
                    const mappers = itemTypes.map(type => this.visitAtom(type));
                    return `${CORE}.hashMapper(${CORE}.unionMapper([${validators.join(', ')}], [${mappers.join(', ')}]))`;
                },
                visitListOrAtom(types, itemTypes) {
                    const validatorNames = types.map(type => genspec.validatorName(type).fqn).join(', ');
                    const itemValidatorNames = itemTypes.map(type => genspec.validatorName(type).fqn).join(', ');
                    const scalarValidator = `${CORE}.unionValidator(${validatorNames})`;
                    const listValidator = `${CORE}.listValidator(${CORE}.unionValidator(${itemValidatorNames}))`;
                    const scalarMapper = `${CORE}.unionMapper([${validatorNames}], [${types.map(type => this.visitAtom(type)).join(', ')}])`;
                    // eslint-disable-next-line max-len
                    const listMapper = `${CORE}.listMapper(${CORE}.unionMapper([${itemValidatorNames}], [${itemTypes.map(type => this.visitAtom(type)).join(', ')}]))`;
                    return `${CORE}.unionMapper([${scalarValidator}, ${listValidator}], [${scalarMapper}, ${listMapper}])`;
                },
            });
            self.code.line(`${cfnName}: ${mapperExpression}(properties.${propName}),`);
        });
        this.code.unindent('};');
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
    emitFromCfnFactoryFunction(resource, typeName, propSpecs, nameConversionTable, allowReturningIResolvable) {
        const factoryName = genspec.fromCfnFactoryName(typeName);
        this.code.line();
        // Do not error out if this function is unused.
        // Some types are declared in the CFN schema,
        // but never used as types of properties,
        // and in those cases this function will never be called.
        this.code.line('// @ts-ignore TS6133');
        const returnType = `${typeName.fqn}${allowReturningIResolvable ? ' | ' + CORE + '.IResolvable' : ''}`;
        this.code.openBlock(`function ${factoryName.functionName}(properties: any): ` +
            `${CFN_PARSE}.FromCloudFormationResult<${returnType}>`);
        if (allowReturningIResolvable) {
            this.code.openBlock(`if (${CORE}.isResolvableObject(properties))`);
            this.code.line(`return new ${CFN_PARSE}.FromCloudFormationResult(properties);`);
            this.code.closeBlock();
        }
        this.code.line('properties = properties == null ? {} : properties;');
        // if the passed value is not an object, immediately return it,
        // and let a validator report an error -
        // otherwise, we'll just return an empty object for this case,
        // which a validator might not catch
        // (if the interface we're emitting this function for has no required properties, for example)
        this.code.openBlock("if (typeof properties !== 'object')");
        this.code.line(`return new ${CFN_PARSE}.FromCloudFormationResult(properties);`);
        this.code.closeBlock();
        this.code.line(`const ret = new ${CFN_PARSE}.FromCloudFormationPropertyObject<${typeName.fqn}>();`);
        const self = this;
        // class used for the visitor
        class FromCloudFormationFactoryVisitor {
            visitAtom(type) {
                const specType = type.specName && self.spec.PropertyTypes[type.specName.fqn];
                if (specType && !cfnspec_1.schema.isRecordType(specType)) {
                    return genspec.typeDispatch(resource, specType, this);
                }
                else {
                    return genspec.fromCfnFactoryName(type).fqn;
                }
            }
            visitList(itemType) {
                return itemType.className === 'string'
                    // an array of strings is a special case,
                    // because it might need to be encoded as a Token directly
                    // (and not an array of tokens), for example,
                    // when a Ref expression references a parameter of type CommaDelimitedList
                    ? `${CFN_PARSE}.FromCloudFormation.getStringArray`
                    : `${CFN_PARSE}.FromCloudFormation.getArray(${this.visitAtom(itemType)})`;
            }
            visitMap(itemType) {
                return `${CFN_PARSE}.FromCloudFormation.getMap(${this.visitAtom(itemType)})`;
            }
            visitMapOfLists(itemType) {
                return `${CFN_PARSE}.FromCloudFormation.getMap(` +
                    `${CFN_PARSE}.FromCloudFormation.getArray(${this.visitAtom(itemType)}))`;
            }
            visitAtomUnion(types) {
                const validatorNames = types.map(type => genspec.validatorName(type).fqn).join(', ');
                const mappers = types.map(type => this.visitAtom(type)).join(', ');
                return `${CFN_PARSE}.FromCloudFormation.getTypeUnion([${validatorNames}], [${mappers}])`;
            }
            visitUnionList(itemTypes) {
                const validatorNames = itemTypes.map(type => genspec.validatorName(type).fqn).join(', ');
                const mappers = itemTypes.map(type => this.visitAtom(type)).join(', ');
                return `${CFN_PARSE}.FromCloudFormation.getArray(` +
                    `${CFN_PARSE}.FromCloudFormation.getTypeUnion([${validatorNames}], [${mappers}])` +
                    ')';
            }
            visitUnionMap(itemTypes) {
                const validatorNames = itemTypes.map(type => genspec.validatorName(type).fqn).join(', ');
                const mappers = itemTypes.map(type => this.visitAtom(type)).join(', ');
                return `${CFN_PARSE}.FromCloudFormation.getMap(` +
                    `${CFN_PARSE}.FromCloudFormation.getTypeUnion([${validatorNames}], [${mappers}])` +
                    ')';
            }
            visitListOrAtom(scalarTypes, itemTypes) {
                const scalarValidatorNames = scalarTypes.map(type => genspec.validatorName(type).fqn).join(', ');
                const itemValidatorNames = itemTypes.map(type => genspec.validatorName(type).fqn).join(', ');
                const scalarTypesMappers = scalarTypes.map(type => this.visitAtom(type)).join(', ');
                const scalarMapper = `${CFN_PARSE}.FromCloudFormation.getTypeUnion([${scalarValidatorNames}], [${scalarTypesMappers}])`;
                const itemTypeMappers = itemTypes.map(type => this.visitAtom(type)).join(', ');
                const listMapper = `${CFN_PARSE}.FromCloudFormation.getArray(` +
                    `${CFN_PARSE}.FromCloudFormation.getTypeUnion([${itemValidatorNames}], [${itemTypeMappers}])` +
                    ')';
                const scalarValidator = `${CORE}.unionValidator(${scalarValidatorNames})`;
                const listValidator = `${CORE}.listValidator(${CORE}.unionValidator(${itemValidatorNames}))`;
                return `${CFN_PARSE}.FromCloudFormation.getTypeUnion([${scalarValidator}, ${listValidator}], [${scalarMapper}, ${listMapper}])`;
            }
        }
        for (const [cfnPropName, cdkPropName] of Object.entries(nameConversionTable)) {
            const propSpec = propSpecs[cfnPropName];
            const simpleCfnPropAccessExpr = `properties.${cfnPropName}`;
            const deserializedExpression = genspec.typeDispatch(resource, propSpec, new FromCloudFormationFactoryVisitor()) +
                `(${simpleCfnPropAccessExpr})`;
            let valueExpression = propSpec.Required
                ? deserializedExpression
                : `${simpleCfnPropAccessExpr} != null ? ${deserializedExpression} : undefined`;
            if (cfnspec_1.schema.isTagPropertyName(cfnPropName)) {
                // Properties that have names considered to denote tags
                // have their type generated without a union with IResolvable.
                // However, we can't possibly know that when generating the factory
                // for that struct, and (in theory, at least)
                // the same type can be used as the value of multiple properties,
                // some of which do not have a tag-compatible name,
                // so there is no way to pass allowReturningIResolvable=false correctly.
                // Do the simple thing in that case, and just cast to any.
                valueExpression += ' as any';
            }
            self.code.line(`ret.addPropertyResult('${cdkPropName}', '${cfnPropName}', ${valueExpression});`);
        }
        // save any extra properties we find on this level
        this.code.line('ret.addUnrecognizedPropertiesAsExtra(properties);');
        // return the result object
        this.code.line('return ret;');
        // close the function brace
        this.code.closeBlock();
    }
    /**
     * Emit a function that will validate whether the given property bag matches the schema of this complex type
     *
     * Generated as a top-level function outside any namespace so we can hide it from library consumers.
     */
    emitPropertiesValidator(resource, typeName, propSpecs, nameConversionTable) {
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
        // check that the argument is an object
        // normally, we would have to explicitly check for null here,
        // as typeof null is 'object' in JavaScript,
        // but validators are never called with null
        // (as evidenced by the code below accessing properties of the argument without checking for null)
        this.code.openBlock("if (typeof properties !== 'object')");
        this.code.line(`errors.collect(new ${CORE}.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));`);
        this.code.closeBlock();
        Object.keys(propSpecs).forEach(cfnPropName => {
            const propSpec = propSpecs[cfnPropName];
            const propName = nameConversionTable[cfnPropName];
            if (propSpec.Required) {
                this.code.line(`errors.collect(${CORE}.propertyValidator('${propName}', ${CORE}.requiredValidator)(properties.${propName}));`);
            }
            const self = this;
            const validatorExpression = genspec.typeDispatch(resource, propSpec, {
                visitAtom(type) {
                    const specType = type.specName && self.spec.PropertyTypes[type.specName.fqn];
                    if (specType && !cfnspec_1.schema.isRecordType(specType)) {
                        return genspec.typeDispatch(resource, specType, this);
                    }
                    return genspec.validatorName(type).fqn;
                },
                visitAtomUnion(types) {
                    return `${CORE}.unionValidator(${types.map(type => this.visitAtom(type)).join(', ')})`;
                },
                visitList(itemType) {
                    return `${CORE}.listValidator(${this.visitAtom(itemType)})`;
                },
                visitUnionList(itemTypes) {
                    return `${CORE}.listValidator(${CORE}.unionValidator(${itemTypes.map(type => this.visitAtom(type)).join(', ')}))`;
                },
                visitMap(itemType) {
                    return `${CORE}.hashValidator(${this.visitAtom(itemType)})`;
                },
                visitMapOfLists(itemType) {
                    return `${CORE}.hashValidator(${CORE}.listValidator(${this.visitAtom(itemType)}))`;
                },
                visitUnionMap(itemTypes) {
                    return `${CORE}.hashValidator(${CORE}.unionValidator(${itemTypes.map(type => this.visitAtom(type)).join(', ')}))`;
                },
                visitListOrAtom(types, itemTypes) {
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
    emitInterfaceProperty(props) {
        const javascriptPropertyName = genspec.cloudFormationToScriptName(props.propName);
        this.docLink(props.spec.Documentation, props.additionalDocs);
        const line = `: ${this.findNativeType(props.context, props.spec, props.propName)};`;
        const question = props.spec.Required ? '' : '?';
        this.code.line(`readonly ${javascriptPropertyName}${question}${line}`);
        return javascriptPropertyName;
    }
    emitClassProperty(props) {
        const javascriptPropertyName = genspec.cloudFormationToScriptName(props.propName);
        this.docLink(props.spec.Documentation, props.additionalDocs);
        const question = props.spec.Required ? ';' : ' | undefined;';
        const line = `: ${this.findNativeType(props.context, props.spec, props.propName)}${question}`;
        if (cfnspec_1.schema.isTagPropertyName(props.propName) && cfnspec_1.schema.isTagProperty(props.spec)) {
            this.code.line(`public readonly tags: ${TAG_MANAGER};`);
        }
        else {
            this.code.line(`public ${javascriptPropertyName}${line}`);
        }
        return javascriptPropertyName;
    }
    emitProperty(props, container) {
        switch (container) {
            case Container.Class:
                return this.emitClassProperty(props);
            case Container.Interface:
                return this.emitInterfaceProperty(props);
            default:
                throw new Error(`Unsupported container ${container}`);
        }
    }
    beginNamespace(type) {
        if (type.namespace) {
            const parts = type.namespace.split('.');
            for (const part of parts) {
                this.code.openBlock(`export namespace ${part}`);
            }
        }
    }
    endNamespace(type) {
        if (type.namespace) {
            const parts = type.namespace.split('.');
            for (const _ of parts) {
                this.code.closeBlock();
            }
        }
    }
    emitPropertyType(resourceContext, typeName, propTypeSpec) {
        this.code.line();
        this.beginNamespace(typeName);
        const docs = (0, cfnspec_1.typeDocs)(resourceContext.specName?.fqn ?? '', typeName.specName?.propAttrName);
        this.docLink(propTypeSpec.Documentation, docs.description, '', '@struct', // Make this interface ALWAYS be treated as a struct, event if it's named `IPSet...` or something...
        '@stability external');
        /*
        if (!propTypeSpec.Properties || Object.keys(propTypeSpec.Properties).length === 0) {
          this.code.line('// eslint-disable-next-line somethingsomething | A genuine empty-object type');
        }
        */
        this.code.openBlock(`export interface ${typeName.className}`);
        const conversionTable = {};
        if (propTypeSpec.Properties) {
            Object.keys(propTypeSpec.Properties).forEach(propName => {
                const propSpec = propTypeSpec.Properties[propName];
                const additionalDocs = docs.properties[propName] || quoteCode(`${typeName.fqn}.${propName}`);
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
        this.emitPropertiesValidator(resourceContext, typeName, propTypeSpec.Properties, conversionTable);
        this.code.line();
        this.emitCloudFormationMapper(resourceContext, typeName, propTypeSpec.Properties, conversionTable);
        this.emitFromCfnFactoryFunction(resourceContext, typeName, propTypeSpec.Properties, conversionTable, true);
    }
    /**
     * Return the native type expression for the given propSpec
     */
    findNativeType(resourceContext, propSpec, propName) {
        const alternatives = [];
        // render the union of all item types
        if (cfnspec_1.schema.isCollectionProperty(propSpec)) {
            // render the union of all item types
            const itemTypes = genspec.specTypesToCodeTypes(resourceContext, (0, spec_utils_1.itemTypeNames)(propSpec));
            // 'tokenizableType' operates at the level of rendered type names in TypeScript, so stringify
            // the objects.
            const renderedTypes = itemTypes.map(t => this.renderCodeName(resourceContext, t));
            if (!tokenizableType(renderedTypes) && !cfnspec_1.schema.isTagPropertyName(propName)) {
                // Always accept a token in place of any list element (unless the list elements are tokenizable)
                itemTypes.push(genspec.TOKEN_NAME);
            }
            const union = this.renderTypeUnion(resourceContext, itemTypes);
            if (cfnspec_1.schema.isMapProperty(propSpec)) {
                alternatives.push(`{ [key: string]: (${union}) }`);
            }
            else {
                // To make TSLint happy, we have to either emit: SingleType[] or Array<Alt1 | Alt2>
                if (union.indexOf('|') !== -1) {
                    alternatives.push(`Array<${union}>`);
                }
                else {
                    alternatives.push(`${union}[]`);
                }
            }
        }
        // Yes, some types can be both collection and scalar. Looking at you, SAM.
        if (cfnspec_1.schema.isScalarProperty(propSpec)) {
            // Scalar type
            const typeNames = (0, spec_utils_1.scalarTypeNames)(propSpec);
            const types = genspec.specTypesToCodeTypes(resourceContext, typeNames);
            alternatives.push(this.renderTypeUnion(resourceContext, types));
        }
        // Only if this property is not of a "tokenizable type" (string, string[],
        // number in the future) we add a type union for `cdk.Token`. We rather
        // everything to be tokenizable because there are languages that do not
        // support union types (i.e. Java, .NET), so we lose type safety if we have
        // a union.
        if (!tokenizableType(alternatives) && !cfnspec_1.schema.isTagPropertyName(propName)) {
            alternatives.push(genspec.TOKEN_NAME.fqn);
        }
        return alternatives.join(' | ');
    }
    /**
     * Render a CodeName to a string representation of it in TypeScript
     */
    renderCodeName(context, type) {
        const rel = type.relativeTo(context);
        const specType = rel.specName && this.spec.PropertyTypes[rel.specName.fqn];
        if (!specType || cfnspec_1.schema.isRecordType(specType)) {
            return rel.fqn;
        }
        return this.findNativeType(context, specType);
    }
    renderTypeUnion(context, types) {
        return types.map(t => this.renderCodeName(context, t)).join(' | ');
    }
    docLink(link, ...before) {
        if (!link && before.length === 0) {
            return;
        }
        this.code.line('/**');
        before.flatMap(x => x.split('\n')).forEach(line => this.code.line(` * ${escapeDocText(line)}`.trimRight()));
        if (link) {
            if (before.length > 0) {
                this.code.line(' *');
            }
            this.code.line(` * @link ${link}`);
        }
        this.code.line(' */');
        /**
         * Add escapes to the doc text to avoid text that breaks the parsing of the string
         *
         * We currently escape the following sequences:
         *
         * - <asterisk><slash> (* /): if this occurs somewhere in the doc text, it
         *   will end the block comment in the wrong place. Break up those
         *   characters by inserting a space. Would have loved to use a zero-width space,
         *   but I'm very very afraid it will break codegen in subtle ways, and just using
         *   a space feels safer.
         * - \u: if this occurs in Java code, the Java compiler will try and parse the
         *   following 4 characters as a unicode code point, and fail if the 4 characters
         *   aren't hex digits. This is formally a bug in pacmak (it should do the escaping
         *   while rendering, https://github.com/aws/jsii/issues/3302), but to
         *   expedite the build fixing it here as well. Replace with '\ u' (tried using
         *   `\\u` but for some reason that also doesn't carry over to codegen).
         */
        function escapeDocText(x) {
            x = x.replace(/\*\//g, '* /');
            x = x.replace(/\\u/g, '\\ u');
            return x;
        }
    }
}
exports.default = CodeGenerator;
/**
 * Quotes a code name for inclusion in a JSDoc comment, so it will render properly
 * in the Markdown output.
 *
 * @param code a code name to be quoted.
 *
 * @returns the code name surrounded by double backticks.
 */
function quoteCode(code) {
    return '`' + code + '`';
}
function tokenizableType(alternatives) {
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
function tagType(resource) {
    for (const name of Object.keys(resource.Properties)) {
        if (!cfnspec_1.schema.isTagPropertyName(name)) {
            continue;
        }
        if (cfnspec_1.schema.isTagPropertyStandard(resource.Properties[name])) {
            return `${TAG_TYPE}.STANDARD`;
        }
        if (cfnspec_1.schema.isTagPropertyAutoScalingGroup(resource.Properties[name])) {
            return `${TAG_TYPE}.AUTOSCALING_GROUP`;
        }
        if (cfnspec_1.schema.isTagPropertyJson(resource.Properties[name]) ||
            cfnspec_1.schema.isTagPropertyStringMap(resource.Properties[name])) {
            return `${TAG_TYPE}.MAP`;
        }
    }
    return `${TAG_TYPE}.NOT_TAGGABLE`;
}
var Container;
(function (Container) {
    Container["Interface"] = "INTERFACE";
    Container["Class"] = "CLASS";
})(Container || (Container = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGVnZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBd0U7QUFDeEUseUNBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyw2Q0FBK0Y7QUFDL0YsaUNBQXFDO0FBRXJDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztBQUNoRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3BDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztBQUM5QyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUMsQ0FBQywrQkFBK0I7QUFDbEYsTUFBTSxlQUFlLEdBQUcsR0FBRyxVQUFVLFlBQVksQ0FBQztBQUNsRCxNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDO0FBQ25DLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxhQUFhLENBQUM7QUFFekMsSUFBSyxjQUdKO0FBSEQsV0FBSyxjQUFjO0lBQ2pCLDBEQUF3QyxDQUFBO0lBQ3hDLDREQUEwQyxDQUFBO0FBQzVDLENBQUMsRUFISSxjQUFjLEtBQWQsY0FBYyxRQUdsQjtBQWFEOztHQUVHO0FBQ0gsTUFBcUIsYUFBYTtJQU1oQzs7OztPQUlHO0lBQ0gsWUFBWSxVQUFrQixFQUFtQixJQUEwQixFQUFtQixLQUFhLEVBQUUsVUFBZ0MsRUFBRTtRQUE5RixTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBVDNGLGNBQVMsR0FBMkIsRUFBRSxDQUFDO1FBRS9DLFNBQUksR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQVE3QixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsVUFBVSxlQUFlLENBQUM7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLE1B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LFFBQVEsZUFBZSxDQUFDO0FBQ3BDLENBQUM7QUFFRCxJQUFLLFNBR0o7QUFIRCxXQUFLLFNBQVM7SUFDWixvQ0FBdUIsQ0FBQTtJQUN2Qiw0QkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFISSxTQUFTLEtBQVQsU0FBUyxRQUdiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2NoZW1hLCBjZm5MaW50QW5ub3RhdGlvbnMsIHR5cGVEb2NzIH0gZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgeyBDb2RlTWFrZXIgfSBmcm9tICdjb2RlbWFrZXInO1xuaW1wb3J0ICogYXMgZ2Vuc3BlYyBmcm9tICcuL2dlbnNwZWMnO1xuaW1wb3J0IHsgaXRlbVR5cGVOYW1lcywgUHJvcGVydHlBdHRyaWJ1dGVOYW1lLCBzY2FsYXJUeXBlTmFtZXMsIFNwZWNOYW1lIH0gZnJvbSAnLi9zcGVjLXV0aWxzJztcbmltcG9ydCB7IHVwY2FzZUZpcnN0IH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgQ09OU1RSVUNUUyA9IGdlbnNwZWMuQ09OU1RSVUNUU19OQU1FU1BBQ0U7XG5jb25zdCBDT1JFID0gZ2Vuc3BlYy5DT1JFX05BTUVTUEFDRTtcbmNvbnN0IENGTl9QQVJTRSA9IGdlbnNwZWMuQ0ZOX1BBUlNFX05BTUVTUEFDRTtcbmNvbnN0IFJFU09VUkNFX0JBU0VfQ0xBU1MgPSBgJHtDT1JFfS5DZm5SZXNvdXJjZWA7IC8vIGJhc2UgY2xhc3MgZm9yIGFsbCByZXNvdXJjZXNcbmNvbnN0IENPTlNUUlVDVF9DTEFTUyA9IGAke0NPTlNUUlVDVFN9LkNvbnN0cnVjdGA7XG5jb25zdCBUQUdfVFlQRSA9IGAke0NPUkV9LlRhZ1R5cGVgO1xuY29uc3QgVEFHX01BTkFHRVIgPSBgJHtDT1JFfS5UYWdNYW5hZ2VyYDtcblxuZW51bSBUcmVlQXR0cmlidXRlcyB7XG4gIENGTl9UWVBFID0gJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZScsXG4gIENGTl9QUk9QUyA9ICdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzJ1xufVxuXG5pbnRlcmZhY2UgRGljdGlvbmFyeTxUPiB7IFtrZXk6IHN0cmluZ106IFQ7IH1cblxuZXhwb3J0IGludGVyZmFjZSBDb2RlR2VuZXJhdG9yT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBIb3cgdG8gaW1wb3J0IHRoZSBjb3JlIGxpYnJhcnkuXG4gICAqXG4gICAqIEBkZWZhdWx0ICdAYXdzLWNkay9jb3JlJ1xuICAgKi9cbiAgcmVhZG9ubHkgY29yZUltcG9ydD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBFbWl0cyBjbGFzc2VzIGZvciBhbGwgcmVzb3VyY2UgdHlwZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZUdlbmVyYXRvciB7XG4gIHB1YmxpYyByZWFkb25seSBvdXRwdXRGaWxlOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICBwcml2YXRlIGNvZGUgPSBuZXcgQ29kZU1ha2VyKCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGNvZGUgZ2VuZXJhdG9yLlxuICAgKiBAcGFyYW0gbW9kdWxlTmFtZSB0aGUgbmFtZSBvZiB0aGUgbW9kdWxlICh1c2VkIHRvIGRldGVybWluZSB0aGUgZmlsZSBuYW1lKS5cbiAgICogQHBhcmFtIHNwZWMgICAgIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHNwZWNpZmljYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKG1vZHVsZU5hbWU6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBzcGVjOiBzY2hlbWEuU3BlY2lmaWNhdGlvbiwgcHJpdmF0ZSByZWFkb25seSBhZmZpeDogc3RyaW5nLCBvcHRpb25zOiBDb2RlR2VuZXJhdG9yT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vdXRwdXRGaWxlID0gYCR7bW9kdWxlTmFtZX0uZ2VuZXJhdGVkLnRzYDtcbiAgICB0aGlzLmNvZGUub3BlbkZpbGUodGhpcy5vdXRwdXRGaWxlKTtcbiAgICBjb25zdCBjb3JlSW1wb3J0ID0gb3B0aW9ucy5jb3JlSW1wb3J0ID8/ICdAYXdzLWNkay9jb3JlJztcblxuICAgIGNvbnN0IG1ldGEgPSB7XG4gICAgICBnZW5lcmF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICBmaW5nZXJwcmludDogc3BlYy5GaW5nZXJwcmludCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoYC8vIENvcHlyaWdodCAyMDEyLSR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfSBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLmApO1xuICAgIHRoaXMuY29kZS5saW5lKCcvLyBHZW5lcmF0ZWQgZnJvbSB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIFJlc291cmNlIFNwZWNpZmljYXRpb24nKTtcbiAgICB0aGlzLmNvZGUubGluZSgnLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbCcpO1xuICAgIHRoaXMuY29kZS5saW5lKGAvLyBAY2ZuMnRzOm1ldGFAICR7SlNPTi5zdHJpbmdpZnkobWV0YSl9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICB0aGlzLmNvZGUubGluZSgnLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbCcpO1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYGltcG9ydCAqIGFzICR7Q09OU1RSVUNUU30gZnJvbSAnY29uc3RydWN0cyc7YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYGltcG9ydCAqIGFzICR7Q09SRX0gZnJvbSAnJHtjb3JlSW1wb3J0fSc7YCk7XG4gICAgLy8gaW1wb3J0IGNmbi1wYXJzZSBmcm9tIGFuIGVtYmVkZGVkIGZvbGRlciBpbnNpZGUgQGNvcmUsIHNpbmNlIGl0IGlzIG5vdCBwYXJ0IG9mIHRoZSBwdWJsaWMgQVBJIG9mIHRoZSBtb2R1bGVcbiAgICB0aGlzLmNvZGUubGluZShgaW1wb3J0ICogYXMgJHtDRk5fUEFSU0V9IGZyb20gJyR7Y29yZUltcG9ydH0vJHtjb3JlSW1wb3J0ID09PSAnLicgPyAnJyA6ICdsaWIvJ31oZWxwZXJzLWludGVybmFsJztgKTtcbiAgfVxuXG4gIHB1YmxpYyBlbWl0Q29kZSgpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5zcGVjLlJlc291cmNlVHlwZXMpLnNvcnQoKSkge1xuICAgICAgY29uc3QgcmVzb3VyY2VUeXBlID0gdGhpcy5zcGVjLlJlc291cmNlVHlwZXNbbmFtZV07XG5cbiAgICAgIGNvbnN0IGNmbk5hbWUgPSBTcGVjTmFtZS5wYXJzZShuYW1lKTtcbiAgICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IGdlbnNwZWMuQ29kZU5hbWUuZm9yQ2ZuUmVzb3VyY2UoY2ZuTmFtZSwgdGhpcy5hZmZpeCk7XG4gICAgICB0aGlzLmNvZGUubGluZSgpO1xuXG4gICAgICB0aGlzLnJlc291cmNlc1tyZXNvdXJjZU5hbWUuc3BlY05hbWUhLmZxbl0gPSByZXNvdXJjZU5hbWUuY2xhc3NOYW1lO1xuICAgICAgdGhpcy5lbWl0UmVzb3VyY2VUeXBlKHJlc291cmNlTmFtZSwgcmVzb3VyY2VUeXBlKTtcbiAgICAgIHRoaXMuZW1pdFByb3BlcnR5VHlwZXMobmFtZSwgcmVzb3VyY2VOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgdGhlIGdlbmVyYXRlZCBmaWxlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHNhdmUoZGlyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgdGhpcy5jb2RlLmNsb3NlRmlsZSh0aGlzLm91dHB1dEZpbGUpO1xuICAgIHJldHVybiB0aGlzLmNvZGUuc2F2ZShkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGNsYXNzZXMgZm9yIGFsbCBwcm9wZXJ0eSB0eXBlc1xuICAgKi9cbiAgcHJpdmF0ZSBlbWl0UHJvcGVydHlUeXBlcyhyZXNvdXJjZU5hbWU6IHN0cmluZywgcmVzb3VyY2VDbGFzczogZ2Vuc3BlYy5Db2RlTmFtZSk6IHZvaWQge1xuICAgIGNvbnN0IHByZWZpeCA9IGAke3Jlc291cmNlTmFtZX0uYDtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5zcGVjLlByb3BlcnR5VHlwZXMpLnNvcnQoKSkge1xuICAgICAgaWYgKCFuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSkgeyBjb250aW51ZTsgfVxuICAgICAgY29uc3QgY2ZuTmFtZSA9IFByb3BlcnR5QXR0cmlidXRlTmFtZS5wYXJzZShuYW1lKTtcbiAgICAgIGNvbnN0IHByb3BUeXBlTmFtZSA9IGdlbnNwZWMuQ29kZU5hbWUuZm9yUHJvcGVydHlUeXBlKGNmbk5hbWUsIHJlc291cmNlQ2xhc3MpO1xuICAgICAgY29uc3QgdHlwZSA9IHRoaXMuc3BlYy5Qcm9wZXJ0eVR5cGVzW25hbWVdO1xuICAgICAgaWYgKHNjaGVtYS5pc1JlY29yZFR5cGUodHlwZSkpIHtcbiAgICAgICAgdGhpcy5lbWl0UHJvcGVydHlUeXBlKHJlc291cmNlQ2xhc3MsIHByb3BUeXBlTmFtZSwgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvcGVuQ2xhc3MobmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSwgc3VwZXJDbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBleHRlbmRzUG9zdGZpeCA9IHN1cGVyQ2xhc3NlcyA/IGAgZXh0ZW5kcyAke3N1cGVyQ2xhc3Nlc31gIDogJyc7XG4gICAgY29uc3QgaW1wbGVtZW50c1Bvc3RmaXggPSBgIGltcGxlbWVudHMgJHtDT1JFfS5JSW5zcGVjdGFibGVgO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGV4cG9ydCBjbGFzcyAke25hbWUuY2xhc3NOYW1lfSR7ZXh0ZW5kc1Bvc3RmaXh9JHtpbXBsZW1lbnRzUG9zdGZpeH1gKTtcbiAgICByZXR1cm4gbmFtZS5jbGFzc05hbWU7XG4gIH1cblxuICBwcml2YXRlIGNsb3NlQ2xhc3MoX25hbWU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0UHJvcHNUeXBlKHJlc291cmNlQ29udGV4dDogZ2Vuc3BlYy5Db2RlTmFtZSwgc3BlYzogc2NoZW1hLlJlc291cmNlVHlwZSk6IGdlbnNwZWMuQ29kZU5hbWUgfCB1bmRlZmluZWQge1xuICAgIGlmICghc3BlYy5Qcm9wZXJ0aWVzIHx8IE9iamVjdC5rZXlzKHNwZWMuUHJvcGVydGllcykubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuICAgIGNvbnN0IG5hbWUgPSBnZW5zcGVjLkNvZGVOYW1lLmZvclJlc291cmNlUHJvcGVydGllcyhyZXNvdXJjZUNvbnRleHQpO1xuXG4gICAgdGhpcy5kb2NMaW5rKHNwZWMuRG9jdW1lbnRhdGlvbixcbiAgICAgIGBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIFxcYCR7cmVzb3VyY2VDb250ZXh0LmNsYXNzTmFtZX1cXGBgLFxuICAgICAgJycsXG4gICAgICAnQHN0cnVjdCcsIC8vIE1ha2UgdGhpcyBpbnRlcmZhY2UgQUxXQVlTIGJlIHRyZWF0ZWQgYXMgYSBzdHJ1Y3QsIGV2ZW50IGlmIGl0J3MgbmFtZWQgYElQU2V0Li4uYCBvciBzb21ldGhpbmcuLi5cbiAgICAgICdAc3RhYmlsaXR5IGV4dGVybmFsJyk7XG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgZXhwb3J0IGludGVyZmFjZSAke25hbWUuY2xhc3NOYW1lfWApO1xuXG4gICAgY29uc3QgY29udmVyc2lvblRhYmxlID0gdGhpcy5lbWl0UHJvcHNUeXBlUHJvcGVydGllcyhyZXNvdXJjZUNvbnRleHQsIHNwZWMuUHJvcGVydGllcywgQ29udGFpbmVyLkludGVyZmFjZSk7XG5cbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICB0aGlzLmVtaXRQcm9wZXJ0aWVzVmFsaWRhdG9yKHJlc291cmNlQ29udGV4dCwgbmFtZSwgc3BlYy5Qcm9wZXJ0aWVzLCBjb252ZXJzaW9uVGFibGUpO1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5lbWl0Q2xvdWRGb3JtYXRpb25NYXBwZXIocmVzb3VyY2VDb250ZXh0LCBuYW1lLCBzcGVjLlByb3BlcnRpZXMsIGNvbnZlcnNpb25UYWJsZSk7XG4gICAgdGhpcy5lbWl0RnJvbUNmbkZhY3RvcnlGdW5jdGlvbihyZXNvdXJjZUNvbnRleHQsIG5hbWUsIHNwZWMuUHJvcGVydGllcywgY29udmVyc2lvblRhYmxlLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IFR5cGVTY3JpcHQgZm9yIGVhY2ggb2YgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMsIHdoaWxlIHJlbmFtaW5nXG4gICAqXG4gICAqIFJldHVybiBhIG1hcHBpbmcgb2YgeyBvcmlnaW5hbE5hbWUgLT4gbmV3TmFtZSB9LlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0UHJvcHNUeXBlUHJvcGVydGllcyhcbiAgICByZXNvdXJjZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICBwcm9wZXJ0aWVzU3BlYzogeyBbbmFtZTogc3RyaW5nXTogc2NoZW1hLlByb3BlcnR5IH0sXG4gICAgY29udGFpbmVyOiBDb250YWluZXIpOiBEaWN0aW9uYXJ5PHN0cmluZz4ge1xuICAgIGNvbnN0IHByb3BlcnR5TWFwOiBEaWN0aW9uYXJ5PHN0cmluZz4gPSB7fTtcblxuICAgIGNvbnN0IGRvY3MgPSB0eXBlRG9jcyhyZXNvdXJjZS5zcGVjTmFtZT8uZnFuID8/ICcnKTtcblxuICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXNTcGVjKS5zb3J0KHByb3BlcnR5Q29tcGFyYXRvcikuZm9yRWFjaChwcm9wTmFtZSA9PiB7XG4gICAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgICAgY29uc3QgcHJvcFNwZWMgPSBwcm9wZXJ0aWVzU3BlY1twcm9wTmFtZV07XG4gICAgICBjb25zdCBhZGRpdGlvbmFsRG9jcyA9IGRvY3MucHJvcGVydGllc1twcm9wTmFtZV0gfHwgcXVvdGVDb2RlKHJlc291cmNlLnNwZWNOYW1lIS5yZWxhdGl2ZU5hbWUocHJvcE5hbWUpLmZxbik7XG4gICAgICBjb25zdCBuZXdOYW1lID0gdGhpcy5lbWl0UHJvcGVydHkoe1xuICAgICAgICBjb250ZXh0OiByZXNvdXJjZSxcbiAgICAgICAgcHJvcE5hbWUsXG4gICAgICAgIHNwZWM6IHByb3BTcGVjLFxuICAgICAgICBhZGRpdGlvbmFsRG9jcyxcbiAgICAgIH0sXG4gICAgICBjb250YWluZXIsXG4gICAgICApO1xuICAgICAgcHJvcGVydHlNYXBbcHJvcE5hbWVdID0gbmV3TmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvcGVydHlNYXA7XG5cbiAgICAvKipcbiAgICAgKiBBIGNvbXBhcmF0b3IgdGhhdCBwbGFjZXMgcmVxdWlyZWQgcHJvcGVydGllcyBiZWZvcmUgb3B0aW9uYWwgcHJvcGVydGllcyxcbiAgICAgKiBhbmQgc29ydHMgcHJvcGVydGllcyBhbHBoYWJldGljYWxseS5cbiAgICAgKiBAcGFyYW0gbCB0aGUgbGVmdCBwcm9wZXJ0eSBuYW1lLlxuICAgICAqIEBwYXJhbSByIHRoZSByaWdodCBwcm9wZXJ0eSBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByb3BlcnR5Q29tcGFyYXRvcihsOiBzdHJpbmcsIHI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICBjb25zdCBscCA9IHByb3BlcnRpZXNTcGVjW2xdO1xuICAgICAgY29uc3QgcnAgPSBwcm9wZXJ0aWVzU3BlY1tyXTtcbiAgICAgIGlmIChscC5SZXF1aXJlZCA9PT0gcnAuUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIGwubG9jYWxlQ29tcGFyZShyKTtcbiAgICAgIH0gZWxzZSBpZiAobHAuUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0UmVzb3VyY2VUeXBlKHJlc291cmNlTmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSwgc3BlYzogc2NoZW1hLlJlc291cmNlVHlwZSk6IHZvaWQge1xuICAgIHRoaXMuYmVnaW5OYW1lc3BhY2UocmVzb3VyY2VOYW1lKTtcblxuICAgIGNvbnN0IGNmbk5hbWUgPSByZXNvdXJjZU5hbWUuc3BlY05hbWUhLmZxbjtcblxuICAgIC8vXG4gICAgLy8gUHJvcHMgQmFnIGZvciB0aGlzIFJlc291cmNlXG4gICAgLy9cblxuICAgIGNvbnN0IHByb3BzVHlwZSA9IHRoaXMuZW1pdFByb3BzVHlwZShyZXNvdXJjZU5hbWUsIHNwZWMpO1xuICAgIGlmIChwcm9wc1R5cGUpIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZG9jcyA9IHR5cGVEb2NzKGNmbk5hbWUpO1xuXG4gICAgLy9cbiAgICAvLyBUaGUgY2xhc3MgZGVjbGFyYXRpb24gcmVwcmVzZW50aW5nIHRoaXMgUmVzb3VyY2VcbiAgICAvL1xuXG4gICAgdGhpcy5kb2NMaW5rKHNwZWMuRG9jdW1lbnRhdGlvbiwgLi4uW1xuICAgICAgYEEgQ2xvdWRGb3JtYXRpb24gXFxgJHtjZm5OYW1lfVxcYGAsXG4gICAgICAnJyxcbiAgICAgIC4uLmRvY3MuZGVzY3JpcHRpb24uc3BsaXQoJ1xcbicpLFxuICAgICAgJycsXG4gICAgICBgQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgJHtjZm5OYW1lfWAsXG4gICAgICAnQHN0YWJpbGl0eSBleHRlcm5hbCcsXG4gICAgXSk7XG4gICAgdGhpcy5vcGVuQ2xhc3MocmVzb3VyY2VOYW1lLCBSRVNPVVJDRV9CQVNFX0NMQVNTKTtcblxuICAgIC8vXG4gICAgLy8gU3RhdGljIGluc3BlY3RvcnMuXG4gICAgLy9cblxuICAgIGNvbnN0IGNmblJlc291cmNlVHlwZU5hbWUgPSBgJHtKU09OLnN0cmluZ2lmeShjZm5OYW1lKX1gO1xuICAgIHRoaXMuY29kZS5saW5lKCcvKionKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy4nKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICovJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9ICR7Y2ZuUmVzb3VyY2VUeXBlTmFtZX07YCk7XG5cbiAgICBpZiAoc3BlYy5SZXF1aXJlZFRyYW5zZm9ybSkge1xuICAgICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgICAgdGhpcy5jb2RlLmxpbmUoJyAqIFRoZSBgVHJhbnNmb3JtYCBhIHRlbXBsYXRlIG11c3QgdXNlIGluIG9yZGVyIHRvIHVzZSB0aGlzIHJlc291cmNlJyk7XG4gICAgICB0aGlzLmNvZGUubGluZSgnICovJyk7XG4gICAgICB0aGlzLmNvZGUubGluZShgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVFVSVJFRF9UUkFOU0ZPUk0gPSAke0pTT04uc3RyaW5naWZ5KHNwZWMuUmVxdWlyZWRUcmFuc2Zvcm0pfTtgKTtcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFRoZSBzdGF0aWMgZnJvbUNsb3VkRm9ybWF0aW9uKCkgbWV0aG9kLFxuICAgIC8vIHVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlXG4gICAgLy9cblxuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0Jyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS4nKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEBpbnRlcm5hbCcpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKi8nKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogJHtDT05TVFJVQ1RfQ0xBU1N9LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBgICtcbiAgICAgIGAke3Jlc291cmNlTmFtZS5jbGFzc05hbWV9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJ3Jlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTsnKTtcbiAgICBpZiAocHJvcHNUeXBlKSB7XG4gICAgICAvLyB0cmFuc2xhdGUgdGhlIHRlbXBsYXRlIHByb3BlcnRpZXMgdG8gQ0RLIG9iamVjdHNcbiAgICAgIHRoaXMuY29kZS5saW5lKCdjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTsnKTtcbiAgICAgIC8vIHRyYW5zbGF0ZSB0byBwcm9wcywgdXNpbmcgYSAobW9kdWxlLXByaXZhdGUpIGZhY3RvcnkgZnVuY3Rpb25cbiAgICAgIHRoaXMuY29kZS5saW5lKGBjb25zdCBwcm9wc1Jlc3VsdCA9ICR7Z2Vuc3BlYy5mcm9tQ2ZuRmFjdG9yeU5hbWUocHJvcHNUeXBlKS5mcW59KHJlc291cmNlUHJvcGVydGllcyk7YCk7XG4gICAgICAvLyBmaW5hbGx5LCBpbnN0YW50aWF0ZSB0aGUgcmVzb3VyY2UgY2xhc3NcbiAgICAgIHRoaXMuY29kZS5saW5lKGBjb25zdCByZXQgPSBuZXcgJHtyZXNvdXJjZU5hbWUuY2xhc3NOYW1lfShzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtgKTtcbiAgICAgIC8vIHNhdmUgYWxsIGtleXMgZnJvbSBleHRyYVByb3BlcnRpZXMgaW4gdGhlIHJlc291cmNlIHVzaW5nIHByb3BlcnR5IG92ZXJyaWRlc1xuICAgICAgdGhpcy5jb2RlLm9wZW5CbG9jaygnZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgJyk7XG4gICAgICB0aGlzLmNvZGUubGluZSgncmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7Jyk7XG4gICAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBwcm9wcyB0eXBlIC0gd2Ugc2ltcGx5IGluc3RhbnRpYXRlIHRoZSBjb25zdHJ1Y3Qgd2l0aG91dCB0aGUgdGhpcmQgYXJndW1lbnRcbiAgICAgIHRoaXMuY29kZS5saW5lKGBjb25zdCByZXQgPSBuZXcgJHtyZXNvdXJjZU5hbWUuY2xhc3NOYW1lfShzY29wZSwgaWQpO2ApO1xuICAgIH1cbiAgICAvLyBoYW5kbGUgYWxsIG5vbi1wcm9wZXJ0eSBhdHRyaWJ1dGVzXG4gICAgLy8gKHJldGVudGlvbiBwb2xpY2llcywgY29uZGl0aW9ucywgbWV0YWRhdGEsIGV0Yy4pXG4gICAgdGhpcy5jb2RlLmxpbmUoJ29wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTsnKTtcblxuICAgIHRoaXMuY29kZS5saW5lKCdyZXR1cm4gcmV0OycpO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICAvL1xuICAgIC8vIEF0dHJpYnV0ZXNcbiAgICAvL1xuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5ldyBBcnJheTxnZW5zcGVjLkF0dHJpYnV0ZT4oKTtcblxuICAgIGlmIChzcGVjLkF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAoY29uc3QgYXR0cmlidXRlTmFtZSBvZiBPYmplY3Qua2V5cyhzcGVjLkF0dHJpYnV0ZXMpLnNvcnQoKSkge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVTcGVjID0gc3BlYy5BdHRyaWJ1dGVzIVthdHRyaWJ1dGVOYW1lXTtcblxuICAgICAgICB0aGlzLmNvZGUubGluZSgpO1xuXG4gICAgICAgIHRoaXMuZG9jTGluayh1bmRlZmluZWQsXG4gICAgICAgICAgZG9jcy5hdHRyaWJ1dGVzPy5bYXR0cmlidXRlTmFtZV0gPz8gJycsXG4gICAgICAgICAgYEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSAke2F0dHJpYnV0ZU5hbWV9YCk7XG4gICAgICAgIGNvbnN0IGF0dHIgPSBnZW5zcGVjLmF0dHJpYnV0ZURlZmluaXRpb24oYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlU3BlYyk7XG5cbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYHB1YmxpYyByZWFkb25seSAke2F0dHIucHJvcGVydHlOYW1lfTogJHthdHRyLmF0dHJpYnV0ZVR5cGV9O2ApO1xuXG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChhdHRyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFNldCBjbGFzcyBwcm9wZXJ0aWVzIHRvIG1hdGNoIENsb3VkRm9ybWF0aW9uIFByb3BlcnRpZXMgc3BlY1xuICAgIC8vXG5cbiAgICBsZXQgcHJvcE1hcDtcbiAgICBpZiAocHJvcHNUeXBlKSB7XG4gICAgICBwcm9wTWFwID0gdGhpcy5lbWl0UHJvcHNUeXBlUHJvcGVydGllcyhyZXNvdXJjZU5hbWUsIHNwZWMuUHJvcGVydGllcyEsIENvbnRhaW5lci5DbGFzcyk7XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIC8vXG5cbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuY29kZS5saW5lKCcvKionKTtcbiAgICB0aGlzLmNvZGUubGluZShgICogQ3JlYXRlIGEgbmV3ICR7cXVvdGVDb2RlKHJlc291cmNlTmFtZS5zcGVjTmFtZSEuZnFuKX0uYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZCcpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXMnKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICovJyk7XG4gICAgY29uc3Qgb3B0aW9uYWxQcm9wcyA9IHNwZWMuUHJvcGVydGllcyAmJiAhT2JqZWN0LnZhbHVlcyhzcGVjLlByb3BlcnRpZXMpLnNvbWUocCA9PiBwLlJlcXVpcmVkIHx8IGZhbHNlKTtcbiAgICBjb25zdCBwcm9wc0FyZ3VtZW50ID0gcHJvcHNUeXBlID8gYCwgcHJvcHM6ICR7cHJvcHNUeXBlLmNsYXNzTmFtZX0ke29wdGlvbmFsUHJvcHMgPyAnID0ge30nIDogJyd9YCA6ICcnO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGNvbnN0cnVjdG9yKHNjb3BlOiAke0NPTlNUUlVDVF9DTEFTU30sIGlkOiBzdHJpbmcke3Byb3BzQXJndW1lbnR9KWApO1xuICAgIHRoaXMuY29kZS5saW5lKGBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogJHtyZXNvdXJjZU5hbWUuY2xhc3NOYW1lfS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FJHtwcm9wc1R5cGUgPyAnLCBwcm9wZXJ0aWVzOiBwcm9wcycgOiAnJ30gfSk7YCk7XG4gICAgLy8gdmVyaWZ5IGFsbCByZXF1aXJlZCBwcm9wZXJ0aWVzXG4gICAgaWYgKHNwZWMuUHJvcGVydGllcykge1xuICAgICAgZm9yIChjb25zdCBwcm9wTmFtZSBvZiBPYmplY3Qua2V5cyhzcGVjLlByb3BlcnRpZXMpKSB7XG4gICAgICAgIGNvbnN0IHByb3AgPSBzcGVjLlByb3BlcnRpZXNbcHJvcE5hbWVdO1xuICAgICAgICBpZiAocHJvcC5SZXF1aXJlZCkge1xuICAgICAgICAgIHRoaXMuY29kZS5saW5lKGAke0NPUkV9LnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJyR7Z2Vuc3BlYy5jbG91ZEZvcm1hdGlvblRvU2NyaXB0TmFtZShwcm9wTmFtZSl9JywgdGhpcyk7YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNwZWMuUmVxdWlyZWRUcmFuc2Zvcm0pIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCcvLyBBdXRvbWF0aWNhbGx5IGFkZCB0aGUgcmVxdWlyZWQgdHJhbnNmb3JtJyk7XG4gICAgICB0aGlzLmNvZGUubGluZShgdGhpcy5zdGFjay5hZGRUcmFuc2Zvcm0oJHtyZXNvdXJjZU5hbWUuY2xhc3NOYW1lfS5SRVFVSVJFRF9UUkFOU0ZPUk0pO2ApO1xuICAgIH1cblxuICAgIC8vIGluaXRpYWxpemUgYWxsIGF0dHJpYnV0ZSBwcm9wZXJ0aWVzXG4gICAgZm9yIChjb25zdCBhdCBvZiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoYXQuYXR0cmlidXRlVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYHRoaXMuJHthdC5wcm9wZXJ0eU5hbWV9ID0gJHtDT1JFfS5Ub2tlbi5hc1N0cmluZygke2F0LmNvbnN0cnVjdG9yQXJndW1lbnRzfSk7YCk7XG4gICAgICB9IGVsc2UgaWYgKGF0LmF0dHJpYnV0ZVR5cGUgPT09ICdzdHJpbmdbXScpIHtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYHRoaXMuJHthdC5wcm9wZXJ0eU5hbWV9ID0gJHtDT1JFfS5Ub2tlbi5hc0xpc3QoJHthdC5jb25zdHJ1Y3RvckFyZ3VtZW50c30pO2ApO1xuICAgICAgfSBlbHNlIGlmIChhdC5hdHRyaWJ1dGVUeXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLmNvZGUubGluZShgdGhpcy4ke2F0LnByb3BlcnR5TmFtZX0gPSAke0NPUkV9LlRva2VuLmFzTnVtYmVyKCR7YXQuY29uc3RydWN0b3JBcmd1bWVudHN9KTtgKTtcbiAgICAgIH0gZWxzZSBpZiAoYXQuYXR0cmlidXRlVHlwZSA9PT0gZ2Vuc3BlYy5UT0tFTl9OQU1FLmZxbikge1xuICAgICAgICB0aGlzLmNvZGUubGluZShgdGhpcy4ke2F0LnByb3BlcnR5TmFtZX0gPSAke2F0LmNvbnN0cnVjdG9yQXJndW1lbnRzfTtgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIGFsbCBwcm9wZXJ0eSBjbGFzcyBtZW1iZXJzXG4gICAgaWYgKHByb3BzVHlwZSAmJiBwcm9wTWFwKSB7XG4gICAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgICAgZm9yIChjb25zdCBwcm9wIG9mIE9iamVjdC52YWx1ZXMocHJvcE1hcCkpIHtcbiAgICAgICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5TmFtZSh1cGNhc2VGaXJzdChwcm9wKSkgJiYgc2NoZW1hLmlzVGFnZ2FibGVSZXNvdXJjZShzcGVjKSkge1xuICAgICAgICAgIHRoaXMuY29kZS5saW5lKGB0aGlzLnRhZ3MgPSBuZXcgJHtUQUdfTUFOQUdFUn0oJHt0YWdUeXBlKHNwZWMpfSwgJHtjZm5SZXNvdXJjZVR5cGVOYW1lfSwgcHJvcHMuJHtwcm9wfSwgeyB0YWdQcm9wZXJ0eU5hbWU6ICcke3Byb3B9JyB9KTtgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvZGUubGluZShgdGhpcy4ke3Byb3B9ID0gcHJvcHMuJHtwcm9wfTtgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gIFZhbGlkYXRvclxuICAgIC8vXG4gICAgdGhpcy5lbWl0Q29uc3RydWN0VmFsaWRhdG9yKHJlc291cmNlTmFtZSk7XG5cbiAgICAvLyBFbmQgY29uc3RydWN0b3JcbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICB0aGlzLmVtaXRUcmVlQXR0cmlidXRlcyhyZXNvdXJjZU5hbWUpO1xuXG4gICAgLy8gc2V0dXAgcmVuZGVyIHByb3BlcnRpZXNcbiAgICBpZiAocHJvcHNUeXBlICYmIHByb3BNYXApIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgICB0aGlzLmVtaXRDbG91ZEZvcm1hdGlvblByb3BlcnRpZXMocHJvcHNUeXBlLCBwcm9wTWFwLCBzY2hlbWEuaXNUYWdnYWJsZVJlc291cmNlKHNwZWMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlQ2xhc3MocmVzb3VyY2VOYW1lKTtcblxuICAgIHRoaXMuZW5kTmFtZXNwYWNlKHJlc291cmNlTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogV2UgcmVzb2x2ZSBoZXJlLlxuICAgKlxuICAgKiBTaW5jZSByZXNvbHZlKCkgZGVlcC1yZXNvbHZlcywgd2Ugb25seSBuZWVkIHRvIGRvIHRoaXMgb25jZS5cbiAgICovXG4gIHByaXZhdGUgZW1pdENsb3VkRm9ybWF0aW9uUHJvcGVydGllcyhwcm9wc1R5cGU6IGdlbnNwZWMuQ29kZU5hbWUsIHByb3BNYXA6IERpY3Rpb25hcnk8c3RyaW5nPiwgdGFnZ2FibGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNvZGUub3BlbkJsb2NrKCdwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAnKTtcbiAgICB0aGlzLmNvZGUuaW5kZW50KCdyZXR1cm4geycpO1xuICAgIGZvciAoY29uc3QgcHJvcCBvZiBPYmplY3QudmFsdWVzKHByb3BNYXApKSB7XG4gICAgICAvLyBoYW5kbGUgdGFnIHJlbmRlcmluZyBiZWNhdXNlIG9mIHNwZWNpYWwgY2FzZXNcbiAgICAgIGlmICh0YWdnYWJsZSAmJiBzY2hlbWEuaXNUYWdQcm9wZXJ0eU5hbWUodXBjYXNlRmlyc3QocHJvcCkpKSB7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGAke3Byb3B9OiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLGApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29kZS5saW5lKGAke3Byb3B9OiB0aGlzLiR7cHJvcH0sYCk7XG4gICAgfVxuICAgIHRoaXMuY29kZS51bmluZGVudCgnfTsnKTtcbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcblxuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soJ3Byb3RlY3RlZCBvdmVycmlkZSByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYHJldHVybiAke2dlbnNwZWMuY2ZuTWFwcGVyTmFtZShwcm9wc1R5cGUpLmZxbn0ocHJvcHMpO2ApO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHZhbGlkYXRpb25zIGZvciB0aGUgZ2l2ZW4gY29uc3RydWN0XG4gICAqXG4gICAqIFRoZSBnZW5lcmF0ZWQgY29kZSBsb29rcyBsaWtlIHRoaXM6XG4gICAqXG4gICAqIGBgYFxuICAgKiB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiAvKiB2YWxpZGF0aW9uIGNvZGUgKiAvIH0pO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0Q29uc3RydWN0VmFsaWRhdG9yKHJlc291cmNlVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSkge1xuICAgIGNvbnN0IGNmbkxpbnQgPSBjZm5MaW50QW5ub3RhdGlvbnMocmVzb3VyY2VUeXBlLnNwZWNOYW1lPy5mcW4gPz8gJycpO1xuXG4gICAgaWYgKGNmbkxpbnQuc3RhdGVmdWwpIHtcbiAgICAgIC8vIERvIGEgc3RhdGVmdWxuZXNzIGNoZWNrLiBBIGRlbGV0aW9uUG9saWN5IGlzIHJlcXVpcmVkIChhbmQgaW4gbm9ybWFsIG9wZXJhdGlvbiBhbiBVcGRhdGVSZXBsYWNlUG9saWN5XG4gICAgICAvLyB3b3VsZCBhbHNvIGJlIHNldCBpZiBhIHVzZXIgZG9lc24ndCBkbyBjb21wbGljYXRlZCBzaGVuYW5pZ2FucywgaW4gd2hpY2ggY2FzZSB0aGV5IHByb2JhYmx5IGtub3cgd2hhdFxuICAgICAgLy8gdGhleSdyZSBkb2luZy5cbiAgICAgIC8vXG4gICAgICAvLyBPbmx5IGRvIHRoaXMgZm9yIEwxcyBlbWJlZGRlZCBpbiBMMnMgKHRvIGZvcmNlIEwyIGF1dGhvcnMgdG8gYWRkIGEgd2F5IHRvIHNldCB0aGlzIHBvbGljeSkuIElmIHdlIGRpZCBpdCBmb3IgYWxsIEwxczpcbiAgICAgIC8vXG4gICAgICAvLyAtIHVzZXJzIHdvcmtpbmcgYXQgdGhlIEwxIGxldmVsIHdvdWxkIHN0YXJ0IGdldHRpbmcgc3ludGhlc2lzIGZhaWx1cmVzIHdoZW4gd2UgYWRkIHRoaXMgZmVhdHVyZVxuICAgICAgLy8gLSB0aGUgYGNsb3VkZm9ybWF0aW9uLWluY2x1ZGVgIGxpYnJhcnkgdGhhdCBsb2FkcyBDRk4gdGVtcGxhdGVzIHRvIEwxcyB3b3VsZCBzdGFydCBmYWlsaW5nIHdoZW4gaXQgbG9hZHNcbiAgICAgIC8vICAgdGVtcGxhdGVzIHRoYXQgZG9uJ3QgaGF2ZSBEZWxldGlvblBvbGljeSBzZXQuXG4gICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBpZiAodGhpcy5ub2RlLnNjb3BlICYmICR7Q09SRX0uUmVzb3VyY2UuaXNSZXNvdXJjZSh0aGlzLm5vZGUuc2NvcGUpKWApO1xuICAgICAgdGhpcy5jb2RlLmxpbmUoJ3RoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMuY2ZuT3B0aW9ucy5kZWxldGlvblBvbGljeSA9PT0gdW5kZWZpbmVkJyk7XG4gICAgICB0aGlzLmNvZGUubGluZShgICA/IFtcXCdcXFxcXFwnJHtyZXNvdXJjZVR5cGUuc3BlY05hbWU/LmZxbn1cXFxcXFwnIGlzIGEgc3RhdGVmdWwgcmVzb3VyY2UgdHlwZSwgYW5kIHlvdSBtdXN0IHNwZWNpZnkgYSBSZW1vdmFsIFBvbGljeSBmb3IgaXQuIENhbGwgXFxcXFxcJ3Jlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeSgpXFxcXFxcJy5cXCddYCk7XG4gICAgICB0aGlzLmNvZGUubGluZSgnICA6IFtdIH0pOycpO1xuICAgICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW1pdCB0aGUgZnVuY3Rpb24gdGhhdCBpcyBnb2luZyB0byBpbXBsZW1lbnQgdGhlIElJbnNwZWN0YWJsZSBpbnRlcmZhY2UuXG4gICAqXG4gICAqIFRoZSBnZW5lcmF0ZWQgY29kZSBsb29rcyBsaWtlIHRoaXM6XG4gICAqIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICogICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuTWFuYWdlZFBvbGljeS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICogICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAqIH1cbiAgICpcbiAgICovXG4gIHByaXZhdGUgZW1pdFRyZWVBdHRyaWJ1dGVzKHJlc291cmNlOiBnZW5zcGVjLkNvZGVOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLicpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKicpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogJHtDT1JFfS5UcmVlSW5zcGVjdG9yKWApO1xuICAgIHRoaXMuY29kZS5saW5lKGBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiJHtUcmVlQXR0cmlidXRlcy5DRk5fVFlQRX1cIiwgJHtyZXNvdXJjZS5jbGFzc05hbWV9LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO2ApO1xuICAgIHRoaXMuY29kZS5saW5lKGBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiJHtUcmVlQXR0cmlidXRlcy5DRk5fUFJPUFN9XCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7YCk7XG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBmdW5jdGlvbiB0aGF0IGlzIGdvaW5nIHRvIG1hcCB0aGUgZ2VuZXJhdGVkIFR5cGVTY3JpcHQgb2JqZWN0IGJhY2sgaW50byB0aGUgc2NoZW1hIHRoYXQgQ2xvdWRGb3JtYXRpb24gZXhwZWN0c1xuICAgKlxuICAgKiBUaGUgZ2VuZXJhdGVkIGNvZGUgbG9va3MgbGlrZSB0aGlzOlxuICAgKlxuICAgKiAgZnVuY3Rpb24gYnVja2V0UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAqICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHJldHVybiBwcm9wZXJ0aWVzO1xuICAgKiAgICBCdWNrZXRQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAqICAgIHJldHVybiB7XG4gICAqICAgICAgQWNjZWxlcmF0ZUNvbmZpZ3VyYXRpb246IGJ1Y2tldEFjY2VsZXJhdGVDb25maWd1cmF0aW9uUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYWNjZWxlcmF0ZUNvbmZpZ3VyYXRpb24pLFxuICAgKiAgICAgIEFjY2Vzc0NvbnRyb2w6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuYWNjZXNzQ29udHJvbCksXG4gICAqICAgICAgQW5hbHl0aWNzQ29uZmlndXJhdGlvbnM6IGNkay5saXN0TWFwcGVyKGJ1Y2tldEFuYWx5dGljc0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24pXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHByb3BlcnRpZXMuYW5hbHl0aWNzQ29uZmlndXJhdGlvbnMpLFxuICAgKiAgICAgIC8vIC4uLlxuICAgKiAgICB9O1xuICAgKiAgfVxuICAgKlxuICAgKiBHZW5lcmF0ZWQgYXMgYSB0b3AtbGV2ZWwgZnVuY3Rpb24gb3V0c2lkZSBhbnkgbmFtZXNwYWNlIHNvIHdlIGNhbiBoaWRlIGl0IGZyb20gbGlicmFyeSBjb25zdW1lcnMuXG4gICAqL1xuICBwcml2YXRlIGVtaXRDbG91ZEZvcm1hdGlvbk1hcHBlcihcbiAgICByZXNvdXJjZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICB0eXBlTmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICBwcm9wU3BlY3M6IHsgW25hbWU6IHN0cmluZ106IHNjaGVtYS5Qcm9wZXJ0eSB9LFxuICAgIG5hbWVDb252ZXJzaW9uVGFibGU6IERpY3Rpb25hcnk8c3RyaW5nPikge1xuICAgIGNvbnN0IG1hcHBlck5hbWUgPSBnZW5zcGVjLmNmbk1hcHBlck5hbWUodHlwZU5hbWUpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiAke3F1b3RlQ29kZSh0eXBlTmFtZS5zcGVjTmFtZSEuZnFuKX0gcmVzb3VyY2VgKTtcbiAgICB0aGlzLmNvZGUubGluZSgnIConKTtcbiAgICB0aGlzLmNvZGUubGluZShgICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgJHtxdW90ZUNvZGUodHlwZU5hbWUuY2xhc3NOYW1lKX1gKTtcbiAgICB0aGlzLmNvZGUubGluZSgnIConKTtcbiAgICB0aGlzLmNvZGUubGluZShgICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuICR7cXVvdGVDb2RlKHR5cGVOYW1lLnNwZWNOYW1lIS5mcW4pfSByZXNvdXJjZS5gKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICovJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8vIEB0cy1pZ25vcmUgVFM2MTMzJyk7XG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgZnVuY3Rpb24gJHttYXBwZXJOYW1lLmZ1bmN0aW9uTmFtZX0ocHJvcGVydGllczogYW55KTogYW55YCk7XG5cbiAgICAvLyBJdCBtaWdodCBiZSB0aGF0IHRoaXMgdmFsdWUgaXMgJ251bGwnIG9yICd1bmRlZmluZWQnLCBhbmQgdGhhdCB0aGF0J3MgT0suIFNpbXBseSByZXR1cm5cbiAgICAvLyB0aGUgZmFsc2V5IHZhbHVlLCB0aGUgdXBzdHJlYW0gc3RydWN0IGlzIGluIGEgYmV0dGVyIHBvc2l0aW9uIHRvIGtub3cgd2hldGhlciB0aGlzIGlzIHJlcXVpcmVkIG9yIG5vdC5cbiAgICB0aGlzLmNvZGUubGluZShgaWYgKCEke0NPUkV9LmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1gKTtcblxuICAgIC8vIERvIGEgJ3R5cGUnIGNoZWNrIGZpcnN0XG4gICAgY29uc3QgdmFsaWRhdG9yTmFtZSA9IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlTmFtZSk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCR7dmFsaWRhdG9yTmFtZS5mcW59KHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtgKTtcblxuICAgIC8vIEdlbmVyYXRlIHRoZSByZXR1cm4gb2JqZWN0XG4gICAgdGhpcy5jb2RlLmluZGVudCgncmV0dXJuIHsnKTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKG5hbWVDb252ZXJzaW9uVGFibGUpLmZvckVhY2goY2ZuTmFtZSA9PiB7XG4gICAgICBjb25zdCBwcm9wTmFtZSA9IG5hbWVDb252ZXJzaW9uVGFibGVbY2ZuTmFtZV07XG4gICAgICBjb25zdCBwcm9wU3BlYyA9IHByb3BTcGVjc1tjZm5OYW1lXTtcblxuICAgICAgY29uc3QgbWFwcGVyRXhwcmVzc2lvbiA9IGdlbnNwZWMudHlwZURpc3BhdGNoPHN0cmluZz4ocmVzb3VyY2UsIHByb3BTcGVjLCB7XG4gICAgICAgIHZpc2l0QXRvbSh0eXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgICAgICAgY29uc3Qgc3BlY1R5cGUgPSB0eXBlLnNwZWNOYW1lICYmIHNlbGYuc3BlYy5Qcm9wZXJ0eVR5cGVzW3R5cGUuc3BlY05hbWUuZnFuXTtcbiAgICAgICAgICBpZiAoc3BlY1R5cGUgJiYgIXNjaGVtYS5pc1JlY29yZFR5cGUoc3BlY1R5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2Vuc3BlYy50eXBlRGlzcGF0Y2gocmVzb3VyY2UsIHNwZWNUeXBlLCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGdlbnNwZWMuY2ZuTWFwcGVyTmFtZSh0eXBlKS5mcW47XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0QXRvbVVuaW9uKHR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICBjb25zdCB2YWxpZGF0b3JzID0gdHlwZXMubWFwKHR5cGUgPT4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbik7XG4gICAgICAgICAgY29uc3QgbWFwcGVycyA9IHR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKTtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0udW5pb25NYXBwZXIoWyR7dmFsaWRhdG9ycy5qb2luKCcsICcpfV0sIFske21hcHBlcnMuam9pbignLCAnKX1dKWA7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0TGlzdChpdGVtVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSkge1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS5saXN0TWFwcGVyKCR7dGhpcy52aXNpdEF0b20oaXRlbVR5cGUpfSlgO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdFVuaW9uTGlzdChpdGVtVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBpdGVtVHlwZXMubWFwKHR5cGUgPT4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbik7XG4gICAgICAgICAgY29uc3QgbWFwcGVycyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiB0aGlzLnZpc2l0QXRvbSh0eXBlKSk7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmxpc3RNYXBwZXIoJHtDT1JFfS51bmlvbk1hcHBlcihbJHt2YWxpZGF0b3JzLmpvaW4oJywgJyl9XSwgWyR7bWFwcGVycy5qb2luKCcsICcpfV0pKWA7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0TWFwKGl0ZW1UeXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmhhc2hNYXBwZXIoJHt0aGlzLnZpc2l0QXRvbShpdGVtVHlwZSl9KWA7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0TWFwT2ZMaXN0cyhpdGVtVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSkge1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS5oYXNoTWFwcGVyKCR7Q09SRX0ubGlzdE1hcHBlcigke3RoaXMudmlzaXRBdG9tKGl0ZW1UeXBlKX0pKWA7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0VW5pb25NYXAoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICBjb25zdCB2YWxpZGF0b3JzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pO1xuICAgICAgICAgIGNvbnN0IG1hcHBlcnMgPSBpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpO1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS5oYXNoTWFwcGVyKCR7Q09SRX0udW5pb25NYXBwZXIoWyR7dmFsaWRhdG9ycy5qb2luKCcsICcpfV0sIFske21hcHBlcnMuam9pbignLCAnKX1dKSlgO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdExpc3RPckF0b20odHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSwgaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IHR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pLmpvaW4oJywgJyk7XG4gICAgICAgICAgY29uc3QgaXRlbVZhbGlkYXRvck5hbWVzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pLmpvaW4oJywgJyk7XG5cbiAgICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3IgPSBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3ZhbGlkYXRvck5hbWVzfSlgO1xuICAgICAgICAgIGNvbnN0IGxpc3RWYWxpZGF0b3IgPSBgJHtDT1JFfS5saXN0VmFsaWRhdG9yKCR7Q09SRX0udW5pb25WYWxpZGF0b3IoJHtpdGVtVmFsaWRhdG9yTmFtZXN9KSlgO1xuICAgICAgICAgIGNvbnN0IHNjYWxhck1hcHBlciA9IGAke0NPUkV9LnVuaW9uTWFwcGVyKFske3ZhbGlkYXRvck5hbWVzfV0sIFske3R5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfV0pYDtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgIGNvbnN0IGxpc3RNYXBwZXIgPSBgJHtDT1JFfS5saXN0TWFwcGVyKCR7Q09SRX0udW5pb25NYXBwZXIoWyR7aXRlbVZhbGlkYXRvck5hbWVzfV0sIFske2l0ZW1UeXBlcy5tYXAodHlwZSA9PiB0aGlzLnZpc2l0QXRvbSh0eXBlKSkuam9pbignLCAnKX1dKSlgO1xuXG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9LnVuaW9uTWFwcGVyKFske3NjYWxhclZhbGlkYXRvcn0sICR7bGlzdFZhbGlkYXRvcn1dLCBbJHtzY2FsYXJNYXBwZXJ9LCAke2xpc3RNYXBwZXJ9XSlgO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuY29kZS5saW5lKGAke2Nmbk5hbWV9OiAke21hcHBlckV4cHJlc3Npb259KHByb3BlcnRpZXMuJHtwcm9wTmFtZX0pLGApO1xuICAgIH0pO1xuICAgIHRoaXMuY29kZS51bmluZGVudCgnfTsnKTtcbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgZnJvbSBhIHB1cmUgQ2xvdWRGb3JtYXRpb24gdmFsdWUgdGFrZW4gZnJvbSBhIHRlbXBsYXRlXG4gICAqIHRvIGFuIGluc3RhbmNlIG9mIHRoZSBnaXZlbiBDREsgc3RydWN0LlxuICAgKiBUaGlzIGludm9sdmVzIGNoYW5naW5nIHRoZSBjYXNpbmcgb2YgdGhlIHByb3BlcnRpZXMsXG4gICAqIGZyb20gVXBwZXJDYW1lbENhc2UgdXNlZCBieSBDbG91ZEZvcm1hdGlvbixcbiAgICogdG8gbG93ZXJDYW1lbENhc2UgdXNlZCBieSB0aGUgQ0RLLFxuICAgKiBhbmQgYWxzbyB0cmFuc2xhdGluZyB0aGluZ3MgbGlrZSBJUmVzb2x2YWJsZSBpbnRvIHN0cmluZ3MsIG51bWJlcnMgb3Igc3RyaW5nIGFycmF5cyxcbiAgICogZGVwZW5kaW5nIG9uIHRoZSB0eXBlIG9mIHRoZSBMMSBwcm9wZXJ0eS5cbiAgICovXG4gIHByaXZhdGUgZW1pdEZyb21DZm5GYWN0b3J5RnVuY3Rpb24oXG4gICAgcmVzb3VyY2U6IGdlbnNwZWMuQ29kZU5hbWUsXG4gICAgdHlwZU5hbWU6IGdlbnNwZWMuQ29kZU5hbWUsXG4gICAgcHJvcFNwZWNzOiB7IFtuYW1lOiBzdHJpbmddOiBzY2hlbWEuUHJvcGVydHkgfSxcbiAgICBuYW1lQ29udmVyc2lvblRhYmxlOiBEaWN0aW9uYXJ5PHN0cmluZz4sXG4gICAgYWxsb3dSZXR1cm5pbmdJUmVzb2x2YWJsZTogYm9vbGVhbikge1xuXG4gICAgY29uc3QgZmFjdG9yeU5hbWUgPSBnZW5zcGVjLmZyb21DZm5GYWN0b3J5TmFtZSh0eXBlTmFtZSk7XG5cbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIC8vIERvIG5vdCBlcnJvciBvdXQgaWYgdGhpcyBmdW5jdGlvbiBpcyB1bnVzZWQuXG4gICAgLy8gU29tZSB0eXBlcyBhcmUgZGVjbGFyZWQgaW4gdGhlIENGTiBzY2hlbWEsXG4gICAgLy8gYnV0IG5ldmVyIHVzZWQgYXMgdHlwZXMgb2YgcHJvcGVydGllcyxcbiAgICAvLyBhbmQgaW4gdGhvc2UgY2FzZXMgdGhpcyBmdW5jdGlvbiB3aWxsIG5ldmVyIGJlIGNhbGxlZC5cbiAgICB0aGlzLmNvZGUubGluZSgnLy8gQHRzLWlnbm9yZSBUUzYxMzMnKTtcblxuICAgIGNvbnN0IHJldHVyblR5cGUgPSBgJHt0eXBlTmFtZS5mcW59JHthbGxvd1JldHVybmluZ0lSZXNvbHZhYmxlID8gJyB8ICcgKyBDT1JFICsgJy5JUmVzb2x2YWJsZScgOiAnJ31gO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGZ1bmN0aW9uICR7ZmFjdG9yeU5hbWUuZnVuY3Rpb25OYW1lfShwcm9wZXJ0aWVzOiBhbnkpOiBgICtcbiAgICAgIGAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PCR7cmV0dXJuVHlwZX0+YCk7XG5cbiAgICBpZiAoYWxsb3dSZXR1cm5pbmdJUmVzb2x2YWJsZSkge1xuICAgICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgaWYgKCR7Q09SRX0uaXNSZXNvbHZhYmxlT2JqZWN0KHByb3BlcnRpZXMpKWApO1xuICAgICAgdGhpcy5jb2RlLmxpbmUoYHJldHVybiBuZXcgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtgKTtcbiAgICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2RlLmxpbmUoJ3Byb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7Jyk7XG4gICAgLy8gaWYgdGhlIHBhc3NlZCB2YWx1ZSBpcyBub3QgYW4gb2JqZWN0LCBpbW1lZGlhdGVseSByZXR1cm4gaXQsXG4gICAgLy8gYW5kIGxldCBhIHZhbGlkYXRvciByZXBvcnQgYW4gZXJyb3IgLVxuICAgIC8vIG90aGVyd2lzZSwgd2UnbGwganVzdCByZXR1cm4gYW4gZW1wdHkgb2JqZWN0IGZvciB0aGlzIGNhc2UsXG4gICAgLy8gd2hpY2ggYSB2YWxpZGF0b3IgbWlnaHQgbm90IGNhdGNoXG4gICAgLy8gKGlmIHRoZSBpbnRlcmZhY2Ugd2UncmUgZW1pdHRpbmcgdGhpcyBmdW5jdGlvbiBmb3IgaGFzIG5vIHJlcXVpcmVkIHByb3BlcnRpZXMsIGZvciBleGFtcGxlKVxuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soXCJpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKVwiKTtcbiAgICB0aGlzLmNvZGUubGluZShgcmV0dXJuIG5ldyAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO2ApO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICB0aGlzLmNvZGUubGluZShgY29uc3QgcmV0ID0gbmV3ICR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDwke3R5cGVOYW1lLmZxbn0+KCk7YCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gY2xhc3MgdXNlZCBmb3IgdGhlIHZpc2l0b3JcbiAgICBjbGFzcyBGcm9tQ2xvdWRGb3JtYXRpb25GYWN0b3J5VmlzaXRvciBpbXBsZW1lbnRzIGdlbnNwZWMuUHJvcGVydHlWaXNpdG9yPHN0cmluZz4ge1xuICAgICAgcHVibGljIHZpc2l0QXRvbSh0eXBlOiBnZW5zcGVjLkNvZGVOYW1lKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3Qgc3BlY1R5cGUgPSB0eXBlLnNwZWNOYW1lICYmIHNlbGYuc3BlYy5Qcm9wZXJ0eVR5cGVzW3R5cGUuc3BlY05hbWUuZnFuXTtcbiAgICAgICAgaWYgKHNwZWNUeXBlICYmICFzY2hlbWEuaXNSZWNvcmRUeXBlKHNwZWNUeXBlKSkge1xuICAgICAgICAgIHJldHVybiBnZW5zcGVjLnR5cGVEaXNwYXRjaChyZXNvdXJjZSwgc3BlY1R5cGUsIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBnZW5zcGVjLmZyb21DZm5GYWN0b3J5TmFtZSh0eXBlKS5mcW47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVibGljIHZpc2l0TGlzdChpdGVtVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBpdGVtVHlwZS5jbGFzc05hbWUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgLy8gYW4gYXJyYXkgb2Ygc3RyaW5ncyBpcyBhIHNwZWNpYWwgY2FzZSxcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IG1pZ2h0IG5lZWQgdG8gYmUgZW5jb2RlZCBhcyBhIFRva2VuIGRpcmVjdGx5XG4gICAgICAgICAgLy8gKGFuZCBub3QgYW4gYXJyYXkgb2YgdG9rZW5zKSwgZm9yIGV4YW1wbGUsXG4gICAgICAgICAgLy8gd2hlbiBhIFJlZiBleHByZXNzaW9uIHJlZmVyZW5jZXMgYSBwYXJhbWV0ZXIgb2YgdHlwZSBDb21tYURlbGltaXRlZExpc3RcbiAgICAgICAgICA/IGAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5YFxuICAgICAgICAgIDogYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoJHt0aGlzLnZpc2l0QXRvbShpdGVtVHlwZSl9KWA7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyB2aXNpdE1hcChpdGVtVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRNYXAoJHt0aGlzLnZpc2l0QXRvbShpdGVtVHlwZSl9KWA7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyB2aXNpdE1hcE9mTGlzdHMoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TWFwKGAgK1xuICAgICAgICAgIGAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KCR7dGhpcy52aXNpdEF0b20oaXRlbVR5cGUpfSkpYDtcbiAgICAgIH1cblxuICAgICAgcHVibGljIHZpc2l0QXRvbVVuaW9uKHR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IHR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pLmpvaW4oJywgJyk7XG4gICAgICAgIGNvbnN0IG1hcHBlcnMgPSB0eXBlcy5tYXAodHlwZSA9PiB0aGlzLnZpc2l0QXRvbSh0eXBlKSkuam9pbignLCAnKTtcblxuICAgICAgICByZXR1cm4gYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0VHlwZVVuaW9uKFske3ZhbGlkYXRvck5hbWVzfV0sIFske21hcHBlcnN9XSlgO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgdmlzaXRVbmlvbkxpc3QoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBtYXBwZXJzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpO1xuXG4gICAgICAgIHJldHVybiBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShgICtcbiAgICAgICAgICBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRUeXBlVW5pb24oWyR7dmFsaWRhdG9yTmFtZXN9XSwgWyR7bWFwcGVyc31dKWAgK1xuICAgICAgICAgICcpJztcbiAgICAgIH1cblxuICAgICAgcHVibGljIHZpc2l0VW5pb25NYXAoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBtYXBwZXJzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpO1xuXG4gICAgICAgIHJldHVybiBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRNYXAoYCArXG4gICAgICAgICAgYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0VHlwZVVuaW9uKFske3ZhbGlkYXRvck5hbWVzfV0sIFske21hcHBlcnN9XSlgICtcbiAgICAgICAgICAnKSc7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyB2aXNpdExpc3RPckF0b20oc2NhbGFyVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSwgaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBhbnkge1xuICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3JOYW1lcyA9IHNjYWxhclR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pLmpvaW4oJywgJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1WYWxpZGF0b3JOYW1lcyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKS5qb2luKCcsICcpO1xuXG4gICAgICAgIGNvbnN0IHNjYWxhclR5cGVzTWFwcGVycyA9IHNjYWxhclR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBzY2FsYXJNYXBwZXIgPSBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRUeXBlVW5pb24oWyR7c2NhbGFyVmFsaWRhdG9yTmFtZXN9XSwgWyR7c2NhbGFyVHlwZXNNYXBwZXJzfV0pYDtcblxuICAgICAgICBjb25zdCBpdGVtVHlwZU1hcHBlcnMgPSBpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyk7XG4gICAgICAgIGNvbnN0IGxpc3RNYXBwZXIgPSBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShgICtcbiAgICAgICAgICBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRUeXBlVW5pb24oWyR7aXRlbVZhbGlkYXRvck5hbWVzfV0sIFske2l0ZW1UeXBlTWFwcGVyc31dKWAgK1xuICAgICAgICAgICcpJztcblxuICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3IgPSBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3NjYWxhclZhbGlkYXRvck5hbWVzfSlgO1xuICAgICAgICBjb25zdCBsaXN0VmFsaWRhdG9yID0gYCR7Q09SRX0ubGlzdFZhbGlkYXRvcigke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7aXRlbVZhbGlkYXRvck5hbWVzfSkpYDtcblxuICAgICAgICByZXR1cm4gYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0VHlwZVVuaW9uKFske3NjYWxhclZhbGlkYXRvcn0sICR7bGlzdFZhbGlkYXRvcn1dLCBbJHtzY2FsYXJNYXBwZXJ9LCAke2xpc3RNYXBwZXJ9XSlgO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2NmblByb3BOYW1lLCBjZGtQcm9wTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMobmFtZUNvbnZlcnNpb25UYWJsZSkpIHtcbiAgICAgIGNvbnN0IHByb3BTcGVjID0gcHJvcFNwZWNzW2NmblByb3BOYW1lXTtcbiAgICAgIGNvbnN0IHNpbXBsZUNmblByb3BBY2Nlc3NFeHByID0gYHByb3BlcnRpZXMuJHtjZm5Qcm9wTmFtZX1gO1xuICAgICAgY29uc3QgZGVzZXJpYWxpemVkRXhwcmVzc2lvbiA9IGdlbnNwZWMudHlwZURpc3BhdGNoPHN0cmluZz4ocmVzb3VyY2UsIHByb3BTcGVjLCBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uRmFjdG9yeVZpc2l0b3IoKSkgK1xuICAgICAgICBgKCR7c2ltcGxlQ2ZuUHJvcEFjY2Vzc0V4cHJ9KWA7XG5cbiAgICAgIGxldCB2YWx1ZUV4cHJlc3Npb24gPSBwcm9wU3BlYy5SZXF1aXJlZFxuICAgICAgICA/IGRlc2VyaWFsaXplZEV4cHJlc3Npb25cbiAgICAgICAgOiBgJHtzaW1wbGVDZm5Qcm9wQWNjZXNzRXhwcn0gIT0gbnVsbCA/ICR7ZGVzZXJpYWxpemVkRXhwcmVzc2lvbn0gOiB1bmRlZmluZWRgO1xuICAgICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5TmFtZShjZm5Qcm9wTmFtZSkpIHtcbiAgICAgICAgLy8gUHJvcGVydGllcyB0aGF0IGhhdmUgbmFtZXMgY29uc2lkZXJlZCB0byBkZW5vdGUgdGFnc1xuICAgICAgICAvLyBoYXZlIHRoZWlyIHR5cGUgZ2VuZXJhdGVkIHdpdGhvdXQgYSB1bmlvbiB3aXRoIElSZXNvbHZhYmxlLlxuICAgICAgICAvLyBIb3dldmVyLCB3ZSBjYW4ndCBwb3NzaWJseSBrbm93IHRoYXQgd2hlbiBnZW5lcmF0aW5nIHRoZSBmYWN0b3J5XG4gICAgICAgIC8vIGZvciB0aGF0IHN0cnVjdCwgYW5kIChpbiB0aGVvcnksIGF0IGxlYXN0KVxuICAgICAgICAvLyB0aGUgc2FtZSB0eXBlIGNhbiBiZSB1c2VkIGFzIHRoZSB2YWx1ZSBvZiBtdWx0aXBsZSBwcm9wZXJ0aWVzLFxuICAgICAgICAvLyBzb21lIG9mIHdoaWNoIGRvIG5vdCBoYXZlIGEgdGFnLWNvbXBhdGlibGUgbmFtZSxcbiAgICAgICAgLy8gc28gdGhlcmUgaXMgbm8gd2F5IHRvIHBhc3MgYWxsb3dSZXR1cm5pbmdJUmVzb2x2YWJsZT1mYWxzZSBjb3JyZWN0bHkuXG4gICAgICAgIC8vIERvIHRoZSBzaW1wbGUgdGhpbmcgaW4gdGhhdCBjYXNlLCBhbmQganVzdCBjYXN0IHRvIGFueS5cbiAgICAgICAgdmFsdWVFeHByZXNzaW9uICs9ICcgYXMgYW55JztcbiAgICAgIH1cblxuICAgICAgc2VsZi5jb2RlLmxpbmUoYHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnJHtjZGtQcm9wTmFtZX0nLCAnJHtjZm5Qcm9wTmFtZX0nLCAke3ZhbHVlRXhwcmVzc2lvbn0pO2ApO1xuICAgIH1cblxuICAgIC8vIHNhdmUgYW55IGV4dHJhIHByb3BlcnRpZXMgd2UgZmluZCBvbiB0aGlzIGxldmVsXG4gICAgdGhpcy5jb2RlLmxpbmUoJ3JldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTsnKTtcblxuICAgIC8vIHJldHVybiB0aGUgcmVzdWx0IG9iamVjdFxuICAgIHRoaXMuY29kZS5saW5lKCdyZXR1cm4gcmV0OycpO1xuXG4gICAgLy8gY2xvc2UgdGhlIGZ1bmN0aW9uIGJyYWNlXG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IGEgZnVuY3Rpb24gdGhhdCB3aWxsIHZhbGlkYXRlIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnR5IGJhZyBtYXRjaGVzIHRoZSBzY2hlbWEgb2YgdGhpcyBjb21wbGV4IHR5cGVcbiAgICpcbiAgICogR2VuZXJhdGVkIGFzIGEgdG9wLWxldmVsIGZ1bmN0aW9uIG91dHNpZGUgYW55IG5hbWVzcGFjZSBzbyB3ZSBjYW4gaGlkZSBpdCBmcm9tIGxpYnJhcnkgY29uc3VtZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0UHJvcGVydGllc1ZhbGlkYXRvcihcbiAgICByZXNvdXJjZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICB0eXBlTmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICBwcm9wU3BlY3M6IHsgW25hbWU6IHN0cmluZ106IHNjaGVtYS5Qcm9wZXJ0eSB9LFxuICAgIG5hbWVDb252ZXJzaW9uVGFibGU6IERpY3Rpb25hcnk8c3RyaW5nPik6IHZvaWQge1xuICAgIGNvbnN0IHZhbGlkYXRvck5hbWUgPSBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZU5hbWUpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhICR7cXVvdGVDb2RlKHR5cGVOYW1lLmNsYXNzTmFtZSl9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhICR7cXVvdGVDb2RlKHR5cGVOYW1lLmNsYXNzTmFtZSl9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGZ1bmN0aW9uICR7dmFsaWRhdG9yTmFtZS5mdW5jdGlvbk5hbWV9KHByb3BlcnRpZXM6IGFueSk6ICR7Q09SRX0uVmFsaWRhdGlvblJlc3VsdGApO1xuICAgIHRoaXMuY29kZS5saW5lKGBpZiAoISR7Q09SRX0uY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gJHtDT1JFfS5WQUxJREFUSU9OX1NVQ0NFU1M7IH1gKTtcblxuICAgIHRoaXMuY29kZS5saW5lKGBjb25zdCBlcnJvcnMgPSBuZXcgJHtDT1JFfS5WYWxpZGF0aW9uUmVzdWx0cygpO2ApO1xuXG4gICAgLy8gY2hlY2sgdGhhdCB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gICAgLy8gbm9ybWFsbHksIHdlIHdvdWxkIGhhdmUgdG8gZXhwbGljaXRseSBjaGVjayBmb3IgbnVsbCBoZXJlLFxuICAgIC8vIGFzIHR5cGVvZiBudWxsIGlzICdvYmplY3QnIGluIEphdmFTY3JpcHQsXG4gICAgLy8gYnV0IHZhbGlkYXRvcnMgYXJlIG5ldmVyIGNhbGxlZCB3aXRoIG51bGxcbiAgICAvLyAoYXMgZXZpZGVuY2VkIGJ5IHRoZSBjb2RlIGJlbG93IGFjY2Vzc2luZyBwcm9wZXJ0aWVzIG9mIHRoZSBhcmd1bWVudCB3aXRob3V0IGNoZWNraW5nIGZvciBudWxsKVxuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soXCJpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKVwiKTtcbiAgICB0aGlzLmNvZGUubGluZShgZXJyb3JzLmNvbGxlY3QobmV3ICR7Q09SRX0uVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO2ApO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICBPYmplY3Qua2V5cyhwcm9wU3BlY3MpLmZvckVhY2goY2ZuUHJvcE5hbWUgPT4ge1xuICAgICAgY29uc3QgcHJvcFNwZWMgPSBwcm9wU3BlY3NbY2ZuUHJvcE5hbWVdO1xuICAgICAgY29uc3QgcHJvcE5hbWUgPSBuYW1lQ29udmVyc2lvblRhYmxlW2NmblByb3BOYW1lXTtcblxuICAgICAgaWYgKHByb3BTcGVjLlJlcXVpcmVkKSB7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGBlcnJvcnMuY29sbGVjdCgke0NPUkV9LnByb3BlcnR5VmFsaWRhdG9yKCcke3Byb3BOYW1lfScsICR7Q09SRX0ucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuJHtwcm9wTmFtZX0pKTtgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCB2YWxpZGF0b3JFeHByZXNzaW9uID0gZ2Vuc3BlYy50eXBlRGlzcGF0Y2g8c3RyaW5nPihyZXNvdXJjZSwgcHJvcFNwZWMsIHtcbiAgICAgICAgdmlzaXRBdG9tKHR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCBzcGVjVHlwZSA9IHR5cGUuc3BlY05hbWUgJiYgc2VsZi5zcGVjLlByb3BlcnR5VHlwZXNbdHlwZS5zcGVjTmFtZS5mcW5dO1xuICAgICAgICAgIGlmIChzcGVjVHlwZSAmJiAhc2NoZW1hLmlzUmVjb3JkVHlwZShzcGVjVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBnZW5zcGVjLnR5cGVEaXNwYXRjaChyZXNvdXJjZSwgc3BlY1R5cGUsIHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbjtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRBdG9tVW5pb24odHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3R5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfSlgO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdExpc3QoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0ubGlzdFZhbGlkYXRvcigke3RoaXMudmlzaXRBdG9tKGl0ZW1UeXBlKX0pYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRVbmlvbkxpc3QoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0ubGlzdFZhbGlkYXRvcigke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7aXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfSkpYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRNYXAoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0uaGFzaFZhbGlkYXRvcigke3RoaXMudmlzaXRBdG9tKGl0ZW1UeXBlKX0pYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRNYXBPZkxpc3RzKGl0ZW1UeXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmhhc2hWYWxpZGF0b3IoJHtDT1JFfS5saXN0VmFsaWRhdG9yKCR7dGhpcy52aXNpdEF0b20oaXRlbVR5cGUpfSkpYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRVbmlvbk1hcChpdGVtVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS5oYXNoVmFsaWRhdG9yKCR7Q09SRX0udW5pb25WYWxpZGF0b3IoJHtpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyl9KSlgO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdExpc3RPckF0b20odHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSwgaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3IgPSBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3R5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfSlgO1xuICAgICAgICAgIGNvbnN0IGxpc3RWYWxpZGF0b3IgPSBgJHtDT1JFfS5saXN0VmFsaWRhdG9yKCR7Q09SRX0udW5pb25WYWxpZGF0b3IoJHtpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyl9KSlgO1xuXG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7c2NhbGFyVmFsaWRhdG9yfSwgJHtsaXN0VmFsaWRhdG9yfSlgO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBzZWxmLmNvZGUubGluZShgZXJyb3JzLmNvbGxlY3QoJHtDT1JFfS5wcm9wZXJ0eVZhbGlkYXRvcignJHtwcm9wTmFtZX0nLCAke3ZhbGlkYXRvckV4cHJlc3Npb259KShwcm9wZXJ0aWVzLiR7cHJvcE5hbWV9KSk7YCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvZGUubGluZShgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIiR7dHlwZU5hbWUuY2xhc3NOYW1lfVwiJyk7YCk7XG5cbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0SW50ZXJmYWNlUHJvcGVydHkocHJvcHM6IEVtaXRQcm9wZXJ0eVByb3BzKTogc3RyaW5nIHtcbiAgICBjb25zdCBqYXZhc2NyaXB0UHJvcGVydHlOYW1lID0gZ2Vuc3BlYy5jbG91ZEZvcm1hdGlvblRvU2NyaXB0TmFtZShwcm9wcy5wcm9wTmFtZSk7XG5cbiAgICB0aGlzLmRvY0xpbmsocHJvcHMuc3BlYy5Eb2N1bWVudGF0aW9uLCBwcm9wcy5hZGRpdGlvbmFsRG9jcyk7XG4gICAgY29uc3QgbGluZSA9IGA6ICR7dGhpcy5maW5kTmF0aXZlVHlwZShwcm9wcy5jb250ZXh0LCBwcm9wcy5zcGVjLCBwcm9wcy5wcm9wTmFtZSl9O2A7XG5cbiAgICBjb25zdCBxdWVzdGlvbiA9IHByb3BzLnNwZWMuUmVxdWlyZWQgPyAnJyA6ICc/JztcbiAgICB0aGlzLmNvZGUubGluZShgcmVhZG9ubHkgJHtqYXZhc2NyaXB0UHJvcGVydHlOYW1lfSR7cXVlc3Rpb259JHtsaW5lfWApO1xuICAgIHJldHVybiBqYXZhc2NyaXB0UHJvcGVydHlOYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0Q2xhc3NQcm9wZXJ0eShwcm9wczogRW1pdFByb3BlcnR5UHJvcHMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGphdmFzY3JpcHRQcm9wZXJ0eU5hbWUgPSBnZW5zcGVjLmNsb3VkRm9ybWF0aW9uVG9TY3JpcHROYW1lKHByb3BzLnByb3BOYW1lKTtcblxuICAgIHRoaXMuZG9jTGluayhwcm9wcy5zcGVjLkRvY3VtZW50YXRpb24sIHByb3BzLmFkZGl0aW9uYWxEb2NzKTtcbiAgICBjb25zdCBxdWVzdGlvbiA9IHByb3BzLnNwZWMuUmVxdWlyZWQgPyAnOycgOiAnIHwgdW5kZWZpbmVkOyc7XG4gICAgY29uc3QgbGluZSA9IGA6ICR7dGhpcy5maW5kTmF0aXZlVHlwZShwcm9wcy5jb250ZXh0LCBwcm9wcy5zcGVjLCBwcm9wcy5wcm9wTmFtZSl9JHtxdWVzdGlvbn1gO1xuICAgIGlmIChzY2hlbWEuaXNUYWdQcm9wZXJ0eU5hbWUocHJvcHMucHJvcE5hbWUpICYmIHNjaGVtYS5pc1RhZ1Byb3BlcnR5KHByb3BzLnNwZWMpKSB7XG4gICAgICB0aGlzLmNvZGUubGluZShgcHVibGljIHJlYWRvbmx5IHRhZ3M6ICR7VEFHX01BTkFHRVJ9O2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvZGUubGluZShgcHVibGljICR7amF2YXNjcmlwdFByb3BlcnR5TmFtZX0ke2xpbmV9YCk7XG4gICAgfVxuICAgIHJldHVybiBqYXZhc2NyaXB0UHJvcGVydHlOYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0UHJvcGVydHkocHJvcHM6IEVtaXRQcm9wZXJ0eVByb3BzLCBjb250YWluZXI6IENvbnRhaW5lcik6IHN0cmluZyB7XG4gICAgc3dpdGNoIChjb250YWluZXIpIHtcbiAgICAgIGNhc2UgQ29udGFpbmVyLkNsYXNzOlxuICAgICAgICByZXR1cm4gdGhpcy5lbWl0Q2xhc3NQcm9wZXJ0eShwcm9wcyk7XG4gICAgICBjYXNlIENvbnRhaW5lci5JbnRlcmZhY2U6XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXRJbnRlcmZhY2VQcm9wZXJ0eShwcm9wcyk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbnRhaW5lciAke2NvbnRhaW5lcn1gKTtcbiAgICB9XG5cbiAgfVxuXG4gIHByaXZhdGUgYmVnaW5OYW1lc3BhY2UodHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSk6IHZvaWQge1xuICAgIGlmICh0eXBlLm5hbWVzcGFjZSkge1xuICAgICAgY29uc3QgcGFydHMgPSB0eXBlLm5hbWVzcGFjZS5zcGxpdCgnLicpO1xuICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGV4cG9ydCBuYW1lc3BhY2UgJHtwYXJ0fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW5kTmFtZXNwYWNlKHR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpOiB2b2lkIHtcbiAgICBpZiAodHlwZS5uYW1lc3BhY2UpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gdHlwZS5uYW1lc3BhY2Uuc3BsaXQoJy4nKTtcbiAgICAgIGZvciAoY29uc3QgXyBvZiBwYXJ0cykge1xuICAgICAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdFByb3BlcnR5VHlwZShyZXNvdXJjZUNvbnRleHQ6IGdlbnNwZWMuQ29kZU5hbWUsIHR5cGVOYW1lOiBnZW5zcGVjLkNvZGVOYW1lLCBwcm9wVHlwZVNwZWM6IHNjaGVtYS5SZWNvcmRQcm9wZXJ0eSk6IHZvaWQge1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5iZWdpbk5hbWVzcGFjZSh0eXBlTmFtZSk7XG5cbiAgICBjb25zdCBkb2NzID0gdHlwZURvY3MocmVzb3VyY2VDb250ZXh0LnNwZWNOYW1lPy5mcW4gPz8gJycsICh0eXBlTmFtZS5zcGVjTmFtZSBhcyBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUgfCB1bmRlZmluZWQpPy5wcm9wQXR0ck5hbWUpO1xuXG4gICAgdGhpcy5kb2NMaW5rKFxuICAgICAgcHJvcFR5cGVTcGVjLkRvY3VtZW50YXRpb24sXG4gICAgICBkb2NzLmRlc2NyaXB0aW9uLFxuICAgICAgJycsXG4gICAgICAnQHN0cnVjdCcsIC8vIE1ha2UgdGhpcyBpbnRlcmZhY2UgQUxXQVlTIGJlIHRyZWF0ZWQgYXMgYSBzdHJ1Y3QsIGV2ZW50IGlmIGl0J3MgbmFtZWQgYElQU2V0Li4uYCBvciBzb21ldGhpbmcuLi5cbiAgICAgICdAc3RhYmlsaXR5IGV4dGVybmFsJyxcbiAgICApO1xuICAgIC8qXG4gICAgaWYgKCFwcm9wVHlwZVNwZWMuUHJvcGVydGllcyB8fCBPYmplY3Qua2V5cyhwcm9wVHlwZVNwZWMuUHJvcGVydGllcykubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmNvZGUubGluZSgnLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNvbWV0aGluZ3NvbWV0aGluZyB8IEEgZ2VudWluZSBlbXB0eS1vYmplY3QgdHlwZScpO1xuICAgIH1cbiAgICAqL1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGV4cG9ydCBpbnRlcmZhY2UgJHt0eXBlTmFtZS5jbGFzc05hbWV9YCk7XG4gICAgY29uc3QgY29udmVyc2lvblRhYmxlOiBEaWN0aW9uYXJ5PHN0cmluZz4gPSB7fTtcblxuICAgIGlmIChwcm9wVHlwZVNwZWMuUHJvcGVydGllcykge1xuICAgICAgT2JqZWN0LmtleXMocHJvcFR5cGVTcGVjLlByb3BlcnRpZXMpLmZvckVhY2gocHJvcE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBwcm9wU3BlYyA9IHByb3BUeXBlU3BlYy5Qcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbERvY3MgPSBkb2NzLnByb3BlcnRpZXNbcHJvcE5hbWVdIHx8IHF1b3RlQ29kZShgJHt0eXBlTmFtZS5mcW59LiR7cHJvcE5hbWV9YCk7XG4gICAgICAgIGNvbnN0IG5ld05hbWUgPSB0aGlzLmVtaXRJbnRlcmZhY2VQcm9wZXJ0eSh7XG4gICAgICAgICAgY29udGV4dDogcmVzb3VyY2VDb250ZXh0LFxuICAgICAgICAgIHByb3BOYW1lLFxuICAgICAgICAgIHNwZWM6IHByb3BTcGVjLFxuICAgICAgICAgIGFkZGl0aW9uYWxEb2NzLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udmVyc2lvblRhYmxlW3Byb3BOYW1lXSA9IG5ld05hbWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgIHRoaXMuZW5kTmFtZXNwYWNlKHR5cGVOYW1lKTtcblxuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5lbWl0UHJvcGVydGllc1ZhbGlkYXRvcihyZXNvdXJjZUNvbnRleHQsIHR5cGVOYW1lLCBwcm9wVHlwZVNwZWMuUHJvcGVydGllcywgY29udmVyc2lvblRhYmxlKTtcbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuZW1pdENsb3VkRm9ybWF0aW9uTWFwcGVyKHJlc291cmNlQ29udGV4dCwgdHlwZU5hbWUsIHByb3BUeXBlU3BlYy5Qcm9wZXJ0aWVzLCBjb252ZXJzaW9uVGFibGUpO1xuICAgIHRoaXMuZW1pdEZyb21DZm5GYWN0b3J5RnVuY3Rpb24ocmVzb3VyY2VDb250ZXh0LCB0eXBlTmFtZSwgcHJvcFR5cGVTcGVjLlByb3BlcnRpZXMsIGNvbnZlcnNpb25UYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuYXRpdmUgdHlwZSBleHByZXNzaW9uIGZvciB0aGUgZ2l2ZW4gcHJvcFNwZWNcbiAgICovXG4gIHByaXZhdGUgZmluZE5hdGl2ZVR5cGUocmVzb3VyY2VDb250ZXh0OiBnZW5zcGVjLkNvZGVOYW1lLCBwcm9wU3BlYzogc2NoZW1hLlByb3BlcnR5LCBwcm9wTmFtZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgYWx0ZXJuYXRpdmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgLy8gcmVuZGVyIHRoZSB1bmlvbiBvZiBhbGwgaXRlbSB0eXBlc1xuICAgIGlmIChzY2hlbWEuaXNDb2xsZWN0aW9uUHJvcGVydHkocHJvcFNwZWMpKSB7XG4gICAgICAvLyByZW5kZXIgdGhlIHVuaW9uIG9mIGFsbCBpdGVtIHR5cGVzXG4gICAgICBjb25zdCBpdGVtVHlwZXMgPSBnZW5zcGVjLnNwZWNUeXBlc1RvQ29kZVR5cGVzKHJlc291cmNlQ29udGV4dCwgaXRlbVR5cGVOYW1lcyhwcm9wU3BlYykpO1xuXG4gICAgICAvLyAndG9rZW5pemFibGVUeXBlJyBvcGVyYXRlcyBhdCB0aGUgbGV2ZWwgb2YgcmVuZGVyZWQgdHlwZSBuYW1lcyBpbiBUeXBlU2NyaXB0LCBzbyBzdHJpbmdpZnlcbiAgICAgIC8vIHRoZSBvYmplY3RzLlxuICAgICAgY29uc3QgcmVuZGVyZWRUeXBlcyA9IGl0ZW1UeXBlcy5tYXAodCA9PiB0aGlzLnJlbmRlckNvZGVOYW1lKHJlc291cmNlQ29udGV4dCwgdCkpO1xuICAgICAgaWYgKCF0b2tlbml6YWJsZVR5cGUocmVuZGVyZWRUeXBlcykgJiYgIXNjaGVtYS5pc1RhZ1Byb3BlcnR5TmFtZShwcm9wTmFtZSkpIHtcbiAgICAgICAgLy8gQWx3YXlzIGFjY2VwdCBhIHRva2VuIGluIHBsYWNlIG9mIGFueSBsaXN0IGVsZW1lbnQgKHVubGVzcyB0aGUgbGlzdCBlbGVtZW50cyBhcmUgdG9rZW5pemFibGUpXG4gICAgICAgIGl0ZW1UeXBlcy5wdXNoKGdlbnNwZWMuVE9LRU5fTkFNRSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVuaW9uID0gdGhpcy5yZW5kZXJUeXBlVW5pb24ocmVzb3VyY2VDb250ZXh0LCBpdGVtVHlwZXMpO1xuXG4gICAgICBpZiAoc2NoZW1hLmlzTWFwUHJvcGVydHkocHJvcFNwZWMpKSB7XG4gICAgICAgIGFsdGVybmF0aXZlcy5wdXNoKGB7IFtrZXk6IHN0cmluZ106ICgke3VuaW9ufSkgfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVG8gbWFrZSBUU0xpbnQgaGFwcHksIHdlIGhhdmUgdG8gZWl0aGVyIGVtaXQ6IFNpbmdsZVR5cGVbXSBvciBBcnJheTxBbHQxIHwgQWx0Mj5cbiAgICAgICAgaWYgKHVuaW9uLmluZGV4T2YoJ3wnKSAhPT0gLTEpIHtcbiAgICAgICAgICBhbHRlcm5hdGl2ZXMucHVzaChgQXJyYXk8JHt1bmlvbn0+YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWx0ZXJuYXRpdmVzLnB1c2goYCR7dW5pb259W11gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFllcywgc29tZSB0eXBlcyBjYW4gYmUgYm90aCBjb2xsZWN0aW9uIGFuZCBzY2FsYXIuIExvb2tpbmcgYXQgeW91LCBTQU0uXG4gICAgaWYgKHNjaGVtYS5pc1NjYWxhclByb3BlcnR5KHByb3BTcGVjKSkge1xuICAgICAgLy8gU2NhbGFyIHR5cGVcbiAgICAgIGNvbnN0IHR5cGVOYW1lcyA9IHNjYWxhclR5cGVOYW1lcyhwcm9wU3BlYyk7XG4gICAgICBjb25zdCB0eXBlcyA9IGdlbnNwZWMuc3BlY1R5cGVzVG9Db2RlVHlwZXMocmVzb3VyY2VDb250ZXh0LCB0eXBlTmFtZXMpO1xuICAgICAgYWx0ZXJuYXRpdmVzLnB1c2godGhpcy5yZW5kZXJUeXBlVW5pb24ocmVzb3VyY2VDb250ZXh0LCB0eXBlcykpO1xuICAgIH1cblxuICAgIC8vIE9ubHkgaWYgdGhpcyBwcm9wZXJ0eSBpcyBub3Qgb2YgYSBcInRva2VuaXphYmxlIHR5cGVcIiAoc3RyaW5nLCBzdHJpbmdbXSxcbiAgICAvLyBudW1iZXIgaW4gdGhlIGZ1dHVyZSkgd2UgYWRkIGEgdHlwZSB1bmlvbiBmb3IgYGNkay5Ub2tlbmAuIFdlIHJhdGhlclxuICAgIC8vIGV2ZXJ5dGhpbmcgdG8gYmUgdG9rZW5pemFibGUgYmVjYXVzZSB0aGVyZSBhcmUgbGFuZ3VhZ2VzIHRoYXQgZG8gbm90XG4gICAgLy8gc3VwcG9ydCB1bmlvbiB0eXBlcyAoaS5lLiBKYXZhLCAuTkVUKSwgc28gd2UgbG9zZSB0eXBlIHNhZmV0eSBpZiB3ZSBoYXZlXG4gICAgLy8gYSB1bmlvbi5cbiAgICBpZiAoIXRva2VuaXphYmxlVHlwZShhbHRlcm5hdGl2ZXMpICYmICFzY2hlbWEuaXNUYWdQcm9wZXJ0eU5hbWUocHJvcE5hbWUpKSB7XG4gICAgICBhbHRlcm5hdGl2ZXMucHVzaChnZW5zcGVjLlRPS0VOX05BTUUuZnFuKTtcbiAgICB9XG4gICAgcmV0dXJuIGFsdGVybmF0aXZlcy5qb2luKCcgfCAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYSBDb2RlTmFtZSB0byBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBpdCBpbiBUeXBlU2NyaXB0XG4gICAqL1xuICBwcml2YXRlIHJlbmRlckNvZGVOYW1lKGNvbnRleHQ6IGdlbnNwZWMuQ29kZU5hbWUsIHR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlbCA9IHR5cGUucmVsYXRpdmVUbyhjb250ZXh0KTtcbiAgICBjb25zdCBzcGVjVHlwZSA9IHJlbC5zcGVjTmFtZSAmJiB0aGlzLnNwZWMuUHJvcGVydHlUeXBlc1tyZWwuc3BlY05hbWUuZnFuXTtcbiAgICBpZiAoIXNwZWNUeXBlIHx8IHNjaGVtYS5pc1JlY29yZFR5cGUoc3BlY1R5cGUpKSB7XG4gICAgICByZXR1cm4gcmVsLmZxbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmluZE5hdGl2ZVR5cGUoY29udGV4dCwgc3BlY1R5cGUpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJUeXBlVW5pb24oY29udGV4dDogZ2Vuc3BlYy5Db2RlTmFtZSwgdHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHR5cGVzLm1hcCh0ID0+IHRoaXMucmVuZGVyQ29kZU5hbWUoY29udGV4dCwgdCkpLmpvaW4oJyB8ICcpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb2NMaW5rKGxpbms6IHN0cmluZyB8IHVuZGVmaW5lZCwgLi4uYmVmb3JlOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICghbGluayAmJiBiZWZvcmUubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuICAgIHRoaXMuY29kZS5saW5lKCcvKionKTtcbiAgICBiZWZvcmUuZmxhdE1hcCh4ID0+IHguc3BsaXQoJ1xcbicpKS5mb3JFYWNoKGxpbmUgPT4gdGhpcy5jb2RlLmxpbmUoYCAqICR7ZXNjYXBlRG9jVGV4dChsaW5lKX1gLnRyaW1SaWdodCgpKSk7XG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGlmIChiZWZvcmUubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmNvZGUubGluZSgnIConKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29kZS5saW5lKGAgKiBAbGluayAke2xpbmt9YCk7XG4gICAgfVxuICAgIHRoaXMuY29kZS5saW5lKCcgKi8nKTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBlc2NhcGVzIHRvIHRoZSBkb2MgdGV4dCB0byBhdm9pZCB0ZXh0IHRoYXQgYnJlYWtzIHRoZSBwYXJzaW5nIG9mIHRoZSBzdHJpbmdcbiAgICAgKlxuICAgICAqIFdlIGN1cnJlbnRseSBlc2NhcGUgdGhlIGZvbGxvd2luZyBzZXF1ZW5jZXM6XG4gICAgICpcbiAgICAgKiAtIDxhc3Rlcmlzaz48c2xhc2g+ICgqIC8pOiBpZiB0aGlzIG9jY3VycyBzb21ld2hlcmUgaW4gdGhlIGRvYyB0ZXh0LCBpdFxuICAgICAqICAgd2lsbCBlbmQgdGhlIGJsb2NrIGNvbW1lbnQgaW4gdGhlIHdyb25nIHBsYWNlLiBCcmVhayB1cCB0aG9zZVxuICAgICAqICAgY2hhcmFjdGVycyBieSBpbnNlcnRpbmcgYSBzcGFjZS4gV291bGQgaGF2ZSBsb3ZlZCB0byB1c2UgYSB6ZXJvLXdpZHRoIHNwYWNlLFxuICAgICAqICAgYnV0IEknbSB2ZXJ5IHZlcnkgYWZyYWlkIGl0IHdpbGwgYnJlYWsgY29kZWdlbiBpbiBzdWJ0bGUgd2F5cywgYW5kIGp1c3QgdXNpbmdcbiAgICAgKiAgIGEgc3BhY2UgZmVlbHMgc2FmZXIuXG4gICAgICogLSBcXHU6IGlmIHRoaXMgb2NjdXJzIGluIEphdmEgY29kZSwgdGhlIEphdmEgY29tcGlsZXIgd2lsbCB0cnkgYW5kIHBhcnNlIHRoZVxuICAgICAqICAgZm9sbG93aW5nIDQgY2hhcmFjdGVycyBhcyBhIHVuaWNvZGUgY29kZSBwb2ludCwgYW5kIGZhaWwgaWYgdGhlIDQgY2hhcmFjdGVyc1xuICAgICAqICAgYXJlbid0IGhleCBkaWdpdHMuIFRoaXMgaXMgZm9ybWFsbHkgYSBidWcgaW4gcGFjbWFrIChpdCBzaG91bGQgZG8gdGhlIGVzY2FwaW5nXG4gICAgICogICB3aGlsZSByZW5kZXJpbmcsIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvMzMwMiksIGJ1dCB0b1xuICAgICAqICAgZXhwZWRpdGUgdGhlIGJ1aWxkIGZpeGluZyBpdCBoZXJlIGFzIHdlbGwuIFJlcGxhY2Ugd2l0aCAnXFwgdScgKHRyaWVkIHVzaW5nXG4gICAgICogICBgXFxcXHVgIGJ1dCBmb3Igc29tZSByZWFzb24gdGhhdCBhbHNvIGRvZXNuJ3QgY2Fycnkgb3ZlciB0byBjb2RlZ2VuKS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlc2NhcGVEb2NUZXh0KHg6IHN0cmluZykge1xuICAgICAgeCA9IHgucmVwbGFjZSgvXFwqXFwvL2csICcqIC8nKTtcbiAgICAgIHggPSB4LnJlcGxhY2UoL1xcXFx1L2csICdcXFxcIHUnKTtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFF1b3RlcyBhIGNvZGUgbmFtZSBmb3IgaW5jbHVzaW9uIGluIGEgSlNEb2MgY29tbWVudCwgc28gaXQgd2lsbCByZW5kZXIgcHJvcGVybHlcbiAqIGluIHRoZSBNYXJrZG93biBvdXRwdXQuXG4gKlxuICogQHBhcmFtIGNvZGUgYSBjb2RlIG5hbWUgdG8gYmUgcXVvdGVkLlxuICpcbiAqIEByZXR1cm5zIHRoZSBjb2RlIG5hbWUgc3Vycm91bmRlZCBieSBkb3VibGUgYmFja3RpY2tzLlxuICovXG5mdW5jdGlvbiBxdW90ZUNvZGUoY29kZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICdgJyArIGNvZGUgKyAnYCc7XG59XG5cbmZ1bmN0aW9uIHRva2VuaXphYmxlVHlwZShhbHRlcm5hdGl2ZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIGlmIChhbHRlcm5hdGl2ZXMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR5cGUgPSBhbHRlcm5hdGl2ZXNbMF07XG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmdbXScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0YWdUeXBlKHJlc291cmNlOiBzY2hlbWEuVGFnZ2FibGVSZXNvdXJjZSk6IHN0cmluZyB7XG4gIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyhyZXNvdXJjZS5Qcm9wZXJ0aWVzKSkge1xuICAgIGlmICghc2NoZW1hLmlzVGFnUHJvcGVydHlOYW1lKG5hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5U3RhbmRhcmQocmVzb3VyY2UuUHJvcGVydGllc1tuYW1lXSkpIHtcbiAgICAgIHJldHVybiBgJHtUQUdfVFlQRX0uU1RBTkRBUkRgO1xuICAgIH1cbiAgICBpZiAoc2NoZW1hLmlzVGFnUHJvcGVydHlBdXRvU2NhbGluZ0dyb3VwKHJlc291cmNlLlByb3BlcnRpZXNbbmFtZV0pKSB7XG4gICAgICByZXR1cm4gYCR7VEFHX1RZUEV9LkFVVE9TQ0FMSU5HX0dST1VQYDtcbiAgICB9XG4gICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5SnNvbihyZXNvdXJjZS5Qcm9wZXJ0aWVzW25hbWVdKSB8fFxuICAgICAgc2NoZW1hLmlzVGFnUHJvcGVydHlTdHJpbmdNYXAocmVzb3VyY2UuUHJvcGVydGllc1tuYW1lXSkpIHtcbiAgICAgIHJldHVybiBgJHtUQUdfVFlQRX0uTUFQYDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGAke1RBR19UWVBFfS5OT1RfVEFHR0FCTEVgO1xufVxuXG5lbnVtIENvbnRhaW5lciB7XG4gIEludGVyZmFjZSA9ICdJTlRFUkZBQ0UnLFxuICBDbGFzcyA9ICdDTEFTUycsXG59XG5cbmludGVyZmFjZSBFbWl0UHJvcGVydHlQcm9wcyB7XG4gIGNvbnRleHQ6IGdlbnNwZWMuQ29kZU5hbWU7XG4gIHByb3BOYW1lOiBzdHJpbmc7XG4gIHNwZWM6IHNjaGVtYS5Qcm9wZXJ0eTtcbiAgYWRkaXRpb25hbERvY3M6IHN0cmluZztcbn1cbiJdfQ==