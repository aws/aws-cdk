.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _creating_constructs:

#########################
Creating |cdk| Constructs
#########################

This topic provides information on how to create constructs in the |cdk|.

.. _what_are_constructs:

What Are Constructs?
====================

As described in :doc:`concepts`,
constructs are components that developers can combine into other constructs and
an application stack to create an |cdk| application.

The lowest-level |cdk| construct is an |l1|,
which represents a single AWS service resource,
such as an SNS topic or an SQS queue.

The next level of constructs,
which we call an |l2|,
consist of two or more |level1| constructs.
For example, the stack described in the :doc:`getting-started` topic consists of an |SQS| queue,
|SNS| topic, a subscription between the topic and the queue,
and an |IAM| policy document.

The |cdk| includes a variety of |level2| constructs,
and you can create your own for special needs.

The |cdk| also includes a library of |level3| constructs
that consist of two or more |l2| objects,
where some or most of the run-time attributes, such as the Region or availability zone, are specified.

To create an |l1|, see :doc:`cloudformation`.

The rest of this topic describes how to create an |l2|
and contribute it to the |cdk| as a pull request.

.. _creating_l2_constructs:

Creating |level2| Constructs
============================

To create a new |l2| as a pull request to the |cdk|:

* Clone the |cdk| project to your computer:

.. code-block:: sh

   mkdir ~/cdk
   cd ~/cdk
   git clone ...

* Create a new branch to hold your code

.. code-block:: sh

   git checkout my-branch

* Create a new folder, *aws-cdk-RESOURCE*, in *packages/*,
  where *RESOURCE* is the name of a |cfn| resource.

* Code goes in *lib/*; tests in *test/*.

* Create an *index.ts* file that only imports the other *NAME.ts* files,
  where *NAME* indicates the functionality within the file.

* Create *NAME.ts* for each set of related classes,
  such as an L2 and its props.

In *NAME.ts*:

* Create a class.

* Create the related props interface.

* Instantiate the resource.

* Add enhancements as methods.

* Set props to reasonable default values
  (think clicking through the console and accepting those defaults).

* Don't forget to implement **validate()**.

Finally for the package:

* Add a test, *test.NAME.ts*, for each L2 construct.

* Create an integration test, *integ.everything.ts*.

* Once everything looks good, navigate to the |cdk| project in GitHub,
  select your branch, and next to the **Branch** menu select **New pull request**.

See the **aws-cdk-dynamodb** package for examples.
