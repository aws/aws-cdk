"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarativeStack = void 0;
const cdk = require("@aws-cdk/core");
const reflect = require("jsii-reflect");
const jsonschema = require("jsonschema");
const cdk_schema_1 = require("./cdk-schema");
const jsii2schema_1 = require("./jsii2schema");
class DeclarativeStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id);
        const typeSystem = props.typeSystem;
        const template = props.template;
        const schema = cdk_schema_1.renderFullSchema(typeSystem);
        const result = jsonschema.validate(template, schema);
        if (!result.valid) {
            throw new ValidationError('Schema validation errors:\n  ' + result.errors.map(e => `"${e.property}" ${e.message}`).join('\n  '));
        }
        // Replace every resource that starts with CDK::
        for (const [logicalId, resourceProps] of Object.entries(template.Resources || {})) {
            const rprops = resourceProps;
            if (!rprops.Type) {
                throw new Error('Resource is missing type: ' + JSON.stringify(resourceProps));
            }
            if (isCfnResourceType(rprops.Type)) {
                continue;
            }
            const typeInfo = typeSystem.findFqn(rprops.Type + 'Props');
            const typeRef = new reflect.TypeReference(typeSystem, typeInfo);
            const Ctor = resolveType(rprops.Type);
            // Changing working directory if needed, such that relative paths in the template are resolved relative to the
            // template's location, and not to the current process' CWD.
            _cwd(props.workingDirectory, () => new Ctor(this, logicalId, deserializeValue(this, typeRef, true, 'Properties', rprops.Properties)));
            delete template.Resources[logicalId];
        }
        delete template.$schema;
        // Add an Include construct with what's left of the template
        new cdk.CfnInclude(this, 'Include', { template });
        // replace all "Fn::GetAtt" with tokens that resolve correctly both for
        // constructs and raw resources.
        processReferences(this);
    }
}
exports.DeclarativeStack = DeclarativeStack;
function resolveType(fqn) {
    const [mod, ...className] = fqn.split('.');
    const module = require(mod);
    return module[className.join('.')];
}
function tryResolveIntrinsic(value) {
    if (Object.keys(value).length !== 1) {
        return undefined;
    }
    const name = Object.keys(value)[0];
    const val = value[name];
    return { name, val };
}
function tryResolveRef(value) {
    const fn = tryResolveIntrinsic(value);
    if (!fn) {
        return undefined;
    }
    if (fn.name !== 'Ref') {
        return undefined;
    }
    return fn.val;
}
function tryResolveGetAtt(value) {
    const fn = tryResolveIntrinsic(value);
    if (!fn || fn.name !== 'Fn::GetAtt') {
        return undefined;
    }
    return fn.val;
}
function deserializeValue(stack, typeRef, optional, key, value) {
    // console.error('====== deserializer ===================');
    // console.error(`type: ${typeRef}`);
    // console.error(`value: ${JSON.stringify(value, undefined, 2)}`);
    // console.error('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`');
    if (value === undefined) {
        if (optional) {
            return undefined;
        }
        throw new Error(`Missing required value for ${key} in ${typeRef}`);
    }
    // deserialize arrays
    if (typeRef.arrayOfType) {
        if (!Array.isArray(value)) {
            throw new Error(`Expecting array for ${key} in ${typeRef}`);
        }
        return value.map((x, i) => deserializeValue(stack, typeRef.arrayOfType, false, `${key}[${i}]`, x));
    }
    const asRef = tryResolveRef(value);
    if (asRef) {
        if (jsii2schema_1.isConstruct(typeRef)) {
            return findConstruct(stack, value.Ref);
        }
        throw new Error(`{ Ref } can only be used when a construct type is expected and this is ${typeRef}. ` +
            `Use { Fn::GetAtt } to represent specific resource attributes`);
    }
    const getAtt = tryResolveGetAtt(value);
    if (getAtt) {
        const [logical, attr] = getAtt;
        if (jsii2schema_1.isConstruct(typeRef)) {
            const obj = findConstruct(stack, logical);
            return obj[attr];
        }
        if (typeRef.primitive === 'string') {
            // return a lazy value, so we only try to find after all constructs
            // have been added to the stack.
            return deconstructGetAtt(stack, logical, attr);
        }
        throw new Error(`Fn::GetAtt can only be used for string primitives and ${key} is ${typeRef}`);
    }
    // deserialize maps
    if (typeRef.mapOfType) {
        if (typeof (value) !== 'object') {
            throw new ValidationError(`Expecting object for ${key} in ${typeRef}`);
        }
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = deserializeValue(stack, typeRef.mapOfType, false, `${key}.${k}`, v);
        }
        return out;
    }
    if (typeRef.unionOfTypes) {
        const errors = new Array();
        for (const x of typeRef.unionOfTypes) {
            try {
                return deserializeValue(stack, x, optional, key, value);
            }
            catch (e) {
                if (!(e instanceof ValidationError)) {
                    throw e;
                }
                errors.push(e);
                continue;
            }
        }
        throw new ValidationError(`Failed to deserialize union. Errors: \n  ${errors.map(e => e.message).join('\n  ')}`);
    }
    const enm = deconstructEnum(stack, typeRef, key, value);
    if (enm) {
        return enm;
    }
    // if this is an interface, deserialize each property
    const ifc = deconstructInterface(stack, typeRef, key, value);
    if (ifc) {
        return ifc;
    }
    // if this is an enum type, use the name to dereference
    if (typeRef.type instanceof reflect.EnumType) {
        const enumType = resolveType(typeRef.type.fqn);
        return enumType[value];
    }
    if (typeRef.primitive) {
        return value;
    }
    const enumLike = deconstructEnumLike(stack, typeRef, value);
    if (enumLike) {
        return enumLike;
    }
    const asType = deconstructType(stack, typeRef, value);
    if (asType) {
        return asType;
    }
    throw new Error(`Unable to deconstruct "${JSON.stringify(value)}" for type ref ${typeRef}`);
}
function deconstructEnum(_stack, typeRef, _key, value) {
    if (!(typeRef.type instanceof reflect.EnumType)) {
        return undefined;
    }
    const enumType = resolveType(typeRef.type.fqn);
    return enumType[value];
}
function deconstructInterface(stack, typeRef, key, value) {
    if (!jsii2schema_1.isSerializableInterface(typeRef.type)) {
        return undefined;
    }
    const out = {};
    for (const prop of typeRef.type.allProperties) {
        const propValue = value[prop.name];
        if (!propValue) {
            if (!prop.optional) {
                throw new ValidationError(`Missing required property ${key}.${prop.name} in ${typeRef}`);
            }
            continue;
        }
        out[prop.name] = deserializeValue(stack, prop.type, prop.optional, `${key}.${prop.name}`, propValue);
    }
    return out;
}
function deconstructEnumLike(stack, typeRef, value) {
    if (!jsii2schema_1.isEnumLikeClass(typeRef.type)) {
        return undefined;
    }
    // if the value is a string, we deconstruct it as a static property
    if (typeof (value) === 'string') {
        return deconstructStaticProperty(typeRef.type, value);
    }
    // if the value is an object, we deconstruct it as a static method
    if (typeof (value) === 'object' && !Array.isArray(value)) {
        return deconstructStaticMethod(stack, typeRef.type, value);
    }
    throw new Error(`Invalid value for enum-like class ${typeRef.fqn}: ${JSON.stringify(value)}`);
}
function deconstructType(stack, typeRef, value) {
    const schemaDefs = {};
    const ctx = jsii2schema_1.SchemaContext.root(schemaDefs);
    const schemaRef = jsii2schema_1.schemaForPolymorphic(typeRef.type, ctx);
    if (!schemaRef) {
        return undefined;
    }
    const def = findDefinition(schemaDefs, schemaRef.$ref);
    const keys = Object.keys(value);
    if (keys.length !== 1) {
        throw new ValidationError(`Cannot parse class type ${typeRef} with value ${value}`);
    }
    const className = keys[0];
    // now we need to check if it's an enum or a normal class
    const schema = def.anyOf.find((x) => x.properties && x.properties[className]);
    if (!schema) {
        throw new ValidationError(`Cannot find schema for ${className}`);
    }
    const def2 = findDefinition(schemaDefs, schema.properties[className].$ref);
    const methodFqn = def2.comment;
    const parts = methodFqn.split('.');
    const last = parts[parts.length - 1];
    if (last !== '<initializer>') {
        throw new Error(`Expectring an initializer`);
    }
    const classFqn = parts.slice(0, parts.length - 1).join('.');
    const method = typeRef.system.findClass(classFqn).initializer;
    if (!method) {
        throw new Error(`Cannot find the initializer for ${classFqn}`);
    }
    return invokeMethod(stack, method, value[className]);
}
function findDefinition(defs, $ref) {
    const k = $ref.split('/').slice(2).join('/');
    return defs[k];
}
function deconstructStaticProperty(typeRef, value) {
    const typeClass = resolveType(typeRef.fqn);
    return typeClass[value];
}
function deconstructStaticMethod(stack, typeRef, value) {
    const methods = typeRef.allMethods.filter(m => m.static);
    const members = methods.map(x => x.name);
    if (typeof (value) === 'object') {
        const entries = Object.entries(value);
        if (entries.length !== 1) {
            throw new Error(`Value for enum-like class ${typeRef.fqn} must be an object with a single key (one of: ${members.join(',')})`);
        }
        const [methodName, args] = entries[0];
        const method = methods.find(m => m.name === methodName);
        if (!method) {
            throw new Error(`Invalid member "${methodName}" for enum-like class ${typeRef.fqn}. Options: ${members.join(',')}`);
        }
        if (typeof (args) !== 'object') {
            throw new Error(`Expecting enum-like member ${methodName} to be an object for enum-like class ${typeRef.fqn}`);
        }
        return invokeMethod(stack, method, args);
    }
}
function invokeMethod(stack, method, parameters) {
    const typeClass = resolveType(method.parentType.fqn);
    const args = new Array();
    for (let i = 0; i < method.parameters.length; ++i) {
        const p = method.parameters[i];
        // kwargs: if this is the last argument and a data type, flatten (treat as keyword args)
        if (i === method.parameters.length - 1 && jsii2schema_1.isDataType(p.type.type)) {
            // we pass in all parameters are the value, and the positional arguments will be ignored since
            // we are promised there are no conflicts
            const kwargs = deserializeValue(stack, p.type, p.optional, p.name, parameters);
            args.push(kwargs);
        }
        else {
            const val = parameters[p.name];
            if (val === undefined && !p.optional) {
                throw new Error(`Missing required parameter '${p.name}' for ${method.parentType.fqn}.${method.name}`);
            }
            if (val !== undefined) {
                args.push(deserializeValue(stack, p.type, p.optional, p.name, val));
            }
        }
    }
    if (reflect.Initializer.isInitializer(method)) {
        return new typeClass(...args);
    }
    const methodFn = typeClass[method.name];
    if (!methodFn) {
        throw new Error(`Cannot find method named ${method.name} in ${typeClass.fqn}`);
    }
    return methodFn.apply(typeClass, args);
}
/**
 * Returns a lazy string that includes a deconstructed Fn::GetAt to a certain
 * resource or construct.
 *
 * If `id` points to a CDK construct, the resolved value will be the value returned by
 * the property `attribute`. If `id` points to a "raw" resource, the resolved value will be
 * an `Fn::GetAtt`.
 */
