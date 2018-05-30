import { CodeMaker } from 'codemaker';
import * as cfnspec from './cfnspec';
import * as genspec from './genspec';

const CORE = 'core';
const REGISTRY = 'registry';
const RUNTIME = 'runtime';
const RESOURCE_BASE_CLASS = `${CORE}.Resource`; // base class for all resources
const CONSTRUCT_CLASS = `${CORE}.Construct`;

interface Dictionary<T> { [key: string]: T; }

/**
 * Emits classes for all resource types
 */
export default class CodeGenerator {
    public readonly outputFile: string;

    private code = new CodeMaker();
    private spec = new cfnspec.Spec();

    /**
     * Creates the code generator.
     * @param filePath
     * @param spec CloudFormation spec JSON
     * @param extensions A set of
     */
    constructor(readonly namespace: string, readonly extensions: { [type: string]: string }, pathPrefix: string) {
        this.outputFile = `lib/${pathPrefix}/${namespace}.ts`;
        this.code.openFile(this.outputFile);

        this.code.line('// Copyright 2012-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.');
        this.code.line('// Generated from the CloudFormation resource specification');
        this.code.line('// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html');
        this.code.line();

        // We're going to generate lots of long lines. Might as well ignore this for these files.
        this.code.line('// tslint:disable:max-line-length');
        this.code.line(`import * as ${CORE} from 'aws-cdk';`);
        this.code.line(`import * as ${REGISTRY} from '../registry';`);
        this.code.line(`import * as ${RUNTIME} from '../runtime';`);
        this.code.line();

        this.code.openBlock(`export namespace ${namespace}`);
    }

    /**
     * Adds another spec to the code generator (merges it with the spec).
     * @param additionalSpec
     */
    public addSpec(additionalSpec: cfnspec.Spec) {

        if ((additionalSpec as any).ResourceType) {
            additionalSpec.ResourceTypes = (additionalSpec as any).ResourceType;
        }

        // if the spec has a transform attached to it, add the transform info to all resources
        if (additionalSpec.ResourceSpecificationTransform && additionalSpec.ResourceTypes) {
            for (const type in additionalSpec.ResourceTypes) {
                if (additionalSpec.ResourceTypes.hasOwnProperty(type)) {
                    additionalSpec.ResourceTypes[type].RequiredTransform = additionalSpec.ResourceSpecificationTransform;
                }
            }
        }

        conditionalMerge(this.spec.PropertyTypes, additionalSpec.PropertyTypes);
        conditionalMerge(this.spec.ResourceTypes, additionalSpec.ResourceTypes);
    }

    /**
     * Emits classes for all resource types
     */
    public emitResourceTypes() {
        Object.keys(this.spec.ResourceTypes).sort().forEach(name => {
            const cfnName = cfnspec.SpecName.parse(name);
            const resourceName = genspec.CodeName.forResource(cfnName);
            this.emitResourceType(resourceName, this.spec.ResourceTypes[name]);
        });
    }

    /**
     * Emits classes for all property types
     */
    public emitPropertyTypes() {
        Object.keys(this.spec.PropertyTypes).sort().forEach(name => {
            const cfnName = cfnspec.PropertyAttributeName.parse(name);
            const propTypeName = genspec.CodeName.forPropertyType(cfnName);
            this.emitPropertyType(propTypeName, this.spec.PropertyTypes[name]);
        });
    }

    /**
     * Saves the generated file.
     */
    public async save(dir: string) {
        this.code.closeBlock(` // namespace ${this.namespace}`);
        this.code.closeFile(this.outputFile);
        return await this.code.save(dir);
    }

    private openClass(name: genspec.CodeName, docLink: string, superClasses?: string) {
        let className = name.className;

        // if we have an extension for this class, add a 'Base' postfix.
        if (name.fqn in this.extensions) {
            className += 'Base';
        }

        this.code.line();
        const extendsPostfix = superClasses ? ` extends ${superClasses}` : '';
        this.docLink(docLink);
        this.code.openBlock(`export class ${className}${extendsPostfix}`);
        return className;
    }

    private closeClass(name: genspec.CodeName) {
        this.code.closeBlock();

        // if this class has extensions, emit them now

        const extension = this.extensions[name.fqn];
        if (!extension) {
            return;
        }

        this.code.line();
        this.code.line(`// Extensions for type: ${name.fqn}`);
        this.code.line();

        extension
            .split('\n')
            .filter(line => line.indexOf('/// <omit/>') === -1)
            .forEach(s => this.code.line(s));
    }

