## Runtime Values

The CDK allows apps to advertise values from __construction time__ to __runtime
code__. For example, consider code in a Lambda function which needs to know the
URL of the SQS queue created as part of your CDK app.

Runtime values are advertised as textual SSM parameters with the following key:

```
/rtv/<stack-name>/<package>/<name>
```

Therefore, in order to advertise a value you will need to:

1. Make the current stack name available as an environment variable to your
   runtime code. The convention is to use `RTV_STACK_NAME`.
2. Use the `RuntimeValue` construct in order to create the SSM parameter and
   specify least-privilege permissions.

For example, say we want to publish a queue's URL to a lambda function.

### Construction Code

```ts
import { RuntimeValue } from '@aws-cdk/rtv'

const queue = new Queue(this, 'MyQueue', { /* props.... */ });
const fn = new Function(this, 'MyFunction', { /* props... */ });
const fleet = new Fleet(this, 'MyFleet', { /* props... */ });

// this line defines an AWS::SSM::Parameter resource with the
// key "/rtv/<stack-name>/com.myorg/MyQueueURL" and the actual queue URL as value
const queueUrlRtv = new RuntimeValue(this, 'QueueRTV', {
    package: 'com.myorg',
    name: 'MyQueueURL',
    value: queue.queueUrl
});

// this line adds read permissions for this SSM parameter to the policies associated with
// the IAM roles of the Lambda function and the EC2 fleet
queueUrlRtv.grantRead(fn.role);
queueUrlRtv.grantRead(fleet.role);

// adds the `RTV_STACK_NAME` to the environment of the lambda function
// and the fleet (via user-data)
fn.env(RuntimeValue.ENV_NAME, RuntimeValue.ENV_VALUE);
fleet.env(RuntimeValue.ENV_NAME, RuntimeValue.ENV_VALUE);
```

### Runtime Code

Then, your runtime code will need to use the SSM Parameter Store AWS SDK in
order to format the SSM parameter key and read the value. In future releases, we
will provide runtime libraries to make this easy.
