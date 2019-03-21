## Alexa Ask Construct Library

```ts
const alexaAsk = require('@aws-cdk/alexa-ask');
```

### Alexa as deploy target for CodePipeline

You can deploy to Alexa using CodePipeline with the following DeployAction.

```ts
// Read the secrets from ParameterStore
const secret = new secretsmanager.SecretString(this, 'AlexaToken', { secretId: 'MyAlexaToken' })
const clientId = secret.jsonFieldValue('ClientId');
const clientSecret = secret.jsonFieldValue('ClientSecret');
const refreshToken = secret.jsonFieldValue('RefreshToken');

// Add deploy action
new alexaAsk.AlexaSkillDeployAction({
  actionName: 'DeploySkill',
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  clientId: clientId.value,
  clientSecret: clientSecret.value,
  refreshToken: refreshToken.value,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```

If you need manifest overrides you can specify them as `parameterOverridesArtifact` in the action:

```ts
const cloudformation = require('@aws-cdk/aws-cloudformation');

// Deploy some CFN change set and store output
const executeChangeSetAction = new cloudformation.PipelineExecuteChangeSetAction({
  actionName: 'ExecuteChangesTest',
  runOrder: 2,
  stackName,
  changeSetName,
  outputFileName: 'overrides.json',
  outputArtifactName: 'CloudFormation',
});

// Provide CFN output as manifest overrides
new alexaAsk.AlexaSkillDeployAction({
  actionName: 'DeploySkill',
  runOrder: 1,
  inputArtifact: sourceAction.outputArtifact,
  parameterOverridesArtifact: executeChangeSetAction.outputArtifact,
  clientId: clientId.value,
  clientSecret: clientSecret.value,
  refreshToken: refreshToken.value,
  skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
});
```
