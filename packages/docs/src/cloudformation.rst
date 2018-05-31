.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _cloudformation:

###################
Using CloudFormation Resource Constructs
###################

CloudFormation Resource constructs are found in the :py:mod:`aws-cdk-resources` package. They map directly onto |cfn|
resources.

.. important::

  In general, you shouldn't need to use this type of Constructs, unless you have
  special requirements or there is no Construct Library for the AWS resource you
  need yet. Prefer using other packages with higher-level constructs instead. See
  :ref:`l1_vs_l2` for a comparison between the construct types.

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
