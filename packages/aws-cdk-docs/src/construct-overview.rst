.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _construct_overview:

Construct Overview
------------------

Constructs are the building blocks of |cdk| applications. Constructs can have
child constructs, which in turn can have child constructs, forming a
hierarchical tree structure.

The |cdk| includes with two different levels of constructs:

|l1|

  These constructs are low-level constructs that provide a direct, one-to-one,
  mapping to an |CFN| resource,
  as listed in the |CFN| topic `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.

  All |l1| members are found in the :py:mod:`aws-cdk-resources` package.

|l2|

  These constructs have been handwritten by AWS and come with
  convenient defaults and additional knowledge about the inner workings of the
  AWS resources they represent. In general, you will be able to express your
  intent without worrying about the details too much, and the correct resources
  will automatically be defined for you.

  |l2| members are found in the :py:mod:`aws-cdk-NAMESPACE` packages,
  where RESOURCE is the short name for the associated service,
  such as SQS for the |l2| for the |SQS| service.
  See the :ref:`reference` section for descriptions of the |cdk|
  packages and constructs.

.. Hide for now
   At an even higher-level than an |l2|, a |l3|
   aggregates multiple, other constructs together
   into common architectural patterns, such as a *queue processor* or an *HTTP
   service*.

   By leveraging these common patterns, you can assemble your
   application even faster than by using an |l2| directly.

   A |l3|
   is not included with the standard CDK Construct
   Library. Instead, we encourage you to develop and share them inside your
   organization or on GitHub.
