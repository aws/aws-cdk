.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _developing_cdk_apps:

#####################
Developing |cdk| Apps
#####################

*CDK Apps* are the applications you write using the CDK libraries. After writing
and compiling them, you'll use the |toolkit| to synthesize or deploy the
stacks they describe.

To write your CDK app, you can create your own constructs, as described in
:doc:`cloudformation`, or use higher-level constructs, as described in the next section.

.. _l2_advantages:

Using an |l2| Versus a |l1|
===========================
We recommend that you use an |l2| whenever possible,
as they provide the best developer experience.

To illustrate the advantages that an |l2| has over
a |l1|, let's look at an example.

The :py:mod:`@aws-cdk/aws-sns` Construct Library includes the `Topic` construct that
you can use to define an |SNS| topic:

.. code-block:: js

    import { Topic } from '@aws-cdk/aws-sns';
    const topic = new Topic(this, 'MyTopic');

An |l2| encapsulate the
details of working with these AWS resources. For example, to subscribe a queue to a topic,
call the :py:meth:`@aws-cdk/aws-sns.Topic.subscribeQueue` method with a queue object as the second argument:

.. code-block:: js

    const topic = new Topic(this, 'MyTopic');
    const queue = new Queue(this, 'MyQueue', {
        visibilityTimeoutSec: 300
    });

    topic.subscribeQueue('TopicToQueue', queue);

This method:

1. Creates a subscription and associates it with the topic and the queue.

2. Adds a queue policy with permissions for the topic to send messages to the queue.

To achieve a similar result using :py:mod:`@aws-cdk/resources`, you have to explicitly define the
subscription and queue policy, since there is no **subscribeToQueue** method in the **TopicResource** class:

.. code-block:: js

    const topic = new sns.TopicResource(this, 'MyTopic');
    const queue = new sqs.QueueResource(this, 'MyQueue');

    new sns.SubscriptionResource(this, 'TopicToQueue', {
        topicArn: topic.ref, // ref == arn for topics
        endpoint: queue.queueName,
        protocol: 'sqs'
    });

    const policyDocument = new PolicyDocument();
    policyDocument.addStatement(new PolicyStatement()
        .addResource(queue.queueArn)
        .addAction('sqs:SendMessage')
        .addServicePrincipal('sns.amazonaws.com')
        .setCondition('ArnEquals', { 'aws:SourceArn': topic.ref }));

    new sqs.QueuePolicyResource(this, 'MyQueuePolicy', {
        policyDocument: policyDocument,
        queues: [ queue.ref ]
    });

Notice how much cleaner the first version is. There is more focus on intent,
rather than mechanism.

This example shows one of the many benefits
of using an |l2| instead of a |l1|.

.. _incorporating_external_constructs:

Incorporating external constructs
=================================

To incorporate an external construct, use the **import** statement,
as shown in the following example, which imports a reference to the **MyGroovyStack** class
from the code in *my-stack.ts*.

.. code-block:: js

   import { MyGroovyStack } from './my-stack'

You can then instantiate an instance of **MyGroovyStack**.

.. code-block:: js

   new MyGroovyStack(app, 'Test');

.. _organizing_your_app:

Organizing your application
===========================

The natural way to write CDK apps is by defining new constructs. The difference
between your constructs and the Construct Library constructs is that the ones
you will be writing are exactly tailored to your application.

Defining a construct is as simple as declaring a class that inherits from
**Construct**, and doing whatever work is appropriate in the constructor.

The simplest custom Constructs you will be writing are **Stacks**. They define
the individually deployable components of your application.

The main entry point of your CDK App will instantiate an instance of **App**,
add instantiate each of your stacks **Stacks** as a child of the **App** (or
potentially, instantiate the same **Stack** multiple times but with different
arguments, for example if you want to deploy the stame stack to different
regions).

See the :ref:`cdk_examples` section for a number of examples on writing a simple
stack-plus-app combination. For real code, we recommend separating the
entry point and the stack's class into different files, though.

Evolving your application's constructs
======================================

Once your stack grows too big, it may make sense to define individual constructs
for logical pieces that make sense together. For example, if your application
contains a queue and some compute to work on that queue, it might make sense to
define a new construct called **QueueProcessor** that codifies that pattern. If
the new construct is successful, you might even consider adding some parameters
to it to make it more reusable, and sharing it among your projects, or even
sharing it with other people.

Writing a CDK app means breaking down your desired infrastructure into logical
constructs, and reusing them wherever it makes sense.

.. _runtime_discovery:

Referencing Resources at Runtime
================================

As you create constructs in the |cdk|,
you will likely want to be able to refer to the created resources at runtime.
To facilitate this requirement,
the |cdk| uses the **SSM Parameter Store** as the repository for publishing and consuming runtime values.

The SSM parameter store is a global key/value store.
Namespaces within the SSM parameter store are scoped to an environment (account and Region).
All stacks within the same environment share the same namespace.

.. _creating_runtime_value:

Creating a Runtime Value
------------------------

To create a runtime value, add an
`AWS::SSM::Parameter <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-parameter.html>`_
as shown in the following example, which creates the runtime value **MyTopicARN** and adds it to your environment.

First import the required packages.

.. code-block:: js

   import { App, Stack } from '@aws-cdk/cdk';
   import { Lambda, LambdaRuntime, LambdaS3Code } from '@aws-cdk/aws-lambda';
   import { RuntimeValue } from '@aws-cdk/rtv';
   import { Bucket } from '@aws-cdk/aws-s3';
   import { Topic } from '@aws-cdk/aws-sns';

Add an SNS topic to the stack and advertise the topic ARN as a runtime value.

.. code-block:: js

   const topic = new Topic(this, 'MySnsTopic', {
     topicName: 'MyTopic'
   });

   const RTV_PACKAGE = 'com.amazonaws.rtvtest';

   const runtimeValues = [
     new RuntimeValue(this, 'MyRuntimeValue', {
       package: RTV_PACKAGE,
       value: topic.topicArn
   })];

You can also use this construct to manipulate |IAM| policy documents.
For example, you could append the following to the previous example to give a Lambda function
read permission for **MyTopicARN**.

.. code-block:: js

   const bucket = new Bucket(this, 'MyBucket');

   const lambda = new Lambda(this, 'MyFunction', {
     runtime: LambdaRuntime.NodeJS610,
     code: new LambdaS3Code(bucket, 'myKey'),
     handler: 'index.handler'
   });

   bucket.grantReadWrite(lambda.role);

   runtimeValues.forEach(rtv => rtv.grantReadPermissions(lambda.role));

.. _building-stacks:

Building and Deploying Stacks
=============================

Stacks are |cdk| constructs that you build from one or more lower level constructs.
You deploy stacks into an environment, which consists of a specific Region under a specific AWS account.

.. _building-apps:

Building and Deploying Apps
===========================

Once you have all of the stacks,
either defined by you or by someone else,
that you need to model your AWS resources,
use them to build an **App** and use the app to create an |CFN| template
and deploy that template to create your AWS service resources.
