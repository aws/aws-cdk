.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _cloudformation:

##########################
AWS CloudFormation Library
##########################

The :doc:`AWS Construct Library <aws-construct-lib>` includes constructs with rich APIs
for defining AWS infrastructure. For example, the
:py:class:`@aws-cdk/aws-s3.Bucket` construct can be used to define S3 Buckets,
the :py:class:`@aws-cdk/aws-sns.Topic` construct can be used to define SNS
Topics, etc.

Under the hood, these constructs are implemented using CloudFormation resources,
which are available under the **cloudformation** namespace of each library. For
example, the :py:class:`@aws-cdk/aws-s3.Bucket` construct uses the
:py:class:`@aws-cdk/aws-s3.cloudformation.BucketResource` resource (as well as
other resources, depending on what bucket APIs are used).

.. important::

  Generally, when building CDK apps, you shouldn't need to interact
  CloudFormation directly. However, there might be advanced use cases and
  migration scenarios where this might be required. We are also aware that
  there might be gaps in capabilities in the AWS Construct Library over time.

Resources
---------

CloudFormation resource classes are automatically generated from the `AWS
CloudFormation Resource Specification
<https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html>`_
and available under the **cloudformation** namespace of each AWS library. Their
API matches 1:1 with how you would use these resources in CloudFormation.

When defining CloudFormation resource, the **props** argument of the class
initializer will match 1:1 to the resource's properties in CloudFormation.

For example, to define an
`AWS::SQS::Queue <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html>`_
resource encrypted with an AWS managed key you can directly specify the
`KmsMasterKeyId <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-kmsmasterkeyid>`_
property.

.. code-block:: js

    import { cloudformation } from '@aws-cdk/aws-sqs';

    new cloudformation.QueueResource(this, 'MyQueueResource', {
        kmsMasterKeyId: 'alias/aws/sqs'
    });

For reference, if you use the :py:class:`@aws-cdk/aws-sqs.Queue` construct, you
can define managed queue encryption as follows:

.. code-block:: js

    import sqs = require('@aws-cdk/aws-sqs');

    new sqs.Queue(this, 'MyQueue', {
        encryption: sqs.QueueEncryption.KmsManaged
    });


.. _construct_attributes:

Resource Attributes
-------------------

To reference the runtime attributes of CloudFormation resources,
use one of the properties available on the resource object.

The following example configures a |LAM| function's dead letter queue to use a
the ARN of an |SQS| queue resource.

.. code-block:: js

   import { cloudformation as sqscfn } from '@aws-cdk/aws-sqs';
   import { cloudformation as lambdacfn } from '@aws-cdk/aws-lambda';

   const dlq = new sqscfn.QueueResource(this, { name: 'DLQ' });

   new lambdacfn.FunctionResource(this, {
      deadLetterConfig: {
         targetArn: dlq.queueArn
      }
   });

The :py:attr:`@aws-cdk/cdk.Resource.ref` attribute represents the |cfn|
resource's intrinsic reference (or "Return Value"). For example, for `dlq.ref`
will also `refer
<http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-properties-sqs-queues-ref>`_
to the queue's ARN. When possible, it is preferrable to use an explicitly named
attribute instead of *ref*.

.. _resource_options:

Resource Options
----------------

The :py:attr:`@aws-cdk/cdk.Resource.options` object includes |CFN| options, such
as :code:`condition`, :code:`updatePolicy`, :code:`createPolicy` and
:code:`metadata`, for a resource.

.. _parameters:

Parameters
----------

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { cloudformation } from '@aws-cdk/aws-sns';
    import cdk = require('@aws-cdk/cdk');

    const p = new cdk.Parameter(this, 'MyParam', { type: 'String' });
    new cloudformation.TopicResource(this, 'MyTopic', { displayName: p.ref });

.. _outputs:

Outputs
-------

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { cloudformation } from '@aws-cdk/aws-sqs';
    import cdk = require('@aws-cdk/cdk');

    const queue = new cloudformation.QueueResource(this, 'MyQueue');
    const out = new cdk.Output(this, 'MyQueueArn', { value: queue.queueArn });

    const import = out.makeImportValue();
    assert(import === { "Fn::ImportValue": out.exportName }

.. _conditions:

Conditions
----------

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import { cloudformation } from '@aws-cdk/aws-sqs';
    import cdk = require('@aws-cdk/cdk');
    const cond = new cdk.Condition(this, 'MyCondition', {
        expression: new cdk.FnIf(...)
    });

    const queue = new cloudformation.QueueResource(this, 'MyQueue');
    queue.options.condition = cond;

.. _intrinsic_functions:

Intrinsic Functions
-------------------

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import cdk = require('@aws-cdk/cdk');
    new cdk.FnJoin(",", ...)

.. _pseudo_parameters:

Pseudo Parameters
-----------------

.. NEEDS SOME INTRO TEXT

.. code-block:: js

    import cdk = require('@aws-cdk/cdk');
    new cdk.AwsRegion()

.. Add a new topic in "Advanced Topics" about integrating
   cdk synch > mytemplate
   into a CI/CD pipeline
