.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _using_l2_constructs:

######################################
Using |level2| Constructs in the |cdk|
######################################

This topic provides information about using |level2| constructs in the |cdk|.

An |l1| represents a single AWS service resource,
such as an |s3| bucket, |sns| topic, or |sqs| queue;
an |l2| represents two or more |l1| objects;
and a |l3| represents two or more |l2| objects.
You can create your own constructs, as described in
:doc:`cloudformation`,
or use constructs created by others.

.. _incorporating_external_constructs:

Incorporating External Constructs
=================================

To incorporate an external construct, use the **import** statement,
as shown in the following example, which imports a reference to the **MyGroovyStack** class
from the code in *my-stack.ts*.

.. code-block:: js

   import { MyGroovyStack } from './my-stack'

You can then instantiate an instance of **MyGroovyStack**.

.. code-block:: js

   new MyGroovyStack(app, 'Test');

.. _runtime_discovery:

Incorporating Constructs at Runtime
===================================

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

   import { App, Stack } from 'aws-cdk';
   import { Lambda, LambdaRuntime, LambdaS3Code } from 'aws-cdk-lambda';
   import { RuntimeValue } from 'aws-cdk-rtv';
   import { Bucket } from 'aws-cdk-s3';
   import { Topic } from 'aws-cdk-sns';

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