function deconstructGetAtt(stack, id, attribute) {
    return cdk.Lazy.string({ produce: () => {
            const res = stack.node.tryFindChild(id);
            if (!res) {
                const include = stack.node.tryFindChild('Include');
                if (!include) {
                    throw new Error(`Unexpected - "Include" should be in the stack at this point`);
                }
                const raw = include.template.Resources[id];
                if (!raw) {
                    throw new Error(`Unable to find a resource ${id}`);
                }
                // just leak
                return { "Fn::GetAtt": [id, attribute] };
            }
            return res[attribute];
        } });
}
function findConstruct(stack, id) {
    const child = stack.node.tryFindChild(id);
    if (!child) {
        throw new Error(`Construct with ID ${id} not found (it must be defined before it is referenced)`);
    }
    return child;
}
function processReferences(stack) {
    const include = stack.node.findChild('Include');
    if (!include) {
        throw new Error('Unexpected');
    }
    process(include.template);
    function process(value) {
        if (typeof (value) === 'object' && Object.keys(value).length === 1 && Object.keys(value)[0] === 'Fn::GetAtt') {
            const [id, attribute] = value['Fn::GetAtt'];
            return deconstructGetAtt(stack, id, attribute);
        }
        if (Array.isArray(value)) {
            return value.map(x => process(x));
        }
        if (typeof (value) === 'object') {
            for (const [k, v] of Object.entries(value)) {
                value[k] = process(v);
            }
            return value;
        }
        return value;
    }
}
function isCfnResourceType(resourceType) {
    return resourceType.includes('::');
}
class ValidationError extends Error {
}
function _cwd(workDir, cb) {
    if (!workDir) {
        return cb();
    }
    const prevWd = process.cwd();
    try {
        process.chdir(workDir);
        return cb();
    }
    finally {
        process.chdir(prevWd);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpdmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZWNsYXJhdGl2ZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsd0NBQXdDO0FBQ3hDLHlDQUF5QztBQUN6Qyw2Q0FBZ0Q7QUFDaEQsK0NBQXVJO0FBUXZJLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNwQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRWhDLE1BQU0sTUFBTSxHQUFHLDZCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxlQUFlLENBQUMsK0JBQStCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDbEk7UUFFRCxnREFBZ0Q7UUFDaEQsS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNqRixNQUFNLE1BQU0sR0FBUSxhQUFhLENBQUM7WUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2FBQy9FO1lBRUQsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLFNBQVM7YUFDVjtZQUVELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztZQUMzRCxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEMsOEdBQThHO1lBQzlHLDREQUE0RDtZQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUNoQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJHLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QztRQUVELE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUV4Qiw0REFBNEQ7UUFDNUQsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRWxELHVFQUF1RTtRQUN2RSxnQ0FBZ0M7UUFDaEMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBOUNELDRDQThDQztBQUVELFNBQVMsV0FBVyxDQUFDLEdBQVc7SUFDOUIsTUFBTSxDQUFFLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFVO0lBQ3JDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ25DLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBVTtJQUMvQixNQUFNLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ1AsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1FBQ3JCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO0FBQ2hCLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEtBQVU7SUFDbEMsTUFBTSxFQUFFLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUNuQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFnQixFQUFFLE9BQThCLEVBQUUsUUFBaUIsRUFBRSxHQUFXLEVBQUUsS0FBVTtJQUNwSCw0REFBNEQ7SUFDNUQscUNBQXFDO0lBQ3JDLGtFQUFrRTtJQUNsRSx3RUFBd0U7SUFFeEUsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLElBQUksUUFBUSxFQUFFO1lBQ1osT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixHQUFHLE9BQU8sT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNwRTtJQUVELHFCQUFxQjtJQUNyQixJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxPQUFPLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFdBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyRztJQUVELE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxJQUFJLEtBQUssRUFBRTtRQUNULElBQUkseUJBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN4QixPQUFPLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FDYiwwRUFBMEUsT0FBTyxJQUFJO1lBQ3JGLDhEQUE4RCxDQUFDLENBQUM7S0FDbkU7SUFFRCxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxJQUFJLE1BQU0sRUFBRTtRQUNWLE1BQU0sQ0FBRSxPQUFPLEVBQUUsSUFBSSxDQUFFLEdBQUcsTUFBTSxDQUFDO1FBRWpDLElBQUkseUJBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN4QixNQUFNLEdBQUcsR0FBUSxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNsQyxtRUFBbUU7WUFDbkUsZ0NBQWdDO1lBQ2hDLE9BQU8saUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNoRDtRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELEdBQUcsT0FBTyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQy9GO0lBRUQsbUJBQW1CO0lBQ25CLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtRQUNyQixJQUFJLE9BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDOUIsTUFBTSxJQUFJLGVBQWUsQ0FBQyx3QkFBd0IsR0FBRyxPQUFPLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDeEU7UUFFRCxNQUFNLEdBQUcsR0FBUSxFQUFHLENBQUM7UUFDckIsS0FBSyxNQUFNLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM5RTtRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7UUFDeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztRQUNoQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDcEMsSUFBSTtnQkFDRixPQUFPLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN6RDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxlQUFlLENBQUMsRUFBRTtvQkFDbkMsTUFBTSxDQUFDLENBQUM7aUJBQ1Q7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixTQUFTO2FBQ1Y7U0FDRjtRQUVELE1BQU0sSUFBSSxlQUFlLENBQUMsNENBQTRDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNsSDtJQUVELE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxJQUFJLEdBQUcsRUFBRTtRQUNQLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCxxREFBcUQ7SUFDckQsTUFBTSxHQUFHLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0QsSUFBSSxHQUFHLEVBQUU7UUFDUCxPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsdURBQXVEO0lBQ3ZELElBQUksT0FBTyxDQUFDLElBQUksWUFBWSxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQzVDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hCO0lBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3JCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxNQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELElBQUksUUFBUSxFQUFFO1FBQ1osT0FBTyxRQUFRLENBQUM7S0FDakI7SUFFRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RCxJQUFJLE1BQU0sRUFBRTtRQUNWLE9BQU8sTUFBTSxDQUFDO0tBQ2Y7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsTUFBaUIsRUFBRSxPQUE4QixFQUFFLElBQVksRUFBRSxLQUFVO0lBQ2xHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFlBQVksT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQy9DLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBZ0IsRUFBRSxPQUE4QixFQUFFLEdBQVcsRUFBRSxLQUFVO0lBQ3JHLElBQUksQ0FBQyxxQ0FBdUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDMUMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxNQUFNLEdBQUcsR0FBUSxFQUFHLENBQUM7SUFDckIsS0FBSyxNQUFNLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUM3QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsTUFBTSxJQUFJLGVBQWUsQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLE9BQU8sT0FBTyxFQUFFLENBQUMsQ0FBQzthQUMxRjtZQUNELFNBQVM7U0FDVjtRQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEc7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEtBQWdCLEVBQUUsT0FBOEIsRUFBRSxLQUFVO0lBQ3ZGLElBQUksQ0FBQyw2QkFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNsQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELG1FQUFtRTtJQUNuRSxJQUFJLE9BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDOUIsT0FBTyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQsa0VBQWtFO0lBQ2xFLElBQUksT0FBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkQsT0FBTyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RDtJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLEtBQWdCLEVBQUUsT0FBOEIsRUFBRSxLQUFVO0lBQ25GLE1BQU0sVUFBVSxHQUFRLEVBQUUsQ0FBQztJQUMzQixNQUFNLEdBQUcsR0FBRywyQkFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxrQ0FBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXZELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNyQixNQUFNLElBQUksZUFBZSxDQUFDLDJCQUEyQixPQUFPLGVBQWUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNyRjtJQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxQix5REFBeUQ7SUFDekQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ25GLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksZUFBZSxDQUFDLDBCQUEwQixTQUFTLEVBQUUsQ0FBQyxDQUFDO0tBQ2xFO0lBRUQsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFFL0IsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFJLElBQUksS0FBSyxlQUFlLEVBQUU7UUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0tBQzlDO0lBRUQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQzlELElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQ2hFO0lBRUQsT0FBTyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBUyxFQUFFLElBQVk7SUFDN0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLHlCQUF5QixDQUFDLE9BQTBCLEVBQUUsS0FBYTtJQUMxRSxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFTLHVCQUF1QixDQUFDLEtBQWdCLEVBQUUsT0FBMEIsRUFBRSxLQUFVO0lBQ3ZGLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFekMsSUFBSSxPQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQzlCLE1BQU0sT0FBTyxHQUEyQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsT0FBTyxDQUFDLEdBQUcsaURBQWlELE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hJO1FBRUQsTUFBTSxDQUFFLFVBQVUsRUFBRSxJQUFJLENBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLFVBQVUseUJBQXlCLE9BQU8sQ0FBQyxHQUFHLGNBQWMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDckg7UUFFRCxJQUFJLE9BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsVUFBVSx3Q0FBd0MsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDaEg7UUFFRCxPQUFPLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWdCLEVBQUUsTUFBd0IsRUFBRSxVQUFlO0lBQy9FLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUM7SUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ2pELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0Isd0ZBQXdGO1FBQ3hGLElBQUksQ0FBQyxLQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSx3QkFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakUsOEZBQThGO1lBQzlGLHlDQUF5QztZQUN6QyxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQjthQUFNO1lBQ0wsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUMsSUFBSSxTQUFTLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ3ZHO1lBRUQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO2dCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3JFO1NBQ0Y7S0FDRjtJQUVELElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQy9CO0lBRUQsTUFBTSxRQUFRLEdBQTRCLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDaEY7SUFFRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxTQUFpQjtJQUN4RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBbUIsQ0FBQztnQkFDckUsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7aUJBQ2hGO2dCQUVELE1BQU0sR0FBRyxHQUFJLE9BQU8sQ0FBQyxRQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDUixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUNwRDtnQkFFRCxZQUFZO2dCQUNaLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBRSxFQUFFLEVBQUUsU0FBUyxDQUFFLEVBQUUsQ0FBQzthQUM1QztZQUNELE9BQVEsR0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBZ0IsRUFBRSxFQUFVO0lBQ2pELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixFQUFFLHlEQUF5RCxDQUFDLENBQUM7S0FDbkc7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQWdCO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBbUIsQ0FBQztJQUNsRSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQjtJQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBZSxDQUFDLENBQUM7SUFFakMsU0FBUyxPQUFPLENBQUMsS0FBVTtRQUN6QixJQUFJLE9BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFO1lBQzNHLE1BQU0sQ0FBRSxFQUFFLEVBQUUsU0FBUyxDQUFFLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzlDLE9BQU8saUJBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNoRDtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN4QixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQztRQUVELElBQUksT0FBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUM5QixLQUFLLE1BQU0sQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QjtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxZQUFvQjtJQUM3QyxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVELE1BQU0sZUFBZ0IsU0FBUSxLQUFLO0NBQUk7QUFFdkMsU0FBUyxJQUFJLENBQUksT0FBMkIsRUFBRSxFQUFXO0lBQ3ZELElBQUksQ0FBQyxPQUFPLEVBQUU7UUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO0tBQUU7SUFDOUIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzdCLElBQUk7UUFDRixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDYjtZQUFTO1FBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2QjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyByZWZsZWN0IGZyb20gJ2pzaWktcmVmbGVjdCc7XG5pbXBvcnQgKiBhcyBqc29uc2NoZW1hIGZyb20gJ2pzb25zY2hlbWEnO1xuaW1wb3J0IHsgcmVuZGVyRnVsbFNjaGVtYSB9IGZyb20gJy4vY2RrLXNjaGVtYSc7XG5pbXBvcnQgeyBpc0NvbnN0cnVjdCwgaXNEYXRhVHlwZSwgaXNFbnVtTGlrZUNsYXNzLCBpc1NlcmlhbGl6YWJsZUludGVyZmFjZSwgU2NoZW1hQ29udGV4dCwgc2NoZW1hRm9yUG9seW1vcnBoaWMgfSBmcm9tICcuL2pzaWkyc2NoZW1hJztcblxuZXhwb3J0IGludGVyZmFjZSBEZWNsYXJhdGl2ZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHR5cGVTeXN0ZW06IHJlZmxlY3QuVHlwZVN5c3RlbTtcbiAgdGVtcGxhdGU6IGFueTtcbiAgd29ya2luZ0RpcmVjdG9yeT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERlY2xhcmF0aXZlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IERlY2xhcmF0aXZlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB0eXBlU3lzdGVtID0gcHJvcHMudHlwZVN5c3RlbTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHByb3BzLnRlbXBsYXRlO1xuXG4gICAgY29uc3Qgc2NoZW1hID0gcmVuZGVyRnVsbFNjaGVtYSh0eXBlU3lzdGVtKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGpzb25zY2hlbWEudmFsaWRhdGUodGVtcGxhdGUsIHNjaGVtYSk7XG4gICAgaWYgKCFyZXN1bHQudmFsaWQpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1NjaGVtYSB2YWxpZGF0aW9uIGVycm9yczpcXG4gICcgKyByZXN1bHQuZXJyb3JzLm1hcChlID0+IGBcIiR7ZS5wcm9wZXJ0eX1cIiAke2UubWVzc2FnZX1gKS5qb2luKCdcXG4gICcpKTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIGV2ZXJ5IHJlc291cmNlIHRoYXQgc3RhcnRzIHdpdGggQ0RLOjpcbiAgICBmb3IgKGNvbnN0IFtsb2dpY2FsSWQsIHJlc291cmNlUHJvcHNdIG9mIE9iamVjdC5lbnRyaWVzKHRlbXBsYXRlLlJlc291cmNlcyB8fCB7fSkpIHtcbiAgICAgIGNvbnN0IHJwcm9wczogYW55ID0gcmVzb3VyY2VQcm9wcztcbiAgICAgIGlmICghcnByb3BzLlR5cGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXNvdXJjZSBpcyBtaXNzaW5nIHR5cGU6ICcgKyBKU09OLnN0cmluZ2lmeShyZXNvdXJjZVByb3BzKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0NmblJlc291cmNlVHlwZShycHJvcHMuVHlwZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHR5cGVJbmZvID0gdHlwZVN5c3RlbS5maW5kRnFuKHJwcm9wcy5UeXBlICsgJ1Byb3BzJyk7XG4gICAgICBjb25zdCB0eXBlUmVmID0gbmV3IHJlZmxlY3QuVHlwZVJlZmVyZW5jZSh0eXBlU3lzdGVtLCB0eXBlSW5mbyk7XG4gICAgICBjb25zdCBDdG9yID0gcmVzb2x2ZVR5cGUocnByb3BzLlR5cGUpO1xuXG4gICAgICAvLyBDaGFuZ2luZyB3b3JraW5nIGRpcmVjdG9yeSBpZiBuZWVkZWQsIHN1Y2ggdGhhdCByZWxhdGl2ZSBwYXRocyBpbiB0aGUgdGVtcGxhdGUgYXJlIHJlc29sdmVkIHJlbGF0aXZlIHRvIHRoZVxuICAgICAgLy8gdGVtcGxhdGUncyBsb2NhdGlvbiwgYW5kIG5vdCB0byB0aGUgY3VycmVudCBwcm9jZXNzJyBDV0QuXG4gICAgICBfY3dkKHByb3BzLndvcmtpbmdEaXJlY3RvcnksICgpID0+XG4gICAgICAgIG5ldyBDdG9yKHRoaXMsIGxvZ2ljYWxJZCwgZGVzZXJpYWxpemVWYWx1ZSh0aGlzLCB0eXBlUmVmLCB0cnVlLCAnUHJvcGVydGllcycsIHJwcm9wcy5Qcm9wZXJ0aWVzKSkpO1xuXG4gICAgICBkZWxldGUgdGVtcGxhdGUuUmVzb3VyY2VzW2xvZ2ljYWxJZF07XG4gICAgfVxuXG4gICAgZGVsZXRlIHRlbXBsYXRlLiRzY2hlbWE7XG5cbiAgICAvLyBBZGQgYW4gSW5jbHVkZSBjb25zdHJ1Y3Qgd2l0aCB3aGF0J3MgbGVmdCBvZiB0aGUgdGVtcGxhdGVcbiAgICBuZXcgY2RrLkNmbkluY2x1ZGUodGhpcywgJ0luY2x1ZGUnLCB7IHRlbXBsYXRlIH0pO1xuXG4gICAgLy8gcmVwbGFjZSBhbGwgXCJGbjo6R2V0QXR0XCIgd2l0aCB0b2tlbnMgdGhhdCByZXNvbHZlIGNvcnJlY3RseSBib3RoIGZvclxuICAgIC8vIGNvbnN0cnVjdHMgYW5kIHJhdyByZXNvdXJjZXMuXG4gICAgcHJvY2Vzc1JlZmVyZW5jZXModGhpcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVR5cGUoZnFuOiBzdHJpbmcpIHtcbiAgY29uc3QgWyBtb2QsIC4uLmNsYXNzTmFtZSBdID0gZnFuLnNwbGl0KCcuJyk7XG4gIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUobW9kKTtcbiAgcmV0dXJuIG1vZHVsZVtjbGFzc05hbWUuam9pbignLicpXTtcbn1cblxuZnVuY3Rpb24gdHJ5UmVzb2x2ZUludHJpbnNpYyh2YWx1ZTogYW55KSB7XG4gIGlmIChPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoICE9PSAxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IG5hbWUgPSBPYmplY3Qua2V5cyh2YWx1ZSlbMF07XG4gIGNvbnN0IHZhbCA9IHZhbHVlW25hbWVdO1xuICByZXR1cm4geyBuYW1lLCB2YWwgfTtcbn1cblxuZnVuY3Rpb24gdHJ5UmVzb2x2ZVJlZih2YWx1ZTogYW55KSB7XG4gIGNvbnN0IGZuID0gdHJ5UmVzb2x2ZUludHJpbnNpYyh2YWx1ZSk7XG4gIGlmICghZm4pIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKGZuLm5hbWUgIT09ICdSZWYnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBmbi52YWw7XG59XG5cbmZ1bmN0aW9uIHRyeVJlc29sdmVHZXRBdHQodmFsdWU6IGFueSkge1xuICBjb25zdCBmbiA9IHRyeVJlc29sdmVJbnRyaW5zaWModmFsdWUpO1xuICBpZiAoIWZuIHx8IGZuLm5hbWUgIT09ICdGbjo6R2V0QXR0Jykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gZm4udmFsO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVZhbHVlKHN0YWNrOiBjZGsuU3RhY2ssIHR5cGVSZWY6IHJlZmxlY3QuVHlwZVJlZmVyZW5jZSwgb3B0aW9uYWw6IGJvb2xlYW4sIGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogYW55IHtcbiAgLy8gY29uc29sZS5lcnJvcignPT09PT09IGRlc2VyaWFsaXplciA9PT09PT09PT09PT09PT09PT09Jyk7XG4gIC8vIGNvbnNvbGUuZXJyb3IoYHR5cGU6ICR7dHlwZVJlZn1gKTtcbiAgLy8gY29uc29sZS5lcnJvcihgdmFsdWU6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUsIHVuZGVmaW5lZCwgMil9YCk7XG4gIC8vIGNvbnNvbGUuZXJyb3IoJ35+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+YCcpO1xuXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKG9wdGlvbmFsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyByZXF1aXJlZCB2YWx1ZSBmb3IgJHtrZXl9IGluICR7dHlwZVJlZn1gKTtcbiAgfVxuXG4gIC8vIGRlc2VyaWFsaXplIGFycmF5c1xuICBpZiAodHlwZVJlZi5hcnJheU9mVHlwZSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nIGFycmF5IGZvciAke2tleX0gaW4gJHt0eXBlUmVmfWApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZS5tYXAoKHgsIGkpID0+IGRlc2VyaWFsaXplVmFsdWUoc3RhY2ssIHR5cGVSZWYuYXJyYXlPZlR5cGUhLCBmYWxzZSwgYCR7a2V5fVske2l9XWAsIHgpKTtcbiAgfVxuXG4gIGNvbnN0IGFzUmVmID0gdHJ5UmVzb2x2ZVJlZih2YWx1ZSk7XG4gIGlmIChhc1JlZikge1xuICAgIGlmIChpc0NvbnN0cnVjdCh0eXBlUmVmKSkge1xuICAgICAgcmV0dXJuIGZpbmRDb25zdHJ1Y3Qoc3RhY2ssIHZhbHVlLlJlZik7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYHsgUmVmIH0gY2FuIG9ubHkgYmUgdXNlZCB3aGVuIGEgY29uc3RydWN0IHR5cGUgaXMgZXhwZWN0ZWQgYW5kIHRoaXMgaXMgJHt0eXBlUmVmfS4gYCArXG4gICAgICBgVXNlIHsgRm46OkdldEF0dCB9IHRvIHJlcHJlc2VudCBzcGVjaWZpYyByZXNvdXJjZSBhdHRyaWJ1dGVzYCk7XG4gIH1cblxuICBjb25zdCBnZXRBdHQgPSB0cnlSZXNvbHZlR2V0QXR0KHZhbHVlKTtcbiAgaWYgKGdldEF0dCkge1xuICAgIGNvbnN0IFsgbG9naWNhbCwgYXR0ciBdID0gZ2V0QXR0O1xuXG4gICAgaWYgKGlzQ29uc3RydWN0KHR5cGVSZWYpKSB7XG4gICAgICBjb25zdCBvYmo6IGFueSA9IGZpbmRDb25zdHJ1Y3Qoc3RhY2ssIGxvZ2ljYWwpO1xuICAgICAgcmV0dXJuIG9ialthdHRyXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZVJlZi5wcmltaXRpdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyByZXR1cm4gYSBsYXp5IHZhbHVlLCBzbyB3ZSBvbmx5IHRyeSB0byBmaW5kIGFmdGVyIGFsbCBjb25zdHJ1Y3RzXG4gICAgICAvLyBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHN0YWNrLlxuICAgICAgcmV0dXJuIGRlY29uc3RydWN0R2V0QXR0KHN0YWNrLCBsb2dpY2FsLCBhdHRyKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZuOjpHZXRBdHQgY2FuIG9ubHkgYmUgdXNlZCBmb3Igc3RyaW5nIHByaW1pdGl2ZXMgYW5kICR7a2V5fSBpcyAke3R5cGVSZWZ9YCk7XG4gIH1cblxuICAvLyBkZXNlcmlhbGl6ZSBtYXBzXG4gIGlmICh0eXBlUmVmLm1hcE9mVHlwZSkge1xuICAgIGlmICh0eXBlb2YodmFsdWUpICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihgRXhwZWN0aW5nIG9iamVjdCBmb3IgJHtrZXl9IGluICR7dHlwZVJlZn1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXQ6IGFueSA9IHsgfTtcbiAgICBmb3IgKGNvbnN0IFsgaywgdiBdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgb3V0W2tdID0gZGVzZXJpYWxpemVWYWx1ZShzdGFjaywgdHlwZVJlZi5tYXBPZlR5cGUsIGZhbHNlLCBgJHtrZXl9LiR7a31gLCB2KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgaWYgKHR5cGVSZWYudW5pb25PZlR5cGVzKSB7XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICBmb3IgKGNvbnN0IHggb2YgdHlwZVJlZi51bmlvbk9mVHlwZXMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVZhbHVlKHN0YWNrLCB4LCBvcHRpb25hbCwga2V5LCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICBlcnJvcnMucHVzaChlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihgRmFpbGVkIHRvIGRlc2VyaWFsaXplIHVuaW9uLiBFcnJvcnM6IFxcbiAgJHtlcnJvcnMubWFwKGUgPT4gZS5tZXNzYWdlKS5qb2luKCdcXG4gICcpfWApO1xuICB9XG5cbiAgY29uc3QgZW5tID0gZGVjb25zdHJ1Y3RFbnVtKHN0YWNrLCB0eXBlUmVmLCBrZXksIHZhbHVlKTtcbiAgaWYgKGVubSkge1xuICAgIHJldHVybiBlbm07XG4gIH1cblxuICAvLyBpZiB0aGlzIGlzIGFuIGludGVyZmFjZSwgZGVzZXJpYWxpemUgZWFjaCBwcm9wZXJ0eVxuICBjb25zdCBpZmMgPSBkZWNvbnN0cnVjdEludGVyZmFjZShzdGFjaywgdHlwZVJlZiwga2V5LCB2YWx1ZSk7XG4gIGlmIChpZmMpIHtcbiAgICByZXR1cm4gaWZjO1xuICB9XG5cbiAgLy8gaWYgdGhpcyBpcyBhbiBlbnVtIHR5cGUsIHVzZSB0aGUgbmFtZSB0byBkZXJlZmVyZW5jZVxuICBpZiAodHlwZVJlZi50eXBlIGluc3RhbmNlb2YgcmVmbGVjdC5FbnVtVHlwZSkge1xuICAgIGNvbnN0IGVudW1UeXBlID0gcmVzb2x2ZVR5cGUodHlwZVJlZi50eXBlLmZxbik7XG4gICAgcmV0dXJuIGVudW1UeXBlW3ZhbHVlXTtcbiAgfVxuXG4gIGlmICh0eXBlUmVmLnByaW1pdGl2ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IGVudW1MaWtlID0gZGVjb25zdHJ1Y3RFbnVtTGlrZShzdGFjaywgdHlwZVJlZiwgdmFsdWUpO1xuICBpZiAoZW51bUxpa2UpIHtcbiAgICByZXR1cm4gZW51bUxpa2U7XG4gIH1cblxuICBjb25zdCBhc1R5cGUgPSBkZWNvbnN0cnVjdFR5cGUoc3RhY2ssIHR5cGVSZWYsIHZhbHVlKTtcbiAgaWYgKGFzVHlwZSkge1xuICAgIHJldHVybiBhc1R5cGU7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBkZWNvbnN0cnVjdCBcIiR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfVwiIGZvciB0eXBlIHJlZiAke3R5cGVSZWZ9YCk7XG59XG5cbmZ1bmN0aW9uIGRlY29uc3RydWN0RW51bShfc3RhY2s6IGNkay5TdGFjaywgdHlwZVJlZjogcmVmbGVjdC5UeXBlUmVmZXJlbmNlLCBfa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgaWYgKCEodHlwZVJlZi50eXBlIGluc3RhbmNlb2YgcmVmbGVjdC5FbnVtVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZW51bVR5cGUgPSByZXNvbHZlVHlwZSh0eXBlUmVmLnR5cGUuZnFuKTtcbiAgcmV0dXJuIGVudW1UeXBlW3ZhbHVlXTtcbn1cblxuZnVuY3Rpb24gZGVjb25zdHJ1Y3RJbnRlcmZhY2Uoc3RhY2s6IGNkay5TdGFjaywgdHlwZVJlZjogcmVmbGVjdC5UeXBlUmVmZXJlbmNlLCBrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICBpZiAoIWlzU2VyaWFsaXphYmxlSW50ZXJmYWNlKHR5cGVSZWYudHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3Qgb3V0OiBhbnkgPSB7IH07XG4gIGZvciAoY29uc3QgcHJvcCBvZiB0eXBlUmVmLnR5cGUuYWxsUHJvcGVydGllcykge1xuICAgIGNvbnN0IHByb3BWYWx1ZSA9IHZhbHVlW3Byb3AubmFtZV07XG4gICAgaWYgKCFwcm9wVmFsdWUpIHtcbiAgICAgIGlmICghcHJvcC5vcHRpb25hbCkge1xuICAgICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGBNaXNzaW5nIHJlcXVpcmVkIHByb3BlcnR5ICR7a2V5fS4ke3Byb3AubmFtZX0gaW4gJHt0eXBlUmVmfWApO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgb3V0W3Byb3AubmFtZV0gPSBkZXNlcmlhbGl6ZVZhbHVlKHN0YWNrLCBwcm9wLnR5cGUsIHByb3Aub3B0aW9uYWwsIGAke2tleX0uJHtwcm9wLm5hbWV9YCwgcHJvcFZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGRlY29uc3RydWN0RW51bUxpa2Uoc3RhY2s6IGNkay5TdGFjaywgdHlwZVJlZjogcmVmbGVjdC5UeXBlUmVmZXJlbmNlLCB2YWx1ZTogYW55KSB7XG4gIGlmICghaXNFbnVtTGlrZUNsYXNzKHR5cGVSZWYudHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gaWYgdGhlIHZhbHVlIGlzIGEgc3RyaW5nLCB3ZSBkZWNvbnN0cnVjdCBpdCBhcyBhIHN0YXRpYyBwcm9wZXJ0eVxuICBpZiAodHlwZW9mKHZhbHVlKSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGVjb25zdHJ1Y3RTdGF0aWNQcm9wZXJ0eSh0eXBlUmVmLnR5cGUsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIGlmIHRoZSB2YWx1ZSBpcyBhbiBvYmplY3QsIHdlIGRlY29uc3RydWN0IGl0IGFzIGEgc3RhdGljIG1ldGhvZFxuICBpZiAodHlwZW9mKHZhbHVlKSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGRlY29uc3RydWN0U3RhdGljTWV0aG9kKHN0YWNrLCB0eXBlUmVmLnR5cGUsIHZhbHVlKTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgZW51bS1saWtlIGNsYXNzICR7dHlwZVJlZi5mcW59OiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gKTtcbn1cblxuZnVuY3Rpb24gZGVjb25zdHJ1Y3RUeXBlKHN0YWNrOiBjZGsuU3RhY2ssIHR5cGVSZWY6IHJlZmxlY3QuVHlwZVJlZmVyZW5jZSwgdmFsdWU6IGFueSkge1xuICBjb25zdCBzY2hlbWFEZWZzOiBhbnkgPSB7fTtcbiAgY29uc3QgY3R4ID0gU2NoZW1hQ29udGV4dC5yb290KHNjaGVtYURlZnMpO1xuICBjb25zdCBzY2hlbWFSZWYgPSBzY2hlbWFGb3JQb2x5bW9ycGhpYyh0eXBlUmVmLnR5cGUsIGN0eCk7XG4gIGlmICghc2NoZW1hUmVmKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGRlZiA9IGZpbmREZWZpbml0aW9uKHNjaGVtYURlZnMsIHNjaGVtYVJlZi4kcmVmKTtcblxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICBpZiAoa2V5cy5sZW5ndGggIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGBDYW5ub3QgcGFyc2UgY2xhc3MgdHlwZSAke3R5cGVSZWZ9IHdpdGggdmFsdWUgJHt2YWx1ZX1gKTtcbiAgfVxuXG4gIGNvbnN0IGNsYXNzTmFtZSA9IGtleXNbMF07XG5cbiAgLy8gbm93IHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBhbiBlbnVtIG9yIGEgbm9ybWFsIGNsYXNzXG4gIGNvbnN0IHNjaGVtYSA9IGRlZi5hbnlPZi5maW5kKCh4OiBhbnkpID0+IHgucHJvcGVydGllcyAmJiB4LnByb3BlcnRpZXNbY2xhc3NOYW1lXSk7XG4gIGlmICghc2NoZW1hKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihgQ2Fubm90IGZpbmQgc2NoZW1hIGZvciAke2NsYXNzTmFtZX1gKTtcbiAgfVxuXG4gIGNvbnN0IGRlZjIgPSBmaW5kRGVmaW5pdGlvbihzY2hlbWFEZWZzLCBzY2hlbWEucHJvcGVydGllc1tjbGFzc05hbWVdLiRyZWYpO1xuICBjb25zdCBtZXRob2RGcW4gPSBkZWYyLmNvbW1lbnQ7XG5cbiAgY29uc3QgcGFydHMgPSBtZXRob2RGcW4uc3BsaXQoJy4nKTtcbiAgY29uc3QgbGFzdCA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICBpZiAobGFzdCAhPT0gJzxpbml0aWFsaXplcj4nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RyaW5nIGFuIGluaXRpYWxpemVyYCk7XG4gIH1cblxuICBjb25zdCBjbGFzc0ZxbiA9IHBhcnRzLnNsaWNlKDAsIHBhcnRzLmxlbmd0aCAtIDEpLmpvaW4oJy4nKTtcbiAgY29uc3QgbWV0aG9kID0gdHlwZVJlZi5zeXN0ZW0uZmluZENsYXNzKGNsYXNzRnFuKS5pbml0aWFsaXplcjtcbiAgaWYgKCFtZXRob2QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIHRoZSBpbml0aWFsaXplciBmb3IgJHtjbGFzc0Zxbn1gKTtcbiAgfVxuXG4gIHJldHVybiBpbnZva2VNZXRob2Qoc3RhY2ssIG1ldGhvZCwgdmFsdWVbY2xhc3NOYW1lXSk7XG59XG5cbmZ1bmN0aW9uIGZpbmREZWZpbml0aW9uKGRlZnM6IGFueSwgJHJlZjogc3RyaW5nKSB7XG4gIGNvbnN0IGsgPSAkcmVmLnNwbGl0KCcvJykuc2xpY2UoMikuam9pbignLycpO1xuICByZXR1cm4gZGVmc1trXTtcbn1cblxuZnVuY3Rpb24gZGVjb25zdHJ1Y3RTdGF0aWNQcm9wZXJ0eSh0eXBlUmVmOiByZWZsZWN0LkNsYXNzVHlwZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCB0eXBlQ2xhc3MgPSByZXNvbHZlVHlwZSh0eXBlUmVmLmZxbik7XG4gIHJldHVybiB0eXBlQ2xhc3NbdmFsdWVdO1xufVxuXG5mdW5jdGlvbiBkZWNvbnN0cnVjdFN0YXRpY01ldGhvZChzdGFjazogY2RrLlN0YWNrLCB0eXBlUmVmOiByZWZsZWN0LkNsYXNzVHlwZSwgdmFsdWU6IGFueSkge1xuICBjb25zdCBtZXRob2RzID0gdHlwZVJlZi5hbGxNZXRob2RzLmZpbHRlcihtID0+IG0uc3RhdGljKTtcbiAgY29uc3QgbWVtYmVycyA9IG1ldGhvZHMubWFwKHggPT4geC5uYW1lKTtcblxuICBpZiAodHlwZW9mKHZhbHVlKSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCBlbnRyaWVzOiBBcnJheTxbIHN0cmluZywgYW55IF0+ID0gT2JqZWN0LmVudHJpZXModmFsdWUpO1xuICAgIGlmIChlbnRyaWVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBWYWx1ZSBmb3IgZW51bS1saWtlIGNsYXNzICR7dHlwZVJlZi5mcW59IG11c3QgYmUgYW4gb2JqZWN0IHdpdGggYSBzaW5nbGUga2V5IChvbmUgb2Y6ICR7bWVtYmVycy5qb2luKCcsJyl9KWApO1xuICAgIH1cblxuICAgIGNvbnN0IFsgbWV0aG9kTmFtZSwgYXJncyBdID0gZW50cmllc1swXTtcbiAgICBjb25zdCBtZXRob2QgPSBtZXRob2RzLmZpbmQobSA9PiBtLm5hbWUgPT09IG1ldGhvZE5hbWUpO1xuICAgIGlmICghbWV0aG9kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbWVtYmVyIFwiJHttZXRob2ROYW1lfVwiIGZvciBlbnVtLWxpa2UgY2xhc3MgJHt0eXBlUmVmLmZxbn0uIE9wdGlvbnM6ICR7bWVtYmVycy5qb2luKCcsJyl9YCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihhcmdzKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0aW5nIGVudW0tbGlrZSBtZW1iZXIgJHttZXRob2ROYW1lfSB0byBiZSBhbiBvYmplY3QgZm9yIGVudW0tbGlrZSBjbGFzcyAke3R5cGVSZWYuZnFufWApO1xuICAgIH1cblxuICAgIHJldHVybiBpbnZva2VNZXRob2Qoc3RhY2ssIG1ldGhvZCwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlTWV0aG9kKHN0YWNrOiBjZGsuU3RhY2ssIG1ldGhvZDogcmVmbGVjdC5DYWxsYWJsZSwgcGFyYW1ldGVyczogYW55KSB7XG4gIGNvbnN0IHR5cGVDbGFzcyA9IHJlc29sdmVUeXBlKG1ldGhvZC5wYXJlbnRUeXBlLmZxbik7XG4gIGNvbnN0IGFyZ3MgPSBuZXcgQXJyYXk8YW55PigpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWV0aG9kLnBhcmFtZXRlcnMubGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBwID0gbWV0aG9kLnBhcmFtZXRlcnNbaV07XG5cbiAgICAvLyBrd2FyZ3M6IGlmIHRoaXMgaXMgdGhlIGxhc3QgYXJndW1lbnQgYW5kIGEgZGF0YSB0eXBlLCBmbGF0dGVuICh0cmVhdCBhcyBrZXl3b3JkIGFyZ3MpXG4gICAgaWYgKGkgPT09IG1ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aCAtIDEgJiYgaXNEYXRhVHlwZShwLnR5cGUudHlwZSkpIHtcbiAgICAgIC8vIHdlIHBhc3MgaW4gYWxsIHBhcmFtZXRlcnMgYXJlIHRoZSB2YWx1ZSwgYW5kIHRoZSBwb3NpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIGlnbm9yZWQgc2luY2VcbiAgICAgIC8vIHdlIGFyZSBwcm9taXNlZCB0aGVyZSBhcmUgbm8gY29uZmxpY3RzXG4gICAgICBjb25zdCBrd2FyZ3MgPSBkZXNlcmlhbGl6ZVZhbHVlKHN0YWNrLCBwLnR5cGUsIHAub3B0aW9uYWwsIHAubmFtZSwgcGFyYW1ldGVycyk7XG4gICAgICBhcmdzLnB1c2goa3dhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdmFsID0gcGFyYW1ldGVyc1twLm5hbWVdO1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkICYmICFwLm9wdGlvbmFsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXIgJyR7cC5uYW1lfScgZm9yICR7bWV0aG9kLnBhcmVudFR5cGUuZnFufS4ke21ldGhvZC5uYW1lfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXJncy5wdXNoKGRlc2VyaWFsaXplVmFsdWUoc3RhY2ssIHAudHlwZSwgcC5vcHRpb25hbCwgcC5uYW1lLCB2YWwpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAocmVmbGVjdC5Jbml0aWFsaXplci5pc0luaXRpYWxpemVyKG1ldGhvZCkpIHtcbiAgICByZXR1cm4gbmV3IHR5cGVDbGFzcyguLi5hcmdzKTtcbiAgfVxuXG4gIGNvbnN0IG1ldGhvZEZuOiAoLi4uYXJnczogYW55W10pID0+IGFueSA9IHR5cGVDbGFzc1ttZXRob2QubmFtZV07XG4gIGlmICghbWV0aG9kRm4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIG1ldGhvZCBuYW1lZCAke21ldGhvZC5uYW1lfSBpbiAke3R5cGVDbGFzcy5mcW59YCk7XG4gIH1cblxuICByZXR1cm4gbWV0aG9kRm4uYXBwbHkodHlwZUNsYXNzLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGF6eSBzdHJpbmcgdGhhdCBpbmNsdWRlcyBhIGRlY29uc3RydWN0ZWQgRm46OkdldEF0IHRvIGEgY2VydGFpblxuICogcmVzb3VyY2Ugb3IgY29uc3RydWN0LlxuICpcbiAqIElmIGBpZGAgcG9pbnRzIHRvIGEgQ0RLIGNvbnN0cnVjdCwgdGhlIHJlc29sdmVkIHZhbHVlIHdpbGwgYmUgdGhlIHZhbHVlIHJldHVybmVkIGJ5XG4gKiB0aGUgcHJvcGVydHkgYGF0dHJpYnV0ZWAuIElmIGBpZGAgcG9pbnRzIHRvIGEgXCJyYXdcIiByZXNvdXJjZSwgdGhlIHJlc29sdmVkIHZhbHVlIHdpbGwgYmVcbiAqIGFuIGBGbjo6R2V0QXR0YC5cbiAqL1xuZnVuY3Rpb24gZGVjb25zdHJ1Y3RHZXRBdHQoc3RhY2s6IGNkay5TdGFjaywgaWQ6IHN0cmluZywgYXR0cmlidXRlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHtcbiAgICBjb25zdCByZXMgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZChpZCk7XG4gICAgaWYgKCFyZXMpIHtcbiAgICAgIGNvbnN0IGluY2x1ZGUgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnSW5jbHVkZScpIGFzIGNkay5DZm5JbmNsdWRlO1xuICAgICAgaWYgKCFpbmNsdWRlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCAtIFwiSW5jbHVkZVwiIHNob3VsZCBiZSBpbiB0aGUgc3RhY2sgYXQgdGhpcyBwb2ludGApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByYXcgPSAoaW5jbHVkZS50ZW1wbGF0ZSBhcyBhbnkpLlJlc291cmNlc1tpZF07XG4gICAgICBpZiAoIXJhdykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIGEgcmVzb3VyY2UgJHtpZH1gKTtcbiAgICAgIH1cblxuICAgICAgLy8ganVzdCBsZWFrXG4gICAgICByZXR1cm4geyBcIkZuOjpHZXRBdHRcIjogWyBpZCwgYXR0cmlidXRlIF0gfTtcbiAgICB9XG4gICAgcmV0dXJuIChyZXMgYXMgYW55KVthdHRyaWJ1dGVdO1xuICB9fSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRDb25zdHJ1Y3Qoc3RhY2s6IGNkay5TdGFjaywgaWQ6IHN0cmluZykge1xuICBjb25zdCBjaGlsZCA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKGlkKTtcbiAgaWYgKCFjaGlsZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ29uc3RydWN0IHdpdGggSUQgJHtpZH0gbm90IGZvdW5kIChpdCBtdXN0IGJlIGRlZmluZWQgYmVmb3JlIGl0IGlzIHJlZmVyZW5jZWQpYCk7XG4gIH1cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzUmVmZXJlbmNlcyhzdGFjazogY2RrLlN0YWNrKSB7XG4gIGNvbnN0IGluY2x1ZGUgPSBzdGFjay5ub2RlLmZpbmRDaGlsZCgnSW5jbHVkZScpIGFzIGNkay5DZm5JbmNsdWRlO1xuICBpZiAoIWluY2x1ZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQnKTtcbiAgfVxuXG4gIHByb2Nlc3MoaW5jbHVkZS50ZW1wbGF0ZSBhcyBhbnkpO1xuXG4gIGZ1bmN0aW9uIHByb2Nlc3ModmFsdWU6IGFueSk6IGFueSB7XG4gICAgaWYgKHR5cGVvZih2YWx1ZSkgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDEgJiYgT2JqZWN0LmtleXModmFsdWUpWzBdID09PSAnRm46OkdldEF0dCcpIHtcbiAgICAgIGNvbnN0IFsgaWQsIGF0dHJpYnV0ZSBdID0gdmFsdWVbJ0ZuOjpHZXRBdHQnXTtcbiAgICAgIHJldHVybiBkZWNvbnN0cnVjdEdldEF0dChzdGFjaywgaWQsIGF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUubWFwKHggPT4gcHJvY2Vzcyh4KSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZih2YWx1ZSkgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKGNvbnN0IFsgaywgdiBdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZVtrXSA9IHByb2Nlc3Modik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQ2ZuUmVzb3VyY2VUeXBlKHJlc291cmNlVHlwZTogc3RyaW5nKSB7XG4gIHJldHVybiByZXNvdXJjZVR5cGUuaW5jbHVkZXMoJzo6Jyk7XG59XG5cbmNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHsgfVxuXG5mdW5jdGlvbiBfY3dkPFQ+KHdvcmtEaXI6IHN0cmluZyB8IHVuZGVmaW5lZCwgY2I6ICgpID0+IFQpOiBUIHtcbiAgaWYgKCF3b3JrRGlyKSB7IHJldHVybiBjYigpOyB9XG4gIGNvbnN0IHByZXZXZCA9IHByb2Nlc3MuY3dkKCk7XG4gIHRyeSB7XG4gICAgcHJvY2Vzcy5jaGRpcih3b3JrRGlyKTtcbiAgICByZXR1cm4gY2IoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBwcm9jZXNzLmNoZGlyKHByZXZXZCk7XG4gIH1cbn1cbiJdfQ==