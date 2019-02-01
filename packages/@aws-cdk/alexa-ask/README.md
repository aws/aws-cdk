## Alexa Ask Construct Library

```ts
const alexaAsk = require('@aws-cdk/alexa-ask');
```

### Alexa as deploy target for CodePipeline

You can deploy to Alexa using CodePipeline with the following DeployAction.

```ts
// Read the secrets from ParameterStore
const clientId = new cdk.SecretParameter(stack, 'AlexaClientId', {ssmParameter: '/Alexa/ClientId'});
const clientSecret = new cdk.SecretParameter(stack, 'AlexaClientSecret', {ssmParameter: '/Alexa/ClientSecret'});
const refreshToken = new cdk.SecretParameter(stack, 'AlexaRefreshToken', {ssmParameter: '/Alexa/RefreshToken'});

// Add deploy action
new alexa.AlexaSkillDeployAction(stack, 'DeploySkill', {
  stage: deployStage,
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  clientId: clientId.value,
  clientSecret: clientSecret.value,
  refreshToken: refreshToken.value,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```

If you need manifest overrides you can specify them as `overrideArtifact` in the action.

```ts
// Deploy some CFN change set and store output
const executeChangeSetAction = new PipelineExecuteChangeSetAction(this, 'ExecuteChangesTest', {
  stage: deployStage,
  runOrder: 2,
  stackName,
  changeSetName,
  outputFileName: 'overrides.json',
  outputArtifactName: 'CloudFormation',
});

// Provide CFN output as manifest overrides
new AlexaSkillDeployAction(this, 'DeploySkill', {
  stage: deployStage,
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  parameterOverridesArtifact: executeChangeSetAction.outputArtifact,
  clientId: clientId.value,
  clientSecret: clientSecret.value,
  refreshToken: refreshToken.value,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```