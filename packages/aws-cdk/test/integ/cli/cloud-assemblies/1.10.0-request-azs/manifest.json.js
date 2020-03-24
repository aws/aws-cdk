process.stdout.write(JSON.stringify({
  "version": "1.10.0",
  "artifacts": {
    "InitStack": {
      "type": "aws:cloudformation:stack",
      "environment": `aws://${process.env.TEST_ACCOUNT}/${process.env.TEST_REGION}`,
      "properties": {
        "templateFile": "InitStack.template.json"
      }
    }
  },
  "runtime": {
    "libraries": {
      "@aws-cdk/core": "1.14.0",
      "@aws-cdk/cx-api": "1.14.0",
      "@aws-cdk/aws-ec2": "1.14.0",
      "@aws-cdk/aws-iam": "1.14.0",
      "@aws-cdk/region-info": "1.14.0",
      "@aws-cdk/aws-ssm": "1.14.0",
      "@aws-cdk/aws-cloudwatch": "1.14.0",
      "jsii-runtime": "node.js/v8.11.4"
    }
  },
  "missing": [
    {
      "key": `availability-zones:account=${process.env.TEST_ACCOUNT}:region=${process.env.TEST_REGION}`,
      "props": {
        "account": process.env.TEST_ACCOUNT,
        "region": process.env.TEST_REGION,
      },
      "provider": "availability-zones"
    }
  ]
}, undefined, 2));
