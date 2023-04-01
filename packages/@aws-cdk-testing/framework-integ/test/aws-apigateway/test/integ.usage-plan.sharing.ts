/// !cdk-integ *
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IUsagePlan } from 'aws-cdk-lib/aws-apigateway';

class Create extends cdk.Stack {
  public usagePlan: IUsagePlan;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    this.usagePlan = new apigateway.UsagePlan(this, 'myusageplan');
  }
}

interface ImportStackProps extends cdk.StackProps {
  usagePlan: apigateway.IUsagePlan;
}

class Import extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ImportStackProps) {
    super(scope, id);

    const usageplan = apigateway.UsagePlan.fromUsagePlanId(this, 'myusageplan', props.usagePlan.usagePlanId);
    const apikey = new apigateway.ApiKey(this, 'myapikey');
    usageplan.addApiKey(apikey);
  }
}

const app = new cdk.App();

const test = new Create(app, 'test-apigateway-usageplan-create');
new Import(app, 'test-apigateway-usageplan-import', {
  usagePlan: test.usagePlan,
});

app.synth();
