import {
  expr,
  Expression,
  ObjectPropertyAccess,
  IsNotNullish,
  Type,
  ThingSymbol,
  IScope,
  StructType,
  PrimitiveType,
  FreeFunction,
  stmt,
  $E,
  IsObject,
} from '@cdklabs/typewriter';
import { CDK_CORE } from './cdk';
import { PropertyValidator } from './property-validator';
import { TypeConverter } from './type-converter';
import { UnionOrdering } from './union-ordering';
import { cfnParserNameFromType, cfnProducerNameFromType, cfnPropsValidatorNameFromType } from '../naming';

export interface PropertyMapping {
  readonly cfnName: string;
  readonly propName: string;
  readonly baseType: Type;
  readonly optional?: boolean;
}

/**
 * Convert values between CloudFormation and TypeScript
 *
 * Retain a list of properties with their CloudFormation and TypeScript names, and generate
 * TypeScript expression that convert between the respective types.
 */
export class CloudFormationMapping {
  private readonly cfn2ts: Record<string, string> = {};
  private readonly cfn2Prop: Record<string, PropertyMapping> = {};

  constructor(private readonly mapperFunctionsScope: IScope, private readonly converter: TypeConverter) {}

  public add(mapping: PropertyMapping) {
    this.cfn2ts[mapping.cfnName] = mapping.propName;
    this.cfn2Prop[mapping.cfnName] = mapping;
  }

  public cfnFromTs(): Array<[string, string]> {
    return Object.entries(this.cfn2ts).sort(([a], [b]) => a.localeCompare(b));
  }

  public cfnProperties(): string[] {
    return Object.keys(this.cfn2Prop).sort();
  }

  public produceProperty(cfnName: string, struct: Expression): Expression {
    const value = new ObjectPropertyAccess(struct, this.cfn2ts[cfnName]);
    const type = this.cfn2Prop[cfnName].baseType;
    if (!type) {
      throw new Error(`No type for ${cfnName}`);
    }

    return this.typeHandlers(type).produce.call(value);
  }

  public parseProperty(cfnName: string, propsObj: Expression): Expression {
    const value = new ObjectPropertyAccess(propsObj, cfnName);
    const type = this.cfn2Prop[cfnName].baseType;
    if (!type) {
      throw new Error(`No type for ${cfnName}`);
    }

    return expr.cond(new IsNotNullish(value)).then(this.typeHandlers(type).parse.call(value)).else(expr.UNDEFINED);
  }

  public validateProperty(cfnName: string, propsObj: Expression, errorsObj: Expression): Expression[] {
    const prop = this.cfn2Prop[cfnName];

    const validations = new Array<Expression>();

    if (!prop.optional) {
      validations.push(
        errorsObj.callMethod(
          'collect',
          CDK_CORE.propertyValidator
            .call(expr.lit(prop.propName), CDK_CORE.requiredValidator)
            .call(propsObj.prop(prop.propName)),
        ),
      );
    }

    validations.push(
      errorsObj.callMethod(
        'collect',
        CDK_CORE.propertyValidator
          .call(expr.lit(prop.propName), this.typeHandlers(prop.baseType).validate)
          .call(propsObj.prop(prop.propName)),
      ),
    );

    return validations;
  }

