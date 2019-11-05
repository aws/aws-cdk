import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');

const DefaultFunctionProps: lambda.FunctionProps | any = {
  logRetention: logs.RetentionDays.THREE_MONTHS,
  environment: {
    LOGLEVEL: 'INFO'
  }
};

export { DefaultFunctionProps };