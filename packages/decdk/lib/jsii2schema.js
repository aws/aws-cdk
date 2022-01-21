"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstruct = exports.enumLikeClassProperties = exports.enumLikeClassMethods = exports.isEnumLikeClass = exports.isSerializableInterface = exports.isSerializableTypeReference = exports.isDataType = exports.schemaForInterface = exports.schemaForPolymorphic = exports.schemaForTypeReference = exports.SchemaContext = void 0;
const jsiiReflect = require("jsii-reflect");
const util = require("util");
/* eslint-disable no-console */
class SchemaContext {
    constructor(name, parent, definitions) {
        this.children = new Array();
        this.warnings = new Array();
        this.errors = new Array();
        this.name = name || '';
        if (parent) {
            this.root = false;
            parent.children.push(this);
            this.definitions = parent.definitions;
            this.path = parent.path + '/' + this.name;
            this.definitionStack = parent.definitionStack;
        }
        else {
            this.root = true;
            this.definitions = definitions || {};
            this.path = this.name || '';
            this.definitionStack = new Array();
        }
    }
    static root(definitions) {
        return new SchemaContext(undefined, undefined, definitions);
    }
    child(type, name) {
        return new SchemaContext(`[${type} "${name}"]`, this);
    }
    get hasWarningsOrErrors() {
        return this.warnings.length > 0 || this.errors.length > 0 || this.children.some(child => child.hasWarningsOrErrors);
    }
    warning(format, ...args) {
        this.warnings.push(util.format(format, ...args));
    }
    error(format, ...args) {
        this.errors.push(util.format(format, ...args));
    }
    findDefinition(ref) {
        const [, , id] = ref.split('/');
        return this.definitions[id];
    }
    define(fqn, schema) {
        const originalFqn = fqn;
        fqn = fqn.replace('/', '.');
        if (!(fqn in this.definitions)) {
            if (this.definitionStack.includes(fqn)) {
                this.error(`cyclic definition of ${fqn}`);
                return undefined;
            }
            this.definitionStack.push(fqn);
            try {
                const s = schema();
                if (!s) {
                    this.error('cannot schematize');
                    return undefined;
                }
                s.comment = originalFqn;
                this.definitions[fqn] = s;
            }
            finally {
                this.definitionStack.pop();
            }
        }
        return { $ref: `#/definitions/${fqn}` };
    }
}
exports.SchemaContext = SchemaContext;
function schemaForTypeReference(type, ctx) {
    const prim = schemaForPrimitive(type);
    if (prim) {
        return prim;
    }
    const arr = schemaForArray(type, ctx);
    if (arr) {
        return arr;
    }
    const map = schemaForMap(type, ctx);
    if (map) {
        return map;
    }
    const union = schemaForUnion(type, ctx);
    if (union) {
        return union;
    }
    const constructRef = schemaForConstructRef(type);
    if (constructRef) {
        return constructRef;
    }
    const iface = schemaForInterface(type.type, ctx);
    if (iface) {
        return iface;
    }
    const enm = schemaForEnum(type.type);
    if (enm) {
        return enm;
    }
    const enumLike = schemaForEnumLikeClass(type.type, ctx);
    if (enumLike) {
        return enumLike;
    }
    const cls = schemaForPolymorphic(type.type, ctx);
    if (cls) {
        return cls;
    }
    if (!ctx.hasWarningsOrErrors) {
        ctx.error(`didn't match any schematizable shape`);
    }
    return undefined;
}
exports.schemaForTypeReference = schemaForTypeReference;
function schemaForPolymorphic(type, ctx) {
    if (!type) {
        return undefined;
    }
    ctx = ctx.child('polymorphic', type.fqn);
    const anyOf = new Array();
    const parentctx = ctx;
    for (const x of allImplementationsOfType(type)) {
        ctx = parentctx.child('impl', x.fqn);
        const enumLike = schemaForEnumLikeClass(x, ctx);
        if (enumLike) {
            anyOf.push(enumLike);
        }
        if (x.initializer) {
            const methd = methodSchema(x.initializer, ctx);
            if (methd) {
                anyOf.push({
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        [x.fqn]: methd
                    }
                });
            }
        }
    }
    if (anyOf.length === 0) {
        return undefined;
    }
    return ctx.define(type.fqn, () => {
        return { anyOf };
    });
}
exports.schemaForPolymorphic = schemaForPolymorphic;
function schemaForEnum(type) {
    if (!type || !(type instanceof jsiiReflect.EnumType)) {
        return undefined;
    }
    return {
        enum: type.members.map(m => m.name)
    };
}
function schemaForMap(type, ctx) {
    ctx = ctx.child('map', type.toString());
    if (!type.mapOfType) {
        return undefined;
    }
    const s = schemaForTypeReference(type.mapOfType, ctx);
    if (!s) {
        return undefined;
    }
    return {
        type: 'object',
        additionalProperties: s
    };
}
function schemaForArray(type, ctx) {
    ctx = ctx.child('array', type.toString());
    if (!type.arrayOfType) {
        return undefined;
    }
    const s = schemaForTypeReference(type.arrayOfType, ctx);
    if (!s) {
        return undefined;
    }
    return {
        type: 'array',
        items: schemaForTypeReference(type.arrayOfType, ctx)
    };
}
function schemaForPrimitive(type) {
    if (!type.primitive) {
        return undefined;
    }
    switch (type.primitive) {
        case 'date': return { type: 'string', format: 'date-time' };
        case 'json': return { type: 'object' };
        case 'any': return {}; // this means "any"
        default: return { type: type.primitive };
    }
}
function schemaForUnion(type, ctx) {
    ctx = ctx.child('union', type.toString());
    if (!type.unionOfTypes) {
        return undefined;
    }
    const anyOf = type.unionOfTypes
        .map(x => schemaForTypeReference(x, ctx))
        .filter(x => x); // filter failed schemas
    if (anyOf.length === 0) {
        return undefined;
    }
    return { anyOf };
}
function schemaForConstructRef(type) {
    if (!isConstruct(type)) {
        return undefined;
    }
    return {
        type: 'object',
        properties: {
            Ref: { type: 'string' }
        }
    };
}
function schemaForInterface(type, ctx) {
    if (!type || !(type instanceof jsiiReflect.InterfaceType)) {
        return undefined; // skip
    }
    if (type.allMethods.length > 0) {
        return undefined;
    }
    ctx = ctx.child('interface', type.fqn);
    const ifctx = ctx;
    return ctx.define(type.fqn, () => {
        const properties = {};
        const required = new Array();
        for (const prop of type.allProperties) {
            ctx = ifctx.child(prop.optional ? 'optional' : 'required' + ' property', prop.name);
            const schema = schemaForTypeReference(prop.type, ctx);
            if (!schema) {
                // if prop is not serializable but optional, we can still serialize
                // but without this property.
                if (prop.optional) {
                    ctx.warning(`optional proprety omitted because it cannot be schematized`);
                    continue;
                }
                // error
                ctx.error('property cannot be schematized');
                return undefined;
            }
            properties[prop.name] = schema;
            const docstring = prop.docs.toString();
            if (docstring) {
                properties[prop.name].description = docstring;
            }
            if (!prop.optional) {
                required.push(prop.name);
            }
        }
        return {
            type: 'object',
            title: type.name,
            additionalProperties: false,
            properties,
            required: required.length > 0 ? required : undefined,
        };
    });
}
exports.schemaForInterface = schemaForInterface;
function schemaForEnumLikeClass(type, ctx) {
    if (type) {
        ctx = ctx.child('enum-like', type.toString());
    }
    if (!type || !(type instanceof jsiiReflect.ClassType)) {
        return undefined;
    }
    const enumLikeProps = enumLikeClassProperties(type);
    const enumLikeMethods = enumLikeClassMethods(type);
    if (enumLikeProps.length === 0 && enumLikeMethods.length === 0) {
        return undefined;
    }
    const anyOf = new Array();
    if (enumLikeProps.length > 0) {
        anyOf.push({ enum: enumLikeProps.map(m => m.name) });
    }
    for (const method of enumLikeMethods) {
        const s = methodSchema(method, ctx);
        if (!s) {
            continue;
        }
        anyOf.push({
            type: 'object',
            additionalProperties: false,
            properties: {
                [method.name]: methodSchema(method, ctx)
            }
        });
    }
    if (anyOf.length === 0) {
        return undefined;
    }
    return ctx.define(type.fqn, () => {
        return { anyOf };
    });
}
function methodSchema(method, ctx) {
    ctx = ctx.child('method', method.name);
    const fqn = `${method.parentType.fqn}.${method.name}`;
    const methodctx = ctx;
    return ctx.define(fqn, () => {
        const properties = {};
        const required = new Array();
        const addProperty = (prop) => {
            const param = schemaForTypeReference(prop.type, ctx);
            // bail out - can't serialize a required parameter, so we can't serialize the method
            if (!param && !prop.optional) {
                ctx.error(`cannot schematize method because parameter cannot be schematized`);
                return undefined;
            }
            properties[prop.name] = param;
            if (!prop.optional) {
                required.push(prop.name);
            }
        };
        for (let i = 0; i < method.parameters.length; ++i) {
            const p = method.parameters[i];
            methodctx.child('param', p.name);
            // if this is the last parameter and it's a data type, treat as keyword arguments
            if (i === method.parameters.length - 1 && isDataType(p.type.type)) {
                const kwargs = schemaForInterface(p.type.type, ctx);
                if (kwargs) {
                    for (const prop of p.type.type.allProperties) {
                        addProperty(prop);
                    }
                }
            }
            else {
                addProperty(p);
            }
        }
        return {
            type: 'object',
            properties,
            additionalProperties: false,
            required: required.length > 0 ? required : undefined
        };
    });
}
function isDataType(t) {
    if (!t) {
        return false;
    }
    return t instanceof jsiiReflect.InterfaceType && t.spec.datatype;
}
exports.isDataType = isDataType;
// Must only have properties, all of which are scalars,
// lists or isSerializableInterface types.
function isSerializableTypeReference(type, errorPrefix) {
    if (type.primitive) {
        return true;
    }
    if (type.arrayOfType) {
        return isSerializableTypeReference(type.arrayOfType, errorPrefix);
    }
    if (type.mapOfType) {
        return isSerializableTypeReference(type.mapOfType, errorPrefix);
    }
    if (type.type) {
        return isSerializableType(type.type, errorPrefix);
    }
    if (type.unionOfTypes) {
        return type.unionOfTypes.some(x => isSerializableTypeReference(x, errorPrefix));
    }
    return false;
}
exports.isSerializableTypeReference = isSerializableTypeReference;
function isSerializableType(type, errorPrefix) {
    // if this is a cosntruct class, we can represent it as a "Ref"
    if (isConstruct(type)) {
        return true;
    }
    if (isEnum(type)) {
        return true;
    }
    if (isSerializableInterface(type)) {
        return true;
    }
    // if this is a class that looks like an enum, we can represent it
    if (isEnumLikeClass(type)) {
        return true;
    }
    if (allImplementationsOfType(type).length > 0) {
        return true;
    }
    if (errorPrefix) {
        console.error(errorPrefix, `${type} is not serializable`);
    }
    return false;
}
function isSerializableInterface(type, errorPrefix) {
    if (!type || !(type instanceof jsiiReflect.InterfaceType)) {
        return false;
    }
    if (type.allMethods.length > 0) {
        return false;
    }
    return type.allProperties.every(p => isSerializableTypeReference(p.type, errorPrefix)
        || isConstruct(p.type)
        || p.optional);
}
exports.isSerializableInterface = isSerializableInterface;
function isEnum(type) {
    return type instanceof jsiiReflect.EnumType;
}
function isEnumLikeClass(cls) {
    if (!cls) {
        return false;
    }
    if (!(cls instanceof jsiiReflect.ClassType)) {
        return false;
    }
    return enumLikeClassMethods(cls).length > 0
        || enumLikeClassProperties(cls).length > 0;
}
exports.isEnumLikeClass = isEnumLikeClass;
function enumLikeClassMethods(cls) {
    return cls.allMethods.filter(m => m.static && m.returns && m.returns.type.type && m.returns.type.type.extends(cls));
}
exports.enumLikeClassMethods = enumLikeClassMethods;
function enumLikeClassProperties(cls) {
    return cls.allProperties.filter(p => p.static && p.type.type && p.type.type.extends(cls));
}
exports.enumLikeClassProperties = enumLikeClassProperties;
function isConstruct(typeOrTypeRef) {
    let type;
    if (typeOrTypeRef instanceof jsiiReflect.Type) {
        type = typeOrTypeRef;
    }
    else {
        if (typeOrTypeRef.arrayOfType) {
            return isConstruct(typeOrTypeRef.arrayOfType);
        }
        if (typeOrTypeRef.mapOfType) {
            return isConstruct(typeOrTypeRef.mapOfType);
        }
        if (typeOrTypeRef.unionOfTypes) {
            return typeOrTypeRef.unionOfTypes.some(x => isConstruct(x));
        }
        if (typeOrTypeRef.type) {
            type = typeOrTypeRef.type;
        }
        else {
            return false;
        }
    }
    // if it is an interface, it should extend constructs.IConstruct
    if (type instanceof jsiiReflect.InterfaceType) {
        const constructIface = type.system.findFqn('constructs.IConstruct');
        return type.extends(constructIface);
    }
    // if it is a class, it should extend constructs.Construct
    if (type instanceof jsiiReflect.ClassType) {
        const constructClass = type.system.findFqn('constructs.Construct');
        return type.extends(constructClass);
    }
    return false;
}
exports.isConstruct = isConstruct;
function allImplementationsOfType(type) {
    if (type instanceof jsiiReflect.ClassType) {
        return allSubclasses(type).filter(x => !x.abstract);
    }
    if (type instanceof jsiiReflect.InterfaceType) {
        return allImplementations(type).filter(x => !x.abstract);
    }
    throw new Error(`Must either be a class or an interface`);
}
function allSubclasses(base) {
    return base.system.classes.filter(x => x.extends(base));
}
function allImplementations(base) {
    return base.system.classes.filter(x => x.getInterfaces(true).some(i => i.extends(base)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNpaTJzY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqc2lpMnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBNEM7QUFDNUMsNkJBQTZCO0FBRTdCLCtCQUErQjtBQUUvQixNQUFhLGFBQWE7SUFleEIsWUFBb0IsSUFBYSxFQUFFLE1BQXNCLEVBQUUsV0FBb0M7UUFSL0UsYUFBUSxHQUFHLElBQUksS0FBSyxFQUFpQixDQUFDO1FBR3RDLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQy9CLFdBQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBSzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1NBQy9DO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsSUFBSSxFQUFHLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBNUJNLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBb0M7UUFDckQsT0FBTyxJQUFJLGFBQWEsQ0FBQyxT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Q0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDMUQ7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQTJCO0lBQ2hELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLElBQStCO0lBQ3pELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMganNpaVJlZmxlY3QgZnJvbSAnanNpaS1yZWZsZWN0JztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAndXRpbCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGNsYXNzIFNjaGVtYUNvbnRleHQge1xuICBwdWJsaWMgc3RhdGljIHJvb3QoZGVmaW5pdGlvbnM/OiB7IFtmcW46IHN0cmluZ106IGFueSB9KTogU2NoZW1hQ29udGV4dCB7XG4gICAgcmV0dXJuIG5ldyBTY2hlbWFDb250ZXh0KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkZWZpbml0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZGVmaW5pdGlvbnM6IHsgW2Zxbjogc3RyaW5nXTogYW55IH07XG4gIHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjaGlsZHJlbiA9IG5ldyBBcnJheTxTY2hlbWFDb250ZXh0PigpO1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogYm9vbGVhbjtcbiAgcHVibGljIHJlYWRvbmx5IHdhcm5pbmdzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgcHVibGljIHJlYWRvbmx5IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkZWZpbml0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IobmFtZT86IHN0cmluZywgcGFyZW50PzogU2NoZW1hQ29udGV4dCwgZGVmaW5pdGlvbnM/OiB7IFtmcW46IHN0cmluZ106IGFueSB9KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZSB8fCAnJztcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICB0aGlzLnJvb3QgPSBmYWxzZTtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgICAgdGhpcy5kZWZpbml0aW9ucyA9IHBhcmVudC5kZWZpbml0aW9ucztcbiAgICAgIHRoaXMucGF0aCA9IHBhcmVudC5wYXRoICsgJy8nICsgdGhpcy5uYW1lO1xuICAgICAgdGhpcy5kZWZpbml0aW9uU3RhY2sgPSBwYXJlbnQuZGVmaW5pdGlvblN0YWNrO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QgPSB0cnVlO1xuICAgICAgdGhpcy5kZWZpbml0aW9ucyA9IGRlZmluaXRpb25zIHx8IHsgfTtcbiAgICAgIHRoaXMucGF0aCA9IHRoaXMubmFtZSB8fCAnJztcbiAgICAgIHRoaXMuZGVmaW5pdGlvblN0YWNrID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2hpbGQodHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBTY2hlbWFDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IFNjaGVtYUNvbnRleHQoYFske3R5cGV9IFwiJHtuYW1lfVwiXWAsIHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGdldCBoYXNXYXJuaW5nc09yRXJyb3JzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLndhcm5pbmdzLmxlbmd0aCA+IDAgfHwgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCB8fCB0aGlzLmNoaWxkcmVuLnNvbWUoY2hpbGQgPT4gY2hpbGQuaGFzV2FybmluZ3NPckVycm9ycyk7XG4gIH1cblxuICBwdWJsaWMgd2FybmluZyhmb3JtYXQ6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLndhcm5pbmdzLnB1c2godXRpbC5mb3JtYXQoZm9ybWF0LCAuLi5hcmdzKSk7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoZm9ybWF0OiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgdGhpcy5lcnJvcnMucHVzaCh1dGlsLmZvcm1hdChmb3JtYXQsIC4uLmFyZ3MpKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kRGVmaW5pdGlvbihyZWY6IHN0cmluZykge1xuICAgIGNvbnN0IFsgLCAsIGlkIF0gPSByZWYuc3BsaXQoJy8nKTtcbiAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9uc1tpZF07XG4gIH1cblxuICBwdWJsaWMgZGVmaW5lKGZxbjogc3RyaW5nLCBzY2hlbWE6ICgpID0+IGFueSkge1xuICAgIGNvbnN0IG9yaWdpbmFsRnFuID0gZnFuO1xuICAgIGZxbiA9IGZxbi5yZXBsYWNlKCcvJywgJy4nKTtcblxuICAgIGlmICghKGZxbiBpbiB0aGlzLmRlZmluaXRpb25zKSkge1xuICAgICAgaWYgKHRoaXMuZGVmaW5pdGlvblN0YWNrLmluY2x1ZGVzKGZxbikpIHtcbiAgICAgICAgdGhpcy5lcnJvcihgY3ljbGljIGRlZmluaXRpb24gb2YgJHtmcW59YCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGVmaW5pdGlvblN0YWNrLnB1c2goZnFuKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcyA9IHNjaGVtYSgpO1xuICAgICAgICBpZiAoIXMpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKCdjYW5ub3Qgc2NoZW1hdGl6ZScpO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBzLmNvbW1lbnQgPSBvcmlnaW5hbEZxbjtcblxuICAgICAgICB0aGlzLmRlZmluaXRpb25zW2Zxbl0gPSBzO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9uU3RhY2sucG9wKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgJHJlZjogYCMvZGVmaW5pdGlvbnMvJHtmcW59YCB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2hlbWFGb3JUeXBlUmVmZXJlbmNlKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGVSZWZlcmVuY2UsIGN0eDogU2NoZW1hQ29udGV4dCk6IGFueSB7XG5cbiAgY29uc3QgcHJpbSA9IHNjaGVtYUZvclByaW1pdGl2ZSh0eXBlKTtcbiAgaWYgKHByaW0pIHtcbiAgICByZXR1cm4gcHJpbTtcbiAgfVxuXG4gIGNvbnN0IGFyciA9IHNjaGVtYUZvckFycmF5KHR5cGUsIGN0eCk7XG4gIGlmIChhcnIpIHtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgY29uc3QgbWFwID0gc2NoZW1hRm9yTWFwKHR5cGUsIGN0eCk7XG4gIGlmIChtYXApIHtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgY29uc3QgdW5pb24gPSBzY2hlbWFGb3JVbmlvbih0eXBlLCBjdHgpO1xuICBpZiAodW5pb24pIHtcbiAgICByZXR1cm4gdW5pb247XG4gIH1cblxuICBjb25zdCBjb25zdHJ1Y3RSZWYgPSBzY2hlbWFGb3JDb25zdHJ1Y3RSZWYodHlwZSk7XG4gIGlmIChjb25zdHJ1Y3RSZWYpIHtcbiAgICByZXR1cm4gY29uc3RydWN0UmVmO1xuICB9XG5cbiAgY29uc3QgaWZhY2UgPSBzY2hlbWFGb3JJbnRlcmZhY2UodHlwZS50eXBlLCBjdHgpO1xuICBpZiAoaWZhY2UpIHtcbiAgICByZXR1cm4gaWZhY2U7XG4gIH1cblxuICBjb25zdCBlbm0gPSBzY2hlbWFGb3JFbnVtKHR5cGUudHlwZSk7XG4gIGlmIChlbm0pIHtcbiAgICByZXR1cm4gZW5tO1xuICB9XG5cbiAgY29uc3QgZW51bUxpa2UgPSBzY2hlbWFGb3JFbnVtTGlrZUNsYXNzKHR5cGUudHlwZSwgY3R4KTtcbiAgaWYgKGVudW1MaWtlKSB7XG4gICAgcmV0dXJuIGVudW1MaWtlO1xuICB9XG5cbiAgY29uc3QgY2xzID0gc2NoZW1hRm9yUG9seW1vcnBoaWModHlwZS50eXBlLCBjdHgpO1xuICBpZiAoY2xzKSB7XG4gICAgcmV0dXJuIGNscztcbiAgfVxuXG4gIGlmICghY3R4Lmhhc1dhcm5pbmdzT3JFcnJvcnMpIHtcbiAgICBjdHguZXJyb3IoYGRpZG4ndCBtYXRjaCBhbnkgc2NoZW1hdGl6YWJsZSBzaGFwZWApO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjaGVtYUZvclBvbHltb3JwaGljKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGUgfCB1bmRlZmluZWQsIGN0eDogU2NoZW1hQ29udGV4dCkge1xuICBpZiAoIXR5cGUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY3R4ID0gY3R4LmNoaWxkKCdwb2x5bW9ycGhpYycsIHR5cGUuZnFuKTtcblxuICBjb25zdCBhbnlPZiA9IG5ldyBBcnJheTxhbnk+KCk7XG5cbiAgY29uc3QgcGFyZW50Y3R4ID0gY3R4O1xuXG4gIGZvciAoY29uc3QgeCBvZiBhbGxJbXBsZW1lbnRhdGlvbnNPZlR5cGUodHlwZSkpIHtcblxuICAgIGN0eCA9IHBhcmVudGN0eC5jaGlsZCgnaW1wbCcsIHguZnFuKTtcblxuICAgIGNvbnN0IGVudW1MaWtlID0gc2NoZW1hRm9yRW51bUxpa2VDbGFzcyh4LCBjdHgpO1xuICAgIGlmIChlbnVtTGlrZSkge1xuICAgICAgYW55T2YucHVzaChlbnVtTGlrZSk7XG4gICAgfVxuXG4gICAgaWYgKHguaW5pdGlhbGl6ZXIpIHtcbiAgICAgIGNvbnN0IG1ldGhkID0gbWV0aG9kU2NoZW1hKHguaW5pdGlhbGl6ZXIsIGN0eCk7XG4gICAgICBpZiAobWV0aGQpIHtcbiAgICAgICAgYW55T2YucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFt4LmZxbl06IG1ldGhkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoYW55T2YubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBjdHguZGVmaW5lKHR5cGUuZnFuLCAoKSA9PiB7XG4gICAgcmV0dXJuIHsgYW55T2YgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNjaGVtYUZvckVudW0odHlwZToganNpaVJlZmxlY3QuVHlwZSB8IHVuZGVmaW5lZCkge1xuICBpZiAoIXR5cGUgfHwgISh0eXBlIGluc3RhbmNlb2YganNpaVJlZmxlY3QuRW51bVR5cGUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZW51bTogdHlwZS5tZW1iZXJzLm1hcChtID0+IG0ubmFtZSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2NoZW1hRm9yTWFwKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGVSZWZlcmVuY2UsIGN0eDogU2NoZW1hQ29udGV4dCkge1xuICBjdHggPSBjdHguY2hpbGQoJ21hcCcsIHR5cGUudG9TdHJpbmcoKSk7XG5cbiAgaWYgKCF0eXBlLm1hcE9mVHlwZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBzID0gc2NoZW1hRm9yVHlwZVJlZmVyZW5jZSh0eXBlLm1hcE9mVHlwZSwgY3R4KTtcbiAgaWYgKCFzKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHNcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2NoZW1hRm9yQXJyYXkodHlwZToganNpaVJlZmxlY3QuVHlwZVJlZmVyZW5jZSwgY3R4OiBTY2hlbWFDb250ZXh0KSB7XG4gIGN0eCA9IGN0eC5jaGlsZCgnYXJyYXknLCB0eXBlLnRvU3RyaW5nKCkpO1xuXG4gIGlmICghdHlwZS5hcnJheU9mVHlwZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBzID0gc2NoZW1hRm9yVHlwZVJlZmVyZW5jZSh0eXBlLmFycmF5T2ZUeXBlLCBjdHgpO1xuICBpZiAoIXMpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnYXJyYXknLFxuICAgIGl0ZW1zOiBzY2hlbWFGb3JUeXBlUmVmZXJlbmNlKHR5cGUuYXJyYXlPZlR5cGUsIGN0eClcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2NoZW1hRm9yUHJpbWl0aXZlKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGVSZWZlcmVuY2UpOiBhbnkge1xuICBpZiAoIXR5cGUucHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZS5wcmltaXRpdmUpIHtcbiAgICBjYXNlICdkYXRlJzogcmV0dXJuIHsgdHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2RhdGUtdGltZScgfTtcbiAgICBjYXNlICdqc29uJzogcmV0dXJuIHsgdHlwZTogJ29iamVjdCcgfTtcbiAgICBjYXNlICdhbnknOiByZXR1cm4geyB9OyAvLyB0aGlzIG1lYW5zIFwiYW55XCJcbiAgICBkZWZhdWx0OiByZXR1cm4geyB0eXBlOiB0eXBlLnByaW1pdGl2ZSB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNjaGVtYUZvclVuaW9uKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGVSZWZlcmVuY2UsIGN0eDogU2NoZW1hQ29udGV4dCk6IGFueSB7XG4gIGN0eCA9IGN0eC5jaGlsZCgndW5pb24nLCB0eXBlLnRvU3RyaW5nKCkpO1xuXG4gIGlmICghdHlwZS51bmlvbk9mVHlwZXMpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgYW55T2YgPSB0eXBlLnVuaW9uT2ZUeXBlc1xuICAgIC5tYXAoeCA9PiBzY2hlbWFGb3JUeXBlUmVmZXJlbmNlKHgsIGN0eCkpXG4gICAgLmZpbHRlcih4ID0+IHgpOyAvLyBmaWx0ZXIgZmFpbGVkIHNjaGVtYXNcblxuICBpZiAoYW55T2YubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB7IGFueU9mIH07XG59XG5cbmZ1bmN0aW9uIHNjaGVtYUZvckNvbnN0cnVjdFJlZih0eXBlOiBqc2lpUmVmbGVjdC5UeXBlUmVmZXJlbmNlKSB7XG4gIGlmICghaXNDb25zdHJ1Y3QodHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBSZWY6IHsgdHlwZTogJ3N0cmluZycgfVxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjaGVtYUZvckludGVyZmFjZSh0eXBlOiBqc2lpUmVmbGVjdC5UeXBlIHwgdW5kZWZpbmVkLCBjdHg6IFNjaGVtYUNvbnRleHQpIHtcbiAgaWYgKCF0eXBlIHx8ICEodHlwZSBpbnN0YW5jZW9mIGpzaWlSZWZsZWN0LkludGVyZmFjZVR5cGUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gc2tpcFxuICB9XG5cbiAgaWYgKHR5cGUuYWxsTWV0aG9kcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGN0eCA9IGN0eC5jaGlsZCgnaW50ZXJmYWNlJywgdHlwZS5mcW4pO1xuXG4gIGNvbnN0IGlmY3R4ID0gY3R4O1xuXG4gIHJldHVybiBjdHguZGVmaW5lKHR5cGUuZnFuLCAoKSA9PiB7XG4gICAgY29uc3QgcHJvcGVydGllczogYW55ID0ge307XG4gICAgY29uc3QgcmVxdWlyZWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgZm9yIChjb25zdCBwcm9wIG9mIHR5cGUuYWxsUHJvcGVydGllcykge1xuXG4gICAgICBjdHggPSBpZmN0eC5jaGlsZChwcm9wLm9wdGlvbmFsID8gJ29wdGlvbmFsJyA6ICdyZXF1aXJlZCcgKyAnIHByb3BlcnR5JywgcHJvcC5uYW1lKTtcblxuICAgICAgY29uc3Qgc2NoZW1hID0gc2NoZW1hRm9yVHlwZVJlZmVyZW5jZShwcm9wLnR5cGUsIGN0eCk7XG4gICAgICBpZiAoIXNjaGVtYSkge1xuICAgICAgICAvLyBpZiBwcm9wIGlzIG5vdCBzZXJpYWxpemFibGUgYnV0IG9wdGlvbmFsLCB3ZSBjYW4gc3RpbGwgc2VyaWFsaXplXG4gICAgICAgIC8vIGJ1dCB3aXRob3V0IHRoaXMgcHJvcGVydHkuXG4gICAgICAgIGlmIChwcm9wLm9wdGlvbmFsKSB7XG4gICAgICAgICAgY3R4Lndhcm5pbmcoYG9wdGlvbmFsIHByb3ByZXR5IG9taXR0ZWQgYmVjYXVzZSBpdCBjYW5ub3QgYmUgc2NoZW1hdGl6ZWRgKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVycm9yXG4gICAgICAgIGN0eC5lcnJvcigncHJvcGVydHkgY2Fubm90IGJlIHNjaGVtYXRpemVkJyk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHNjaGVtYTtcblxuICAgICAgY29uc3QgZG9jc3RyaW5nID0gcHJvcC5kb2NzLnRvU3RyaW5nKCk7XG4gICAgICBpZiAoZG9jc3RyaW5nKSB7XG4gICAgICAgIHByb3BlcnRpZXNbcHJvcC5uYW1lXS5kZXNjcmlwdGlvbiA9IGRvY3N0cmluZztcbiAgICAgIH1cblxuICAgICAgaWYgKCFwcm9wLm9wdGlvbmFsKSB7XG4gICAgICAgIHJlcXVpcmVkLnB1c2gocHJvcC5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICB0aXRsZTogdHlwZS5uYW1lLFxuICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgcHJvcGVydGllcyxcbiAgICAgIHJlcXVpcmVkOiByZXF1aXJlZC5sZW5ndGggPiAwID8gcmVxdWlyZWQgOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNjaGVtYUZvckVudW1MaWtlQ2xhc3ModHlwZToganNpaVJlZmxlY3QuVHlwZSB8IHVuZGVmaW5lZCwgY3R4OiBTY2hlbWFDb250ZXh0KSB7XG4gIGlmICh0eXBlKSB7XG4gICAgY3R4ID0gY3R4LmNoaWxkKCdlbnVtLWxpa2UnLCB0eXBlLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgaWYgKCF0eXBlIHx8ICEodHlwZSBpbnN0YW5jZW9mIGpzaWlSZWZsZWN0LkNsYXNzVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZW51bUxpa2VQcm9wcyA9IGVudW1MaWtlQ2xhc3NQcm9wZXJ0aWVzKHR5cGUpO1xuICBjb25zdCBlbnVtTGlrZU1ldGhvZHMgPSBlbnVtTGlrZUNsYXNzTWV0aG9kcyh0eXBlKTtcblxuICBpZiAoZW51bUxpa2VQcm9wcy5sZW5ndGggPT09IDAgJiYgZW51bUxpa2VNZXRob2RzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBhbnlPZiA9IG5ldyBBcnJheTxhbnk+KCk7XG5cbiAgaWYgKGVudW1MaWtlUHJvcHMubGVuZ3RoID4gMCkge1xuICAgIGFueU9mLnB1c2goeyBlbnVtOiBlbnVtTGlrZVByb3BzLm1hcChtID0+IG0ubmFtZSkgfSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBlbnVtTGlrZU1ldGhvZHMpIHtcbiAgICBjb25zdCBzID0gbWV0aG9kU2NoZW1hKG1ldGhvZCwgY3R4KTtcbiAgICBpZiAoIXMpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGFueU9mLnB1c2goe1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFttZXRob2QubmFtZV06IG1ldGhvZFNjaGVtYShtZXRob2QsIGN0eClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChhbnlPZi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIGN0eC5kZWZpbmUodHlwZS5mcW4sICgpID0+IHtcbiAgICByZXR1cm4geyBhbnlPZiB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWV0aG9kU2NoZW1hKG1ldGhvZDoganNpaVJlZmxlY3QuQ2FsbGFibGUsIGN0eDogU2NoZW1hQ29udGV4dCkge1xuICBjdHggPSBjdHguY2hpbGQoJ21ldGhvZCcsIG1ldGhvZC5uYW1lKTtcblxuICBjb25zdCBmcW4gPSBgJHttZXRob2QucGFyZW50VHlwZS5mcW59LiR7bWV0aG9kLm5hbWV9YDtcblxuICBjb25zdCBtZXRob2RjdHggPSBjdHg7XG5cbiAgcmV0dXJuIGN0eC5kZWZpbmUoZnFuLCAoKSA9PiB7XG4gICAgY29uc3QgcHJvcGVydGllczogYW55ID0geyB9O1xuICAgIGNvbnN0IHJlcXVpcmVkID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgIGNvbnN0IGFkZFByb3BlcnR5ID0gKHByb3A6IGpzaWlSZWZsZWN0LlByb3BlcnR5IHwganNpaVJlZmxlY3QuUGFyYW1ldGVyKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBwYXJhbSA9IHNjaGVtYUZvclR5cGVSZWZlcmVuY2UocHJvcC50eXBlLCBjdHgpO1xuXG4gICAgICAvLyBiYWlsIG91dCAtIGNhbid0IHNlcmlhbGl6ZSBhIHJlcXVpcmVkIHBhcmFtZXRlciwgc28gd2UgY2FuJ3Qgc2VyaWFsaXplIHRoZSBtZXRob2RcbiAgICAgIGlmICghcGFyYW0gJiYgIXByb3Aub3B0aW9uYWwpIHtcbiAgICAgICAgY3R4LmVycm9yKGBjYW5ub3Qgc2NoZW1hdGl6ZSBtZXRob2QgYmVjYXVzZSBwYXJhbWV0ZXIgY2Fubm90IGJlIHNjaGVtYXRpemVkYCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHBhcmFtO1xuXG4gICAgICBpZiAoIXByb3Aub3B0aW9uYWwpIHtcbiAgICAgICAgcmVxdWlyZWQucHVzaChwcm9wLm5hbWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBwID0gbWV0aG9kLnBhcmFtZXRlcnNbaV07XG4gICAgICBtZXRob2RjdHguY2hpbGQoJ3BhcmFtJywgcC5uYW1lKTtcblxuICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgbGFzdCBwYXJhbWV0ZXIgYW5kIGl0J3MgYSBkYXRhIHR5cGUsIHRyZWF0IGFzIGtleXdvcmQgYXJndW1lbnRzXG4gICAgICBpZiAoaSA9PT0gbWV0aG9kLnBhcmFtZXRlcnMubGVuZ3RoIC0gMSAmJiBpc0RhdGFUeXBlKHAudHlwZS50eXBlKSkge1xuICAgICAgICBjb25zdCBrd2FyZ3MgPSBzY2hlbWFGb3JJbnRlcmZhY2UocC50eXBlLnR5cGUsIGN0eCk7XG4gICAgICAgIGlmIChrd2FyZ3MpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHByb3Agb2YgcC50eXBlLnR5cGUuYWxsUHJvcGVydGllcykge1xuICAgICAgICAgICAgYWRkUHJvcGVydHkocHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRQcm9wZXJ0eShwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzLFxuICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgcmVxdWlyZWQ6IHJlcXVpcmVkLmxlbmd0aCA+IDAgPyByZXF1aXJlZCA6IHVuZGVmaW5lZFxuICAgIH07XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhVHlwZSh0OiBqc2lpUmVmbGVjdC5UeXBlIHwgdW5kZWZpbmVkKTogdCBpcyBqc2lpUmVmbGVjdC5JbnRlcmZhY2VUeXBlIHtcbiAgaWYgKCF0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0IGluc3RhbmNlb2YganNpaVJlZmxlY3QuSW50ZXJmYWNlVHlwZSAmJiAodCBhcyBhbnkpLnNwZWMuZGF0YXR5cGU7XG59XG5cbi8vIE11c3Qgb25seSBoYXZlIHByb3BlcnRpZXMsIGFsbCBvZiB3aGljaCBhcmUgc2NhbGFycyxcbi8vIGxpc3RzIG9yIGlzU2VyaWFsaXphYmxlSW50ZXJmYWNlIHR5cGVzLlxuZXhwb3J0IGZ1bmN0aW9uIGlzU2VyaWFsaXphYmxlVHlwZVJlZmVyZW5jZSh0eXBlOiBqc2lpUmVmbGVjdC5UeXBlUmVmZXJlbmNlLCBlcnJvclByZWZpeD86IHN0cmluZyk6IGJvb2xlYW4ge1xuXG4gIGlmICh0eXBlLnByaW1pdGl2ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGUuYXJyYXlPZlR5cGUpIHtcbiAgICByZXR1cm4gaXNTZXJpYWxpemFibGVUeXBlUmVmZXJlbmNlKHR5cGUuYXJyYXlPZlR5cGUsIGVycm9yUHJlZml4KTtcbiAgfVxuXG4gIGlmICh0eXBlLm1hcE9mVHlwZSkge1xuICAgIHJldHVybiBpc1NlcmlhbGl6YWJsZVR5cGVSZWZlcmVuY2UodHlwZS5tYXBPZlR5cGUsIGVycm9yUHJlZml4KTtcbiAgfVxuXG4gIGlmICh0eXBlLnR5cGUpIHtcbiAgICByZXR1cm4gaXNTZXJpYWxpemFibGVUeXBlKHR5cGUudHlwZSwgZXJyb3JQcmVmaXgpO1xuICB9XG5cbiAgaWYgKHR5cGUudW5pb25PZlR5cGVzKSB7XG4gICAgcmV0dXJuIHR5cGUudW5pb25PZlR5cGVzLnNvbWUoeCA9PiBpc1NlcmlhbGl6YWJsZVR5cGVSZWZlcmVuY2UoeCwgZXJyb3JQcmVmaXgpKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTZXJpYWxpemFibGVUeXBlKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGUsIGVycm9yUHJlZml4Pzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIGlmIHRoaXMgaXMgYSBjb3NudHJ1Y3QgY2xhc3MsIHdlIGNhbiByZXByZXNlbnQgaXQgYXMgYSBcIlJlZlwiXG4gIGlmIChpc0NvbnN0cnVjdCh0eXBlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzRW51bSh0eXBlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzU2VyaWFsaXphYmxlSW50ZXJmYWNlKHR5cGUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpZiB0aGlzIGlzIGEgY2xhc3MgdGhhdCBsb29rcyBsaWtlIGFuIGVudW0sIHdlIGNhbiByZXByZXNlbnQgaXRcbiAgaWYgKGlzRW51bUxpa2VDbGFzcyh0eXBlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGFsbEltcGxlbWVudGF0aW9uc09mVHlwZSh0eXBlKS5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoZXJyb3JQcmVmaXgpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yUHJlZml4LCBgJHt0eXBlfSBpcyBub3Qgc2VyaWFsaXphYmxlYCk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NlcmlhbGl6YWJsZUludGVyZmFjZSh0eXBlOiBqc2lpUmVmbGVjdC5UeXBlIHwgdW5kZWZpbmVkLCBlcnJvclByZWZpeD86IHN0cmluZyk6IHR5cGUgaXMganNpaVJlZmxlY3QuSW50ZXJmYWNlVHlwZSB7XG4gIGlmICghdHlwZSB8fCAhKHR5cGUgaW5zdGFuY2VvZiBqc2lpUmVmbGVjdC5JbnRlcmZhY2VUeXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlLmFsbE1ldGhvZHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0eXBlLmFsbFByb3BlcnRpZXMuZXZlcnkocCA9PlxuICAgICAgaXNTZXJpYWxpemFibGVUeXBlUmVmZXJlbmNlKHAudHlwZSwgZXJyb3JQcmVmaXgpXG4gICAgICB8fCBpc0NvbnN0cnVjdChwLnR5cGUpXG4gICAgICB8fCBwLm9wdGlvbmFsKTtcbn1cblxuZnVuY3Rpb24gaXNFbnVtKHR5cGU6IGpzaWlSZWZsZWN0LlR5cGUpOiB0eXBlIGlzIGpzaWlSZWZsZWN0LkVudW1UeXBlIHtcbiAgcmV0dXJuIHR5cGUgaW5zdGFuY2VvZiBqc2lpUmVmbGVjdC5FbnVtVHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRW51bUxpa2VDbGFzcyhjbHM6IGpzaWlSZWZsZWN0LlR5cGUgfCB1bmRlZmluZWQpOiBjbHMgaXMganNpaVJlZmxlY3QuQ2xhc3NUeXBlIHtcbiAgaWYgKCFjbHMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIShjbHMgaW5zdGFuY2VvZiBqc2lpUmVmbGVjdC5DbGFzc1R5cGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBlbnVtTGlrZUNsYXNzTWV0aG9kcyhjbHMpLmxlbmd0aCA+IDBcbiAgICB8fCBlbnVtTGlrZUNsYXNzUHJvcGVydGllcyhjbHMpLmxlbmd0aCA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnVtTGlrZUNsYXNzTWV0aG9kcyhjbHM6IGpzaWlSZWZsZWN0LkNsYXNzVHlwZSkge1xuICByZXR1cm4gY2xzLmFsbE1ldGhvZHMuZmlsdGVyKG0gPT4gbS5zdGF0aWMgJiYgbS5yZXR1cm5zICYmIG0ucmV0dXJucy50eXBlLnR5cGUgJiYgbS5yZXR1cm5zLnR5cGUudHlwZS5leHRlbmRzKGNscykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW51bUxpa2VDbGFzc1Byb3BlcnRpZXMoY2xzOiBqc2lpUmVmbGVjdC5DbGFzc1R5cGUpIHtcbiAgcmV0dXJuIGNscy5hbGxQcm9wZXJ0aWVzLmZpbHRlcihwID0+IHAuc3RhdGljICYmIHAudHlwZS50eXBlICYmIHAudHlwZS50eXBlLmV4dGVuZHMoY2xzKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbnN0cnVjdCh0eXBlT3JUeXBlUmVmOiBqc2lpUmVmbGVjdC5UeXBlUmVmZXJlbmNlIHwganNpaVJlZmxlY3QuVHlwZSk6IGJvb2xlYW4ge1xuICBsZXQgdHlwZToganNpaVJlZmxlY3QuVHlwZTtcblxuICBpZiAodHlwZU9yVHlwZVJlZiBpbnN0YW5jZW9mIGpzaWlSZWZsZWN0LlR5cGUpIHtcbiAgICB0eXBlID0gdHlwZU9yVHlwZVJlZjtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZU9yVHlwZVJlZi5hcnJheU9mVHlwZSkge1xuICAgICAgcmV0dXJuIGlzQ29uc3RydWN0KHR5cGVPclR5cGVSZWYuYXJyYXlPZlR5cGUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlT3JUeXBlUmVmLm1hcE9mVHlwZSkge1xuICAgICAgcmV0dXJuIGlzQ29uc3RydWN0KHR5cGVPclR5cGVSZWYubWFwT2ZUeXBlKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZU9yVHlwZVJlZi51bmlvbk9mVHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlT3JUeXBlUmVmLnVuaW9uT2ZUeXBlcy5zb21lKHggPT4gaXNDb25zdHJ1Y3QoeCkpO1xuICAgIH1cblxuICAgIGlmICh0eXBlT3JUeXBlUmVmLnR5cGUpIHtcbiAgICAgIHR5cGUgPSB0eXBlT3JUeXBlUmVmLnR5cGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBpdCBpcyBhbiBpbnRlcmZhY2UsIGl0IHNob3VsZCBleHRlbmQgY29uc3RydWN0cy5JQ29uc3RydWN0XG4gIGlmICh0eXBlIGluc3RhbmNlb2YganNpaVJlZmxlY3QuSW50ZXJmYWNlVHlwZSkge1xuICAgIGNvbnN0IGNvbnN0cnVjdElmYWNlID0gdHlwZS5zeXN0ZW0uZmluZEZxbignY29uc3RydWN0cy5JQ29uc3RydWN0Jyk7XG4gICAgcmV0dXJuIHR5cGUuZXh0ZW5kcyhjb25zdHJ1Y3RJZmFjZSk7XG4gIH1cblxuICAvLyBpZiBpdCBpcyBhIGNsYXNzLCBpdCBzaG91bGQgZXh0ZW5kIGNvbnN0cnVjdHMuQ29uc3RydWN0XG4gIGlmICh0eXBlIGluc3RhbmNlb2YganNpaVJlZmxlY3QuQ2xhc3NUeXBlKSB7XG4gICAgY29uc3QgY29uc3RydWN0Q2xhc3MgPSB0eXBlLnN5c3RlbS5maW5kRnFuKCdjb25zdHJ1Y3RzLkNvbnN0cnVjdCcpO1xuICAgIHJldHVybiB0eXBlLmV4dGVuZHMoY29uc3RydWN0Q2xhc3MpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBhbGxJbXBsZW1lbnRhdGlvbnNPZlR5cGUodHlwZToganNpaVJlZmxlY3QuVHlwZSkge1xuICBpZiAodHlwZSBpbnN0YW5jZW9mIGpzaWlSZWZsZWN0LkNsYXNzVHlwZSkge1xuICAgIHJldHVybiBhbGxTdWJjbGFzc2VzKHR5cGUpLmZpbHRlcih4ID0+ICF4LmFic3RyYWN0KTtcbiAgfVxuXG4gIGlmICh0eXBlIGluc3RhbmNlb2YganNpaVJlZmxlY3QuSW50ZXJmYWNlVHlwZSkge1xuICAgIHJldHVybiBhbGxJbXBsZW1lbnRhdGlvbnModHlwZSkuZmlsdGVyKHggPT4gIXguYWJzdHJhY3QpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKGBNdXN0IGVpdGhlciBiZSBhIGNsYXNzIG9yIGFuIGludGVyZmFjZWApO1xufVxuXG5mdW5jdGlvbiBhbGxTdWJjbGFzc2VzKGJhc2U6IGpzaWlSZWZsZWN0LkNsYXNzVHlwZSkge1xuICByZXR1cm4gYmFzZS5zeXN0ZW0uY2xhc3Nlcy5maWx0ZXIoeCA9PiB4LmV4dGVuZHMoYmFzZSkpO1xufVxuXG5mdW5jdGlvbiBhbGxJbXBsZW1lbnRhdGlvbnMoYmFzZToganNpaVJlZmxlY3QuSW50ZXJmYWNlVHlwZSkge1xuICByZXR1cm4gYmFzZS5zeXN0ZW0uY2xhc3Nlcy5maWx0ZXIoeCA9PiB4LmdldEludGVyZmFjZXModHJ1ZSkuc29tZShpID0+IGkuZXh0ZW5kcyhiYXNlKSkpO1xufVxuIl19