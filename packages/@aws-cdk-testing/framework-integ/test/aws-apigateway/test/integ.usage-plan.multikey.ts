import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const usageplan = new apigateway.UsagePlan(this, 'myusageplan');
    const apikey1 = new apigateway.ApiKey(this, 'myapikey1');
    const apikey2 = new apigateway.ApiKey(this, 'myapikey2');
    usageplan.addApiKey(apikey1);
    usageplan.addApiKey(apikey2);
  }
}

const app = new cdk.App();

new Test(app, 'test-apigateway-usageplan-multikey');

app.synth();