  private typeHandlers(type: Type): TypeHandlers {
    if (type.equals(CDK_CORE.CfnTag)) {
      return {
        produce: CDK_CORE.cfnTagToCloudFormation,
        parse: CDK_CORE.helpers.FromCloudFormation.getCfnTag,
        validate: CDK_CORE.validateCfnTag,
      };
    }

    if (type.equals(CDK_CORE.IResolvable)) {
      return {
        produce: CDK_CORE.objectToCloudFormation,
        parse: CDK_CORE.helpers.FromCloudFormation.getAny,
        validate: CDK_CORE.validateObject,
      };
    }

    switch (type.primitive) {
      case PrimitiveType.String:
        return {
          produce: CDK_CORE.stringToCloudFormation,
          parse: CDK_CORE.helpers.FromCloudFormation.getString,
          validate: CDK_CORE.validateString,
        };
      case PrimitiveType.DateTime:
        return {
          produce: CDK_CORE.dateToCloudFormation,
          parse: CDK_CORE.helpers.FromCloudFormation.getDate,
          validate: CDK_CORE.validateDate,
        };
      case PrimitiveType.Number:
        return {
          produce: CDK_CORE.numberToCloudFormation,
          parse: CDK_CORE.helpers.FromCloudFormation.getNumber,
          validate: CDK_CORE.validateNumber,
        };
      case PrimitiveType.Json:
        return {
          produce: CDK_CORE.objectToCloudFormation,
          parse: CDK_CORE.helpers.FromCloudFormation.getAny,
          validate: CDK_CORE.validateObject,
        };
      case PrimitiveType.Any:
        return {
          produce: CDK_CORE.objectToCloudFormation,
          parse: CDK_CORE.helpers.FromCloudFormation.getAny,
          validate: CDK_CORE.validateObject,
        };
      case PrimitiveType.Boolean:
        return {
          produce: CDK_CORE.booleanToCloudFormation,
          parse: CDK_CORE.helpers.FromCloudFormation.getBoolean,
          validate: CDK_CORE.validateBoolean,
        };
    }

    if (type.arrayOfType) {
      const innerHandler = this.typeHandlers(type.arrayOfType);
      return {
        produce: CDK_CORE.listMapper(innerHandler.produce),
        parse: CDK_CORE.helpers.FromCloudFormation.getArray(innerHandler.parse),
        validate: CDK_CORE.listValidator.call(innerHandler.validate),
      };
    }

    if (type.mapOfType) {
      const innerHandler = this.typeHandlers(type.mapOfType);
      return {
        produce: CDK_CORE.hashMapper(innerHandler.produce),
        parse: CDK_CORE.helpers.FromCloudFormation.getMap(innerHandler.parse),
        validate: CDK_CORE.hashValidator.call(innerHandler.validate),
      };
    }

    if (type.symbol) {
      const struct = StructType.assertStruct(type.symbol.findDeclaration());
      return {
        produce: expr.sym(new ThingSymbol(cfnProducerNameFromType(struct), this.mapperFunctionsScope)),
        parse: expr.sym(new ThingSymbol(cfnParserNameFromType(struct), this.mapperFunctionsScope)),
        validate: expr.sym(new ThingSymbol(cfnPropsValidatorNameFromType(struct), this.mapperFunctionsScope)),
      };
    }

    if (type.unionOfTypes) {
      // Need access to the PropertyTypes to order these
      const originalTypes = type.unionOfTypes.map((t) => this.converter.originalType(t));
      const orderedTypes = new UnionOrdering(this.converter.db).orderTypewriterTypes(type.unionOfTypes, originalTypes);
      const innerProducers = orderedTypes.map((t) => this.typeHandlers(t));
      const validators = innerProducers.map((p) => p.validate);

      return {
        produce: CDK_CORE.unionMapper(expr.list(validators), expr.list(innerProducers.map((p) => p.produce))),
        parse: CDK_CORE.helpers.FromCloudFormation.getTypeUnion(
          expr.list(validators),
          expr.list(innerProducers.map((p) => p.parse)),
        ),
        validate: CDK_CORE.unionValidator.call(...validators),
      };
    }

    const todo = expr.ident(`/* @todo typeHandlers(${type}) */`);
    return { produce: todo, parse: todo, validate: todo };
  }

  /**
   * Make the function that translates code -> CFN
   */
  public makeCfnProducer(scope: IScope, propsInterface: StructType) {
    const validator = new PropertyValidator(scope, {
      type: propsInterface,
      mapping: this,
    });

    const producer = new FreeFunction(scope, {
      name: cfnProducerNameFromType(propsInterface),
      returnType: Type.ANY,
    });

    const propsObj = producer.addParameter({
      name: 'properties',
      type: Type.ANY,
    });

    producer.addBody(
      stmt.if_(expr.not(CDK_CORE.canInspect(propsObj))).then(stmt.ret(propsObj)),
      validator.fn.call(propsObj).callMethod('assertSuccess'),
      stmt.ret(expr.object(this.cfnProperties().map((cfn) => [cfn, this.produceProperty(cfn, propsObj)] as const))),
    );

    return producer;
  }

  /**
   * Make the function that translates CFN -> code
   */
  public makeCfnParser(scope: IScope, propsInterface: StructType) {
    const parserType = Type.unionOf(propsInterface.type, CDK_CORE.IResolvable);

    const parser = new FreeFunction(scope, {
      name: cfnParserNameFromType(propsInterface),
      returnType: CDK_CORE.helpers.FromCloudFormationResult.withGenericArguments(parserType),
    });

    const propsObj = parser.addParameter({
      name: 'properties',
      type: Type.ANY,
    });

    const $ret = $E(expr.ident('ret'));

    parser.addBody(
      stmt
        .if_(CDK_CORE.isResolvableObject(propsObj))
        .then(stmt.block(stmt.ret(new CDK_CORE.helpers.FromCloudFormationResult(propsObj)))),
      stmt.assign(propsObj, expr.cond(expr.binOp(propsObj, '==', expr.NULL)).then(expr.lit({})).else(propsObj)),
      stmt
        .if_(expr.not(new IsObject(propsObj)))
        .then(stmt.block(stmt.ret(new CDK_CORE.helpers.FromCloudFormationResult(propsObj)))),

      stmt.constVar(
        $ret,
        CDK_CORE.helpers.FromCloudFormationPropertyObject.withGenericArguments(propsInterface.type).newInstance(),
      ),

      ...this.cfnFromTs().map(([cfnName, tsName]) =>
        $ret.addPropertyResult(expr.lit(tsName), expr.lit(cfnName), this.parseProperty(cfnName, propsObj)),
      ),

      $ret.addUnrecognizedPropertiesAsExtra(propsObj),
      stmt.ret($ret),
    );

    return parser;
  }
}

interface TypeHandlers {
  readonly produce: Expression;
  readonly parse: Expression;
  readonly validate: Expression;
}
