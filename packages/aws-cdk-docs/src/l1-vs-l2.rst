.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _l1_vs_l2:

#####################
The Construct Library
#####################

The |cdk| standard library comes with two different types of Constructs:

AWS CloudFormation Resource Constructs

  CloudFormation Resource constructs are low-level constructs that provide a direct, one-to-one,
  mapping to an |cfn| resource,
  as listed in the |cfn| topic `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.

  All Resource constructs are found in the :py:mod:`aws-cdk-resources` package.

AWS Construct Library Constructs

  These constructs have been handwritten by AWS engineers and come with
  convenient defaults and additional knowledge about the inner workings of the
  AWS resources they represent. In general, you will be able to express your
  intent without worrying about the details too much, and the correct resources
  will automatically be defined for you.

  Construt Library constructs are those that are found in all of the other
  **aws-cdk-** packages. See the :ref:`reference` section for a list of all
  available Construct Library packages and constructs.

Prefer using Construct Library constructs whenever possible, as they will provide the
best developer experience.

Sometimes there are use cases where you need to directly define |cfn| resources,
such as when migrating from an existing template, or when there is no Construct
Library for the AWS resources you need yet. In those case you can use Resource
constructs to define CloudFormation entities such as Resources, Parameters, Outputs, and
Conditions.

Of course, it's always possible to define your own higher-level constructs in
addition to the ones already provided, simply by defining a new class that
describes your construct. For more information, see :doc:`creating-constructs`.

.. _aws_constructs_versus_cfn_resources:

Construct Library constructs vs CloudFormation Resource constructs
==================================================================

To illustrate the advantages that Construct Library constructs have over
CloudFormation Resource constructs, let's look at an example.

The :py:mod:`@aws-cdk/sns` Construct Library includes the `Topic` construct that
you can use to define an |SNS| topic:

.. code-block:: js

    import { Topic } from '@aws-cdk/sns';
    const topic = new Topic(this, 'MyTopic');

Library constructs encapsulate the
details of working with these AWS resources. For example, to subscribe a queue to a topic,
call the :py:meth:`@aws-cdk/sns.Topic.subscribeQueue` method with a queue object as the second argument:

.. code-block:: js

    const topic = new Topic(this, 'MyTopic');
    const queue = new Queue(this, 'MyQueue', {
        visibilityTimeoutSec: 300
    });

    topic.subscribeQueue('TopicToQueue', queue);

This method:

1. Creates a subscription and associates it with the topic and the queue.

2. Adds a queue policy with permissions for the topic to send messages to the queue.

To achieve a similar result using :py:mod:`aws-cdk-resources`, you have to explicitly define the
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
of using the Library constructs instead of the Resource constructs.

.. _purpose_built_constructs:

Purpose-built constructs
========================

At an even higher-level than Construct Library constructs, *Purpose-built
constructs* are constructs that aggregate multiple other constructs together
into common architectural patterns, such as a *queue processor* or an *HTTP
service*.

By leveraging these common patterns, you will be able to assemble your
application even faster than by using Construct Library constructs directly.

Because these constructs will depend on your application's specific goals and
requirements, they are not included with the standard CDK Construct
Library. Instead, we encourage you to develop and share them inside your
organization or on GitHub.
