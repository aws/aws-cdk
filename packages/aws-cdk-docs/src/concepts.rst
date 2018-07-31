.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _concepts:

##############
|cdk| Concepts
##############

This topic describes some of the concepts (the why and how)
behind the |cdk|.
It also discusses the advantages of a |l2| over a low-level |l1|.

|cdk| apps are represented as a hierarchal structure we call the *construct
tree*. Every node in the tree is a |construct-class| object. The
root of an |cdk| app is typically an |app-class| construct. Apps
contain one or more |stack-class| constructs, which are deployable
units of your app.

This composition of constructs gives you the flexibility to architect your app, such as
having a stack deployed in multiple regions. Stacks represent a collection of AWS resources, either directly or
indirectly through a child construct that itself represents an AWS resource, such as an |SQS|
queue, an |SNS| topic, an |LAM| function, or an |DDB| table.

This composition of constructs also means you can easily create sharable constructs,
and make changes to any construct and have those changes available to consumers
as shared class libraries.

.. toctree::
   :titlesonly:
   :caption: Topics
   :maxdepth: 1

   constructs
   stacks
   logical-ids
   environments
   apps
   assets
   applets