    private emitPropsType(resourceName: genspec.CodeName, spec: cfnspec.ResourceType): genspec.CodeName {
        if (!spec.Properties) {
            throw new Error(`Unlikely - a resource without properties? ${JSON.stringify(spec)}`);
        }

        const name = genspec.CodeName.forResourceProperties(resourceName);

        this.code.line();
        this.docLink(spec.Documentation);
        this.code.openBlock(`export interface ${name.className}`);

        const conversionTable = this.emitPropsTypeProperties(resourceName.specName!, spec.Properties);

        this.code.closeBlock();

        this.emitValidator(name, spec.Properties, conversionTable);
        this.emitCloudFormationMapper(name, spec.Properties, conversionTable);

        return name;
    }

    /**
     * Emit TypeScript for each of the CloudFormation properties, while renaming
     *
     * Return a mapping of { originalName -> newName }.
     */
    private emitPropsTypeProperties(resourceName: cfnspec.SpecName, propertiesSpec: cfnspec.PropertySpecs): Dictionary<string> {
        const propertyMap: Dictionary<string> = {};

        // Sanity check that our renamed "Name" is not going to conflict with a real property
        const renamedNameProperty = resourceNameProperty(resourceName);
        const lowerNames = Object.keys(propertiesSpec).map(s => s.toLowerCase());
        if (lowerNames.indexOf('name') !== -1 && lowerNames.indexOf(renamedNameProperty.toLowerCase()) !== -1) {
            // tslint:disable-next-line:max-line-length
            throw new Error(`Oh gosh, we want to rename ${resourceName.fqn}'s 'Name' property to '${renamedNameProperty}', but that property already exists! We need to find a solution to this problem.`);
        }

        Object.keys(propertiesSpec).forEach(propName => {
            const originalName = propName;
            const propSpec = propertiesSpec[propName];
            const additionalDocs = resourceName.relativeName(propName).fqn;

            if (propName.toLocaleLowerCase() === 'name') {
                propName = renamedNameProperty;
                // tslint:disable-next-line:no-console
                console.error(`Renamed property 'Name' of ${resourceName.fqn} to '${renamedNameProperty}'`);
            }

            const resourceCodeName = genspec.CodeName.forResource(resourceName);
            const newName = this.emitProperty(resourceCodeName, propName, propSpec, additionalDocs);
            propertyMap[originalName] = newName;
        });
        return propertyMap;
    }

    private emitResourceType(resourceName: genspec.CodeName, spec: cfnspec.ResourceType) {
        this.beginNamespace(resourceName);

        //
        // Props Bag for this Resource
        //

        const propsType = this.emitPropsType(resourceName, spec);

        this.openClass(resourceName, spec.Documentation, RESOURCE_BASE_CLASS);

        //
        // Static inspectors.
        //

        this.code.line('/**');
        this.code.line(` * The CloudFormation resource type name for this resource class.`);
        this.code.line(' */');
        this.code.line(`public static readonly RESOURCE_TYPE_NAME = ${JSON.stringify(resourceName.specName!.fqn)};`);
        this.code.line();
        this.code.line('/**');
        this.code.line(' * The list of properties on the CloudFormation model for this resource, with their attache metadata.');
        this.code.line(' */');
        this.code.open(`public static readonly RESOURCE_PROPERTIES: { [name: string]: ${REGISTRY}.PropertySpecification } = {`);
        for (const pname of Object.keys(spec.Properties).sort()) {
            const prop = spec.Properties[pname];
            this.code.line(`${pname}: { isRequired: ${JSON.stringify(prop.Required)}, updateType: ${JSON.stringify(prop.UpdateType)} },`);
        }
        this.code.close('};');
        this.code.line();

        //
        // Attributes
        //

        const attributeTypes = new Array<genspec.Attribute>();

        if (spec.Attributes) {
            Object.keys(spec.Attributes).forEach(attributeName => {
                const docLink = spec.Attributes[attributeName].Documentation;
                this.docLink(docLink, `@cloudformation_attribute ${attributeName}`);

                const attr = genspec.attributeDefinition(resourceName, attributeName, docLink);

                this.code.line(`public readonly ${attr.propertyName}: ${attr.typeName.className};`);
                attributeTypes.push(attr);
                this.code.line();
            });
        }

        //
        // Constructor
        //

        this.code.line('/**');
        this.code.line(` * Creates a new ${resourceName.specName!.fqn}.`);
        this.code.line(' *');
        this.code.line(` * @param parent the ${CONSTRUCT_CLASS} this ${resourceName.className} is a part of`);
        this.code.line(` * @param props  the properties of this ${resourceName.className}`);
        this.code.line(' */');
        this.code.openBlock(`constructor(parent: ${CONSTRUCT_CLASS}, name: string, props?: ${propsType.className})`);
        this.code.line(`super(parent, name, { type: '${resourceName.specName!.fqn}', properties: props });`);

        // verify all required properties
        for (const pname of Object.keys(spec.Properties)) {
            const prop = spec.Properties[pname];
            if (prop.Required) {
                const propName = pname.toLocaleLowerCase() === 'name' ? resourceNameProperty(resourceName.specName!) : pname;
                this.code.line(`this.required(props, '${genspec.cloudFormationToScriptName(propName)}');`);
            }
        }

        // initialize all attribute properties
        for (const at of attributeTypes) {
            if (!(at.typeName.specName instanceof cfnspec.PropertyAttributeName)) {
                throw new Error('SpecName must be a PropertyAttributeName');
            }

            this.code.line(`this.${at.propertyName} = new ${at.typeName.className}(this.getAtt('${at.typeName.specName.propAttrName}'));`);
        }

        this.code.closeBlock();

        this.code.line();

        this.emitCloudFormationPropertiesOverride(propsType);

        this.closeClass(resourceName);

        // register the resource type in the registry
        this.code.line();
        this.code.line(`${REGISTRY}.registerResourceType(${resourceName.className});`);

        // if we have attribute types, emit them.
        for (const attrType of attributeTypes) {
            this.emitAttributeType(attrType);
        }

        this.endNamespace(resourceName);
    }

