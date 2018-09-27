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

.. _least_privilege:

Least-Privilege IAM Policies
============================

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

.. _event_driven_apis:

Event-Driven APIs
=================

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

.. _security_groups:

Security Groups
===============

EC2 network entities such as the :py:mod:`Elastic Load Balancer <@aws-cdk/aws-ec2.ElasticLoadBalancer`
and :py:mod:`AutoScalingGroup <@aws-cdk/aws-ec2.AutoScalingGroup>` instances can connect to each other
based on definitions of security groups.

The AWS CDK provides a rich API for defining security group connections. For more information,
see **Allowing Connections** in the :doc:`@aws-cdk/aws-ec2 <refs/_aws-cdk_aws-ec2>` documentation.

.. _metrics:

Metrics
=======

Many AWS resources emit AWS CloudWatch metrics as part of their normal operation. Metrics can
be used to setup :py:mod:`Alarms <@aws-cdk/aws-cloudwatch.Alarm>` or included in :py:mod:`Dashboards <@aws-cdk/aws-cloudwatch.Dashboard>`.

:py:mod:`Metric <@aws-cdk/aws-cloudwatch.Metric>` objects for AWS Constructs can be obtained
via ``metricXxx()`` methods. For example, the :py:meth:`metricDuration() <@aws-cdk/aws-lambda.FunctionRef.metricDuration>`
method reports the execution time of an AWS Lambda function.

For more information see the :doc:`refs/_aws-cdk_aws-cloudwatch` documentation.

.. _import:

Imports
=======

If you need to reference a resource which is defined outside of your CDK app (e.g. a bucket, a VPC, etc),
you can use the ``Xxxx.import(...)`` static methods which are available on AWS Constructs. For example,
the :py:meth:`Bucket.import() <@aws-cdk/aws-s3.BucketRef.import>` method can be used to obtain
a :py:mod:`BucketRef <@aws-cdk/aws-s3.BucketRef>` object which can be used in most places where
a bucket is required. This patterns allows treating resources defined outside your app as if they
were part of your app.

.. _cloudformation_layer:

Access the AWS CloudFormation Layer
===================================

This topic discusses ways to directly modify the underlying CloudFormation
resources at the AWS Construct Library. We also call this technique an "escape
hatch", as it allows users to "escape" from the abstraction boundary defined by
the AWS Construct and patch the underlying resources.

.. important::

   **We do not recommend this method, as it breaks the abstraction layer and
   might produce unexpected results**.

   Furthermore, the internal implementation of an AWS construct is not part of
   the API compatibility guarantees that we can make. This means that updates to
   the construct library may break your code without a major version bump.

AWS constructs, such as :py:class:`Topic <@aws-cdk/aws-sns.Topic>`, encapsulate
one or more AWS CloudFormation resources behind their APIs. These resources are
also represented as constructs under the ``cloudformation`` namespace in each
library. For example, the :py:class:`@aws-cdk/aws-s3.Bucket` construct
encapsulates the :py:class:`@aws-cdk/aws-s3.cloudformation.BucketResource`. When
a stack that includes an AWS construct is synthesized, the CloudFormation
definition of the underlying resources are included in the resulting template.

Eventually, the APIs provided by AWS constructs are expected to support all the
services and capabilities offered by AWS, but we are aware that the library
still has many gaps both at the service level (some services don't have any
constructs yet) and at the resource level (an AWS construct exists, but some
features are missing).

.. note::

   If you encounter a missing capability in the AWS Construct Library, whether
   it is an entire library, a specific resource or a feature,
   `raise an issue <https://github.com/awslabs/aws-cdk/issues/new>`_ on GitHub,
   and letting us know.

This topic covers the following use cases:

- How to access the low-level CloudFormation resources encapsulated by an AWS construct
- How to specify resource options such as metadata, dependencies on resources
- How to add overrides to a CloudFormation resource and property definitions
- How to directly define low-level CloudFormation resources without an AWS construct

You can also find more information on how to work directly with the AWS
CloudFormation layer under :py:doc:`cloudformation`.

Accessing Low-level Resources
-----------------------------

You can use :py:meth:`construct.findChild(id) <@aws-cdk/cdk.Construct.findChild>`
to access any child of this construct by its construct ID. By convention, the "main"
resource of any AWS Construct is called ``"Resource"``.

The following example shows how to access the underlying S3 bucket resource
given an :py:class:`s3.Bucket <@aws-cdk/s3.Bucket>` construct:

.. code-block:: ts

   // let's create an AWS bucket construct
   const bucket = new s3.Bucket(this, 'MyBucket');

   // we use our knowledge that the main construct is called "Resource" and
   // that it's actual type is s3.cloudformation.BucketResource; const
   const bucketResource = bucket.findResource('Resource') as s3.cloudformation.BucketResource;

At this point, ``bucketResource`` represents the low-level CloudFormation resource of type
:py:class:`s3.cloudformation.BucketResource <@aws-cdk/aws-s3.cloudformation.BucketResource>`
encapsulated by our bucket.

:py:meth:`construct.findChild(id) <@aws-cdk/cdk.Construct.findChild>` will fail
if the child could not be located, which means that if the underlying |l2| changes
the IDs or structure for some reason, synthesis fails.

It is also possible to use :py:meth:`construct.children <@aws-cdk/cdk.Construct.children>` for more
advanced queries. For example, we can look for a child that has a certain CloudFormation resource
type:

.. code-block:: ts

   const bucketResource =
      bucket.children.find(c => (c as cdk.Resource).resourceType === 'AWS::S3::Bucket')
      as s3.cloudformation.BucketResource;

