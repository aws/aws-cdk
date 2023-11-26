"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatErrorInContext = exports.CfnSpecValidator = void 0;
/* eslint-disable no-console */
/**
 * CloudFormation spec validator
 *
 * "Why not JSON Schema?", you might ask, and it's a fair question. The answer is:
 * because the error reporting from JSON schema is pretty bad, and I want the validation
 * errors reported from this check to be blindingly obvious, as non-spec-experts
 * are going to have to consume and understand them.
 *
 * I tried JSON Schema validation and its errors look like:
 *
 * ```
 * - instance.PropertyTypes["..."].Properties.Xyz does not match allOf schema <#/definitions/Typed> with 7 error[s]:
 * - instance.PropertyTypes["..."].Properties.Xyz requires property "PrimitiveType"
 * - instance.PropertyTypes["..."].Properties.Xyz requires property "Type"
 * - instance.PropertyTypes["..."].Properties.Xyz requires property "Type"
 * - instance.PropertyTypes["..."].Properties.Xyz requires property "ItemType"
 * - instance.PropertyTypes["..."].Properties.Xyz requires property "Type"
 * - instance.PropertyTypes["..."].Properties.Xyz requires property "PrimitiveItemType"
 * - instance.PropertyTypes["..."].Properties.Xyz is not exactly one from "Primitive","Complex Type","Collection of Primitives","Collection of Complex Types"
 * ```
 *
 * No bueno. In contrast, this script prints:
 *
 * ```
 * {
 *   "ResourceTypes": {
 *     "AWS::SageMaker::Device": {
 *       "Properties": {
 *         "Device": {
 *
 * !!!       must have exactly one of 'Type', 'PrimitiveType', found: {"Type":"Device","PrimitiveType":"Json"} !!!
 *
 *           "Documentation": "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sagemaker-device.html#cfn-sagemaker-device-device",
 *           "UpdateType": "Mutable",
 *           "Required": false,
 *           "PrimitiveType": "Json",
 *           "Type": "Device"
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
const fs = require("fs-extra");
class CfnSpecValidator {
    static validate(spec) {
        const ret = new CfnSpecValidator(spec);
        ret.validateSpec();
        return ret.errors;
    }
    constructor(spec) {
        this.errors = new Array();
        this.root = JsonValue.of(spec);
    }
    validateSpec() {
        this.assert(this.root.get('PropertyTypes'), isObject, (propTypes) => {
            this.validateMap(propTypes, (propType) => this.validatePropertyType(propType));
        });
        this.assert(this.root.get('ResourceTypes'), isObject, (resTypes) => {
            this.validateMap(resTypes, (propType) => this.validateResourceType(propType));
        });
    }
    /**
     * Property types are extremely weird
     *
     * Nominally, they define "records" that have a `Properties` field with the defined
     * properties.
     *
     * However, they are also commonly used as aliases for other types, meaning they have
     * the same type-indicating fields as individual property *fields* would have.
     *
     * Also also, it seems to be quite common to have them empty--have no fields at all.
     * This seems to be taken as an alias for an unstructured `Json` type. It's probably
     * just a mistake, but unfortunately a mistake that S3 is participating in, so if we
     * fail on that we won't be able to consume updates to S3's schema. Our codegen is
     * ready to deal with this and just renders it to an empty struct.
     */
    validatePropertyType(propType) {
        // If the only set of properties is "Documentation", we take this to be an alias
        // for an empty struct and allow it. I feel icky allowing this, but it seems to
        // be pragmatic for now.
        if (Object.keys(propType.value).join(',') === 'Documentation') {
            return;
        }
        const properties = propType.get('Properties');
        if (properties.hasValue) {
            this.assert(properties, isObject, (props) => {
                this.validateProperties(props);
            });
        }
        else {
            this.validateType(propType, 'if a property type doesn\'t have "Properties", it ');
        }
    }
    validateResourceType(resType) {
        this.assertOptional(resType.get('Properties'), isObject, (props) => {
            this.validateProperties(props);
        });
        this.assertOptional(resType.get('Attributes'), isObject, (attrs) => {
            this.validateMap(attrs, attr => {
                this.validateType(attr);
            });
        });
    }
    validateProperties(properties) {
        this.validateMap(properties, prop => {
            this.validateType(prop);
            this.assertOptional(prop.get('UpdateType'), (x) => {
                if (!['Mutable', 'Immutable', 'Conditional'].includes(x)) {
                    throw new Error(`invalid value for enum: '${x}'`);
                }
            });
        });
    }
    /**
     * Validate the type
     *
     * There must be:
     * - Either Type or PrimitiveType
     * - Only if Type is List or Map, there will be either an ItemType or a PrimitiveItemType
     * - Non-primitive Types must correspond to a property type
     */
    validateType(typedObject, errorPrefix = '') {
        const type = typedObject.get('Type');
        const primitiveType = typedObject.get('PrimitiveType');
        if (type.hasValue === primitiveType.hasValue) {
            this.report(typedObject, `${errorPrefix}must have exactly one of 'Type', 'PrimitiveType', found: ${JSON.stringify({
                Type: type.valueOrUndefined,
                PrimitiveType: primitiveType.valueOrUndefined,
            })}`);
        }
        this.assertOptional(primitiveType, isValidPrimitive);
        let isCollectionType = false;
        const itemType = typedObject.get('ItemType');
        const primitiveItemType = typedObject.get('PrimitiveItemType');
        if (type.hasValue) {
            isCollectionType = COLLECTION_TYPES.includes(type.value);
            if (isCollectionType) {
                if (itemType.hasValue === primitiveItemType.hasValue) {
                    this.report(typedObject, `must have exactly one of 'ItemType', 'PrimitiveItemType', found: ${JSON.stringify({
                        ItemType: itemType.valueOrUndefined,
                        PrimitiveItemType: primitiveItemType.valueOrUndefined,
                    })}`);
                }
                this.assertOptional(primitiveItemType, isValidPrimitive);
                if (itemType.hasValue) {
                    this.assertValidPropertyTypeReference(itemType);
                }
            }
            else {
                this.assertValidPropertyTypeReference(type);
            }
        }
        if (!isCollectionType) {
            if (itemType.hasValue || primitiveItemType.hasValue) {
                this.report(typedObject, 'only \'List\' or \'Map\' types can have \'ItemType\', \'PrimitiveItemType\'');
            }
        }
        const dupes = typedObject.get('DuplicatesAllowed');
        if (dupes.hasValue && !isCollectionType) {
            this.report(dupes, 'occurs on non-collection type');
        }
    }
    assertValidPropertyTypeReference(typeName) {
        if (BUILTIN_COMPLEX_TYPES.includes(typeName.value)) {
            return;
        }
        const cfnName = typeName.path[1]; // AWS::Xyz::Resource[.Property]
        const namespace = cfnName.split('.')[0];
        const propTypeName = `${namespace}.${typeName.value}`;
        if (!this.root.get('PropertyTypes').get(propTypeName).hasValue) {
            this.report(typeName, `unknown property type name '${typeName.value}' (missing definition for '${propTypeName}')`);
        }
    }
    assertOptional(x, pred, block) {
        return x.hasValue ? this.assert(x, pred, block) : true;
    }
    assert(x, pred, block) {
        try {
            pred(x.value);
            if (block) {
                block(new JsonValue(x.value, x.path));
            }
            return true;
        }
        catch (e) {
            this.report(x, e.message);
            return false;
        }
    }
    validateMap(x, block) {
        for (const key in x.value) {
            block(x.get(key));
        }
    }
    report(value, message) {
        this.errors.push({ value, message });
    }
}
exports.CfnSpecValidator = CfnSpecValidator;
function isObject(x) {
    if (x == null || typeof x !== 'object' || Array.isArray(x)) {
        throw new Error(`expected object, found '${x}'`);
    }
}
const COLLECTION_TYPES = ['List', 'Map'];
const BUILTIN_COMPLEX_TYPES = ['Tag'];
function isValidPrimitive(x) {
    const primitives = ['String', 'Long', 'Integer', 'Double', 'Boolean', 'Timestamp', 'Json'];
    if (!primitives.includes(x)) {
        throw new Error(`must be one of ${primitives.join(', ')}, got: ${x}`);
    }
}
class JsonValue {
    static of(x) {
        return new JsonValue(x, []);
    }
    constructor(value, path) {
        this.value = value;
        this.path = path;
        this.hasValue = true;
        this.valueOrUndefined = this.value;
        this.pathValue = this.value;
    }
    get(k) {
        if (!this.value || typeof this.value !== 'object' || Array.isArray(this.value)) {
            return new ErrorValue(`expected object, found ${this.value}`, this.path, this.value);
        }
        const ret = this.value[k];
        if (ret === undefined) {
            return new ErrorValue(`missing required key '${String(k)}'`, this.path, this.value);
        }
        return new JsonValue(ret, [...this.path, `${String(k)}`]);
    }
}
class ErrorValue {
    constructor(error, path, pathValue) {
        this.error = error;
        this.path = path;
        this.pathValue = pathValue;
        this.hasValue = false;
        this.valueOrUndefined = undefined;
    }
    get(_k) {
        return this;
    }
    get value() {
        throw new Error(this.error);
    }
}
function formatErrorInContext(error) {
    let reportValue = error.value.pathValue;
    for (let i = error.value.path.length; i > 0; i--) {
        reportValue = { [error.value.path[i - 1]]: reportValue };
    }
    const formattedLines = JSON.stringify(reportValue, undefined, 2).split('\n');
    const indent = 2 * (error.value.path.length + 1);
    // Insert the error message at line N with an appropriate indent
    formattedLines.splice(error.value.path.length + 1, 0, `\n!!!${' '.repeat(indent - 3)}${error.message} !!!\n`);
    return formattedLines.join('\n');
}
exports.formatErrorInContext = formatErrorInContext;
async function main(args) {
    const spec = await fs.readJson(args[0]);
    const errors = CfnSpecValidator.validate(spec);
    if (errors.length !== 0) {
        for (const error of errors) {
            console.error(formatErrorInContext(error));
        }
        process.exitCode = 1;
    }
}
if (require.main === module) {
    main(process.argv.slice(2)).catch(e => {
        process.exitCode = 1;
        // eslint-disable-next-line no-console
        console.error(e.message);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtY2ZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdGUtY2ZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJDRztBQUNILCtCQUErQjtBQWEvQixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQWE7UUFDbEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7SUFLRCxZQUFZLElBQWE7UUFIVCxXQUFNLEdBQUcsSUFBSSxLQUFLLEVBQW1CLENBQUM7UUFJcEQsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxZQUFZO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNqRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixD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b250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8qKlxuICogQ2xvdWRGb3JtYXRpb24gc3BlYyB2YWxpZGF0b3JcbiAqXG4gKiBcIldoeSBub3QgSlNPTiBTY2hlbWE/XCIsIHlvdSBtaWdodCBhc2ssIGFuZCBpdCdzIGEgZmFpciBxdWVzdGlvbi4gVGhlIGFuc3dlciBpczpcbiAqIGJlY2F1c2UgdGhlIGVycm9yIHJlcG9ydGluZyBmcm9tIEpTT04gc2NoZW1hIGlzIHByZXR0eSBiYWQsIGFuZCBJIHdhbnQgdGhlIHZhbGlkYXRpb25cbiAqIGVycm9ycyByZXBvcnRlZCBmcm9tIHRoaXMgY2hlY2sgdG8gYmUgYmxpbmRpbmdseSBvYnZpb3VzLCBhcyBub24tc3BlYy1leHBlcnRzXG4gKiBhcmUgZ29pbmcgdG8gaGF2ZSB0byBjb25zdW1lIGFuZCB1bmRlcnN0YW5kIHRoZW0uXG4gKlxuICogSSB0cmllZCBKU09OIFNjaGVtYSB2YWxpZGF0aW9uIGFuZCBpdHMgZXJyb3JzIGxvb2sgbGlrZTpcbiAqXG4gKiBgYGBcbiAqIC0gaW5zdGFuY2UuUHJvcGVydHlUeXBlc1tcIi4uLlwiXS5Qcm9wZXJ0aWVzLlh5eiBkb2VzIG5vdCBtYXRjaCBhbGxPZiBzY2hlbWEgPCMvZGVmaW5pdGlvbnMvVHlwZWQ+IHdpdGggNyBlcnJvcltzXTpcbiAqIC0gaW5zdGFuY2UuUHJvcGVydHlUeXBlc1tcIi4uLlwiXS5Qcm9wZXJ0aWVzLlh5eiByZXF1aXJlcyBwcm9wZXJ0eSBcIlByaW1pdGl2ZVR5cGVcIlxuICogLSBpbnN0YW5jZS5Qcm9wZXJ0eVR5cGVzW1wiLi4uXCJdLlByb3BlcnRpZXMuWHl6IHJlcXVpcmVzIHByb3BlcnR5IFwiVHlwZVwiXG4gKiAtIGluc3RhbmNlLlByb3BlcnR5VHlwZXNbXCIuLi5cIl0uUHJvcGVydGllcy5YeXogcmVxdWlyZXMgcHJvcGVydHkgXCJUeXBlXCJcbiAqIC0gaW5zdGFuY2UuUHJvcGVydHlUeXBlc1tcIi4uLlwiXS5Qcm9wZXJ0aWVzLlh5eiByZXF1aXJlcyBwcm9wZXJ0eSBcIkl0ZW1UeXBlXCJcbiAqIC0gaW5zdGFuY2UuUHJvcGVydHlUeXBlc1tcIi4uLlwiXS5Qcm9wZXJ0aWVzLlh5eiByZXF1aXJlcyBwcm9wZXJ0eSBcIlR5cGVcIlxuICogLSBpbnN0YW5jZS5Qcm9wZXJ0eVR5cGVzW1wiLi4uXCJdLlByb3BlcnRpZXMuWHl6IHJlcXVpcmVzIHByb3BlcnR5IFwiUHJpbWl0aXZlSXRlbVR5cGVcIlxuICogLSBpbnN0YW5jZS5Qcm9wZXJ0eVR5cGVzW1wiLi4uXCJdLlByb3BlcnRpZXMuWHl6IGlzIG5vdCBleGFjdGx5IG9uZSBmcm9tIFwiUHJpbWl0aXZlXCIsXCJDb21wbGV4IFR5cGVcIixcIkNvbGxlY3Rpb24gb2YgUHJpbWl0aXZlc1wiLFwiQ29sbGVjdGlvbiBvZiBDb21wbGV4IFR5cGVzXCJcbiAqIGBgYFxuICpcbiAqIE5vIGJ1ZW5vLiBJbiBjb250cmFzdCwgdGhpcyBzY3JpcHQgcHJpbnRzOlxuICpcbiAqIGBgYFxuICoge1xuICogICBcIlJlc291cmNlVHlwZXNcIjoge1xuICogICAgIFwiQVdTOjpTYWdlTWFrZXI6OkRldmljZVwiOiB7XG4gKiAgICAgICBcIlByb3BlcnRpZXNcIjoge1xuICogICAgICAgICBcIkRldmljZVwiOiB7XG4gKlxuICogISEhICAgICAgIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBvZiAnVHlwZScsICdQcmltaXRpdmVUeXBlJywgZm91bmQ6IHtcIlR5cGVcIjpcIkRldmljZVwiLFwiUHJpbWl0aXZlVHlwZVwiOlwiSnNvblwifSAhISFcbiAqXG4gKiAgICAgICAgICAgXCJEb2N1bWVudGF0aW9uXCI6IFwiaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc2FnZW1ha2VyLWRldmljZS5odG1sI2Nmbi1zYWdlbWFrZXItZGV2aWNlLWRldmljZVwiLFxuICogICAgICAgICAgIFwiVXBkYXRlVHlwZVwiOiBcIk11dGFibGVcIixcbiAqICAgICAgICAgICBcIlJlcXVpcmVkXCI6IGZhbHNlLFxuICogICAgICAgICAgIFwiUHJpbWl0aXZlVHlwZVwiOiBcIkpzb25cIixcbiAqICAgICAgICAgICBcIlR5cGVcIjogXCJEZXZpY2VcIlxuICogICAgICAgICB9XG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENmblNwZWMge1xuICBQcm9wZXJ0eVR5cGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBSZXNvdXJjZVR5cGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBSZXNvdXJjZVNwZWNpZmljYXRpb25WZXJzaW9uOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdGlvbkVycm9yIHtcbiAgcmVhZG9ubHkgdmFsdWU6IEpzb25WYWx1ZTxhbnk+O1xuICByZWFkb25seSBtZXNzYWdlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBDZm5TcGVjVmFsaWRhdG9yIHtcbiAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZShzcGVjOiBDZm5TcGVjKSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IENmblNwZWNWYWxpZGF0b3Ioc3BlYyk7XG4gICAgcmV0LnZhbGlkYXRlU3BlYygpO1xuICAgIHJldHVybiByZXQuZXJyb3JzO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVycm9ycyA9IG5ldyBBcnJheTxWYWxpZGF0aW9uRXJyb3I+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgcm9vdDogSnNvblZhbHVlPENmblNwZWM+O1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IENmblNwZWMpIHtcbiAgICB0aGlzLnJvb3QgPSBKc29uVmFsdWUub2Yoc3BlYyk7XG4gIH1cblxuICBwdWJsaWMgdmFsaWRhdGVTcGVjKCkge1xuICAgIHRoaXMuYXNzZXJ0KHRoaXMucm9vdC5nZXQoJ1Byb3BlcnR5VHlwZXMnKSwgaXNPYmplY3QsIChwcm9wVHlwZXMpID0+IHtcbiAgICAgIHRoaXMudmFsaWRhdGVNYXAocHJvcFR5cGVzLCAocHJvcFR5cGUpID0+IHRoaXMudmFsaWRhdGVQcm9wZXJ0eVR5cGUocHJvcFR5cGUpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXJ0KHRoaXMucm9vdC5nZXQoJ1Jlc291cmNlVHlwZXMnKSwgaXNPYmplY3QsIChyZXNUeXBlcykgPT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZU1hcChyZXNUeXBlcywgKHByb3BUeXBlKSA9PiB0aGlzLnZhbGlkYXRlUmVzb3VyY2VUeXBlKHByb3BUeXBlKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGVydHkgdHlwZXMgYXJlIGV4dHJlbWVseSB3ZWlyZFxuICAgKlxuICAgKiBOb21pbmFsbHksIHRoZXkgZGVmaW5lIFwicmVjb3Jkc1wiIHRoYXQgaGF2ZSBhIGBQcm9wZXJ0aWVzYCBmaWVsZCB3aXRoIHRoZSBkZWZpbmVkXG4gICAqIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEhvd2V2ZXIsIHRoZXkgYXJlIGFsc28gY29tbW9ubHkgdXNlZCBhcyBhbGlhc2VzIGZvciBvdGhlciB0eXBlcywgbWVhbmluZyB0aGV5IGhhdmVcbiAgICogdGhlIHNhbWUgdHlwZS1pbmRpY2F0aW5nIGZpZWxkcyBhcyBpbmRpdmlkdWFsIHByb3BlcnR5ICpmaWVsZHMqIHdvdWxkIGhhdmUuXG4gICAqXG4gICAqIEFsc28gYWxzbywgaXQgc2VlbXMgdG8gYmUgcXVpdGUgY29tbW9uIHRvIGhhdmUgdGhlbSBlbXB0eS0taGF2ZSBubyBmaWVsZHMgYXQgYWxsLlxuICAgKiBUaGlzIHNlZW1zIHRvIGJlIHRha2VuIGFzIGFuIGFsaWFzIGZvciBhbiB1bnN0cnVjdHVyZWQgYEpzb25gIHR5cGUuIEl0J3MgcHJvYmFibHlcbiAgICoganVzdCBhIG1pc3Rha2UsIGJ1dCB1bmZvcnR1bmF0ZWx5IGEgbWlzdGFrZSB0aGF0IFMzIGlzIHBhcnRpY2lwYXRpbmcgaW4sIHNvIGlmIHdlXG4gICAqIGZhaWwgb24gdGhhdCB3ZSB3b24ndCBiZSBhYmxlIHRvIGNvbnN1bWUgdXBkYXRlcyB0byBTMydzIHNjaGVtYS4gT3VyIGNvZGVnZW4gaXNcbiAgICogcmVhZHkgdG8gZGVhbCB3aXRoIHRoaXMgYW5kIGp1c3QgcmVuZGVycyBpdCB0byBhbiBlbXB0eSBzdHJ1Y3QuXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlUHJvcGVydHlUeXBlKHByb3BUeXBlOiBKc29uVmFsdWU8UmVjb3JkPHN0cmluZywgYW55Pj4pIHtcbiAgICAvLyBJZiB0aGUgb25seSBzZXQgb2YgcHJvcGVydGllcyBpcyBcIkRvY3VtZW50YXRpb25cIiwgd2UgdGFrZSB0aGlzIHRvIGJlIGFuIGFsaWFzXG4gICAgLy8gZm9yIGFuIGVtcHR5IHN0cnVjdCBhbmQgYWxsb3cgaXQuIEkgZmVlbCBpY2t5IGFsbG93aW5nIHRoaXMsIGJ1dCBpdCBzZWVtcyB0b1xuICAgIC8vIGJlIHByYWdtYXRpYyBmb3Igbm93LlxuICAgIGlmIChPYmplY3Qua2V5cyhwcm9wVHlwZS52YWx1ZSkuam9pbignLCcpID09PSAnRG9jdW1lbnRhdGlvbicpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJvcFR5cGUuZ2V0KCdQcm9wZXJ0aWVzJyk7XG4gICAgaWYgKHByb3BlcnRpZXMuaGFzVmFsdWUpIHtcbiAgICAgIHRoaXMuYXNzZXJ0KHByb3BlcnRpZXMsIGlzT2JqZWN0LCAocHJvcHMpID0+IHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVByb3BlcnRpZXMocHJvcHMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsaWRhdGVUeXBlKHByb3BUeXBlLCAnaWYgYSBwcm9wZXJ0eSB0eXBlIGRvZXNuXFwndCBoYXZlIFwiUHJvcGVydGllc1wiLCBpdCAnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUmVzb3VyY2VUeXBlKHJlc1R5cGU6IEpzb25WYWx1ZTxhbnk+KSB7XG4gICAgdGhpcy5hc3NlcnRPcHRpb25hbChyZXNUeXBlLmdldCgnUHJvcGVydGllcycpLCBpc09iamVjdCwgKHByb3BzKSA9PiB7XG4gICAgICB0aGlzLnZhbGlkYXRlUHJvcGVydGllcyhwcm9wcyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmFzc2VydE9wdGlvbmFsKHJlc1R5cGUuZ2V0KCdBdHRyaWJ1dGVzJyksIGlzT2JqZWN0LCAoYXR0cnMpID0+IHtcbiAgICAgIHRoaXMudmFsaWRhdGVNYXAoYXR0cnMsIGF0dHIgPT4ge1xuICAgICAgICB0aGlzLnZhbGlkYXRlVHlwZShhdHRyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVByb3BlcnRpZXMocHJvcGVydGllczogSnNvblZhbHVlPFJlY29yZDxzdHJpbmcsIGFueT4+KSB7XG4gICAgdGhpcy52YWxpZGF0ZU1hcChwcm9wZXJ0aWVzLCBwcm9wID0+IHtcbiAgICAgIHRoaXMudmFsaWRhdGVUeXBlKHByb3ApO1xuXG4gICAgICB0aGlzLmFzc2VydE9wdGlvbmFsKHByb3AuZ2V0KCdVcGRhdGVUeXBlJyksICh4OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCFbJ011dGFibGUnLCAnSW1tdXRhYmxlJywgJ0NvbmRpdGlvbmFsJ10uaW5jbHVkZXMoeCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgdmFsdWUgZm9yIGVudW06ICcke3h9J2ApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGUgdHlwZVxuICAgKlxuICAgKiBUaGVyZSBtdXN0IGJlOlxuICAgKiAtIEVpdGhlciBUeXBlIG9yIFByaW1pdGl2ZVR5cGVcbiAgICogLSBPbmx5IGlmIFR5cGUgaXMgTGlzdCBvciBNYXAsIHRoZXJlIHdpbGwgYmUgZWl0aGVyIGFuIEl0ZW1UeXBlIG9yIGEgUHJpbWl0aXZlSXRlbVR5cGVcbiAgICogLSBOb24tcHJpbWl0aXZlIFR5cGVzIG11c3QgY29ycmVzcG9uZCB0byBhIHByb3BlcnR5IHR5cGVcbiAgICovXG4gIHByaXZhdGUgdmFsaWRhdGVUeXBlKHR5cGVkT2JqZWN0OiBKc29uVmFsdWU8UmVjb3JkPHN0cmluZywgYW55Pj4sIGVycm9yUHJlZml4ID0gJycpIHtcbiAgICBjb25zdCB0eXBlID0gdHlwZWRPYmplY3QuZ2V0KCdUeXBlJyk7XG4gICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IHR5cGVkT2JqZWN0LmdldCgnUHJpbWl0aXZlVHlwZScpO1xuXG4gICAgaWYgKHR5cGUuaGFzVmFsdWUgPT09IHByaW1pdGl2ZVR5cGUuaGFzVmFsdWUpIHtcbiAgICAgIHRoaXMucmVwb3J0KHR5cGVkT2JqZWN0LCBgJHtlcnJvclByZWZpeH1tdXN0IGhhdmUgZXhhY3RseSBvbmUgb2YgJ1R5cGUnLCAnUHJpbWl0aXZlVHlwZScsIGZvdW5kOiAke0pTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgVHlwZTogdHlwZS52YWx1ZU9yVW5kZWZpbmVkLFxuICAgICAgICBQcmltaXRpdmVUeXBlOiBwcmltaXRpdmVUeXBlLnZhbHVlT3JVbmRlZmluZWQsXG4gICAgICB9KX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLmFzc2VydE9wdGlvbmFsKHByaW1pdGl2ZVR5cGUsIGlzVmFsaWRQcmltaXRpdmUpO1xuXG4gICAgbGV0IGlzQ29sbGVjdGlvblR5cGUgPSBmYWxzZTtcbiAgICBjb25zdCBpdGVtVHlwZSA9IHR5cGVkT2JqZWN0LmdldCgnSXRlbVR5cGUnKTtcbiAgICBjb25zdCBwcmltaXRpdmVJdGVtVHlwZSA9IHR5cGVkT2JqZWN0LmdldCgnUHJpbWl0aXZlSXRlbVR5cGUnKTtcblxuICAgIGlmICh0eXBlLmhhc1ZhbHVlKSB7XG4gICAgICBpc0NvbGxlY3Rpb25UeXBlID0gQ09MTEVDVElPTl9UWVBFUy5pbmNsdWRlcyh0eXBlLnZhbHVlKTtcbiAgICAgIGlmIChpc0NvbGxlY3Rpb25UeXBlKSB7XG4gICAgICAgIGlmIChpdGVtVHlwZS5oYXNWYWx1ZSA9PT0gcHJpbWl0aXZlSXRlbVR5cGUuaGFzVmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnJlcG9ydCh0eXBlZE9iamVjdCwgYG11c3QgaGF2ZSBleGFjdGx5IG9uZSBvZiAnSXRlbVR5cGUnLCAnUHJpbWl0aXZlSXRlbVR5cGUnLCBmb3VuZDogJHtKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBJdGVtVHlwZTogaXRlbVR5cGUudmFsdWVPclVuZGVmaW5lZCxcbiAgICAgICAgICAgIFByaW1pdGl2ZUl0ZW1UeXBlOiBwcmltaXRpdmVJdGVtVHlwZS52YWx1ZU9yVW5kZWZpbmVkLFxuICAgICAgICAgIH0pfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hc3NlcnRPcHRpb25hbChwcmltaXRpdmVJdGVtVHlwZSwgaXNWYWxpZFByaW1pdGl2ZSk7XG4gICAgICAgIGlmIChpdGVtVHlwZS5oYXNWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuYXNzZXJ0VmFsaWRQcm9wZXJ0eVR5cGVSZWZlcmVuY2UoaXRlbVR5cGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFzc2VydFZhbGlkUHJvcGVydHlUeXBlUmVmZXJlbmNlKHR5cGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNDb2xsZWN0aW9uVHlwZSkge1xuICAgICAgaWYgKGl0ZW1UeXBlLmhhc1ZhbHVlIHx8IHByaW1pdGl2ZUl0ZW1UeXBlLmhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMucmVwb3J0KHR5cGVkT2JqZWN0LCAnb25seSBcXCdMaXN0XFwnIG9yIFxcJ01hcFxcJyB0eXBlcyBjYW4gaGF2ZSBcXCdJdGVtVHlwZVxcJywgXFwnUHJpbWl0aXZlSXRlbVR5cGVcXCcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkdXBlcyA9IHR5cGVkT2JqZWN0LmdldCgnRHVwbGljYXRlc0FsbG93ZWQnKTtcbiAgICBpZiAoZHVwZXMuaGFzVmFsdWUgJiYgIWlzQ29sbGVjdGlvblR5cGUpIHtcbiAgICAgIHRoaXMucmVwb3J0KGR1cGVzLCAnb2NjdXJzIG9uIG5vbi1jb2xsZWN0aW9uIHR5cGUnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzc2VydFZhbGlkUHJvcGVydHlUeXBlUmVmZXJlbmNlKHR5cGVOYW1lOiBKc29uVmFsdWU8c3RyaW5nPikge1xuICAgIGlmIChCVUlMVElOX0NPTVBMRVhfVFlQRVMuaW5jbHVkZXModHlwZU5hbWUudmFsdWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2ZuTmFtZSA9IHR5cGVOYW1lLnBhdGhbMV07IC8vIEFXUzo6WHl6OjpSZXNvdXJjZVsuUHJvcGVydHldXG4gICAgY29uc3QgbmFtZXNwYWNlID0gY2ZuTmFtZS5zcGxpdCgnLicpWzBdO1xuXG4gICAgY29uc3QgcHJvcFR5cGVOYW1lID0gYCR7bmFtZXNwYWNlfS4ke3R5cGVOYW1lLnZhbHVlfWA7XG4gICAgaWYgKCF0aGlzLnJvb3QuZ2V0KCdQcm9wZXJ0eVR5cGVzJykuZ2V0KHByb3BUeXBlTmFtZSkuaGFzVmFsdWUpIHtcbiAgICAgIHRoaXMucmVwb3J0KHR5cGVOYW1lLCBgdW5rbm93biBwcm9wZXJ0eSB0eXBlIG5hbWUgJyR7dHlwZU5hbWUudmFsdWV9JyAobWlzc2luZyBkZWZpbml0aW9uIGZvciAnJHtwcm9wVHlwZU5hbWV9JylgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzc2VydE9wdGlvbmFsPEEsIEIgZXh0ZW5kcyBBPih4OiBKc29uVmFsdWU8QT4sIHByZWQ6ICh4OiBBKSA9PiBhc3NlcnRzIHggaXMgQiwgYmxvY2s/OiAoeDogSnNvblZhbHVlPEI+KSA9PiB2b2lkKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHguaGFzVmFsdWUgPyB0aGlzLmFzc2VydCh4LCBwcmVkLCBibG9jaykgOiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnQ8QSwgQiBleHRlbmRzIEE+KHg6IEpzb25WYWx1ZTxBPiwgcHJlZDogKHg6IEEpID0+IGFzc2VydHMgeCBpcyBCLCBibG9jaz86ICh4OiBKc29uVmFsdWU8Qj4pID0+IHZvaWQpOiBib29sZWFuIHtcbiAgICB0cnkge1xuICAgICAgcHJlZCh4LnZhbHVlKTtcbiAgICAgIGlmIChibG9jaykge1xuICAgICAgICBibG9jayhuZXcgSnNvblZhbHVlKHgudmFsdWUsIHgucGF0aCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICB0aGlzLnJlcG9ydCh4LCBlLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVNYXA8QT4oeDogSnNvblZhbHVlPFJlY29yZDxzdHJpbmcsIEE+PiwgYmxvY2s6ICh4OiBKc29uVmFsdWU8QT4pID0+IHZvaWQpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB4LnZhbHVlKSB7XG4gICAgICBibG9jayh4LmdldChrZXkpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlcG9ydCh2YWx1ZTogSnNvblZhbHVlPGFueT4sIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIHRoaXMuZXJyb3JzLnB1c2goeyB2YWx1ZSwgbWVzc2FnZSB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc09iamVjdCh4OiBhbnkpOiBhc3NlcnRzIHggaXMgUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIGlmICh4ID09IG51bGwgfHwgdHlwZW9mIHggIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkIG9iamVjdCwgZm91bmQgJyR7eH0nYCk7XG4gIH1cbn1cblxuY29uc3QgQ09MTEVDVElPTl9UWVBFUyA9IFsnTGlzdCcsICdNYXAnXTtcbmNvbnN0IEJVSUxUSU5fQ09NUExFWF9UWVBFUyA9IFsnVGFnJ107XG5cbmZ1bmN0aW9uIGlzVmFsaWRQcmltaXRpdmUoeDogYW55KTogYXNzZXJ0cyB4IGlzIHN0cmluZyB7XG4gIGNvbnN0IHByaW1pdGl2ZXMgPSBbJ1N0cmluZycsICdMb25nJywgJ0ludGVnZXInLCAnRG91YmxlJywgJ0Jvb2xlYW4nLCAnVGltZXN0YW1wJywgJ0pzb24nXTtcblxuICBpZiAoIXByaW1pdGl2ZXMuaW5jbHVkZXMoeCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG11c3QgYmUgb25lIG9mICR7cHJpbWl0aXZlcy5qb2luKCcsICcpfSwgZ290OiAke3h9YCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIEpzb25WYWx1ZTxBPiB7XG4gIHJlYWRvbmx5IHBhdGg6IHN0cmluZ1tdO1xuICByZWFkb25seSBwYXRoVmFsdWU6IGFueTtcbiAgcmVhZG9ubHkgaGFzVmFsdWU6IGJvb2xlYW47XG4gIHJlYWRvbmx5IHZhbHVlOiBBO1xuICByZWFkb25seSB2YWx1ZU9yVW5kZWZpbmVkOiBBIHwgdW5kZWZpbmVkO1xuICBnZXQ8SyBleHRlbmRzIGtleW9mIEE+KGs6IEspOiBKc29uVmFsdWU8QVtLXT47XG59XG5cbmNsYXNzIEpzb25WYWx1ZTxBPiBpbXBsZW1lbnRzIEpzb25WYWx1ZTxBPiB7XG4gIHB1YmxpYyBzdGF0aWMgb2Y8Qj4oeDogQik6IEpzb25WYWx1ZTxCPiB7XG4gICAgcmV0dXJuIG5ldyBKc29uVmFsdWUoeCwgW10pO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGhhc1ZhbHVlOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlT3JVbmRlZmluZWQ6IEEgfCB1bmRlZmluZWQgPSB0aGlzLnZhbHVlO1xuICBwdWJsaWMgcmVhZG9ubHkgcGF0aFZhbHVlOiBhbnkgPSB0aGlzLnZhbHVlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTogQSwgcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZ1tdKSB7XG4gIH1cblxuICBwdWJsaWMgZ2V0PEsgZXh0ZW5kcyBrZXlvZiBBPihrOiBLKTogSnNvblZhbHVlPEFbS10+IHtcbiAgICBpZiAoIXRoaXMudmFsdWUgfHwgdHlwZW9mIHRoaXMudmFsdWUgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkodGhpcy52YWx1ZSkpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3JWYWx1ZShgZXhwZWN0ZWQgb2JqZWN0LCBmb3VuZCAke3RoaXMudmFsdWV9YCwgdGhpcy5wYXRoLCB0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gdGhpcy52YWx1ZVtrXTtcbiAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3JWYWx1ZShgbWlzc2luZyByZXF1aXJlZCBrZXkgJyR7U3RyaW5nKGspfSdgLCB0aGlzLnBhdGgsIHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEpzb25WYWx1ZShyZXQsIFsuLi50aGlzLnBhdGgsIGAke1N0cmluZyhrKX1gXSk7XG4gIH1cbn1cblxuY2xhc3MgRXJyb3JWYWx1ZTxBPiBpbXBsZW1lbnRzIEpzb25WYWx1ZTxBPiB7XG4gIHB1YmxpYyByZWFkb25seSBoYXNWYWx1ZSA9IGZhbHNlO1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWVPclVuZGVmaW5lZDogQSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVycm9yOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmdbXSwgcHVibGljIHJlYWRvbmx5IHBhdGhWYWx1ZTogYW55KSB7XG4gIH1cblxuICBwdWJsaWMgZ2V0PEsgZXh0ZW5kcyBrZXlvZiBBPihfazogSyk6IEpzb25WYWx1ZTxBW0tdPiB7XG4gICAgcmV0dXJuIHRoaXMgYXMgYW55O1xuICB9XG5cbiAgcHVibGljIGdldCB2YWx1ZSgpOiBBIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5lcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEVycm9ySW5Db250ZXh0KGVycm9yOiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgbGV0IHJlcG9ydFZhbHVlID0gZXJyb3IudmFsdWUucGF0aFZhbHVlO1xuICBmb3IgKGxldCBpID0gZXJyb3IudmFsdWUucGF0aC5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICByZXBvcnRWYWx1ZSA9IHsgW2Vycm9yLnZhbHVlLnBhdGhbaSAtIDFdXTogcmVwb3J0VmFsdWUgfTtcbiAgfVxuXG4gIGNvbnN0IGZvcm1hdHRlZExpbmVzID0gSlNPTi5zdHJpbmdpZnkocmVwb3J0VmFsdWUsIHVuZGVmaW5lZCwgMikuc3BsaXQoJ1xcbicpO1xuXG4gIGNvbnN0IGluZGVudCA9IDIgKiAoZXJyb3IudmFsdWUucGF0aC5sZW5ndGggKyAxKTtcblxuICAvLyBJbnNlcnQgdGhlIGVycm9yIG1lc3NhZ2UgYXQgbGluZSBOIHdpdGggYW4gYXBwcm9wcmlhdGUgaW5kZW50XG4gIGZvcm1hdHRlZExpbmVzLnNwbGljZShlcnJvci52YWx1ZS5wYXRoLmxlbmd0aCArIDEsIDAsIGBcXG4hISEkeycgJy5yZXBlYXQoaW5kZW50IC0gMyl9JHtlcnJvci5tZXNzYWdlfSAhISFcXG5gKTtcblxuICByZXR1cm4gZm9ybWF0dGVkTGluZXMuam9pbignXFxuJyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oYXJnczogc3RyaW5nW10pIHtcbiAgY29uc3Qgc3BlYyA9IGF3YWl0IGZzLnJlYWRKc29uKGFyZ3NbMF0pO1xuICBjb25zdCBlcnJvcnMgPSBDZm5TcGVjVmFsaWRhdG9yLnZhbGlkYXRlKHNwZWMpO1xuICBpZiAoZXJyb3JzLmxlbmd0aCAhPT0gMCkge1xuICAgIGZvciAoY29uc3QgZXJyb3Igb2YgZXJyb3JzKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGZvcm1hdEVycm9ySW5Db250ZXh0KGVycm9yKSk7XG4gICAgfVxuICAgIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xuICB9XG59XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBtYWluKHByb2Nlc3MuYXJndi5zbGljZSgyKSkuY2F0Y2goZSA9PiB7XG4gICAgcHJvY2Vzcy5leGl0Q29kZSA9IDE7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSk7XG4gIH0pO1xufVxuIl19