    /**
     * We resolve here.
     *
     * Since resolve() deep-resolves, we only need to do this once.
     */
    private emitCloudFormationPropertiesOverride(propsType: genspec.CodeName) {
        this.code.openBlock('protected renderProperties(): { [key: string]: any } ');
        this.code.line(`return ${genspec.cfnMapperName(propsType).fqn}(${CORE}.resolve(this.properties));`);
        this.code.closeBlock();
    }

    /**
     * Emit the function that is going to map the generated TypeScript object back into the schema that CloudFormation expects
     *
     * The generated code looks like this:
     *
     *    function bucketPropsToCloudFormation(properties: any): any {
     *        if (!runtime.canInspect(properties)) return properties;
     *        BucketPropsValidator(properties).assertSuccess();
     *        return {
     *            AccelerateConfiguration: bucketAccelerateConfigurationPropertyToCloudFormation(properties.accelerateConfiguration),
     *            AccessControl: runtime.stringToCloudFormation(properties.accessControl),
     *            AnalyticsConfigurations: runtime.listMapper(bucketAnalyticsConfigurationPropertyToCloudFormation)
     *                                                                                  (properties.analyticsConfigurations),
     *            // ...
     *        };
     *    }
     *
     * Generated as a top-level function outside any namespace so we can hide it from library consumers.
     */
    private emitCloudFormationMapper(typeName: genspec.CodeName, propSpecs: cfnspec.PropertySpecs, nameConversionTable: Dictionary<string>) {
        const mapperName = genspec.cfnMapperName(typeName);

        this.code.line();

        this.code.line('/**');
        this.code.line(` * Return the CloudFormation properties of a ${typeName.className}`);
        this.code.line(' *');
        this.code.line(` * @param properties the TypeScript properties of a ${typeName.className}`);
        this.code.line(' */');

        this.code.openBlock(`function ${mapperName.functionName}(properties: any): any`);

        // It might be that this value is 'null' or 'undefined', and that that's OK. Simply return
        // the falsey value, the upstream struct is in a better position to know whether this is required or not.
        this.code.line('if (!runtime.canInspect(properties)) { return properties; }');

        // Do a 'type' check first
        const validatorName = genspec.validatorName(typeName);
        this.code.line(`${validatorName.fqn}(properties).assertSuccess();`);

        // Generate the return object
        this.code.line('return {');

        const self = this;
        Object.keys(nameConversionTable).forEach(cfnName => {
            const propName = nameConversionTable[cfnName];
            const propSpec = propSpecs[cfnName];

            const mapperExpression = genspec.typeDispatch(typeName.specName!, propSpec, {
                visitScalar(type: genspec.CodeName) {
                    return mapperNames([type]);
                },
                visitUnionScalar(types: genspec.CodeName[]) {
                    return `runtime.unionMapper([${validatorNames(types)}], [${mapperNames(types)}])`;
                },
                visitList(itemType: genspec.CodeName) {
                    return `runtime.listMapper(${mapperNames([itemType])})`;
                },
                visitUnionList(itemTypes: genspec.CodeName[]) {
                    return `runtime.listMapper(runtime.unionMapper([${validatorNames(itemTypes)}], [${mapperNames(itemTypes)}]))`;
                },
                visitMap(itemType: genspec.CodeName) {
                    return `runtime.hashMapper(${mapperNames([itemType])})`;
                },
                visitUnionMap(itemTypes: genspec.CodeName[]) {
                    return `runtime.hashMapper(runtime.unionMapper([${validatorNames(itemTypes)}], [${mapperNames(itemTypes)}]))`;
                },
                visitListOrScalar(types: genspec.CodeName[], itemTypes: genspec.CodeName[]) {
                    const scalarValidator = `runtime.unionValidator(${validatorNames(types)})`;
                    const listValidator = `runtime.listValidator(runtime.unionValidator(${validatorNames(itemTypes)}))`;
                    const scalarMapper = `runtime.unionMapper([${validatorNames(types)}], [${mapperNames(types)}])`;
                    const listMapper = `runtime.listMapper(runtime.unionMapper([${validatorNames(itemTypes)}], [${mapperNames(itemTypes)}]))`;

                    return `runtime.unionMapper([${scalarValidator}, ${listValidator}], [${scalarMapper}, ${listMapper}])`;
                },
            });

            self.code.line(`    ${cfnName}: ${mapperExpression}(properties.${propName}),`);
        });
        this.code.line('};');
        this.code.closeBlock();
    }

