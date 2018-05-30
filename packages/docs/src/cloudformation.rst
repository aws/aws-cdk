.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _cloudformation:

#########################
Using |level1| Constructs
#########################

|level1| constructs are low-level constructs that provide a direct, one-to-one,
mapping to an |cfn| resource,
as listed in the |cfn| topic `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.

Avoid using |level1| constructs if possible.
Instead, use |level2| constructs where you don't really need to
know anything about |cfn|. You just define your intent and the underlying resources are
defined for you.

However, there are use cases where you need to directly define |cfn| resources,
such as when migrating from an existing template.
In those case you can use |level1| constructs
to define |cfn| entities such as resources, parameters, outputs, and conditions.

If you decide to create an |l2|,
especially one that you want to contribute to the |cdk| package,
see :doc:`creating-constructs`.

.. _aws_constructs_versus_cfn_resources:

|level2| Constructs versus CloudFormation Resources
===================================================

The |cdk| includes a set of libraries with constructs for defining AWS
resources that we call |level2| constructs.
For example, the :py:mod:`aws-cdk-sns` library includes the `Topic`
construct that you can use to define an |SNS| topic:

.. code-block:: js

    import { Topic } from 'aws-cdk-sns';
    const topic = new Topic(this, 'MyTopic');

|level2| constructs encapsulate the
details of working with these AWS resources. For example, to subscribe a queue to a topic,
call the :py:meth:`aws-cdk-sns.Topic.subscribeQueue` method with a queue object as the second argument:

.. code-block:: js

    const topic = new Topic(this, 'MyTopic');
    const queue = new Queue(this, 'MyQueue', {
        visibilityTimeoutSec: 300
    });

    topic.subscribeQueue('TopicToQueue', queue);

This method:

1. Creates a subscription and associates it with the topic and the queue.

2. Adds a queue policy with permissions for the topic to send messages to the queue.

The |CDK| also includes a low-level library (:py:mod:`aws-cdk-resources`) which
includes constructs for all |CFN| resources. This library is automatically
generated based on the `CloudFormation resource specification
<https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html>`_
and exposes the declarative API of CloudFormation resources.

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

This example shows one of the many benefits
of using the |level2| constructs instead of the |level1| constructs.

.. _construct_attributes:

Construct Attributes
====================

To reference the runtime attributes of constructs,
use one of the properties available on the construct object.

The following example configures a |LAM| function's dead letter queue to use a
the ARN of an |SQS| queue resource.

.. code-block:: js

   import { lambda, sqs } from 'aws-cdk-resources'

   const dlq = new sqs.QueueResource(this, { name: 'DLQ' });

   new lambda.FunctionResource(this, {
      deadLetterConfig: {
         targetArn: dlq.queueArn
      }
   });

The :py:attr:`aws-cdk.Resource.ref` attribute represents the |cfn|
resource's intrinsic reference (or "Return Value"). For example, for `queue.ref`
will also `refer <http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-properties-sqs-queues-ref>`_
to the queue's ARN. If possible, it is preferrable to use an explicitly
named attribute instead of *ref*.

.. _resource_options:

Resource Options
================

The :py:attr:`aws-cdk.Resource.options` object includes |CFN| options, such as
:code:`condition`, :code:`updatePolicy`, :code:`createPolicy` and
:code:`metadata`, for a resource.

.. _parameters:

Parameters
==========

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { Parameter } from 'aws-cdk';

    const p = new Parameter(this, 'MyParam', { type: 'String' });
    new sns.TopicResource(this, 'MyTopic', { displayName: p.ref });

.. _outputs:

Outputs
=======

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { Output } from 'aws-cdk';

    const queue = new sqs.QueueResource(this, 'MyQueue');
    const out = new Output(this, 'MyQueueArn', { value: queue.queueArn });

    const import = out.makeImportValue();
    assert(import === { "Fn::ImportValue": out.exportName }

.. _conditions:

Conditions
==========

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { Condition } from 'aws-cdk';
    const cond = new Condition(this, 'MyCondition', {
        expression: new FnIf(...)
    });

    const queue = new sqs.QueueResource(this, 'MyQueue');
    queue.options.condition = cond;

.. _intrinsic_functions:

Intrinsic Functions
===================

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { FnJoin } from 'aws-cdk';
    new FnJoin(",", ...)

.. _pseudo_parameters:

Pseudo Parameters
=================

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { AwsRegion } from 'aws-cdk';
    new AwsRegion()

.. _multiple_environments:

Creating Multiple Environments
==============================

As described in :doc:`concepts`,
an environment is the combination of account and Region.
To deploy |cdk| constructs to multiple Regions, you need multiple environments.
The simplest way to manage this action is to define your environments in the
|cx-json| file, as shown in the following example,
which defines a development environment in **us-west-2**
and a production environment in **us-east-1**.

.. SWAG coming:

.. code:: json

   "environments": {
      "production": {
         "account": "123456789012",
         "region": "us-east-1"
      },
      "dev": {
         "account": "123456789012",
         "region": "us-west-2"
      }
   }
