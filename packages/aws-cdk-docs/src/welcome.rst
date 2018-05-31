.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. Synched with release 1.0.200180 on 3/15/2018

.. _welcome:

#######
Welcome
#######

Welcome to the |cdk-long| (|cdk|) User Guide.

The |cdk| is a software development framework which allows
developers to model model AWS infrastructure components as code.

Modern web services rely more and more on infrastructure to achieve their goals.
As the complexity of these applications increases, there is a growing need for
modeling techniques and tools to enable sharing and reusing higher-level
infrastructure building blocks. Previously, achieving even seemingly trivial tasks on
AWS, such as deploying a service on an EC2 fleet, require deep understanding of
the low-level building blocks.

The |cdk| takes a code-first approach to cloud architectures and allows developers
to use familiar object-oriented idioms to describe their architecture
**constructs**.

.. note:: There is no charge for using the |cdk|, however you may incur AWS charges for creating or using AWS
	  `chargeable resources <http://docs.aws.amazon.com/general/latest/gr/glos-chap.html#chargeable-resources>`_,
	  such as running Amazon EC2 instances or using Amazon S3 storage.
	  Use the
	  `AWS Simple Monthly Calculator <http://calculator.s3.amazonaws.com/index.html>`_
          to estimate charges for the use of various AWS resources.

.. _terminology:

Terminology
===========

The |cdk| uses the following terms.

|cdk-long| (|cdk|)
   An AWS toolkit that enables infrastructure as code (IaC), exposing AWS
   resources and high level constructs for use in popular DevOps programming
   languages.

construct
   The building block of an |cdk| app or library. In code, they are instances of
   the :py:class:`aws-cdk.Construct` class or a class that extends the
   :py:class:`aws-cdk.Construct` class.

app
   An executable program that the |cdk| uses to synthesize artifacts
   that can contain multiple stacks and be deployed into multiple AWS environments.
   Apps extend the :py:class:`aws-cdk.App` class.

environment
   An AWS deployment target for |cdk| stacks, defined by a specific AWS account and region.

stack
   An |cdk| construct that can be deployed into an environment.
   Stacks extend the :py:class:`aws-cdk.Stack` class.

applet
   A reusable |cdk| construct that can be instantiated and deployed through a
   YAML-format file.

CloudFormation Resource construct
   The lowest-level construct, which map directly to an |CFN| resource,
   as described in the
   `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.
   These constructs are available in the :py:mod:`aws-cdk-resources` package
   as the |CFN| name with a **Resource** suffix within the AWS service namespace,
   such as **sqs.QueueResource** representing an |SQS| queue.

Construct Library construct
   A construct that provides high level APIs for a AWS services.
   Their names imply the underlying AWS service.
   For example, |s3| resources are available through the **aws-cdk-s3**
   Construct Library.

Purpose-built construct
   Purpose-built construct, designed to abstract away common architectural
   patterns on AWS. These are not supplied with the standard CDK distribution,
   but are shared within your organization or on GitHub.

.. _aws_cdk_additional_resources:

Additional Documentation and Resources
======================================

In addition to this guide, there are a number of other resources available for |cdk| users:

* `AWS Developer blog <https://aws.amazon.com/blogs/developer/>`_
* GitHub

  * documentation source (link TBD)
  * documentation issues (link TBD)
  * toolkit source (link TBD)
  * toolkit issues (link TBD)

* License (link TBD)
* FAQ (link TBD)
* :doc:`getting-started`
* Installing the |cdk| (video) (link TBD)
* `TypeScriptLang.org <https://www.typescriptlang.org/>`_

.. _about-aws:

About Amazon Web Services
=========================

Amazon Web Services (AWS) is a collection of digital infrastructure services that developers can
leverage when developing their applications. The services include computing, storage, database, and
application synchronization (messaging and queuing).

AWS uses a pay-as-you-go service model. You are charged only for the services that you |mdash| or
your applications |mdash| use. Also, to make AWS useful as a platform for prototyping and
experimentation, AWS offers a free usage tier, in which services are free below a certain level of
usage. For more information about AWS costs and the free usage tier go to
`Test-Driving AWS in the Free Usage Tier <http://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-free-tier.html>`_.

To obtain an AWS account, go to `aws.amazon.com <https://aws.amazon.com>`_ and click :guilabel:`Create a Free Account`.
