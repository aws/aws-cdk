import { $E, $T, expr, Expression, ExternalModule, IScope, ThingSymbol, Type } from '@cdklabs/typewriter';

export interface ModuleImportLocations {
  /**
   * The import name used import the core module
   * @default 'aws-cdk-lib'
   */
  readonly core?: string;
  /**
   * The import name used to import core helpers module
   * @default 'aws-cdk-lib/core/lib/helpers-internal'
   */
  readonly coreHelpers?: string;

  /**
   * The import name used to import the CloudWatch module
   *
   * @default 'aws-cdk-lib/aws-cloudwatch'
   */
  readonly cloudwatch?: string;
}

export class CdkCore extends ExternalModule {
  public readonly helpers = new CdkInternalHelpers(this);

  public readonly CfnResource = Type.fromName(this, 'CfnResource');
  public readonly Resource = $T(Type.fromName(this, 'Resource'));
  public readonly IInspectable = Type.fromName(this, 'IInspectable');
  public readonly TreeInspector = Type.fromName(this, 'TreeInspector');
  public readonly Token = $T(Type.fromName(this, 'Token'));
  public readonly ResolutionTypeHint = Type.fromName(this, 'ResolutionTypeHint');
  public readonly CfnTag = Type.fromName(this, 'CfnTag');
  public readonly TagManager = $T(Type.fromName(this, 'TagManager'));
  public readonly TagType = $T(Type.fromName(this, 'TagType'));
  public readonly ITaggable = Type.fromName(this, 'ITaggable');
  public readonly ITaggableV2 = Type.fromName(this, 'ITaggableV2');
  public readonly IResolvable = Type.fromName(this, 'IResolvable');

  public readonly objectToCloudFormation = makeCallableExpr(this, 'objectToCloudFormation');
  public readonly stringToCloudFormation = makeCallableExpr(this, 'stringToCloudFormation');
  public readonly dateToCloudFormation = makeCallableExpr(this, 'dateToCloudFormation');
  public readonly booleanToCloudFormation = makeCallableExpr(this, 'booleanToCloudFormation');
  public readonly numberToCloudFormation = makeCallableExpr(this, 'numberToCloudFormation');
  public readonly cfnTagToCloudFormation = makeCallableExpr(this, 'cfnTagToCloudFormation');
  public readonly canInspect = makeCallableExpr(this, 'canInspect');
  public readonly listMapper = makeCallableExpr(this, 'listMapper');
  public readonly hashMapper = makeCallableExpr(this, 'hashMapper');
  public readonly unionMapper = makeCallableExpr(this, 'unionMapper');
  public readonly requireProperty = makeCallableExpr(this, 'requireProperty');
  public readonly isResolvableObject = makeCallableExpr(this, 'isResolvableObject');

  public readonly ValidationResult = $T(Type.fromName(this, 'ValidationResult'));
  public readonly VALIDATION_SUCCESS = makeCallableExpr(this, 'VALIDATION_SUCCESS');
  public readonly ValidationResults = $T(Type.fromName(this, 'ValidationResults'));

  public readonly propertyValidator = makeCallableExpr(this, 'propertyValidator');
  public readonly requiredValidator = makeCallableExpr(this, 'requiredValidator');
  public readonly listValidator = makeCallableExpr(this, 'listValidator');
  public readonly hashValidator = makeCallableExpr(this, 'hashValidator');
  public readonly unionValidator = makeCallableExpr(this, 'unionValidator');
  public readonly validateCfnTag = makeCallableExpr(this, 'validateCfnTag');
  public readonly validateObject = makeCallableExpr(this, 'validateObject');
  public readonly validateDate = makeCallableExpr(this, 'validateDate');
  public readonly validateBoolean = makeCallableExpr(this, 'validateBoolean');
  public readonly validateNumber = makeCallableExpr(this, 'validateNumber');
  public readonly validateString = makeCallableExpr(this, 'validateString');

  constructor(fqn: string) {
    super(fqn);
  }

  public tokenAsString(arg: Expression) {
    return this.Token.asString(arg);
  }

  public tokenAsNumber(arg: Expression) {
    return this.Token.asNumber(arg);
  }

  public tokenAsList(arg: Expression) {
    return this.Token.asList(arg);
  }
}

export class CdkInternalHelpers extends ExternalModule {
  public readonly FromCloudFormationOptions = Type.fromName(this, 'FromCloudFormationOptions');
  public readonly FromCloudFormationResult = $T(Type.fromName(this, 'FromCloudFormationResult'));
  public readonly FromCloudFormation = $T(Type.fromName(this, 'FromCloudFormation'));
  public readonly FromCloudFormationPropertyObject = Type.fromName(this, 'FromCloudFormationPropertyObject');

  constructor(parent: CdkCore) {
    super(`${parent.fqn}/core/lib/helpers-internal`);
  }
}

export class Constructs extends ExternalModule {
  public readonly Construct = Type.fromName(this, 'Construct');
  public readonly IConstruct = Type.fromName(this, 'IConstruct');

  constructor() {
    super('constructs');
  }
}

export class CdkCloudWatch extends ExternalModule {
  public readonly Metric = $T(Type.fromName(this, 'Metric'));
  public readonly MetricOptions = Type.fromName(this, 'MetricOptions');
}

export const CDK_CORE = new CdkCore('aws-cdk-lib');
export const CDK_CLOUDWATCH = new CdkCloudWatch('aws-cdk-lib/aws-cloudwatch');
export const CONSTRUCTS = new Constructs();

function makeCallableExpr(scope: IScope, name: string) {
  return $E(expr.sym(new ThingSymbol(name, scope)));
}
