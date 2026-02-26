import type { Expression, IScope } from '@cdklabs/typewriter';
import { $E, $T, expr, ExternalModule, ThingSymbol, Type } from '@cdklabs/typewriter';

export class CdkCore extends ExternalModule {
  public readonly helpers = new CdkInternalHelpers(this);
  public readonly errors = new CdkErrors(this);

  public readonly CfnResource = Type.fromName(this, 'CfnResource');
  public readonly Resource = $T(Type.fromName(this, 'Resource'));
  public readonly IInspectable = Type.fromName(this, 'IInspectable');
  public readonly TreeInspector = Type.fromName(this, 'TreeInspector');
  public readonly Token = $T(Type.fromName(this, 'Token'));
  public readonly ResolutionTypeHint = Type.fromName(this, 'ResolutionTypeHint');
  public readonly CfnTag = Type.fromName(this, 'CfnTag');
  public readonly TagManager = $T(Type.fromName(this, 'TagManager'));
  public readonly TagType = $T(Type.fromName(this, 'TagType'));
  public readonly Fn = $T(Type.fromName(this, 'Fn'));
  public readonly Aws = $T(Type.fromName(this, 'Aws'));
  public readonly ITaggable = Type.fromName(this, 'ITaggable');
  public readonly ITaggableV2 = Type.fromName(this, 'ITaggableV2');
  public readonly IResolvable = Type.fromName(this, 'IResolvable');
  public readonly Stack = Type.fromName(this, 'Stack');
  public readonly Names = $T(Type.fromName(this, 'Names'));
  public readonly Arn = $T(Type.fromName(this, 'Arn'));

  public readonly objectToCloudFormation = makeCallableExpr(this, 'objectToCloudFormation');
  public readonly eventPatternToCloudFormation = makeCallableExpr(this, 'eventPatternToCloudFormation');
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
  public readonly mapArrayInPlace = makeCallableExpr(this, 'mapArrayInPlace');

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

  public readonly AWSEventMetadata = Type.fromName(this, 'AWSEventMetadata');
  public readonly AWSEventMetadataProps = Type.fromName(this, 'AWSEventMetadataProps');

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

  public uniqueId(arg: Expression) {
    return this.Names.uniqueId(arg);
  }

  public uniqueResourceName(...args: Expression[]) {
    return this.Names.uniqueResourceName(...args);
  }

  public arnFormat(...args: Expression[]) {
    return this.Arn.format(...args);
  }
}

export class Interfaces extends ExternalModule {
  public readonly IEnvironmentAware = Type.fromName(this, 'IEnvironmentAware');

  public readonly IBucketRef = Type.fromName(this, 'aws_s3.IBucketRef');
  public readonly IKeyRef = Type.fromName(this, 'aws_kms.IKeyRef');
  public readonly ILogGroupRef = Type.fromName(this, 'aws_logs.ILogGroupRef');
  public readonly IDeliveryStreamRef = Type.fromName(this, 'aws_kinesisfirehose.IDeliveryStreamRef');
  public readonly IDeliveryDestinationRef = Type.fromName(this, 'aws_logs.IDeliveryDestinationRef');
}

export class CdkInternalHelpers extends ExternalModule {
  public readonly FromCloudFormationOptions = Type.fromName(this, 'FromCloudFormationOptions');
  public readonly FromCloudFormationResult = $T(Type.fromName(this, 'FromCloudFormationResult'));
  public readonly FromCloudFormation = $T(Type.fromName(this, 'FromCloudFormation'));
  public readonly FromCloudFormationPropertyObject = Type.fromName(this, 'FromCloudFormationPropertyObject');
  public readonly TemplateString = Type.fromName(this, 'TemplateString');

  constructor(parent: CdkCore) {
    super(`${parent.fqn}/core/lib/helpers-internal`);
  }
}

export class CdkErrors extends ExternalModule {
  public readonly ValidationError = Type.fromName(this, 'ValidationError');

  constructor(parent: CdkCore) {
    super(`${parent.fqn}/core/lib/errors`);
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

export const CDK_INTERFACES = new Interfaces('aws-cdk-lib/interfaces');
export const CDK_INTERFACES_ENVIRONMENT_AWARE = new Interfaces('aws-cdk-lib/interfaces/environment-aware');
export const CDK_CORE = new CdkCore('aws-cdk-lib/core');
export const CDK_CLOUDWATCH = new CdkCloudWatch('aws-cdk-lib/aws-cloudwatch');
export const CONSTRUCTS = new Constructs();

function makeCallableExpr(scope: IScope, name: string) {
  return $E(expr.sym(new ThingSymbol(name, scope)));
}
