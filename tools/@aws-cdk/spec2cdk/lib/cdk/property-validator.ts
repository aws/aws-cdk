import { $E, expr, FreeFunction, IScope, stmt, StructType, Type } from '@cdklabs/typewriter';
import { CDK_CORE } from './cdk';
import { CloudFormationMapping } from './cloudformation-mapping';
import { cfnPropsValidatorNameFromType } from '../naming';

export interface PropertyValidatorSpec {
  type: StructType;
  mapping: CloudFormationMapping;
}

export class PropertyValidator extends FreeFunction {
  constructor(scope: IScope, options: PropertyValidatorSpec) {
    const { type, mapping } = options;

    super(scope, {
      name: cfnPropsValidatorNameFromType(type),
      returnType: CDK_CORE.ValidationResult,
      docs: {
        summary: `Determine whether the given properties match those of a \`${type.name}\``,
        remarks: `@param properties - the TypeScript properties of a \`${type.name}\``,
        returns: 'the result of the validation.',
      },
    });

    const $errors = $E(expr.ident('errors'));
    const $properties = this.addParameter({
      name: 'properties',
      type: Type.ANY,
    });

    this.addBody(
      stmt.if_(expr.not(CDK_CORE.canInspect($properties))).then(stmt.ret(CDK_CORE.VALIDATION_SUCCESS)),
      stmt.constVar($errors, CDK_CORE.ValidationResults.newInstance()),
      stmt
        .if_(expr.not(expr.isObject($properties)))
        .then(
          stmt.block(
            $errors.collect(
              CDK_CORE.ValidationResult.newInstance(
                expr.strConcat(
                  expr.lit('Expected an object, but received: '),
                  expr.builtInFn('JSON.stringify', $properties),
                ),
              ),
            ),
          ),
        ),
      ...mapping.cfnProperties().flatMap((cfn) => mapping.validateProperty(cfn, $properties, $errors)),
      stmt.ret($errors.wrap(expr.lit(`supplied properties not correct for "${type.name}"`))),
    );
  }
}
