"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cfnspec_1 = require("@aws-cdk/cfnspec");
const codemaker_1 = require("codemaker");
const genspec = require("./genspec");
const spec_utils_1 = require("./spec-utils");
const util_1 = require("./util");
const CORE = genspec.CORE_NAMESPACE;
const CFN_PARSE = genspec.CFN_PARSE_NAMESPACE;
const RESOURCE_BASE_CLASS = `${CORE}.CfnResource`; // base class for all resources
const CONSTRUCT_CLASS = `${CORE}.Construct`;
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
        var _a;
        this.spec = spec;
        this.affix = affix;
        this.code = new codemaker_1.CodeMaker();
        this.outputFile = `${moduleName}.generated.ts`;
        this.code.openFile(this.outputFile);
        const coreImport = (_a = options.coreImport) !== null && _a !== void 0 ? _a : '@aws-cdk/core';
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
        this.code.line(`import * as ${CORE} from '${coreImport}';`);
        // explicitly import the cfn-parse.ts file from @core, which is not part of the public API of the module
        this.code.line(`import * as ${CFN_PARSE} from '${coreImport}/${coreImport === '.' ? '' : 'lib/'}cfn-parse';`);
    }
    emitCode() {
        for (const name of Object.keys(this.spec.ResourceTypes).sort()) {
            const resourceType = this.spec.ResourceTypes[name];
            const cfnName = spec_utils_1.SpecName.parse(name);
            const resourceName = genspec.CodeName.forCfnResource(cfnName, this.affix);
            this.code.line();
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
        this.docLink(spec.Documentation, `Properties for defining a \`${resourceContext.specName.fqn}\``, '', '@stability external');
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
        Object.keys(propertiesSpec).sort(propertyComparator).forEach(propName => {
            this.code.line();
            const propSpec = propertiesSpec[propName];
            const additionalDocs = resource.specName.relativeName(propName).fqn;
            const newName = this.emitProperty({
                context: resource,
                propName,
                spec: propSpec,
                additionalDocs: quoteCode(additionalDocs),
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
        //
        // The class declaration representing this Resource
        //
        this.docLink(spec.Documentation, `A CloudFormation \`${cfnName}\``, '', `@cloudformationResource ${cfnName}`, '@stability external');
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
                if (cfnspec_1.schema.isTagPropertyName(util_1.upcaseFirst(prop)) && cfnspec_1.schema.isTaggableResource(spec)) {
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
        this.code.openBlock('protected get cfnProperties(): { [key: string]: any } ');
        this.code.indent('return {');
        for (const prop of Object.values(propMap)) {
            // handle tag rendering because of special cases
            if (taggable && cfnspec_1.schema.isTagPropertyName(util_1.upcaseFirst(prop))) {
                this.code.line(`${prop}: this.tags.renderTags(),`);
                continue;
            }
            this.code.line(`${prop}: this.${prop},`);
        }
        this.code.unindent('};');
        this.code.closeBlock();
        this.code.line();
        this.code.openBlock('protected renderProperties(props: {[key: string]: any}): { [key: string]: any } ');
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
        var _a, _b, _c;
        const cfnLint = cfnspec_1.cfnLintAnnotations((_b = (_a = resourceType.specName) === null || _a === void 0 ? void 0 : _a.fqn) !== null && _b !== void 0 ? _b : '');
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
            this.code.line(`  ? [\'\\\'${(_c = resourceType.specName) === null || _c === void 0 ? void 0 : _c.fqn}\\\' is a stateful resource type, and you must specify a Removal Policy for it. Call \\\'resource.applyRemovalPolicy()\\\'.\']`);
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
        this.code.line('properties = properties || {};');
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
        this.docLink(propTypeSpec.Documentation, '@stability external');
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
            const itemTypes = genspec.specTypesToCodeTypes(resourceContext, spec_utils_1.itemTypeNames(propSpec));
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
            const typeNames = spec_utils_1.scalarTypeNames(propSpec);
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
        before.forEach(line => this.code.line(` * ${line}`.trimRight()));
        if (link) {
            this.code.line(` * @link ${link}`);
        }
        this.code.line(' */');
        return;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGVnZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBOEQ7QUFDOUQseUNBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyw2Q0FBK0Y7QUFDL0YsaUNBQXFDO0FBRXJDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDcEMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0FBQzlDLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxJQUFJLGNBQWMsQ0FBQyxDQUFDLCtCQUErQjtBQUNsRixNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksWUFBWSxDQUFDO0FBQzVDLE1BQU0sUUFBUSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUM7QUFDbkMsTUFBTSxXQUFXLEdBQUcsR0FBRyxJQUFJLGFBQWEsQ0FBQztBQUV6QyxJQUFLLGNBR0o7QUFIRCxXQUFLLGNBQWM7SUFDakIsMERBQXdDLENBQUE7SUFDeEMsNERBQTBDLENBQUE7QUFDNUMsQ0FBQyxFQUhJLGNBQWMsS0FBZCxjQUFjLFFBR2xCO0FBYUQ7O0dBRUc7QUFDSCxNQUFxQixhQUFhO0lBS2hDOzs7O09BSUc7SUFDSCxZQUFZLFVBQWtCLEVBQW1CLElBQTBCLEVBQW1CLEtBQWEsRUFBRSxVQUFnQyxFQUFFOztRQUE5RixTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBUG5HLFNBQUksR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQVE3QixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsVUFBVSxlQUFlLENBQUM7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxTQUFHLE9BQU8sQ0FBQyxVQUFVLG1DQUFJLGVBQWUsQ0FBQztRQUV6RCxNQUFNLElBQUksR0FBRztZQUNY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QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ25ELElBQUksQ0FBQyxnQkFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25DLFNBQVM7U0FDVjtRQUNELElBQUksZ0JBQU0sQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDM0QsT0FBTyxHQUFHLFFBQVEsV0FBVyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxnQkFBTSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNuRSxPQUFPLEdBQUcsUUFBUSxvQkFBb0IsQ0FBQztTQUN4QztRQUNELElBQUksZ0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELGdCQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQzFELE9BQU8sR0FBRyxRQUFRLE1BQU0sQ0FBQztTQUMxQjtLQUNGO0lBQ0QsT0FBTyxHQUFHLFFBQVEsZUFBZSxDQUFDO0FBQ3BDLENBQUM7QUFFRCxJQUFLLFNBR0o7QUFIRCxXQUFLLFNBQVM7SUFDWixvQ0FBdUIsQ0FBQTtJQUN2Qiw0QkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFISSxTQUFTLEtBQVQsU0FBUyxRQUdiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2NoZW1hLCBjZm5MaW50QW5ub3RhdGlvbnMgfSBmcm9tICdAYXdzLWNkay9jZm5zcGVjJztcbmltcG9ydCB7IENvZGVNYWtlciB9IGZyb20gJ2NvZGVtYWtlcic7XG5pbXBvcnQgKiBhcyBnZW5zcGVjIGZyb20gJy4vZ2Vuc3BlYyc7XG5pbXBvcnQgeyBpdGVtVHlwZU5hbWVzLCBQcm9wZXJ0eUF0dHJpYnV0ZU5hbWUsIHNjYWxhclR5cGVOYW1lcywgU3BlY05hbWUgfSBmcm9tICcuL3NwZWMtdXRpbHMnO1xuaW1wb3J0IHsgdXBjYXNlRmlyc3QgfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBDT1JFID0gZ2Vuc3BlYy5DT1JFX05BTUVTUEFDRTtcbmNvbnN0IENGTl9QQVJTRSA9IGdlbnNwZWMuQ0ZOX1BBUlNFX05BTUVTUEFDRTtcbmNvbnN0IFJFU09VUkNFX0JBU0VfQ0xBU1MgPSBgJHtDT1JFfS5DZm5SZXNvdXJjZWA7IC8vIGJhc2UgY2xhc3MgZm9yIGFsbCByZXNvdXJjZXNcbmNvbnN0IENPTlNUUlVDVF9DTEFTUyA9IGAke0NPUkV9LkNvbnN0cnVjdGA7XG5jb25zdCBUQUdfVFlQRSA9IGAke0NPUkV9LlRhZ1R5cGVgO1xuY29uc3QgVEFHX01BTkFHRVIgPSBgJHtDT1JFfS5UYWdNYW5hZ2VyYDtcblxuZW51bSBUcmVlQXR0cmlidXRlcyB7XG4gIENGTl9UWVBFID0gJ2F3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZScsXG4gIENGTl9QUk9QUyA9ICdhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzJ1xufVxuXG5pbnRlcmZhY2UgRGljdGlvbmFyeTxUPiB7IFtrZXk6IHN0cmluZ106IFQ7IH1cblxuZXhwb3J0IGludGVyZmFjZSBDb2RlR2VuZXJhdG9yT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBIb3cgdG8gaW1wb3J0IHRoZSBjb3JlIGxpYnJhcnkuXG4gICAqXG4gICAqIEBkZWZhdWx0ICdAYXdzLWNkay9jb3JlJ1xuICAgKi9cbiAgcmVhZG9ubHkgY29yZUltcG9ydD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBFbWl0cyBjbGFzc2VzIGZvciBhbGwgcmVzb3VyY2UgdHlwZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZUdlbmVyYXRvciB7XG4gIHB1YmxpYyByZWFkb25seSBvdXRwdXRGaWxlOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBjb2RlID0gbmV3IENvZGVNYWtlcigpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBjb2RlIGdlbmVyYXRvci5cbiAgICogQHBhcmFtIG1vZHVsZU5hbWUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSAodXNlZCB0byBkZXRlcm1pbmUgdGhlIGZpbGUgbmFtZSkuXG4gICAqIEBwYXJhbSBzcGVjICAgICBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBzcGVjaWZpY2F0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgc3BlYzogc2NoZW1hLlNwZWNpZmljYXRpb24sIHByaXZhdGUgcmVhZG9ubHkgYWZmaXg6IHN0cmluZywgb3B0aW9uczogQ29kZUdlbmVyYXRvck9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMub3V0cHV0RmlsZSA9IGAke21vZHVsZU5hbWV9LmdlbmVyYXRlZC50c2A7XG4gICAgdGhpcy5jb2RlLm9wZW5GaWxlKHRoaXMub3V0cHV0RmlsZSk7XG4gICAgY29uc3QgY29yZUltcG9ydCA9IG9wdGlvbnMuY29yZUltcG9ydCA/PyAnQGF3cy1jZGsvY29yZSc7XG5cbiAgICBjb25zdCBtZXRhID0ge1xuICAgICAgZ2VuZXJhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgZmluZ2VycHJpbnQ6IHNwZWMuRmluZ2VycHJpbnQsXG4gICAgfTtcblxuICAgIHRoaXMuY29kZS5saW5lKGAvLyBDb3B5cmlnaHQgMjAxMi0ke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5gKTtcbiAgICB0aGlzLmNvZGUubGluZSgnLy8gR2VuZXJhdGVkIGZyb20gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBTcGVjaWZpY2F0aW9uJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8vIFNlZTogZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2Nmbi1yZXNvdXJjZS1zcGVjaWZpY2F0aW9uLmh0bWwnKTtcbiAgICB0aGlzLmNvZGUubGluZShgLy8gQGNmbjJ0czptZXRhQCAke0pTT04uc3RyaW5naWZ5KG1ldGEpfWApO1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2wnKTtcbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuY29kZS5saW5lKGBpbXBvcnQgKiBhcyAke0NPUkV9IGZyb20gJyR7Y29yZUltcG9ydH0nO2ApO1xuICAgIC8vIGV4cGxpY2l0bHkgaW1wb3J0IHRoZSBjZm4tcGFyc2UudHMgZmlsZSBmcm9tIEBjb3JlLCB3aGljaCBpcyBub3QgcGFydCBvZiB0aGUgcHVibGljIEFQSSBvZiB0aGUgbW9kdWxlXG4gICAgdGhpcy5jb2RlLmxpbmUoYGltcG9ydCAqIGFzICR7Q0ZOX1BBUlNFfSBmcm9tICcke2NvcmVJbXBvcnR9LyR7Y29yZUltcG9ydCA9PT0gJy4nID8gJycgOiAnbGliLyd9Y2ZuLXBhcnNlJztgKTtcbiAgfVxuXG4gIHB1YmxpYyBlbWl0Q29kZSgpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5zcGVjLlJlc291cmNlVHlwZXMpLnNvcnQoKSkge1xuICAgICAgY29uc3QgcmVzb3VyY2VUeXBlID0gdGhpcy5zcGVjLlJlc291cmNlVHlwZXNbbmFtZV07XG5cbiAgICAgIGNvbnN0IGNmbk5hbWUgPSBTcGVjTmFtZS5wYXJzZShuYW1lKTtcbiAgICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IGdlbnNwZWMuQ29kZU5hbWUuZm9yQ2ZuUmVzb3VyY2UoY2ZuTmFtZSwgdGhpcy5hZmZpeCk7XG4gICAgICB0aGlzLmNvZGUubGluZSgpO1xuXG4gICAgICB0aGlzLmVtaXRSZXNvdXJjZVR5cGUocmVzb3VyY2VOYW1lLCByZXNvdXJjZVR5cGUpO1xuICAgICAgdGhpcy5lbWl0UHJvcGVydHlUeXBlcyhuYW1lLCByZXNvdXJjZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgZ2VuZXJhdGVkIGZpbGUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgc2F2ZShkaXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICB0aGlzLmNvZGUuY2xvc2VGaWxlKHRoaXMub3V0cHV0RmlsZSk7XG4gICAgcmV0dXJuIHRoaXMuY29kZS5zYXZlKGRpcik7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgY2xhc3NlcyBmb3IgYWxsIHByb3BlcnR5IHR5cGVzXG4gICAqL1xuICBwcml2YXRlIGVtaXRQcm9wZXJ0eVR5cGVzKHJlc291cmNlTmFtZTogc3RyaW5nLCByZXNvdXJjZUNsYXNzOiBnZW5zcGVjLkNvZGVOYW1lKTogdm9pZCB7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7cmVzb3VyY2VOYW1lfS5gO1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLnNwZWMuUHJvcGVydHlUeXBlcykuc29ydCgpKSB7XG4gICAgICBpZiAoIW5hbWUuc3RhcnRzV2l0aChwcmVmaXgpKSB7IGNvbnRpbnVlOyB9XG4gICAgICBjb25zdCBjZm5OYW1lID0gUHJvcGVydHlBdHRyaWJ1dGVOYW1lLnBhcnNlKG5hbWUpO1xuICAgICAgY29uc3QgcHJvcFR5cGVOYW1lID0gZ2Vuc3BlYy5Db2RlTmFtZS5mb3JQcm9wZXJ0eVR5cGUoY2ZuTmFtZSwgcmVzb3VyY2VDbGFzcyk7XG4gICAgICBjb25zdCB0eXBlID0gdGhpcy5zcGVjLlByb3BlcnR5VHlwZXNbbmFtZV07XG4gICAgICBpZiAoc2NoZW1hLmlzUmVjb3JkVHlwZSh0eXBlKSkge1xuICAgICAgICB0aGlzLmVtaXRQcm9wZXJ0eVR5cGUocmVzb3VyY2VDbGFzcywgcHJvcFR5cGVOYW1lLCB0eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9wZW5DbGFzcyhuYW1lOiBnZW5zcGVjLkNvZGVOYW1lLCBzdXBlckNsYXNzZXM/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGV4dGVuZHNQb3N0Zml4ID0gc3VwZXJDbGFzc2VzID8gYCBleHRlbmRzICR7c3VwZXJDbGFzc2VzfWAgOiAnJztcbiAgICBjb25zdCBpbXBsZW1lbnRzUG9zdGZpeCA9IGAgaW1wbGVtZW50cyAke0NPUkV9LklJbnNwZWN0YWJsZWA7XG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgZXhwb3J0IGNsYXNzICR7bmFtZS5jbGFzc05hbWV9JHtleHRlbmRzUG9zdGZpeH0ke2ltcGxlbWVudHNQb3N0Zml4fWApO1xuICAgIHJldHVybiBuYW1lLmNsYXNzTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2VDbGFzcyhfbmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSkge1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRQcm9wc1R5cGUocmVzb3VyY2VDb250ZXh0OiBnZW5zcGVjLkNvZGVOYW1lLCBzcGVjOiBzY2hlbWEuUmVzb3VyY2VUeXBlKTogZ2Vuc3BlYy5Db2RlTmFtZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFzcGVjLlByb3BlcnRpZXMgfHwgT2JqZWN0LmtleXMoc3BlYy5Qcm9wZXJ0aWVzKS5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgbmFtZSA9IGdlbnNwZWMuQ29kZU5hbWUuZm9yUmVzb3VyY2VQcm9wZXJ0aWVzKHJlc291cmNlQ29udGV4dCk7XG5cbiAgICB0aGlzLmRvY0xpbmsoc3BlYy5Eb2N1bWVudGF0aW9uLFxuICAgICAgYFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgXFxgJHtyZXNvdXJjZUNvbnRleHQuc3BlY05hbWUhLmZxbn1cXGBgLFxuICAgICAgJycsXG4gICAgICAnQHN0YWJpbGl0eSBleHRlcm5hbCcpO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGV4cG9ydCBpbnRlcmZhY2UgJHtuYW1lLmNsYXNzTmFtZX1gKTtcblxuICAgIGNvbnN0IGNvbnZlcnNpb25UYWJsZSA9IHRoaXMuZW1pdFByb3BzVHlwZVByb3BlcnRpZXMocmVzb3VyY2VDb250ZXh0LCBzcGVjLlByb3BlcnRpZXMsIENvbnRhaW5lci5JbnRlcmZhY2UpO1xuXG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcblxuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5lbWl0UHJvcGVydGllc1ZhbGlkYXRvcihyZXNvdXJjZUNvbnRleHQsIG5hbWUsIHNwZWMuUHJvcGVydGllcywgY29udmVyc2lvblRhYmxlKTtcbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuZW1pdENsb3VkRm9ybWF0aW9uTWFwcGVyKHJlc291cmNlQ29udGV4dCwgbmFtZSwgc3BlYy5Qcm9wZXJ0aWVzLCBjb252ZXJzaW9uVGFibGUpO1xuICAgIHRoaXMuZW1pdEZyb21DZm5GYWN0b3J5RnVuY3Rpb24ocmVzb3VyY2VDb250ZXh0LCBuYW1lLCBzcGVjLlByb3BlcnRpZXMsIGNvbnZlcnNpb25UYWJsZSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCBUeXBlU2NyaXB0IGZvciBlYWNoIG9mIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzLCB3aGlsZSByZW5hbWluZ1xuICAgKlxuICAgKiBSZXR1cm4gYSBtYXBwaW5nIG9mIHsgb3JpZ2luYWxOYW1lIC0+IG5ld05hbWUgfS5cbiAgICovXG4gIHByaXZhdGUgZW1pdFByb3BzVHlwZVByb3BlcnRpZXMoXG4gICAgcmVzb3VyY2U6IGdlbnNwZWMuQ29kZU5hbWUsXG4gICAgcHJvcGVydGllc1NwZWM6IHsgW25hbWU6IHN0cmluZ106IHNjaGVtYS5Qcm9wZXJ0eSB9LFxuICAgIGNvbnRhaW5lcjogQ29udGFpbmVyKTogRGljdGlvbmFyeTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcm9wZXJ0eU1hcDogRGljdGlvbmFyeTxzdHJpbmc+ID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzU3BlYykuc29ydChwcm9wZXJ0eUNvbXBhcmF0b3IpLmZvckVhY2gocHJvcE5hbWUgPT4ge1xuICAgICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICAgIGNvbnN0IHByb3BTcGVjID0gcHJvcGVydGllc1NwZWNbcHJvcE5hbWVdO1xuICAgICAgY29uc3QgYWRkaXRpb25hbERvY3MgPSByZXNvdXJjZS5zcGVjTmFtZSEucmVsYXRpdmVOYW1lKHByb3BOYW1lKS5mcW47XG4gICAgICBjb25zdCBuZXdOYW1lID0gdGhpcy5lbWl0UHJvcGVydHkoe1xuICAgICAgICBjb250ZXh0OiByZXNvdXJjZSxcbiAgICAgICAgcHJvcE5hbWUsXG4gICAgICAgIHNwZWM6IHByb3BTcGVjLFxuICAgICAgICBhZGRpdGlvbmFsRG9jczogcXVvdGVDb2RlKGFkZGl0aW9uYWxEb2NzKSxcbiAgICAgIH0sXG4gICAgICBjb250YWluZXIsXG4gICAgICApO1xuICAgICAgcHJvcGVydHlNYXBbcHJvcE5hbWVdID0gbmV3TmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvcGVydHlNYXA7XG5cbiAgICAvKipcbiAgICAgKiBBIGNvbXBhcmF0b3IgdGhhdCBwbGFjZXMgcmVxdWlyZWQgcHJvcGVydGllcyBiZWZvcmUgb3B0aW9uYWwgcHJvcGVydGllcyxcbiAgICAgKiBhbmQgc29ydHMgcHJvcGVydGllcyBhbHBoYWJldGljYWxseS5cbiAgICAgKiBAcGFyYW0gbCB0aGUgbGVmdCBwcm9wZXJ0eSBuYW1lLlxuICAgICAqIEBwYXJhbSByIHRoZSByaWdodCBwcm9wZXJ0eSBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByb3BlcnR5Q29tcGFyYXRvcihsOiBzdHJpbmcsIHI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICBjb25zdCBscCA9IHByb3BlcnRpZXNTcGVjW2xdO1xuICAgICAgY29uc3QgcnAgPSBwcm9wZXJ0aWVzU3BlY1tyXTtcbiAgICAgIGlmIChscC5SZXF1aXJlZCA9PT0gcnAuUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIGwubG9jYWxlQ29tcGFyZShyKTtcbiAgICAgIH0gZWxzZSBpZiAobHAuUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0UmVzb3VyY2VUeXBlKHJlc291cmNlTmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSwgc3BlYzogc2NoZW1hLlJlc291cmNlVHlwZSk6IHZvaWQge1xuICAgIHRoaXMuYmVnaW5OYW1lc3BhY2UocmVzb3VyY2VOYW1lKTtcblxuICAgIGNvbnN0IGNmbk5hbWUgPSByZXNvdXJjZU5hbWUuc3BlY05hbWUhLmZxbjtcblxuICAgIC8vXG4gICAgLy8gUHJvcHMgQmFnIGZvciB0aGlzIFJlc291cmNlXG4gICAgLy9cblxuICAgIGNvbnN0IHByb3BzVHlwZSA9IHRoaXMuZW1pdFByb3BzVHlwZShyZXNvdXJjZU5hbWUsIHNwZWMpO1xuICAgIGlmIChwcm9wc1R5cGUpIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBUaGUgY2xhc3MgZGVjbGFyYXRpb24gcmVwcmVzZW50aW5nIHRoaXMgUmVzb3VyY2VcbiAgICAvL1xuXG4gICAgdGhpcy5kb2NMaW5rKHNwZWMuRG9jdW1lbnRhdGlvbixcbiAgICAgIGBBIENsb3VkRm9ybWF0aW9uIFxcYCR7Y2ZuTmFtZX1cXGBgLFxuICAgICAgJycsXG4gICAgICBgQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgJHtjZm5OYW1lfWAsXG4gICAgICAnQHN0YWJpbGl0eSBleHRlcm5hbCcpO1xuICAgIHRoaXMub3BlbkNsYXNzKHJlc291cmNlTmFtZSwgUkVTT1VSQ0VfQkFTRV9DTEFTUyk7XG5cbiAgICAvL1xuICAgIC8vIFN0YXRpYyBpbnNwZWN0b3JzLlxuICAgIC8vXG5cbiAgICBjb25zdCBjZm5SZXNvdXJjZVR5cGVOYW1lID0gYCR7SlNPTi5zdHJpbmdpZnkoY2ZuTmFtZSl9YDtcbiAgICB0aGlzLmNvZGUubGluZSgnLyoqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHRoaXMuY29kZS5saW5lKGBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSAke2NmblJlc291cmNlVHlwZU5hbWV9O2ApO1xuXG4gICAgaWYgKHNwZWMuUmVxdWlyZWRUcmFuc2Zvcm0pIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCcvKionKTtcbiAgICAgIHRoaXMuY29kZS5saW5lKCcgKiBUaGUgYFRyYW5zZm9ybWAgYSB0ZW1wbGF0ZSBtdXN0IHVzZSBpbiBvcmRlciB0byB1c2UgdGhpcyByZXNvdXJjZScpO1xuICAgICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgICAgdGhpcy5jb2RlLmxpbmUoYHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVRVUlSRURfVFJBTlNGT1JNID0gJHtKU09OLnN0cmluZ2lmeShzcGVjLlJlcXVpcmVkVHJhbnNmb3JtKX07YCk7XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBUaGUgc3RhdGljIGZyb21DbG91ZEZvcm1hdGlvbigpIG1ldGhvZCxcbiAgICAvLyB1c2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZVxuICAgIC8vXG5cbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuY29kZS5saW5lKCcvKionKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdCcpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLicpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKicpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKiBAaW50ZXJuYWwnKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICovJyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6ICR7Q09OU1RSVUNUX0NMQVNTfSwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6ICR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogYCArXG4gICAgICBgJHtyZXNvdXJjZU5hbWUuY2xhc3NOYW1lfWApO1xuICAgIHRoaXMuY29kZS5saW5lKCdyZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307Jyk7XG4gICAgaWYgKHByb3BzVHlwZSkge1xuICAgICAgLy8gdHJhbnNsYXRlIHRoZSB0ZW1wbGF0ZSBwcm9wZXJ0aWVzIHRvIENESyBvYmplY3RzXG4gICAgICB0aGlzLmNvZGUubGluZSgnY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7Jyk7XG4gICAgICAvLyB0cmFuc2xhdGUgdG8gcHJvcHMsIHVzaW5nIGEgKG1vZHVsZS1wcml2YXRlKSBmYWN0b3J5IGZ1bmN0aW9uXG4gICAgICB0aGlzLmNvZGUubGluZShgY29uc3QgcHJvcHNSZXN1bHQgPSAke2dlbnNwZWMuZnJvbUNmbkZhY3RvcnlOYW1lKHByb3BzVHlwZSkuZnFufShyZXNvdXJjZVByb3BlcnRpZXMpO2ApO1xuICAgICAgLy8gZmluYWxseSwgaW5zdGFudGlhdGUgdGhlIHJlc291cmNlIGNsYXNzXG4gICAgICB0aGlzLmNvZGUubGluZShgY29uc3QgcmV0ID0gbmV3ICR7cmVzb3VyY2VOYW1lLmNsYXNzTmFtZX0oc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7YCk7XG4gICAgICAvLyBzYXZlIGFsbCBrZXlzIGZyb20gZXh0cmFQcm9wZXJ0aWVzIGluIHRoZSByZXNvdXJjZSB1c2luZyBwcm9wZXJ0eSBvdmVycmlkZXNcbiAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soJ2ZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICcpO1xuICAgICAgdGhpcy5jb2RlLmxpbmUoJ3JldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpOycpO1xuICAgICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gcHJvcHMgdHlwZSAtIHdlIHNpbXBseSBpbnN0YW50aWF0ZSB0aGUgY29uc3RydWN0IHdpdGhvdXQgdGhlIHRoaXJkIGFyZ3VtZW50XG4gICAgICB0aGlzLmNvZGUubGluZShgY29uc3QgcmV0ID0gbmV3ICR7cmVzb3VyY2VOYW1lLmNsYXNzTmFtZX0oc2NvcGUsIGlkKTtgKTtcbiAgICB9XG4gICAgLy8gaGFuZGxlIGFsbCBub24tcHJvcGVydHkgYXR0cmlidXRlc1xuICAgIC8vIChyZXRlbnRpb24gcG9saWNpZXMsIGNvbmRpdGlvbnMsIG1ldGFkYXRhLCBldGMuKVxuICAgIHRoaXMuY29kZS5saW5lKCdvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7Jyk7XG5cbiAgICB0aGlzLmNvZGUubGluZSgncmV0dXJuIHJldDsnKTtcbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuXG4gICAgLy9cbiAgICAvLyBBdHRyaWJ1dGVzXG4gICAgLy9cblxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBuZXcgQXJyYXk8Z2Vuc3BlYy5BdHRyaWJ1dGU+KCk7XG5cbiAgICBpZiAoc3BlYy5BdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZU5hbWUgb2YgT2JqZWN0LmtleXMoc3BlYy5BdHRyaWJ1dGVzKS5zb3J0KCkpIHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlU3BlYyA9IHNwZWMuQXR0cmlidXRlcyFbYXR0cmlidXRlTmFtZV07XG5cbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoKTtcblxuICAgICAgICB0aGlzLmRvY0xpbmsodW5kZWZpbmVkLCBgQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlICR7YXR0cmlidXRlTmFtZX1gKTtcbiAgICAgICAgY29uc3QgYXR0ciA9IGdlbnNwZWMuYXR0cmlidXRlRGVmaW5pdGlvbihhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVTcGVjKTtcblxuICAgICAgICB0aGlzLmNvZGUubGluZShgcHVibGljIHJlYWRvbmx5ICR7YXR0ci5wcm9wZXJ0eU5hbWV9OiAke2F0dHIuYXR0cmlidXRlVHlwZX07YCk7XG5cbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKGF0dHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gU2V0IGNsYXNzIHByb3BlcnRpZXMgdG8gbWF0Y2ggQ2xvdWRGb3JtYXRpb24gUHJvcGVydGllcyBzcGVjXG4gICAgLy9cblxuICAgIGxldCBwcm9wTWFwO1xuICAgIGlmIChwcm9wc1R5cGUpIHtcbiAgICAgIHByb3BNYXAgPSB0aGlzLmVtaXRQcm9wc1R5cGVQcm9wZXJ0aWVzKHJlc291cmNlTmFtZSwgc3BlYy5Qcm9wZXJ0aWVzISwgQ29udGFpbmVyLkNsYXNzKTtcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgLy9cblxuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiBDcmVhdGUgYSBuZXcgJHtxdW90ZUNvZGUocmVzb3VyY2VOYW1lLnNwZWNOYW1lIS5mcW4pfS5gKTtcbiAgICB0aGlzLmNvZGUubGluZSgnIConKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2UnKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllcycpO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKi8nKTtcbiAgICBjb25zdCBvcHRpb25hbFByb3BzID0gc3BlYy5Qcm9wZXJ0aWVzICYmICFPYmplY3QudmFsdWVzKHNwZWMuUHJvcGVydGllcykuc29tZShwID0+IHAuUmVxdWlyZWQgfHwgZmFsc2UpO1xuICAgIGNvbnN0IHByb3BzQXJndW1lbnQgPSBwcm9wc1R5cGUgPyBgLCBwcm9wczogJHtwcm9wc1R5cGUuY2xhc3NOYW1lfSR7b3B0aW9uYWxQcm9wcyA/ICcgPSB7fScgOiAnJ31gIDogJyc7XG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgY29uc3RydWN0b3Ioc2NvcGU6ICR7Q09OU1RSVUNUX0NMQVNTfSwgaWQ6IHN0cmluZyR7cHJvcHNBcmd1bWVudH0pYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiAke3Jlc291cmNlTmFtZS5jbGFzc05hbWV9LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUke3Byb3BzVHlwZSA/ICcsIHByb3BlcnRpZXM6IHByb3BzJyA6ICcnfSB9KTtgKTtcbiAgICAvLyB2ZXJpZnkgYWxsIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgICBpZiAoc3BlYy5Qcm9wZXJ0aWVzKSB7XG4gICAgICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIE9iamVjdC5rZXlzKHNwZWMuUHJvcGVydGllcykpIHtcbiAgICAgICAgY29uc3QgcHJvcCA9IHNwZWMuUHJvcGVydGllc1twcm9wTmFtZV07XG4gICAgICAgIGlmIChwcm9wLlJlcXVpcmVkKSB7XG4gICAgICAgICAgdGhpcy5jb2RlLmxpbmUoYCR7Q09SRX0ucmVxdWlyZVByb3BlcnR5KHByb3BzLCAnJHtnZW5zcGVjLmNsb3VkRm9ybWF0aW9uVG9TY3JpcHROYW1lKHByb3BOYW1lKX0nLCB0aGlzKTtgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3BlYy5SZXF1aXJlZFRyYW5zZm9ybSkge1xuICAgICAgdGhpcy5jb2RlLmxpbmUoJy8vIEF1dG9tYXRpY2FsbHkgYWRkIHRoZSByZXF1aXJlZCB0cmFuc2Zvcm0nKTtcbiAgICAgIHRoaXMuY29kZS5saW5lKGB0aGlzLnN0YWNrLmFkZFRyYW5zZm9ybSgke3Jlc291cmNlTmFtZS5jbGFzc05hbWV9LlJFUVVJUkVEX1RSQU5TRk9STSk7YCk7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBhbGwgYXR0cmlidXRlIHByb3BlcnRpZXNcbiAgICBmb3IgKGNvbnN0IGF0IG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmIChhdC5hdHRyaWJ1dGVUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLmNvZGUubGluZShgdGhpcy4ke2F0LnByb3BlcnR5TmFtZX0gPSAke0NPUkV9LlRva2VuLmFzU3RyaW5nKCR7YXQuY29uc3RydWN0b3JBcmd1bWVudHN9KTtgKTtcbiAgICAgIH0gZWxzZSBpZiAoYXQuYXR0cmlidXRlVHlwZSA9PT0gJ3N0cmluZ1tdJykge1xuICAgICAgICB0aGlzLmNvZGUubGluZShgdGhpcy4ke2F0LnByb3BlcnR5TmFtZX0gPSAke0NPUkV9LlRva2VuLmFzTGlzdCgke2F0LmNvbnN0cnVjdG9yQXJndW1lbnRzfSk7YCk7XG4gICAgICB9IGVsc2UgaWYgKGF0LmF0dHJpYnV0ZVR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGB0aGlzLiR7YXQucHJvcGVydHlOYW1lfSA9ICR7Q09SRX0uVG9rZW4uYXNOdW1iZXIoJHthdC5jb25zdHJ1Y3RvckFyZ3VtZW50c30pO2ApO1xuICAgICAgfSBlbHNlIGlmIChhdC5hdHRyaWJ1dGVUeXBlID09PSBnZW5zcGVjLlRPS0VOX05BTUUuZnFuKSB7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGB0aGlzLiR7YXQucHJvcGVydHlOYW1lfSA9ICR7YXQuY29uc3RydWN0b3JBcmd1bWVudHN9O2ApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGluaXRpYWxpemUgYWxsIHByb3BlcnR5IGNsYXNzIG1lbWJlcnNcbiAgICBpZiAocHJvcHNUeXBlICYmIHByb3BNYXApIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgICBmb3IgKGNvbnN0IHByb3Agb2YgT2JqZWN0LnZhbHVlcyhwcm9wTWFwKSkge1xuICAgICAgICBpZiAoc2NoZW1hLmlzVGFnUHJvcGVydHlOYW1lKHVwY2FzZUZpcnN0KHByb3ApKSAmJiBzY2hlbWEuaXNUYWdnYWJsZVJlc291cmNlKHNwZWMpKSB7XG4gICAgICAgICAgdGhpcy5jb2RlLmxpbmUoYHRoaXMudGFncyA9IG5ldyAke1RBR19NQU5BR0VSfSgke3RhZ1R5cGUoc3BlYyl9LCAke2NmblJlc291cmNlVHlwZU5hbWV9LCBwcm9wcy4ke3Byb3B9LCB7IHRhZ1Byb3BlcnR5TmFtZTogJyR7cHJvcH0nIH0pO2ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29kZS5saW5lKGB0aGlzLiR7cHJvcH0gPSBwcm9wcy4ke3Byb3B9O2ApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyAgVmFsaWRhdG9yXG4gICAgLy9cbiAgICB0aGlzLmVtaXRDb25zdHJ1Y3RWYWxpZGF0b3IocmVzb3VyY2VOYW1lKTtcblxuICAgIC8vIEVuZCBjb25zdHJ1Y3RvclxuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuZW1pdFRyZWVBdHRyaWJ1dGVzKHJlc291cmNlTmFtZSk7XG5cbiAgICAvLyBzZXR1cCByZW5kZXIgcHJvcGVydGllc1xuICAgIGlmIChwcm9wc1R5cGUgJiYgcHJvcE1hcCkge1xuICAgICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICAgIHRoaXMuZW1pdENsb3VkRm9ybWF0aW9uUHJvcGVydGllcyhwcm9wc1R5cGUsIHByb3BNYXAsIHNjaGVtYS5pc1RhZ2dhYmxlUmVzb3VyY2Uoc3BlYykpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VDbGFzcyhyZXNvdXJjZU5hbWUpO1xuXG4gICAgdGhpcy5lbmROYW1lc3BhY2UocmVzb3VyY2VOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSByZXNvbHZlIGhlcmUuXG4gICAqXG4gICAqIFNpbmNlIHJlc29sdmUoKSBkZWVwLXJlc29sdmVzLCB3ZSBvbmx5IG5lZWQgdG8gZG8gdGhpcyBvbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0Q2xvdWRGb3JtYXRpb25Qcm9wZXJ0aWVzKHByb3BzVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSwgcHJvcE1hcDogRGljdGlvbmFyeTxzdHJpbmc+LCB0YWdnYWJsZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soJ3Byb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICcpO1xuICAgIHRoaXMuY29kZS5pbmRlbnQoJ3JldHVybiB7Jyk7XG4gICAgZm9yIChjb25zdCBwcm9wIG9mIE9iamVjdC52YWx1ZXMocHJvcE1hcCkpIHtcbiAgICAgIC8vIGhhbmRsZSB0YWcgcmVuZGVyaW5nIGJlY2F1c2Ugb2Ygc3BlY2lhbCBjYXNlc1xuICAgICAgaWYgKHRhZ2dhYmxlICYmIHNjaGVtYS5pc1RhZ1Byb3BlcnR5TmFtZSh1cGNhc2VGaXJzdChwcm9wKSkpIHtcbiAgICAgICAgdGhpcy5jb2RlLmxpbmUoYCR7cHJvcH06IHRoaXMudGFncy5yZW5kZXJUYWdzKCksYCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5jb2RlLmxpbmUoYCR7cHJvcH06IHRoaXMuJHtwcm9wfSxgKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlLnVuaW5kZW50KCd9OycpO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICB0aGlzLmNvZGUubGluZSgpO1xuXG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jaygncHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAnKTtcbiAgICB0aGlzLmNvZGUubGluZShgcmV0dXJuICR7Z2Vuc3BlYy5jZm5NYXBwZXJOYW1lKHByb3BzVHlwZSkuZnFufShwcm9wcyk7YCk7XG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdmFsaWRhdGlvbnMgZm9yIHRoZSBnaXZlbiBjb25zdHJ1Y3RcbiAgICpcbiAgICogVGhlIGdlbmVyYXRlZCBjb2RlIGxvb2tzIGxpa2UgdGhpczpcbiAgICpcbiAgICogYGBgXG4gICAqIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IC8qIHZhbGlkYXRpb24gY29kZSAqIC8gfSk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICBwcml2YXRlIGVtaXRDb25zdHJ1Y3RWYWxpZGF0b3IocmVzb3VyY2VUeXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgY29uc3QgY2ZuTGludCA9IGNmbkxpbnRBbm5vdGF0aW9ucyhyZXNvdXJjZVR5cGUuc3BlY05hbWU/LmZxbiA/PyAnJyk7XG5cbiAgICBpZiAoY2ZuTGludC5zdGF0ZWZ1bCkge1xuICAgICAgLy8gRG8gYSBzdGF0ZWZ1bG5lc3MgY2hlY2suIEEgZGVsZXRpb25Qb2xpY3kgaXMgcmVxdWlyZWQgKGFuZCBpbiBub3JtYWwgb3BlcmF0aW9uIGFuIFVwZGF0ZVJlcGxhY2VQb2xpY3lcbiAgICAgIC8vIHdvdWxkIGFsc28gYmUgc2V0IGlmIGEgdXNlciBkb2Vzbid0IGRvIGNvbXBsaWNhdGVkIHNoZW5hbmlnYW5zLCBpbiB3aGljaCBjYXNlIHRoZXkgcHJvYmFibHkga25vdyB3aGF0XG4gICAgICAvLyB0aGV5J3JlIGRvaW5nLlxuICAgICAgLy9cbiAgICAgIC8vIE9ubHkgZG8gdGhpcyBmb3IgTDFzIGVtYmVkZGVkIGluIEwycyAodG8gZm9yY2UgTDIgYXV0aG9ycyB0byBhZGQgYSB3YXkgdG8gc2V0IHRoaXMgcG9saWN5KS4gSWYgd2UgZGlkIGl0IGZvciBhbGwgTDFzOlxuICAgICAgLy9cbiAgICAgIC8vIC0gdXNlcnMgd29ya2luZyBhdCB0aGUgTDEgbGV2ZWwgd291bGQgc3RhcnQgZ2V0dGluZyBzeW50aGVzaXMgZmFpbHVyZXMgd2hlbiB3ZSBhZGQgdGhpcyBmZWF0dXJlXG4gICAgICAvLyAtIHRoZSBgY2xvdWRmb3JtYXRpb24taW5jbHVkZWAgbGlicmFyeSB0aGF0IGxvYWRzIENGTiB0ZW1wbGF0ZXMgdG8gTDFzIHdvdWxkIHN0YXJ0IGZhaWxpbmcgd2hlbiBpdCBsb2Fkc1xuICAgICAgLy8gICB0ZW1wbGF0ZXMgdGhhdCBkb24ndCBoYXZlIERlbGV0aW9uUG9saWN5IHNldC5cbiAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGlmICh0aGlzLm5vZGUuc2NvcGUgJiYgJHtDT1JFfS5SZXNvdXJjZS5pc1Jlc291cmNlKHRoaXMubm9kZS5zY29wZSkpYCk7XG4gICAgICB0aGlzLmNvZGUubGluZSgndGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy5jZm5PcHRpb25zLmRlbGV0aW9uUG9saWN5ID09PSB1bmRlZmluZWQnKTtcbiAgICAgIHRoaXMuY29kZS5saW5lKGAgID8gW1xcJ1xcXFxcXCcke3Jlc291cmNlVHlwZS5zcGVjTmFtZT8uZnFufVxcXFxcXCcgaXMgYSBzdGF0ZWZ1bCByZXNvdXJjZSB0eXBlLCBhbmQgeW91IG11c3Qgc3BlY2lmeSBhIFJlbW92YWwgUG9saWN5IGZvciBpdC4gQ2FsbCBcXFxcXFwncmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KClcXFxcXFwnLlxcJ11gKTtcbiAgICAgIHRoaXMuY29kZS5saW5lKCcgIDogW10gfSk7Jyk7XG4gICAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBmdW5jdGlvbiB0aGF0IGlzIGdvaW5nIHRvIGltcGxlbWVudCB0aGUgSUluc3BlY3RhYmxlIGludGVyZmFjZS5cbiAgICpcbiAgICogVGhlIGdlbmVyYXRlZCBjb2RlIGxvb2tzIGxpa2UgdGhpczpcbiAgICogcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgKiAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5NYW5hZ2VkUG9saWN5LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgKiAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICogfVxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0VHJlZUF0dHJpYnV0ZXMocmVzb3VyY2U6IGdlbnNwZWMuQ29kZU5hbWUpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGUubGluZSgnLyoqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXMnKTtcbiAgICB0aGlzLmNvZGUubGluZSgnIConKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICogQHN0YWJpbGl0eSBleHBlcmltZW50YWwnKTtcbiAgICB0aGlzLmNvZGUubGluZSgnICovJyk7XG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiAke0NPUkV9LlRyZWVJbnNwZWN0b3IpYCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCIke1RyZWVBdHRyaWJ1dGVzLkNGTl9UWVBFfVwiLCAke3Jlc291cmNlLmNsYXNzTmFtZX0uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCIke1RyZWVBdHRyaWJ1dGVzLkNGTl9QUk9QU31cIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtgKTtcbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXQgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgZ29pbmcgdG8gbWFwIHRoZSBnZW5lcmF0ZWQgVHlwZVNjcmlwdCBvYmplY3QgYmFjayBpbnRvIHRoZSBzY2hlbWEgdGhhdCBDbG91ZEZvcm1hdGlvbiBleHBlY3RzXG4gICAqXG4gICAqIFRoZSBnZW5lcmF0ZWQgY29kZSBsb29rcyBsaWtlIHRoaXM6XG4gICAqXG4gICAqICBmdW5jdGlvbiBidWNrZXRQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICogICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgcmV0dXJuIHByb3BlcnRpZXM7XG4gICAqICAgIEJ1Y2tldFByb3BzVmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICogICAgcmV0dXJuIHtcbiAgICogICAgICBBY2NlbGVyYXRlQ29uZmlndXJhdGlvbjogYnVja2V0QWNjZWxlcmF0ZUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eVRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hY2NlbGVyYXRlQ29uZmlndXJhdGlvbiksXG4gICAqICAgICAgQWNjZXNzQ29udHJvbDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hY2Nlc3NDb250cm9sKSxcbiAgICogICAgICBBbmFseXRpY3NDb25maWd1cmF0aW9uczogY2RrLmxpc3RNYXBwZXIoYnVja2V0QW5hbHl0aWNzQ29uZmlndXJhdGlvblByb3BlcnR5VG9DbG91ZEZvcm1hdGlvbilcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocHJvcGVydGllcy5hbmFseXRpY3NDb25maWd1cmF0aW9ucyksXG4gICAqICAgICAgLy8gLi4uXG4gICAqICAgIH07XG4gICAqICB9XG4gICAqXG4gICAqIEdlbmVyYXRlZCBhcyBhIHRvcC1sZXZlbCBmdW5jdGlvbiBvdXRzaWRlIGFueSBuYW1lc3BhY2Ugc28gd2UgY2FuIGhpZGUgaXQgZnJvbSBsaWJyYXJ5IGNvbnN1bWVycy5cbiAgICovXG4gIHByaXZhdGUgZW1pdENsb3VkRm9ybWF0aW9uTWFwcGVyKFxuICAgIHJlc291cmNlOiBnZW5zcGVjLkNvZGVOYW1lLFxuICAgIHR5cGVOYW1lOiBnZW5zcGVjLkNvZGVOYW1lLFxuICAgIHByb3BTcGVjczogeyBbbmFtZTogc3RyaW5nXTogc2NoZW1hLlByb3BlcnR5IH0sXG4gICAgbmFtZUNvbnZlcnNpb25UYWJsZTogRGljdGlvbmFyeTxzdHJpbmc+KSB7XG4gICAgY29uc3QgbWFwcGVyTmFtZSA9IGdlbnNwZWMuY2ZuTWFwcGVyTmFtZSh0eXBlTmFtZSk7XG5cbiAgICB0aGlzLmNvZGUubGluZSgnLyoqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuICR7cXVvdGVDb2RlKHR5cGVOYW1lLnNwZWNOYW1lIS5mcW4pfSByZXNvdXJjZWApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSAke3F1b3RlQ29kZSh0eXBlTmFtZS5jbGFzc05hbWUpfWApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gJHtxdW90ZUNvZGUodHlwZU5hbWUuc3BlY05hbWUhLmZxbil9IHJlc291cmNlLmApO1xuICAgIHRoaXMuY29kZS5saW5lKCcgKi8nKTtcbiAgICB0aGlzLmNvZGUubGluZSgnLy8gQHRzLWlnbm9yZSBUUzYxMzMnKTtcbiAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBmdW5jdGlvbiAke21hcHBlck5hbWUuZnVuY3Rpb25OYW1lfShwcm9wZXJ0aWVzOiBhbnkpOiBhbnlgKTtcblxuICAgIC8vIEl0IG1pZ2h0IGJlIHRoYXQgdGhpcyB2YWx1ZSBpcyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcsIGFuZCB0aGF0IHRoYXQncyBPSy4gU2ltcGx5IHJldHVyblxuICAgIC8vIHRoZSBmYWxzZXkgdmFsdWUsIHRoZSB1cHN0cmVhbSBzdHJ1Y3QgaXMgaW4gYSBiZXR0ZXIgcG9zaXRpb24gdG8ga25vdyB3aGV0aGVyIHRoaXMgaXMgcmVxdWlyZWQgb3Igbm90LlxuICAgIHRoaXMuY29kZS5saW5lKGBpZiAoISR7Q09SRX0uY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfWApO1xuXG4gICAgLy8gRG8gYSAndHlwZScgY2hlY2sgZmlyc3RcbiAgICBjb25zdCB2YWxpZGF0b3JOYW1lID0gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGVOYW1lKTtcbiAgICB0aGlzLmNvZGUubGluZShgJHt2YWxpZGF0b3JOYW1lLmZxbn0ocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO2ApO1xuXG4gICAgLy8gR2VuZXJhdGUgdGhlIHJldHVybiBvYmplY3RcbiAgICB0aGlzLmNvZGUuaW5kZW50KCdyZXR1cm4geycpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMobmFtZUNvbnZlcnNpb25UYWJsZSkuZm9yRWFjaChjZm5OYW1lID0+IHtcbiAgICAgIGNvbnN0IHByb3BOYW1lID0gbmFtZUNvbnZlcnNpb25UYWJsZVtjZm5OYW1lXTtcbiAgICAgIGNvbnN0IHByb3BTcGVjID0gcHJvcFNwZWNzW2Nmbk5hbWVdO1xuXG4gICAgICBjb25zdCBtYXBwZXJFeHByZXNzaW9uID0gZ2Vuc3BlYy50eXBlRGlzcGF0Y2g8c3RyaW5nPihyZXNvdXJjZSwgcHJvcFNwZWMsIHtcbiAgICAgICAgdmlzaXRBdG9tKHR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCBzcGVjVHlwZSA9IHR5cGUuc3BlY05hbWUgJiYgc2VsZi5zcGVjLlByb3BlcnR5VHlwZXNbdHlwZS5zcGVjTmFtZS5mcW5dO1xuICAgICAgICAgIGlmIChzcGVjVHlwZSAmJiAhc2NoZW1hLmlzUmVjb3JkVHlwZShzcGVjVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBnZW5zcGVjLnR5cGVEaXNwYXRjaChyZXNvdXJjZSwgc3BlY1R5cGUsIHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZ2Vuc3BlYy5jZm5NYXBwZXJOYW1lKHR5cGUpLmZxbjtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRBdG9tVW5pb24odHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSB0eXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKTtcbiAgICAgICAgICBjb25zdCBtYXBwZXJzID0gdHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpO1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS51bmlvbk1hcHBlcihbJHt2YWxpZGF0b3JzLmpvaW4oJywgJyl9XSwgWyR7bWFwcGVycy5qb2luKCcsICcpfV0pYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRMaXN0KGl0ZW1UeXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmxpc3RNYXBwZXIoJHt0aGlzLnZpc2l0QXRvbShpdGVtVHlwZSl9KWA7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0VW5pb25MaXN0KGl0ZW1UeXBlczogZ2Vuc3BlYy5Db2RlTmFtZVtdKSB7XG4gICAgICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKTtcbiAgICAgICAgICBjb25zdCBtYXBwZXJzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKTtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0ubGlzdE1hcHBlcigke0NPUkV9LnVuaW9uTWFwcGVyKFske3ZhbGlkYXRvcnMuam9pbignLCAnKX1dLCBbJHttYXBwZXJzLmpvaW4oJywgJyl9XSkpYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRNYXAoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0uaGFzaE1hcHBlcigke3RoaXMudmlzaXRBdG9tKGl0ZW1UeXBlKX0pYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRNYXBPZkxpc3RzKGl0ZW1UeXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmhhc2hNYXBwZXIoJHtDT1JFfS5saXN0TWFwcGVyKCR7dGhpcy52aXNpdEF0b20oaXRlbVR5cGUpfSkpYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRVbmlvbk1hcChpdGVtVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBpdGVtVHlwZXMubWFwKHR5cGUgPT4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbik7XG4gICAgICAgICAgY29uc3QgbWFwcGVycyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiB0aGlzLnZpc2l0QXRvbSh0eXBlKSk7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmhhc2hNYXBwZXIoJHtDT1JFfS51bmlvbk1hcHBlcihbJHt2YWxpZGF0b3JzLmpvaW4oJywgJyl9XSwgWyR7bWFwcGVycy5qb2luKCcsICcpfV0pKWA7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0TGlzdE9yQXRvbSh0eXBlczogZ2Vuc3BlYy5Db2RlTmFtZVtdLCBpdGVtVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIGNvbnN0IHZhbGlkYXRvck5hbWVzID0gdHlwZXMubWFwKHR5cGUgPT4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbikuam9pbignLCAnKTtcbiAgICAgICAgICBjb25zdCBpdGVtVmFsaWRhdG9yTmFtZXMgPSBpdGVtVHlwZXMubWFwKHR5cGUgPT4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbikuam9pbignLCAnKTtcblxuICAgICAgICAgIGNvbnN0IHNjYWxhclZhbGlkYXRvciA9IGAke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7dmFsaWRhdG9yTmFtZXN9KWA7XG4gICAgICAgICAgY29uc3QgbGlzdFZhbGlkYXRvciA9IGAke0NPUkV9Lmxpc3RWYWxpZGF0b3IoJHtDT1JFfS51bmlvblZhbGlkYXRvcigke2l0ZW1WYWxpZGF0b3JOYW1lc30pKWA7XG4gICAgICAgICAgY29uc3Qgc2NhbGFyTWFwcGVyID0gYCR7Q09SRX0udW5pb25NYXBwZXIoWyR7dmFsaWRhdG9yTmFtZXN9XSwgWyR7dHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyl9XSlgO1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgY29uc3QgbGlzdE1hcHBlciA9IGAke0NPUkV9Lmxpc3RNYXBwZXIoJHtDT1JFfS51bmlvbk1hcHBlcihbJHtpdGVtVmFsaWRhdG9yTmFtZXN9XSwgWyR7aXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfV0pKWA7XG5cbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0udW5pb25NYXBwZXIoWyR7c2NhbGFyVmFsaWRhdG9yfSwgJHtsaXN0VmFsaWRhdG9yfV0sIFske3NjYWxhck1hcHBlcn0sICR7bGlzdE1hcHBlcn1dKWA7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgc2VsZi5jb2RlLmxpbmUoYCR7Y2ZuTmFtZX06ICR7bWFwcGVyRXhwcmVzc2lvbn0ocHJvcGVydGllcy4ke3Byb3BOYW1lfSksYCk7XG4gICAgfSk7XG4gICAgdGhpcy5jb2RlLnVuaW5kZW50KCd9OycpO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgZnVuY3Rpb24gdGhhdCBjb252ZXJ0cyBmcm9tIGEgcHVyZSBDbG91ZEZvcm1hdGlvbiB2YWx1ZSB0YWtlbiBmcm9tIGEgdGVtcGxhdGVcbiAgICogdG8gYW4gaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIENESyBzdHJ1Y3QuXG4gICAqIFRoaXMgaW52b2x2ZXMgY2hhbmdpbmcgdGhlIGNhc2luZyBvZiB0aGUgcHJvcGVydGllcyxcbiAgICogZnJvbSBVcHBlckNhbWVsQ2FzZSB1c2VkIGJ5IENsb3VkRm9ybWF0aW9uLFxuICAgKiB0byBsb3dlckNhbWVsQ2FzZSB1c2VkIGJ5IHRoZSBDREssXG4gICAqIGFuZCBhbHNvIHRyYW5zbGF0aW5nIHRoaW5ncyBsaWtlIElSZXNvbHZhYmxlIGludG8gc3RyaW5ncywgbnVtYmVycyBvciBzdHJpbmcgYXJyYXlzLFxuICAgKiBkZXBlbmRpbmcgb24gdGhlIHR5cGUgb2YgdGhlIEwxIHByb3BlcnR5LlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0RnJvbUNmbkZhY3RvcnlGdW5jdGlvbihcbiAgICByZXNvdXJjZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICB0eXBlTmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICBwcm9wU3BlY3M6IHsgW25hbWU6IHN0cmluZ106IHNjaGVtYS5Qcm9wZXJ0eSB9LFxuICAgIG5hbWVDb252ZXJzaW9uVGFibGU6IERpY3Rpb25hcnk8c3RyaW5nPixcbiAgICBhbGxvd1JldHVybmluZ0lSZXNvbHZhYmxlOiBib29sZWFuKSB7XG5cbiAgICBjb25zdCBmYWN0b3J5TmFtZSA9IGdlbnNwZWMuZnJvbUNmbkZhY3RvcnlOYW1lKHR5cGVOYW1lKTtcblxuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgLy8gRG8gbm90IGVycm9yIG91dCBpZiB0aGlzIGZ1bmN0aW9uIGlzIHVudXNlZC5cbiAgICAvLyBTb21lIHR5cGVzIGFyZSBkZWNsYXJlZCBpbiB0aGUgQ0ZOIHNjaGVtYSxcbiAgICAvLyBidXQgbmV2ZXIgdXNlZCBhcyB0eXBlcyBvZiBwcm9wZXJ0aWVzLFxuICAgIC8vIGFuZCBpbiB0aG9zZSBjYXNlcyB0aGlzIGZ1bmN0aW9uIHdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICAgIHRoaXMuY29kZS5saW5lKCcvLyBAdHMtaWdub3JlIFRTNjEzMycpO1xuXG4gICAgY29uc3QgcmV0dXJuVHlwZSA9IGAke3R5cGVOYW1lLmZxbn0ke2FsbG93UmV0dXJuaW5nSVJlc29sdmFibGUgPyAnIHwgJyArIENPUkUgKyAnLklSZXNvbHZhYmxlJyA6ICcnfWA7XG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgZnVuY3Rpb24gJHtmYWN0b3J5TmFtZS5mdW5jdGlvbk5hbWV9KHByb3BlcnRpZXM6IGFueSk6IGAgK1xuICAgICAgYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8JHtyZXR1cm5UeXBlfT5gKTtcblxuICAgIGlmIChhbGxvd1JldHVybmluZ0lSZXNvbHZhYmxlKSB7XG4gICAgICB0aGlzLmNvZGUub3BlbkJsb2NrKGBpZiAoJHtDT1JFfS5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpYCk7XG4gICAgICB0aGlzLmNvZGUubGluZShgcmV0dXJuIG5ldyAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO2ApO1xuICAgICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvZGUubGluZSgncHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwge307Jyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYGNvbnN0IHJldCA9IG5ldyAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8JHt0eXBlTmFtZS5mcW59PigpO2ApO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gY2xhc3MgdXNlZCBmb3IgdGhlIHZpc2l0b3JcbiAgICBjbGFzcyBGcm9tQ2xvdWRGb3JtYXRpb25GYWN0b3J5VmlzaXRvciBpbXBsZW1lbnRzIGdlbnNwZWMuUHJvcGVydHlWaXNpdG9yPHN0cmluZz4ge1xuICAgICAgcHVibGljIHZpc2l0QXRvbSh0eXBlOiBnZW5zcGVjLkNvZGVOYW1lKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3Qgc3BlY1R5cGUgPSB0eXBlLnNwZWNOYW1lICYmIHNlbGYuc3BlYy5Qcm9wZXJ0eVR5cGVzW3R5cGUuc3BlY05hbWUuZnFuXTtcbiAgICAgICAgaWYgKHNwZWNUeXBlICYmICFzY2hlbWEuaXNSZWNvcmRUeXBlKHNwZWNUeXBlKSkge1xuICAgICAgICAgIHJldHVybiBnZW5zcGVjLnR5cGVEaXNwYXRjaChyZXNvdXJjZSwgc3BlY1R5cGUsIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBnZW5zcGVjLmZyb21DZm5GYWN0b3J5TmFtZSh0eXBlKS5mcW47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVibGljIHZpc2l0TGlzdChpdGVtVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBpdGVtVHlwZS5jbGFzc05hbWUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgLy8gYW4gYXJyYXkgb2Ygc3RyaW5ncyBpcyBhIHNwZWNpYWwgY2FzZSxcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IG1pZ2h0IG5lZWQgdG8gYmUgZW5jb2RlZCBhcyBhIFRva2VuIGRpcmVjdGx5XG4gICAgICAgICAgLy8gKGFuZCBub3QgYW4gYXJyYXkgb2YgdG9rZW5zKSwgZm9yIGV4YW1wbGUsXG4gICAgICAgICAgLy8gd2hlbiBhIFJlZiBleHByZXNzaW9uIHJlZmVyZW5jZXMgYSBwYXJhbWV0ZXIgb2YgdHlwZSBDb21tYURlbGltaXRlZExpc3RcbiAgICAgICAgICA/IGAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZ0FycmF5YFxuICAgICAgICAgIDogYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0QXJyYXkoJHt0aGlzLnZpc2l0QXRvbShpdGVtVHlwZSl9KWA7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyB2aXNpdE1hcChpdGVtVHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRNYXAoJHt0aGlzLnZpc2l0QXRvbShpdGVtVHlwZSl9KWA7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyB2aXNpdE1hcE9mTGlzdHMoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TWFwKGAgK1xuICAgICAgICAgIGAke0NGTl9QQVJTRX0uRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KCR7dGhpcy52aXNpdEF0b20oaXRlbVR5cGUpfSkpYDtcbiAgICAgIH1cblxuICAgICAgcHVibGljIHZpc2l0QXRvbVVuaW9uKHR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IHR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pLmpvaW4oJywgJyk7XG4gICAgICAgIGNvbnN0IG1hcHBlcnMgPSB0eXBlcy5tYXAodHlwZSA9PiB0aGlzLnZpc2l0QXRvbSh0eXBlKSkuam9pbignLCAnKTtcblxuICAgICAgICByZXR1cm4gYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0VHlwZVVuaW9uKFske3ZhbGlkYXRvck5hbWVzfV0sIFske21hcHBlcnN9XSlgO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgdmlzaXRVbmlvbkxpc3QoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBtYXBwZXJzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpO1xuXG4gICAgICAgIHJldHVybiBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShgICtcbiAgICAgICAgICBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRUeXBlVW5pb24oWyR7dmFsaWRhdG9yTmFtZXN9XSwgWyR7bWFwcGVyc31dKWAgK1xuICAgICAgICAgICcpJztcbiAgICAgIH1cblxuICAgICAgcHVibGljIHZpc2l0VW5pb25NYXAoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JOYW1lcyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBtYXBwZXJzID0gaXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpO1xuXG4gICAgICAgIHJldHVybiBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRNYXAoYCArXG4gICAgICAgICAgYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0VHlwZVVuaW9uKFske3ZhbGlkYXRvck5hbWVzfV0sIFske21hcHBlcnN9XSlgICtcbiAgICAgICAgICAnKSc7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyB2aXNpdExpc3RPckF0b20oc2NhbGFyVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSwgaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBhbnkge1xuICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3JOYW1lcyA9IHNjYWxhclR5cGVzLm1hcCh0eXBlID0+IGdlbnNwZWMudmFsaWRhdG9yTmFtZSh0eXBlKS5mcW4pLmpvaW4oJywgJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1WYWxpZGF0b3JOYW1lcyA9IGl0ZW1UeXBlcy5tYXAodHlwZSA9PiBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZSkuZnFuKS5qb2luKCcsICcpO1xuXG4gICAgICAgIGNvbnN0IHNjYWxhclR5cGVzTWFwcGVycyA9IHNjYWxhclR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpO1xuICAgICAgICBjb25zdCBzY2FsYXJNYXBwZXIgPSBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRUeXBlVW5pb24oWyR7c2NhbGFyVmFsaWRhdG9yTmFtZXN9XSwgWyR7c2NhbGFyVHlwZXNNYXBwZXJzfV0pYDtcblxuICAgICAgICBjb25zdCBpdGVtVHlwZU1hcHBlcnMgPSBpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyk7XG4gICAgICAgIGNvbnN0IGxpc3RNYXBwZXIgPSBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRBcnJheShgICtcbiAgICAgICAgICBgJHtDRk5fUEFSU0V9LkZyb21DbG91ZEZvcm1hdGlvbi5nZXRUeXBlVW5pb24oWyR7aXRlbVZhbGlkYXRvck5hbWVzfV0sIFske2l0ZW1UeXBlTWFwcGVyc31dKWAgK1xuICAgICAgICAgICcpJztcblxuICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3IgPSBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3NjYWxhclZhbGlkYXRvck5hbWVzfSlgO1xuICAgICAgICBjb25zdCBsaXN0VmFsaWRhdG9yID0gYCR7Q09SRX0ubGlzdFZhbGlkYXRvcigke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7aXRlbVZhbGlkYXRvck5hbWVzfSkpYDtcblxuICAgICAgICByZXR1cm4gYCR7Q0ZOX1BBUlNFfS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0VHlwZVVuaW9uKFske3NjYWxhclZhbGlkYXRvcn0sICR7bGlzdFZhbGlkYXRvcn1dLCBbJHtzY2FsYXJNYXBwZXJ9LCAke2xpc3RNYXBwZXJ9XSlgO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2NmblByb3BOYW1lLCBjZGtQcm9wTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMobmFtZUNvbnZlcnNpb25UYWJsZSkpIHtcbiAgICAgIGNvbnN0IHByb3BTcGVjID0gcHJvcFNwZWNzW2NmblByb3BOYW1lXTtcbiAgICAgIGNvbnN0IHNpbXBsZUNmblByb3BBY2Nlc3NFeHByID0gYHByb3BlcnRpZXMuJHtjZm5Qcm9wTmFtZX1gO1xuICAgICAgY29uc3QgZGVzZXJpYWxpemVkRXhwcmVzc2lvbiA9IGdlbnNwZWMudHlwZURpc3BhdGNoPHN0cmluZz4ocmVzb3VyY2UsIHByb3BTcGVjLCBuZXcgRnJvbUNsb3VkRm9ybWF0aW9uRmFjdG9yeVZpc2l0b3IoKSkgK1xuICAgICAgICBgKCR7c2ltcGxlQ2ZuUHJvcEFjY2Vzc0V4cHJ9KWA7XG5cbiAgICAgIGxldCB2YWx1ZUV4cHJlc3Npb24gPSBwcm9wU3BlYy5SZXF1aXJlZFxuICAgICAgICA/IGRlc2VyaWFsaXplZEV4cHJlc3Npb25cbiAgICAgICAgOiBgJHtzaW1wbGVDZm5Qcm9wQWNjZXNzRXhwcn0gIT0gbnVsbCA/ICR7ZGVzZXJpYWxpemVkRXhwcmVzc2lvbn0gOiB1bmRlZmluZWRgO1xuICAgICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5TmFtZShjZm5Qcm9wTmFtZSkpIHtcbiAgICAgICAgLy8gUHJvcGVydGllcyB0aGF0IGhhdmUgbmFtZXMgY29uc2lkZXJlZCB0byBkZW5vdGUgdGFnc1xuICAgICAgICAvLyBoYXZlIHRoZWlyIHR5cGUgZ2VuZXJhdGVkIHdpdGhvdXQgYSB1bmlvbiB3aXRoIElSZXNvbHZhYmxlLlxuICAgICAgICAvLyBIb3dldmVyLCB3ZSBjYW4ndCBwb3NzaWJseSBrbm93IHRoYXQgd2hlbiBnZW5lcmF0aW5nIHRoZSBmYWN0b3J5XG4gICAgICAgIC8vIGZvciB0aGF0IHN0cnVjdCwgYW5kIChpbiB0aGVvcnksIGF0IGxlYXN0KVxuICAgICAgICAvLyB0aGUgc2FtZSB0eXBlIGNhbiBiZSB1c2VkIGFzIHRoZSB2YWx1ZSBvZiBtdWx0aXBsZSBwcm9wZXJ0aWVzLFxuICAgICAgICAvLyBzb21lIG9mIHdoaWNoIGRvIG5vdCBoYXZlIGEgdGFnLWNvbXBhdGlibGUgbmFtZSxcbiAgICAgICAgLy8gc28gdGhlcmUgaXMgbm8gd2F5IHRvIHBhc3MgYWxsb3dSZXR1cm5pbmdJUmVzb2x2YWJsZT1mYWxzZSBjb3JyZWN0bHkuXG4gICAgICAgIC8vIERvIHRoZSBzaW1wbGUgdGhpbmcgaW4gdGhhdCBjYXNlLCBhbmQganVzdCBjYXN0IHRvIGFueS5cbiAgICAgICAgdmFsdWVFeHByZXNzaW9uICs9ICcgYXMgYW55JztcbiAgICAgIH1cblxuICAgICAgc2VsZi5jb2RlLmxpbmUoYHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnJHtjZGtQcm9wTmFtZX0nLCAnJHtjZm5Qcm9wTmFtZX0nLCAke3ZhbHVlRXhwcmVzc2lvbn0pO2ApO1xuICAgIH1cblxuICAgIC8vIHNhdmUgYW55IGV4dHJhIHByb3BlcnRpZXMgd2UgZmluZCBvbiB0aGlzIGxldmVsXG4gICAgdGhpcy5jb2RlLmxpbmUoJ3JldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTsnKTtcblxuICAgIC8vIHJldHVybiB0aGUgcmVzdWx0IG9iamVjdFxuICAgIHRoaXMuY29kZS5saW5lKCdyZXR1cm4gcmV0OycpO1xuXG4gICAgLy8gY2xvc2UgdGhlIGZ1bmN0aW9uIGJyYWNlXG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IGEgZnVuY3Rpb24gdGhhdCB3aWxsIHZhbGlkYXRlIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnR5IGJhZyBtYXRjaGVzIHRoZSBzY2hlbWEgb2YgdGhpcyBjb21wbGV4IHR5cGVcbiAgICpcbiAgICogR2VuZXJhdGVkIGFzIGEgdG9wLWxldmVsIGZ1bmN0aW9uIG91dHNpZGUgYW55IG5hbWVzcGFjZSBzbyB3ZSBjYW4gaGlkZSBpdCBmcm9tIGxpYnJhcnkgY29uc3VtZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSBlbWl0UHJvcGVydGllc1ZhbGlkYXRvcihcbiAgICByZXNvdXJjZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICB0eXBlTmFtZTogZ2Vuc3BlYy5Db2RlTmFtZSxcbiAgICBwcm9wU3BlY3M6IHsgW25hbWU6IHN0cmluZ106IHNjaGVtYS5Qcm9wZXJ0eSB9LFxuICAgIG5hbWVDb252ZXJzaW9uVGFibGU6IERpY3Rpb25hcnk8c3RyaW5nPik6IHZvaWQge1xuICAgIGNvbnN0IHZhbGlkYXRvck5hbWUgPSBnZW5zcGVjLnZhbGlkYXRvck5hbWUodHlwZU5hbWUpO1xuXG4gICAgdGhpcy5jb2RlLmxpbmUoJy8qKicpO1xuICAgIHRoaXMuY29kZS5saW5lKGAgKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhICR7cXVvdGVDb2RlKHR5cGVOYW1lLmNsYXNzTmFtZSl9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoYCAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhICR7cXVvdGVDb2RlKHR5cGVOYW1lLmNsYXNzTmFtZSl9YCk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uJyk7XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGZ1bmN0aW9uICR7dmFsaWRhdG9yTmFtZS5mdW5jdGlvbk5hbWV9KHByb3BlcnRpZXM6IGFueSk6ICR7Q09SRX0uVmFsaWRhdGlvblJlc3VsdGApO1xuICAgIHRoaXMuY29kZS5saW5lKGBpZiAoISR7Q09SRX0uY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gJHtDT1JFfS5WQUxJREFUSU9OX1NVQ0NFU1M7IH1gKTtcblxuICAgIHRoaXMuY29kZS5saW5lKGBjb25zdCBlcnJvcnMgPSBuZXcgJHtDT1JFfS5WYWxpZGF0aW9uUmVzdWx0cygpO2ApO1xuXG4gICAgLy8gY2hlY2sgdGhhdCB0aGUgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gICAgLy8gbm9ybWFsbHksIHdlIHdvdWxkIGhhdmUgdG8gZXhwbGljaXRseSBjaGVjayBmb3IgbnVsbCBoZXJlLFxuICAgIC8vIGFzIHR5cGVvZiBudWxsIGlzICdvYmplY3QnIGluIEphdmFTY3JpcHQsXG4gICAgLy8gYnV0IHZhbGlkYXRvcnMgYXJlIG5ldmVyIGNhbGxlZCB3aXRoIG51bGxcbiAgICAvLyAoYXMgZXZpZGVuY2VkIGJ5IHRoZSBjb2RlIGJlbG93IGFjY2Vzc2luZyBwcm9wZXJ0aWVzIG9mIHRoZSBhcmd1bWVudCB3aXRob3V0IGNoZWNraW5nIGZvciBudWxsKVxuICAgIHRoaXMuY29kZS5vcGVuQmxvY2soXCJpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKVwiKTtcbiAgICB0aGlzLmNvZGUubGluZShgZXJyb3JzLmNvbGxlY3QobmV3ICR7Q09SRX0uVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO2ApO1xuICAgIHRoaXMuY29kZS5jbG9zZUJsb2NrKCk7XG5cbiAgICBPYmplY3Qua2V5cyhwcm9wU3BlY3MpLmZvckVhY2goY2ZuUHJvcE5hbWUgPT4ge1xuICAgICAgY29uc3QgcHJvcFNwZWMgPSBwcm9wU3BlY3NbY2ZuUHJvcE5hbWVdO1xuICAgICAgY29uc3QgcHJvcE5hbWUgPSBuYW1lQ29udmVyc2lvblRhYmxlW2NmblByb3BOYW1lXTtcblxuICAgICAgaWYgKHByb3BTcGVjLlJlcXVpcmVkKSB7XG4gICAgICAgIHRoaXMuY29kZS5saW5lKGBlcnJvcnMuY29sbGVjdCgke0NPUkV9LnByb3BlcnR5VmFsaWRhdG9yKCcke3Byb3BOYW1lfScsICR7Q09SRX0ucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuJHtwcm9wTmFtZX0pKTtgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCB2YWxpZGF0b3JFeHByZXNzaW9uID0gZ2Vuc3BlYy50eXBlRGlzcGF0Y2g8c3RyaW5nPihyZXNvdXJjZSwgcHJvcFNwZWMsIHtcbiAgICAgICAgdmlzaXRBdG9tKHR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCBzcGVjVHlwZSA9IHR5cGUuc3BlY05hbWUgJiYgc2VsZi5zcGVjLlByb3BlcnR5VHlwZXNbdHlwZS5zcGVjTmFtZS5mcW5dO1xuICAgICAgICAgIGlmIChzcGVjVHlwZSAmJiAhc2NoZW1hLmlzUmVjb3JkVHlwZShzcGVjVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBnZW5zcGVjLnR5cGVEaXNwYXRjaChyZXNvdXJjZSwgc3BlY1R5cGUsIHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZ2Vuc3BlYy52YWxpZGF0b3JOYW1lKHR5cGUpLmZxbjtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRBdG9tVW5pb24odHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3R5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfSlgO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdExpc3QoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0ubGlzdFZhbGlkYXRvcigke3RoaXMudmlzaXRBdG9tKGl0ZW1UeXBlKX0pYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRVbmlvbkxpc3QoaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0ubGlzdFZhbGlkYXRvcigke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7aXRlbVR5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfSkpYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRNYXAoaXRlbVR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Q09SRX0uaGFzaFZhbGlkYXRvcigke3RoaXMudmlzaXRBdG9tKGl0ZW1UeXBlKX0pYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRNYXBPZkxpc3RzKGl0ZW1UeXBlOiBnZW5zcGVjLkNvZGVOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9Lmhhc2hWYWxpZGF0b3IoJHtDT1JFfS5saXN0VmFsaWRhdG9yKCR7dGhpcy52aXNpdEF0b20oaXRlbVR5cGUpfSkpYDtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRVbmlvbk1hcChpdGVtVHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSkge1xuICAgICAgICAgIHJldHVybiBgJHtDT1JFfS5oYXNoVmFsaWRhdG9yKCR7Q09SRX0udW5pb25WYWxpZGF0b3IoJHtpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyl9KSlgO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdExpc3RPckF0b20odHlwZXM6IGdlbnNwZWMuQ29kZU5hbWVbXSwgaXRlbVR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pIHtcbiAgICAgICAgICBjb25zdCBzY2FsYXJWYWxpZGF0b3IgPSBgJHtDT1JFfS51bmlvblZhbGlkYXRvcigke3R5cGVzLm1hcCh0eXBlID0+IHRoaXMudmlzaXRBdG9tKHR5cGUpKS5qb2luKCcsICcpfSlgO1xuICAgICAgICAgIGNvbnN0IGxpc3RWYWxpZGF0b3IgPSBgJHtDT1JFfS5saXN0VmFsaWRhdG9yKCR7Q09SRX0udW5pb25WYWxpZGF0b3IoJHtpdGVtVHlwZXMubWFwKHR5cGUgPT4gdGhpcy52aXNpdEF0b20odHlwZSkpLmpvaW4oJywgJyl9KSlgO1xuXG4gICAgICAgICAgcmV0dXJuIGAke0NPUkV9LnVuaW9uVmFsaWRhdG9yKCR7c2NhbGFyVmFsaWRhdG9yfSwgJHtsaXN0VmFsaWRhdG9yfSlgO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBzZWxmLmNvZGUubGluZShgZXJyb3JzLmNvbGxlY3QoJHtDT1JFfS5wcm9wZXJ0eVZhbGlkYXRvcignJHtwcm9wTmFtZX0nLCAke3ZhbGlkYXRvckV4cHJlc3Npb259KShwcm9wZXJ0aWVzLiR7cHJvcE5hbWV9KSk7YCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvZGUubGluZShgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIiR7dHlwZU5hbWUuY2xhc3NOYW1lfVwiJyk7YCk7XG5cbiAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0SW50ZXJmYWNlUHJvcGVydHkocHJvcHM6IEVtaXRQcm9wZXJ0eVByb3BzKTogc3RyaW5nIHtcbiAgICBjb25zdCBqYXZhc2NyaXB0UHJvcGVydHlOYW1lID0gZ2Vuc3BlYy5jbG91ZEZvcm1hdGlvblRvU2NyaXB0TmFtZShwcm9wcy5wcm9wTmFtZSk7XG5cbiAgICB0aGlzLmRvY0xpbmsocHJvcHMuc3BlYy5Eb2N1bWVudGF0aW9uLCBwcm9wcy5hZGRpdGlvbmFsRG9jcyk7XG4gICAgY29uc3QgbGluZSA9IGA6ICR7dGhpcy5maW5kTmF0aXZlVHlwZShwcm9wcy5jb250ZXh0LCBwcm9wcy5zcGVjLCBwcm9wcy5wcm9wTmFtZSl9O2A7XG5cbiAgICBjb25zdCBxdWVzdGlvbiA9IHByb3BzLnNwZWMuUmVxdWlyZWQgPyAnJyA6ICc/JztcbiAgICB0aGlzLmNvZGUubGluZShgcmVhZG9ubHkgJHtqYXZhc2NyaXB0UHJvcGVydHlOYW1lfSR7cXVlc3Rpb259JHtsaW5lfWApO1xuICAgIHJldHVybiBqYXZhc2NyaXB0UHJvcGVydHlOYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0Q2xhc3NQcm9wZXJ0eShwcm9wczogRW1pdFByb3BlcnR5UHJvcHMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGphdmFzY3JpcHRQcm9wZXJ0eU5hbWUgPSBnZW5zcGVjLmNsb3VkRm9ybWF0aW9uVG9TY3JpcHROYW1lKHByb3BzLnByb3BOYW1lKTtcblxuICAgIHRoaXMuZG9jTGluayhwcm9wcy5zcGVjLkRvY3VtZW50YXRpb24sIHByb3BzLmFkZGl0aW9uYWxEb2NzKTtcbiAgICBjb25zdCBxdWVzdGlvbiA9IHByb3BzLnNwZWMuUmVxdWlyZWQgPyAnOycgOiAnIHwgdW5kZWZpbmVkOyc7XG4gICAgY29uc3QgbGluZSA9IGA6ICR7dGhpcy5maW5kTmF0aXZlVHlwZShwcm9wcy5jb250ZXh0LCBwcm9wcy5zcGVjLCBwcm9wcy5wcm9wTmFtZSl9JHtxdWVzdGlvbn1gO1xuICAgIGlmIChzY2hlbWEuaXNUYWdQcm9wZXJ0eU5hbWUocHJvcHMucHJvcE5hbWUpICYmIHNjaGVtYS5pc1RhZ1Byb3BlcnR5KHByb3BzLnNwZWMpKSB7XG4gICAgICB0aGlzLmNvZGUubGluZShgcHVibGljIHJlYWRvbmx5IHRhZ3M6ICR7VEFHX01BTkFHRVJ9O2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvZGUubGluZShgcHVibGljICR7amF2YXNjcmlwdFByb3BlcnR5TmFtZX0ke2xpbmV9YCk7XG4gICAgfVxuICAgIHJldHVybiBqYXZhc2NyaXB0UHJvcGVydHlOYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0UHJvcGVydHkocHJvcHM6IEVtaXRQcm9wZXJ0eVByb3BzLCBjb250YWluZXI6IENvbnRhaW5lcik6IHN0cmluZyB7XG4gICAgc3dpdGNoIChjb250YWluZXIpIHtcbiAgICAgIGNhc2UgQ29udGFpbmVyLkNsYXNzOlxuICAgICAgICByZXR1cm4gdGhpcy5lbWl0Q2xhc3NQcm9wZXJ0eShwcm9wcyk7XG4gICAgICBjYXNlIENvbnRhaW5lci5JbnRlcmZhY2U6XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXRJbnRlcmZhY2VQcm9wZXJ0eShwcm9wcyk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGNvbnRhaW5lciAke2NvbnRhaW5lcn1gKTtcbiAgICB9XG5cbiAgfVxuXG4gIHByaXZhdGUgYmVnaW5OYW1lc3BhY2UodHlwZTogZ2Vuc3BlYy5Db2RlTmFtZSk6IHZvaWQge1xuICAgIGlmICh0eXBlLm5hbWVzcGFjZSkge1xuICAgICAgY29uc3QgcGFydHMgPSB0eXBlLm5hbWVzcGFjZS5zcGxpdCgnLicpO1xuICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAgIHRoaXMuY29kZS5vcGVuQmxvY2soYGV4cG9ydCBuYW1lc3BhY2UgJHtwYXJ0fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW5kTmFtZXNwYWNlKHR5cGU6IGdlbnNwZWMuQ29kZU5hbWUpOiB2b2lkIHtcbiAgICBpZiAodHlwZS5uYW1lc3BhY2UpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gdHlwZS5uYW1lc3BhY2Uuc3BsaXQoJy4nKTtcbiAgICAgIGZvciAoY29uc3QgXyBvZiBwYXJ0cykge1xuICAgICAgICB0aGlzLmNvZGUuY2xvc2VCbG9jaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdFByb3BlcnR5VHlwZShyZXNvdXJjZUNvbnRleHQ6IGdlbnNwZWMuQ29kZU5hbWUsIHR5cGVOYW1lOiBnZW5zcGVjLkNvZGVOYW1lLCBwcm9wVHlwZVNwZWM6IHNjaGVtYS5SZWNvcmRQcm9wZXJ0eSk6IHZvaWQge1xuICAgIHRoaXMuY29kZS5saW5lKCk7XG4gICAgdGhpcy5iZWdpbk5hbWVzcGFjZSh0eXBlTmFtZSk7XG5cbiAgICB0aGlzLmRvY0xpbmsocHJvcFR5cGVTcGVjLkRvY3VtZW50YXRpb24sICdAc3RhYmlsaXR5IGV4dGVybmFsJyk7XG4gICAgLypcbiAgICBpZiAoIXByb3BUeXBlU3BlYy5Qcm9wZXJ0aWVzIHx8IE9iamVjdC5rZXlzKHByb3BUeXBlU3BlYy5Qcm9wZXJ0aWVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuY29kZS5saW5lKCcvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc29tZXRoaW5nc29tZXRoaW5nIHwgQSBnZW51aW5lIGVtcHR5LW9iamVjdCB0eXBlJyk7XG4gICAgfVxuICAgICovXG4gICAgdGhpcy5jb2RlLm9wZW5CbG9jayhgZXhwb3J0IGludGVyZmFjZSAke3R5cGVOYW1lLmNsYXNzTmFtZX1gKTtcbiAgICBjb25zdCBjb252ZXJzaW9uVGFibGU6IERpY3Rpb25hcnk8c3RyaW5nPiA9IHt9O1xuICAgIGlmIChwcm9wVHlwZVNwZWMuUHJvcGVydGllcykge1xuICAgICAgT2JqZWN0LmtleXMocHJvcFR5cGVTcGVjLlByb3BlcnRpZXMpLmZvckVhY2gocHJvcE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBwcm9wU3BlYyA9IHByb3BUeXBlU3BlYy5Qcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbERvY3MgPSBxdW90ZUNvZGUoYCR7dHlwZU5hbWUuZnFufS4ke3Byb3BOYW1lfWApO1xuICAgICAgICBjb25zdCBuZXdOYW1lID0gdGhpcy5lbWl0SW50ZXJmYWNlUHJvcGVydHkoe1xuICAgICAgICAgIGNvbnRleHQ6IHJlc291cmNlQ29udGV4dCxcbiAgICAgICAgICBwcm9wTmFtZSxcbiAgICAgICAgICBzcGVjOiBwcm9wU3BlYyxcbiAgICAgICAgICBhZGRpdGlvbmFsRG9jcyxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnZlcnNpb25UYWJsZVtwcm9wTmFtZV0gPSBuZXdOYW1lO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2RlLmNsb3NlQmxvY2soKTtcbiAgICB0aGlzLmVuZE5hbWVzcGFjZSh0eXBlTmFtZSk7XG5cbiAgICB0aGlzLmNvZGUubGluZSgpO1xuICAgIHRoaXMuZW1pdFByb3BlcnRpZXNWYWxpZGF0b3IocmVzb3VyY2VDb250ZXh0LCB0eXBlTmFtZSwgcHJvcFR5cGVTcGVjLlByb3BlcnRpZXMsIGNvbnZlcnNpb25UYWJsZSk7XG4gICAgdGhpcy5jb2RlLmxpbmUoKTtcbiAgICB0aGlzLmVtaXRDbG91ZEZvcm1hdGlvbk1hcHBlcihyZXNvdXJjZUNvbnRleHQsIHR5cGVOYW1lLCBwcm9wVHlwZVNwZWMuUHJvcGVydGllcywgY29udmVyc2lvblRhYmxlKTtcbiAgICB0aGlzLmVtaXRGcm9tQ2ZuRmFjdG9yeUZ1bmN0aW9uKHJlc291cmNlQ29udGV4dCwgdHlwZU5hbWUsIHByb3BUeXBlU3BlYy5Qcm9wZXJ0aWVzLCBjb252ZXJzaW9uVGFibGUsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbmF0aXZlIHR5cGUgZXhwcmVzc2lvbiBmb3IgdGhlIGdpdmVuIHByb3BTcGVjXG4gICAqL1xuICBwcml2YXRlIGZpbmROYXRpdmVUeXBlKHJlc291cmNlQ29udGV4dDogZ2Vuc3BlYy5Db2RlTmFtZSwgcHJvcFNwZWM6IHNjaGVtYS5Qcm9wZXJ0eSwgcHJvcE5hbWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGFsdGVybmF0aXZlczogc3RyaW5nW10gPSBbXTtcblxuICAgIC8vIHJlbmRlciB0aGUgdW5pb24gb2YgYWxsIGl0ZW0gdHlwZXNcbiAgICBpZiAoc2NoZW1hLmlzQ29sbGVjdGlvblByb3BlcnR5KHByb3BTcGVjKSkge1xuICAgICAgLy8gcmVuZGVyIHRoZSB1bmlvbiBvZiBhbGwgaXRlbSB0eXBlc1xuICAgICAgY29uc3QgaXRlbVR5cGVzID0gZ2Vuc3BlYy5zcGVjVHlwZXNUb0NvZGVUeXBlcyhyZXNvdXJjZUNvbnRleHQsIGl0ZW1UeXBlTmFtZXMocHJvcFNwZWMpKTtcblxuICAgICAgLy8gJ3Rva2VuaXphYmxlVHlwZScgb3BlcmF0ZXMgYXQgdGhlIGxldmVsIG9mIHJlbmRlcmVkIHR5cGUgbmFtZXMgaW4gVHlwZVNjcmlwdCwgc28gc3RyaW5naWZ5XG4gICAgICAvLyB0aGUgb2JqZWN0cy5cbiAgICAgIGNvbnN0IHJlbmRlcmVkVHlwZXMgPSBpdGVtVHlwZXMubWFwKHQgPT4gdGhpcy5yZW5kZXJDb2RlTmFtZShyZXNvdXJjZUNvbnRleHQsIHQpKTtcbiAgICAgIGlmICghdG9rZW5pemFibGVUeXBlKHJlbmRlcmVkVHlwZXMpICYmICFzY2hlbWEuaXNUYWdQcm9wZXJ0eU5hbWUocHJvcE5hbWUpKSB7XG4gICAgICAgIC8vIEFsd2F5cyBhY2NlcHQgYSB0b2tlbiBpbiBwbGFjZSBvZiBhbnkgbGlzdCBlbGVtZW50ICh1bmxlc3MgdGhlIGxpc3QgZWxlbWVudHMgYXJlIHRva2VuaXphYmxlKVxuICAgICAgICBpdGVtVHlwZXMucHVzaChnZW5zcGVjLlRPS0VOX05BTUUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1bmlvbiA9IHRoaXMucmVuZGVyVHlwZVVuaW9uKHJlc291cmNlQ29udGV4dCwgaXRlbVR5cGVzKTtcblxuICAgICAgaWYgKHNjaGVtYS5pc01hcFByb3BlcnR5KHByb3BTcGVjKSkge1xuICAgICAgICBhbHRlcm5hdGl2ZXMucHVzaChgeyBba2V5OiBzdHJpbmddOiAoJHt1bmlvbn0pIH1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRvIG1ha2UgVFNMaW50IGhhcHB5LCB3ZSBoYXZlIHRvIGVpdGhlciBlbWl0OiBTaW5nbGVUeXBlW10gb3IgQXJyYXk8QWx0MSB8IEFsdDI+XG4gICAgICAgIGlmICh1bmlvbi5pbmRleE9mKCd8JykgIT09IC0xKSB7XG4gICAgICAgICAgYWx0ZXJuYXRpdmVzLnB1c2goYEFycmF5PCR7dW5pb259PmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFsdGVybmF0aXZlcy5wdXNoKGAke3VuaW9ufVtdYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBZZXMsIHNvbWUgdHlwZXMgY2FuIGJlIGJvdGggY29sbGVjdGlvbiBhbmQgc2NhbGFyLiBMb29raW5nIGF0IHlvdSwgU0FNLlxuICAgIGlmIChzY2hlbWEuaXNTY2FsYXJQcm9wZXJ0eShwcm9wU3BlYykpIHtcbiAgICAgIC8vIFNjYWxhciB0eXBlXG4gICAgICBjb25zdCB0eXBlTmFtZXMgPSBzY2FsYXJUeXBlTmFtZXMocHJvcFNwZWMpO1xuICAgICAgY29uc3QgdHlwZXMgPSBnZW5zcGVjLnNwZWNUeXBlc1RvQ29kZVR5cGVzKHJlc291cmNlQ29udGV4dCwgdHlwZU5hbWVzKTtcbiAgICAgIGFsdGVybmF0aXZlcy5wdXNoKHRoaXMucmVuZGVyVHlwZVVuaW9uKHJlc291cmNlQ29udGV4dCwgdHlwZXMpKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGlmIHRoaXMgcHJvcGVydHkgaXMgbm90IG9mIGEgXCJ0b2tlbml6YWJsZSB0eXBlXCIgKHN0cmluZywgc3RyaW5nW10sXG4gICAgLy8gbnVtYmVyIGluIHRoZSBmdXR1cmUpIHdlIGFkZCBhIHR5cGUgdW5pb24gZm9yIGBjZGsuVG9rZW5gLiBXZSByYXRoZXJcbiAgICAvLyBldmVyeXRoaW5nIHRvIGJlIHRva2VuaXphYmxlIGJlY2F1c2UgdGhlcmUgYXJlIGxhbmd1YWdlcyB0aGF0IGRvIG5vdFxuICAgIC8vIHN1cHBvcnQgdW5pb24gdHlwZXMgKGkuZS4gSmF2YSwgLk5FVCksIHNvIHdlIGxvc2UgdHlwZSBzYWZldHkgaWYgd2UgaGF2ZVxuICAgIC8vIGEgdW5pb24uXG4gICAgaWYgKCF0b2tlbml6YWJsZVR5cGUoYWx0ZXJuYXRpdmVzKSAmJiAhc2NoZW1hLmlzVGFnUHJvcGVydHlOYW1lKHByb3BOYW1lKSkge1xuICAgICAgYWx0ZXJuYXRpdmVzLnB1c2goZ2Vuc3BlYy5UT0tFTl9OQU1FLmZxbik7XG4gICAgfVxuICAgIHJldHVybiBhbHRlcm5hdGl2ZXMuam9pbignIHwgJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGEgQ29kZU5hbWUgdG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgaXQgaW4gVHlwZVNjcmlwdFxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJDb2RlTmFtZShjb250ZXh0OiBnZW5zcGVjLkNvZGVOYW1lLCB0eXBlOiBnZW5zcGVjLkNvZGVOYW1lKTogc3RyaW5nIHtcbiAgICBjb25zdCByZWwgPSB0eXBlLnJlbGF0aXZlVG8oY29udGV4dCk7XG4gICAgY29uc3Qgc3BlY1R5cGUgPSByZWwuc3BlY05hbWUgJiYgdGhpcy5zcGVjLlByb3BlcnR5VHlwZXNbcmVsLnNwZWNOYW1lLmZxbl07XG4gICAgaWYgKCFzcGVjVHlwZSB8fCBzY2hlbWEuaXNSZWNvcmRUeXBlKHNwZWNUeXBlKSkge1xuICAgICAgcmV0dXJuIHJlbC5mcW47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmROYXRpdmVUeXBlKGNvbnRleHQsIHNwZWNUeXBlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVHlwZVVuaW9uKGNvbnRleHQ6IGdlbnNwZWMuQ29kZU5hbWUsIHR5cGVzOiBnZW5zcGVjLkNvZGVOYW1lW10pOiBzdHJpbmcge1xuICAgIHJldHVybiB0eXBlcy5tYXAodCA9PiB0aGlzLnJlbmRlckNvZGVOYW1lKGNvbnRleHQsIHQpKS5qb2luKCcgfCAnKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9jTGluayhsaW5rOiBzdHJpbmcgfCB1bmRlZmluZWQsIC4uLmJlZm9yZTogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAoIWxpbmsgJiYgYmVmb3JlLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNvZGUubGluZSgnLyoqJyk7XG4gICAgYmVmb3JlLmZvckVhY2gobGluZSA9PiB0aGlzLmNvZGUubGluZShgICogJHtsaW5lfWAudHJpbVJpZ2h0KCkpKTtcbiAgICBpZiAobGluaykge1xuICAgICAgdGhpcy5jb2RlLmxpbmUoYCAqIEBsaW5rICR7bGlua31gKTtcbiAgICB9XG4gICAgdGhpcy5jb2RlLmxpbmUoJyAqLycpO1xuICAgIHJldHVybjtcbiAgfVxufVxuXG4vKipcbiAqIFF1b3RlcyBhIGNvZGUgbmFtZSBmb3IgaW5jbHVzaW9uIGluIGEgSlNEb2MgY29tbWVudCwgc28gaXQgd2lsbCByZW5kZXIgcHJvcGVybHlcbiAqIGluIHRoZSBNYXJrZG93biBvdXRwdXQuXG4gKlxuICogQHBhcmFtIGNvZGUgYSBjb2RlIG5hbWUgdG8gYmUgcXVvdGVkLlxuICpcbiAqIEByZXR1cm5zIHRoZSBjb2RlIG5hbWUgc3Vycm91bmRlZCBieSBkb3VibGUgYmFja3RpY2tzLlxuICovXG5mdW5jdGlvbiBxdW90ZUNvZGUoY29kZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICdgJyArIGNvZGUgKyAnYCc7XG59XG5cbmZ1bmN0aW9uIHRva2VuaXphYmxlVHlwZShhbHRlcm5hdGl2ZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIGlmIChhbHRlcm5hdGl2ZXMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHR5cGUgPSBhbHRlcm5hdGl2ZXNbMF07XG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmdbXScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0YWdUeXBlKHJlc291cmNlOiBzY2hlbWEuVGFnZ2FibGVSZXNvdXJjZSk6IHN0cmluZyB7XG4gIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyhyZXNvdXJjZS5Qcm9wZXJ0aWVzKSkge1xuICAgIGlmICghc2NoZW1hLmlzVGFnUHJvcGVydHlOYW1lKG5hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5U3RhbmRhcmQocmVzb3VyY2UuUHJvcGVydGllc1tuYW1lXSkpIHtcbiAgICAgIHJldHVybiBgJHtUQUdfVFlQRX0uU1RBTkRBUkRgO1xuICAgIH1cbiAgICBpZiAoc2NoZW1hLmlzVGFnUHJvcGVydHlBdXRvU2NhbGluZ0dyb3VwKHJlc291cmNlLlByb3BlcnRpZXNbbmFtZV0pKSB7XG4gICAgICByZXR1cm4gYCR7VEFHX1RZUEV9LkFVVE9TQ0FMSU5HX0dST1VQYDtcbiAgICB9XG4gICAgaWYgKHNjaGVtYS5pc1RhZ1Byb3BlcnR5SnNvbihyZXNvdXJjZS5Qcm9wZXJ0aWVzW25hbWVdKSB8fFxuICAgICAgc2NoZW1hLmlzVGFnUHJvcGVydHlTdHJpbmdNYXAocmVzb3VyY2UuUHJvcGVydGllc1tuYW1lXSkpIHtcbiAgICAgIHJldHVybiBgJHtUQUdfVFlQRX0uTUFQYDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGAke1RBR19UWVBFfS5OT1RfVEFHR0FCTEVgO1xufVxuXG5lbnVtIENvbnRhaW5lciB7XG4gIEludGVyZmFjZSA9ICdJTlRFUkZBQ0UnLFxuICBDbGFzcyA9ICdDTEFTUycsXG59XG5cbmludGVyZmFjZSBFbWl0UHJvcGVydHlQcm9wcyB7XG4gIGNvbnRleHQ6IGdlbnNwZWMuQ29kZU5hbWU7XG4gIHByb3BOYW1lOiBzdHJpbmc7XG4gIHNwZWM6IHNjaGVtYS5Qcm9wZXJ0eTtcbiAgYWRkaXRpb25hbERvY3M6IHN0cmluZztcbn1cbiJdfQ==