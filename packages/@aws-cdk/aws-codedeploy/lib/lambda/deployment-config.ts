/**
 * Deployment Config for Lambda CodeDeploy Applications.
 */
export enum LambdaDeploymentConfig {
  AllAtOnce = 'AllAtOnce',
  Canary10Percent30Minutes = 'Canary10Percent30Minutes',
  Canary10Percent5Minutes = 'Canary10Percent5Minutes',
  Canary10Percent10Minutes = 'Canary10Percent10Minutes',
  Canary10Percent15Minutes = 'Canary10Percent15Minutes',
  Linear10PercentEvery10Minutes = 'Linear10PercentEvery10Minutes',
  Linear10PercentEvery1Minute = 'Linear10PercentEvery1Minute',
  Linear10PercentEvery2Minutes = 'Linear10PercentEvery2Minutes',
  Linear10PercentEvery3Minutes = 'Linear10PercentEvery3Minutes'
}