From that point, users are interacting with CloudFormation resource classes
(which extend :py:class:`cdk.Resource <@aws-cdk/cdk.Resource>`), so we will look
into how to use their APIs in order to modify the behavior of the AWS construct
at hand.

Resource Options
----------------

:py:class:`cdk.Resource <@aws-cdk/cdk.Resource>` has a few facilities for
setting resource options such as ``Metadata``, ``DependsOn``, etc.

For example, this code:

.. code-block:: ts

   const bucketResource = bucket.findChild('Resource') as s3.cloudformation.BucketResource;

   bucketResource.options.metadata = { MetadataKey: 'MetadataValue' };
   bucketResource.options.updatePolicy = {
      autoScalingRollingUpdate: {
         pauseTime: '390'
      }
   };

   bucketResource.addDependency(otherBucket.findChild('Resource') as cdk.Resource);

Synthesizes the following template:

.. code-block:: json

   {
      "Type": "AWS::S3::Bucket",
      "DependsOn": [ "Other34654A52" ],
      "UpdatePolicy": {
         "AutoScalingRollingUpdate": {
               "PauseTime": "390"
         }
      },
      "Metadata": {
         "MetadataKey": "MetadataValue"
      }
   }

Overriding Resource Properties
------------------------------

Each low-level resource in the CDK has a strongly-typed property called
``propertyOverrides``. It allows users to apply overrides that adhere to the
CloudFormation schema of the resource, and use code-completion and
type-checking.

You will normally use this mechanism when a certain feature is available at the
CloudFormation layer but is not exposed by the AWS Construct.

The following example sets a bucket's analytics configuration:

.. code-block:: ts

   bucketResource.propertyOverrides.analyticsConfigurations = [
      {
            id: 'config1',
            storageClassAnalysis: {
               dataExport: {
                  outputSchemaVersion: '1',
                  destination: {
                        format: 'html',
                        bucketArn: otherBucket.bucketArn // use tokens freely
                  }
               }
            }
      }
   ];

Raw Overrides
-------------

In cases the strongly-typed overrides are not sufficient, or, for example, if
the schema defined in CloudFormation is not up-to-date, the method
:py:meth:`cdk.Resource.addOverride(path, value) <@aws-cdk/cdk.Resource.addOverride>`
can be used to define an override that will by applied to the resource
definition during synthesis.

For example:

.. code-block:: ts

   // define an override at the resource definition root, you can even modify the "Type"
   // of the resource if needed.
   bucketResource.addOverride('Type', 'AWS::S3::SpecialBucket');

   // define an override for a property (both are equivalent operations):
   bucketResource.addPropertyOverride('VersioningConfiguration.Status', 'NewStatus');
   bucketResource.addOverride('Properties.VersioningConfiguration.Status', 'NewStatus');

   // use dot-notation to define overrides in complex structures which will be merged
   // with the values set by the higher-level construct
   bucketResource.addPropertyOverride('LoggingConfiguration.DestinationBucketName', otherBucket.bucketName);

   // it is also possible to assign a `null` value
   bucketResource.addPropertyOverride('Foo.Bar', null);

Synthesizes to:

.. code-block:: json

   {
      "Type": "AWS::S3::SpecialBucket",
      "Properties": {
         "Foo": {
            "Bar": null
         },
         "VersioningConfiguration": {
            "Status": "NewStatus"
         },
         "LoggingConfiguration": {
            "DestinationBucketName": {
               "Ref": "Other34654A52"
            }
        }
      }
   }

Use ``undefined``, :py:meth:`cdk.Resource.addDeletionOverride <@aws-cdk/cdk.Resource.addDeletionOverride>`
or :py:meth:`cdk.Resource.addPropertyDeletionOverride <@aws-cdk/cdk.Resource.addPropertyDeletionOverride>`
to delete values:

.. code-block:: ts

   const bucket = new s3.Bucket(this, 'MyBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.KmsManaged
   });

   const bucketResource = bucket.findChild('Resource') as s3.cloudformation.BucketResource;
   bucketResource.addPropertyOverride('BucketEncryption.ServerSideEncryptionConfiguration.0.EncryptEverythingAndAlways', true);
   bucketResource.addPropertyDeletionOverride('BucketEncryption.ServerSideEncryptionConfiguration.0.ServerSideEncryptionByDefault');

Synthesizes to:

.. code-block:: json

   "MyBucketF68F3FF0": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
         "BucketEncryption": {
            "ServerSideEncryptionConfiguration": [
               {
                  "EncryptEverythingAndAlways": true
               }
            ]
         },
         "VersioningConfiguration": {
            "Status": "Enabled"
         }
      }
   }

Directly Defining CloudFormation Resources
-------------------------------------------

It is also possible to explicitly define CloudFormation resources in your stack.
To that end, instantiate one of the constructs under the ``cloudformation``
namespace of the dedicated library.

.. code-block:: ts

   new s3.cloudformation.BucketResource(this, 'MyBucket', {
      analyticsConfigurations: [
         // ...
      ]
   });

In the rare case where you want to define a resource that doesn't have a
corresponding ``cloudformation`` class (such as a new resource that was not yet
published in the CloudFormation resource specification), you can instantiate the
:py:class:`cdk.Resource <@aws-cdk/cdk.Resource>` object:

.. code-block:: ts

   new cdk.Resource(this, 'MyBucket', {
      type: 'AWS::S3::Bucket',
      properties: {
         AnalyticsConfiguration: [ /* ... */ ] // note the PascalCase here
      }
   });

