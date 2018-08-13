.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _aws_construct_lib:

#####################
AWS Construct Library
#####################

The AWS Construct Library is a set of modules which expose a rich API for
defining AWS resources in CDK apps. The AWS Construct Library is organized to
modules based on the AWS service the resource belongs to. For example, the
:py:mod:`@aws-cdk/aws-ec2` module includes the `@aws-cdk/aws-ec2.VpcNetwork`
construct which makes it easy to define an `Amazon VPC
<https://aws.amazon.com/vpc>`_ in your CDK app.

The AWS Construct Library includes many common patterns and capabilities which
are designed to allow developers to focus on their application-specific
architectures and reduces the boilerplate and glue logic needed when working
with AWS.

Least-Privilege IAM policies
----------------------------

IAM policies are automatically defined based on intent. For example, when
subscribing an AWS SNS :py:class:`Topic <@aws-cdk/aws-sns.Topic>` to a AWS Lambda
:py:class:`Function <@aws-cdk/aws-lambda.Function>`, the function's IAM permission
policy will automatically be modified to allow the specific topic to invoke the
function.

Furthermore, most AWS Constructs expose ``grant*`` methods which allow
intent-based permission definitions. For example, the AWS S3 :py:class:`Bucket <@aws-cdk/aws-s3.Bucket>`
construct has a :py:meth:`grantRead(principal) <@aws-cdk/aws-s3.BucketRef.grantRead>`
method which accepts an AWS IAM :py:class:`Principal <@aws-cdk/aws-iam.IPrincipal>`
such as a :py:class:`User <@aws-cdk/aws-iam.User>` or a :py:class:`Role <@aws-cdk/aws-iam.Role>`,
and will modify their policy to allow the principal to read objects from the bucket.

Event-driven APIs
------------------

Many of the AWS constructs include ``on*`` methods which can be used to react
to events emitted by the construct. For example, the AWS CodeCommit
:py:mod:`Repository <@aws-cdk/aws-codecommit.Repository>` construct has an
:py:meth:`onCommit <@aws-cdk/aws-codecommit.RepositoryRef.onCommit>` method.

AWS Constructs that can be used as targets for various event providers implement
interfaces such as :py:mod:`IEventRuleTarget <@aws-cdk/aws-events.IEventRuleTarget>`
(for AWS CloudWatch Event Rule target),
:py:mod:`IAlarmAction <@aws-cdk/aws-cloudwatch.IAlarmAction>`
(for AWS CloudWatch Alarm actions), etc.

For more information see the :doc:`refs/_aws-cdk_aws-cloudwatch` and :doc:`refs/_aws-cdk_aws-events`
documentation.

Security Groups
---------------

EC2 network entities such as the :py:mod:`Elastic Load Balancer <@aws-cdk/aws-ec2.ElasticLoadBalancer`
and :py:mod:`AutoScalingGroup <@aws-cdk/aws-ec2.AutoScalingGroup>` instances can connect to each other
based on definitions of security groups.

The AWS CDK provides a rich API for defining security group connections. For more information,
see **Allowing Connections** in the :doc:`@aws-cdk/aws-ec2 <refs/_aws-cdk_aws-ec2>` documentation.

Metrics
-------

Many AWS resources emit AWS CloudWatch metrics as part of their normal operation. Metrics can
be used to setup :py:mod:`Alarms <@aws-cdk/aws-cloudwatch.Alarm>` or included in :py:mod:`Dashboards <@aws-cdk/aws-cloudwatch.Dashboard>`.

:py:mod:`Metric <@aws-cdk/aws-cloudwatch.Metric>` objects for AWS Constructs can be obtained
via ``metricXxx()`` methods. For example, the :py:meth:`metricDuration() <@aws-cdk/aws-lambda.FunctionRef.metricDuration>`
method reports the execution time of an AWS Lambda function.

For more information see the :doc:`refs/_aws-cdk_aws-cloudwatch` documentation.

Imports
-------

If you need to reference a resource which is defined outside of your CDK app (e.g. a bucket, a VPC, etc),
you can use the ``Xxxx.import(...)`` static methods which are available on AWS Constructs. For example,
the :py:meth:`Bucket.import() <@aws-cdk/aws-s3.BucketRef.import>` method can be used to obtain
a :py:mod:`BucketRef <@aws-cdk/aws-s3.BucketRef>` object which can be used in most places where
a bucket is required. This patterns allows treating resources defined outside your app as if they
were part of your app.

AWS CloudFormation Layer
------------------------

Every module in the AWS Construct Library includes a ``cloudformation`` namespace which contains
low-level constructs which represent the low-level AWS CloudFormation semantics of this service.
See :py:doc:`cloudformation` for details.
