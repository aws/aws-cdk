.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

#######
Welcome
#######

Welcome to the |cdk-long| (|cdk|) User Guide.

The |cdk| is an infrastructure modeling framework that allows you to define your
cloud resources using an imperative programming interface.

Developers can use one of the supported programming languages to define reusable
cloud components called :doc:`constructs`, which are composed together into
:doc:`stacks` and :doc:`apps`.

Apps are synthesized to AWS CloudFormation Templates and deployed to the AWS
Cloud using the :ref:`CDK Command Line Toolkit <toolkit>` or via a CI/CD pipeline.

The CDK is shipped with a rich library of constructs called the :doc:`AWS Construct
Library <aws-construct-lib>`, which includes constructs for all AWS services.

To get started see :doc:`getting-started`

.. note:: There is no charge for using the |cdk|, however you may incur AWS charges for creating or using AWS
          `chargeable resources <http://docs.aws.amazon.com/general/latest/gr/glos-chap.html#chargeable-resources>`_,
          such as running |EC2| instances or using |S3| storage.
          Use the
          `AWS Simple Monthly Calculator <http://calculator.s3.amazonaws.com/index.html>`_
          to estimate charges for the use of various AWS resources.

Additional Documentation and Resources
======================================

In addition to this guide, the following are other resources available to |cdk| users:

* `AWS Developer blog <https://aws.amazon.com/blogs/developer/>`_
* `GitHub repository <https://github.com/awslabs/aws-cdk>`_

  * `Examples <https://github.com/awslabs/aws-cdk/tree/master/examples>`_
  * `Documentation source <https://github.com/awslabs/aws-cdk/tree/master/packages/aws-cdk-docs/src>`_
  * `Issues <https://github.com/awslabs/aws-cdk/issues>`_
  * `License <https://github.com/awslabs/aws-cdk/blob/master/LICENSE>`_

.. TBD:
   * FAQ (link)
   * Installing the |cdk| (video) (link)

About Amazon Web Services
=========================

Amazon Web Services (AWS) is a collection of digital infrastructure services that developers can
leverage when developing their applications. The services include computing, storage, database, and
application synchronization (messaging and queuing).

AWS uses a pay-as-you-go service model. You are charged only for the services that you |mdash| or
your applications |mdash| use. Also, to make AWS useful as a platform for prototyping and
experimentation, AWS offers a free usage tier, in which services are free below a certain level of
usage. For more information about AWS costs and the free usage tier, see
`Test-Driving AWS in the Free Usage Tier <http://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-free-tier.html>`_.

To obtain an AWS account, go to `aws.amazon.com <https://aws.amazon.com>`_ and click :guilabel:`Create an AWS Account`.

.. toctree::
   :maxdepth: 2
   :hidden:

   Getting Started <getting-started>
   Concepts <concepts>
   AWS Construct Library <aws-construct-lib>
   AWS CloudFormation Library <cloudformation>
   Examples <examples>
   Tools <tools>
