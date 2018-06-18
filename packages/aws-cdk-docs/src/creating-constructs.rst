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

As described in :doc:`concepts`, constructs are components that developers can
combine into other constructs and an application stack to create an |cdk|
application.

The lowest-level |cdk| construct is a Resource Construct, which represents a
single AWS service resource, such as an SNS topic or an SQS queue.

The next level of constructs, which we call a Construct Library Construct,
typicall wraps one or more Resource Constructs and adds higher-level
abstractions. These can include:

* Convenient defaults.
* Automatic creation of related resources such as policy documents, IAM roles or encryption keys.
* Methods to make the resource interact with other resources.

For example, the stack described in the :doc:`getting-started` topic consists of
an |SQS| queue, |SNS| topic, a subscription between the topic and the queue, and
an |IAM| policy document.

The |cdk| includes a variety of Library constructs, and you can create your own
for special needs. You might even consider writing and publishing purpose-built
constructs (:ref:`purpose_built_constructs`) to solve common business needs. Be
sure to have a look at the :ref:`guidelines` section on tips for developing
new constructs.

Whether you're planning to write a purpose-built construct for your own
application or submit a new Construct Library construct to the CDK, the process
is quite similar. It's described below:

.. _creating_l2_constructs:

Creating Construct Library constructs
=====================================

To create a new Construct Library construct as a pull request to the |cdk|:

* Fork the |cdk| project to your own GitHub account.
* Clone the repository to your computer:

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
  such as the construct itself and its props interface.

In *NAME.ts*:

* Create a class.

* Create the related props interface.

* Instantiate the resource.

* Add enhancements as methods.

* Set props to reasonable default values
  (think clicking through the console and accepting those defaults).

* Don't forget to implement **validate()**.

Finally for the package:

* Add a test, *test.NAME.ts*, for each construct.

* Create an integration test, *integ.everything.ts*.

* Commit your changes and push them back to GitHub.

* Once everything looks good, navigate to the |cdk| project on the GitHub
  website, select your branch, and next to the **Branch** menu select **New pull
  request**.

See the **aws-cdk-dynamodb** package for examples.

Validation
----------

Validation happens in one of two places:

* In the constructor, to validate the properties that are passed in.
* If the Construct offers methods that mutate the state of the Construct,
  in the Construct's :py:meth:`_aws-cdk_core.Construct.validate` method. This
  method is called by the framework after the Construct hierarchy has been set up,
  and is expected to return a list of validation error messages.

Construct implementors should prefer throwing validation errors in the constructor,
falling back to overriding the :py:meth:`_aws-cdk_core.Construct.validate` method
only if the Construct offers mutating members.

Example of implementing validate:

.. code-block:: js

    class MyConstruct extends Construct {
      public validate() {
        if (this.getChildren().length > 1) {
          return [ 'this construct can only have a single child' ];
        }
        else {
          return [ ];
        }
      }
    }