    /**
     * Emit a function that will validate whether the given property bag matches the schema of this complex type
     *
     * Generated as a top-level function outside any namespace so we can hide it from library consumers.
     */
    private emitValidator(typeName: genspec.CodeName, propSpecs: cfnspec.PropertySpecs, nameConversionTable: Dictionary<string>) {
        const validatorName = genspec.validatorName(typeName);

        this.code.line();

        this.code.line('/**');
        this.code.line(` * Determine whether the given properties match those of a ${typeName.className}`);
        this.code.line(' *');
        this.code.line(` * @param properties the TypeScript properties of a ${typeName.className}`);
        this.code.line(' */');
        this.code.openBlock(`function ${validatorName.functionName}(properties: any): runtime.ValidationResult`);
        this.code.line('if (!runtime.canInspect(properties)) { return runtime.VALIDATION_SUCCESS; }');

        this.code.line('const errors = new runtime.ValidationResults();');

        Object.keys(propSpecs).forEach(cfnPropName => {
            const propSpec = propSpecs[cfnPropName];
            const propName = nameConversionTable[cfnPropName];

            if (propSpec.Required) {
                this.code.line(`errors.collect(runtime.propertyValidator('${propName}', runtime.requiredValidator)(properties.${propName}));`);
            }

            const self = this;
            const validatorExpression = genspec.typeDispatch<string>(typeName.specName!, propSpec, {
                visitScalar(type: genspec.CodeName) {
                    return  validatorNames([type]);
                },
                visitUnionScalar(types: genspec.CodeName[]) {
                    return `runtime.unionValidator(${validatorNames(types)})`;
                },
                visitList(itemType: genspec.CodeName) {
                    return `runtime.listValidator(${validatorNames([itemType])})`;
                },
                visitUnionList(itemTypes: genspec.CodeName[]) {
                    return `runtime.listValidator(runtime.unionValidator(${validatorNames(itemTypes)}))`;
                },
                visitMap(itemType: genspec.CodeName) {
                    return `runtime.hashValidator(${validatorNames([itemType])})`;
                },
                visitUnionMap(itemTypes: genspec.CodeName[]) {
                    return `runtime.hashValidator(runtime.unionValidator(${validatorNames(itemTypes)}))`;
                },
                visitListOrScalar(types: genspec.CodeName[], itemTypes: genspec.CodeName[]) {
                    const scalarValidator = `runtime.unionValidator(${validatorNames(types)})`;
                    const listValidator = `runtime.listValidator(runtime.unionValidator(${validatorNames(itemTypes)}))`;

                    return `runtime.unionValidator(${scalarValidator}, ${listValidator})`;
                },
            });
            self.code.line(`errors.collect(runtime.propertyValidator('${propName}', ${validatorExpression})(properties.${propName}));`);
        });

        this.code.line(`return errors.wrap('supplied properties not correct for "${typeName.className}"');`);

        this.code.closeBlock();
    }

