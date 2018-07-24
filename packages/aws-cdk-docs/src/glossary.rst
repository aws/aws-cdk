.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _glossary:

##############
|cdk| Glossary
##############

The |cdk| uses the following terms.
Some are based on AWS CloudFormation `concepts <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html>`_.

app
   An executable program that the |cdk| uses to synthesize a |CFN| template.
   Apps are:

   * Written by a user
   * Contain one or more stacks that can be deployed into multiple AWS environments
   * Define the infrastructure of your application

   Apps extend the :py:class:`aws-cdk.App` class.

applet
   A reusable |cdk| construct that can be instantiated and deployed through a
   YAML-format file.

|cdk-long| (|cdk|)
   An AWS toolkit that enables infrastructure as code (IaC), exposing AWS
   resources and high-level constructs for use in popular DevOps programming
   languages.

construct
   The building block of an |cdk| app or library. In code, they are instances of
   the :py:class:`aws-cdk.Construct` class or a class that extends the
   :py:class:`aws-cdk.Construct` class.

environment
   An AWS deployment target for |cdk| stacks, defined by a specific AWS account and region.

|l1|
   The lowest-level construct, which maps directly to an |CFN| resource,
   as described in the
   `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.
   These constructs are available in the :py:mod:`@aws-cdk/resources` package,
   as the |CFN| name, in lower case, with a **Resource** suffix within the AWS service namespace,
   such as **sqs.QueueResource**, which represents an |SQS| queue.

|l2|
   A construct that provides high-level APIs for AWS services.
   Their names imply the underlying AWS service.
   For example, |S3| resources are available through the **@aws-cdk/aws-s3** package.

.. |l3|
   A construct that abstracts common architectural
   patterns on AWS. These are not supplied with the standard |cdk| distribution,
   but are shared within your organization or on GitHub.

stack
   An |cdk| construct that can be deployed into an environment.
   Stacks extend the :py:class:`aws-cdk.Stack` class.
