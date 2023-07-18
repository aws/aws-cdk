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
import * as fs from 'fs-extra';

export interface CfnSpec {
  PropertyTypes: Record<string, any>;
  ResourceTypes: Record<string, any>;
  ResourceSpecificationVersion: string;
}

export interface ValidationError {
  readonly value: JsonValue<any>;
  readonly message: string;
}

export class CfnSpecValidator {
  public static validate(spec: CfnSpec) {
    const ret = new CfnSpecValidator(spec);
    ret.validateSpec();
    return ret.errors;
  }

  public readonly errors = new Array<ValidationError>();
  private readonly root: JsonValue<CfnSpec>;

  constructor(spec: CfnSpec) {
    this.root = JsonValue.of(spec);
  }

  public validateSpec() {
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
  private validatePropertyType(propType: JsonValue<Record<string, any>>) {
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
    } else {
      this.validateType(propType, 'if a property type doesn\'t have "Properties", it ');
    }
  }

  private validateResourceType(resType: JsonValue<any>) {
    this.assertOptional(resType.get('Properties'), isObject, (props) => {
      this.validateProperties(props);
    });

    this.assertOptional(resType.get('Attributes'), isObject, (attrs) => {
      this.validateMap(attrs, attr => {
        this.validateType(attr);
      });
    });
  }

  private validateProperties(properties: JsonValue<Record<string, any>>) {
    this.validateMap(properties, prop => {
      this.validateType(prop);

      this.assertOptional(prop.get('UpdateType'), (x: any) => {
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
  private validateType(typedObject: JsonValue<Record<string, any>>, errorPrefix = '') {
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
      } else {
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

  private assertValidPropertyTypeReference(typeName: JsonValue<string>) {
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

  private assertOptional<A, B extends A>(x: JsonValue<A>, pred: (x: A) => asserts x is B, block?: (x: JsonValue<B>) => void): boolean {
    return x.hasValue ? this.assert(x, pred, block) : true;
  }

  private assert<A, B extends A>(x: JsonValue<A>, pred: (x: A) => asserts x is B, block?: (x: JsonValue<B>) => void): boolean {
    try {
      pred(x.value);
      if (block) {
        block(new JsonValue(x.value, x.path));
      }
      return true;
    } catch (e: any) {
      this.report(x, e.message);
      return false;
    }
  }

  private validateMap<A>(x: JsonValue<Record<string, A>>, block: (x: JsonValue<A>) => void) {
    for (const key in x.value) {
      block(x.get(key));
    }
  }

  private report(value: JsonValue<any>, message: string) {
    this.errors.push({ value, message });
  }
}

function isObject(x: any): asserts x is Record<string, any> {
  if (x == null || typeof x !== 'object' || Array.isArray(x)) {
    throw new Error(`expected object, found '${x}'`);
  }
}

const COLLECTION_TYPES = ['List', 'Map'];
const BUILTIN_COMPLEX_TYPES = ['Tag'];

function isValidPrimitive(x: any): asserts x is string {
  const primitives = ['String', 'Long', 'Integer', 'Double', 'Boolean', 'Timestamp', 'Json'];

  if (!primitives.includes(x)) {
    throw new Error(`must be one of ${primitives.join(', ')}, got: ${x}`);
  }
}

interface JsonValue<A> {
  readonly path: string[];
  readonly pathValue: any;
  readonly hasValue: boolean;
  readonly value: A;
  readonly valueOrUndefined: A | undefined;
  get<K extends keyof A>(k: K): JsonValue<A[K]>;
}

class JsonValue<A> implements JsonValue<A> {
  public static of<B>(x: B): JsonValue<B> {
    return new JsonValue(x, []);
  }

  public readonly hasValue: boolean = true;
  public readonly valueOrUndefined: A | undefined = this.value;
  public readonly pathValue: any = this.value;

  constructor(public readonly value: A, public readonly path: string[]) {
  }

  public get<K extends keyof A>(k: K): JsonValue<A[K]> {
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

class ErrorValue<A> implements JsonValue<A> {
  public readonly hasValue = false;
  public readonly valueOrUndefined: A | undefined = undefined;

  constructor(private readonly error: string, public readonly path: string[], public readonly pathValue: any) {
  }

  public get<K extends keyof A>(_k: K): JsonValue<A[K]> {
    return this as any;
  }

  public get value(): A {
    throw new Error(this.error);
  }
}

export function formatErrorInContext(error: ValidationError) {
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

async function main(args: string[]) {
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