    /**
     * Attribute types are classes that represent resource attributes (e.g. QueueArnAttribute).
     */
    private emitAttributeType(attr: genspec.Attribute) {
        this.openClass(attr.typeName, attr.docLink, attr.baseClassName);
        this.closeClass(attr.typeName);
    }

    private emitProperty(context: genspec.CodeName, propName: string, spec: cfnspec.PropertySpec, additionalDocs: string): string {
        const question = spec.Required ? '' : '?';
        const javascriptPropertyName = genspec.cloudFormationToScriptName(propName);
        this.docLink(spec.Documentation, additionalDocs);
        this.code.line(`${javascriptPropertyName}${question}: ${this.findNativeType(context, spec)};`);
        this.code.line();

        return javascriptPropertyName;
    }
    private beginNamespace(type: genspec.CodeName) {
        if (type.namespace) {
            this.code.openBlock(`export namespace ${type.namespace}`);
        }
    }

    private endNamespace(type: genspec.CodeName) {
        if (type.namespace) {
            this.code.closeBlock();
        }
    }

    private emitPropertyType(typeName: genspec.CodeName, propTypeSpec: cfnspec.PropertyType) {
        this.beginNamespace(typeName);

        this.code.line();
        this.docLink(propTypeSpec.Documentation);
        this.code.openBlock(`export interface ${typeName.className}`);

        const conversionTable: Dictionary<string> = {};

        if (propTypeSpec.Properties) {
            Object.keys(propTypeSpec.Properties).forEach(propName => {
                const propSpec = propTypeSpec.Properties[propName];
                const additionalDocs = `${typeName.fqn}.${propName}`;
                const newName = this.emitProperty(typeName, propName, propSpec, additionalDocs);
                conversionTable[propName] = newName;
            });
        }

        this.code.closeBlock();
        this.endNamespace(typeName);

        this.emitValidator(typeName, propTypeSpec.Properties, conversionTable);
        this.emitCloudFormationMapper(typeName, propTypeSpec.Properties, conversionTable);

    }

    /**
     * Return the native type expression for the given propSpec
     */
    private findNativeType(resource: genspec.CodeName, propSpec: cfnspec.PropertySpec): string {
        const alternatives: string[] = [];

        if (cfnspec.isCollection(propSpec)) {
            // render the union of all item types
            const itemTypeNames = cfnspec.itemTypeNames(propSpec);
            const itemTypes = genspec.specTypesToCodeTypes(resource.specName!, itemTypeNames);
            // Always accept a token in place of any list element
            itemTypes.push(genspec.TOKEN_NAME);

            const union = this.renderTypeUnion(resource, itemTypes);

            if (cfnspec.isMap(propSpec)) {
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
        if (cfnspec.isScalar(propSpec)) {
            // Scalar type
            const typeNames = cfnspec.scalarTypeNames(propSpec);
            const types = genspec.specTypesToCodeTypes(resource.specName!, typeNames);
            alternatives.push(this.renderTypeUnion(resource, types));
        }

        // Always
        alternatives.push(genspec.TOKEN_NAME.fqn);

        return alternatives.join(' | ');
    }

    private renderTypeUnion(context: genspec.CodeName, types: genspec.CodeName[]) {
        return types.map((type) => type.relativeTo(context).fqn).join(' | ');
    }

    private docLink(link: string, ...before: string[]) {
        this.code.line('/**');
        before.forEach(line => this.code.line(` * ${line}`));
        if (link) {
            this.code.line(` * @link ${link}`);
        }
        this.code.line(' */');
        return;
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

function conditionalMerge(target: any, source?: any) {
    if (!source) {
        return;
    }

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (key in target) {
                throw new Error(`${key} already exists`);
            }

            target[key] = source[key];
        }
    }
}

/**
 * Return the name of the literal "name" property of a resource
 *
 * A number of resources have a "Name" property. Since Constructs already have a "Name" property
 * (which means something different), we must call the original property something else.
 *
 * We name it after the resource, so for a bucket the "Name" property gets renamed to "BucketName".
 *
 * (We can leave the name PascalCased, as it's going to be camelCased later).
 */
function resourceNameProperty(resourceName: cfnspec.SpecName) {
    return `${resourceName.resourceName}Name`;
}
