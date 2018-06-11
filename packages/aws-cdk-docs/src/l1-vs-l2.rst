.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _the_cdk_construct_library:

###########################
The |cdk| Construct Library
###########################

The |cdk| standard library comes with two different levels of constructs:

|l1| Constructs

  These constructs are low-level constructs that provide a direct, one-to-one,
  mapping to an |CFN| resource,
  as listed in the |CFN| topic `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.

  All |l1| constructs are found in the :py:mod:`_aws-cdk_resources` package.

|l2| Constructs

  These constructs have been handwritten by AWS engineers and come with
  convenient defaults and additional knowledge about the inner workings of the
  AWS resources they represent. In general, you will be able to express your
  intent without worrying about the details too much, and the correct resources
  will automatically be defined for you.

  |l2| constructs are found in the :py:mod:`aws-cdk-RESOURCE` package,
  where RESOURCE is the short name for the associated service,
  such as SQS for the |l2| constructs for the |SQS| service.
  See the :ref:`reference` section for descriptions of the |cdk|
  packages and constructs.

Use |l2| constructs whenever possible, as they provide the
best developer experience.

Sometimes there are use cases where you need to directly define |CFN| resources,
such as when migrating from an existing template, or when there is no Construct
Library for the AWS resources you need yet. In those case you can use |l1|
constructs to define |CFN| entities such as Resources, Parameters, Outputs, and
Conditions.

You can define your own higher-level constructs in
addition to the ones already provided, by creating a new class that
pdescribes your construct.

.. _aws_constructs_versus_cfn_resources:

|l2| Constructs vs |l1| Constructs
==================================

To illustrate the advantages that |l2| constructs have over
|l1| constructs, let's look at an example.

The :py:mod:`_aws-cdk_sns` Construct Library includes the `Topic` construct that
you can use to define an |SNS| topic:

.. code-block:: js

    import { Topic } from '@aws-cdk/sns';
    const topic = new Topic(this, 'MyTopic');

|l2| constructs encapsulate the
details of working with these AWS resources. For example, to subscribe a queue to a topic,
call the :py:meth:`_aws-cdk_sns.Topic.subscribeQueue` method with a queue object as the second argument:

.. code-block:: js

    const topic = new Topic(this, 'MyTopic');
    const queue = new Queue(this, 'MyQueue', {
        visibilityTimeoutSec: 300
    });

    topic.subscribeQueue('TopicToQueue', queue);

This method:

1. Creates a subscription and associates it with the topic and the queue.

2. Adds a queue policy with permissions for the topic to send messages to the queue.

To achieve a similar result using :py:mod:`_aws-cdk_resources`, you have to explicitly define the
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
of using the |l2| constructs instead of the |l1| constructs.

.. _purpose_built_constructs:

|l3| Constructs
===============

At an even higher-level than |l2| constructs, |l3|
constructs aggregate multiple, other constructs together
into common architectural patterns, such as a *queue processor* or an *HTTP
service*.

By leveraging these common patterns, you can assemble your
application even faster than by using |l2| constructs directly.

The |l3| constructs
are not included with the standard CDK Construct
Library. Instead, we encourage you to develop and share them inside your
organization or on GitHub.
