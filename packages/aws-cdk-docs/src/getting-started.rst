.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. note:: These instructions are only for the Amazon-internal preview of the |cdk|.

.. _getting_started:

##############################
Getting Started With the |cdk|
##############################

This topic provides information for those getting started with the |cdk-long| (|cdk|).

.. _hello_cdk:

Hello, CDK!
===========

Let's use the |cdk| to create an |CFN| an |SQS| queue, an |SNS| topic, a subscription between the topic and the queue,
and an |IAM| policy document that enables the
topic to send messages to the queue.

.. _hello_cdk_typescript

.. _create_dirs:

Create Your Project Structure
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use **cdk init --lang** *LANGUAGE* to create a skeleton for your |cdk| project
in one of the supported programming languages.
For the examples in this section we'll use TypeScript.

.. code-block:: sh

   mkdir hello-cdk
   cd hello-cdk
   cdk init --language=typescript

The **cdk init** command creates a skeleton |cdk| program for you to work with
and displays some useful commands to help you get started.

.. note:: You can use an IDE, such as
   `Microsoft Visual Code <https://code.visualstudio.com/>`_,
   `Sublime Text <https://www.sublimetext.com/>`_ with the
   `Sublime TypeScript <https://github.com/Microsoft/TypeScript-Sublime-Plugin>`_ plugin, or
   `Atom <https://atom.io/>`_ with the
   `Atom TypeScript <https://atom.io/packages/atom-typescript>`_ plugin,
   to get auto-completion in your Typescript code.

Replace the contents of the file *index.ts* with the following code to create a class that
extends **Stack**, and include some construction logic.

.. code-block:: js

    // You'll need this statement in every app
    import { App, Stack, StackProps } from '@aws-cdk/core';

    // The SNS resources, such as Topic, are defined in aws-cdk-sns
    import { Topic } from '@aws-cdk/sns';

    // The SQS resources, such as Queue, are defined in aws-cdk-sqs
    import { Queue } from '@aws-cdk/sqs';

    class HelloStack extends Stack {
        // Instantiate HelloStack with a reference to its parent,
	// as it might need some context;
	// a name; and some optional properties.
	// You'll almost always use these same two lines.
        constructor(parent: App, name: string, props?: StackProps) {
            super(parent, name, props);

	    // Create an SNS topic
            const topic = new Topic(this, 'MyTopic');

	    // Create an SQS queue
	    const queue = new Queue(this, 'MyQueue', {
	      // By default you only get 30 seconds to delete a read message after you've read it;
	      // otherwise it becomes available to other consumers.
	      // This extends that duration to 5 minutes.
              visibilityTimeoutSec: 300
            });

	    // Subscribe the topic to the queue
            topic.subscribeQueue(queue);
        }
    }

    // Create a new App and associate the HelloStack stack with it.
    const app = new App(process.argv);
    new HelloStack(app, 'hello-cdk');

    // Boilerplate to produce the CloudFormation template
    process.stdout.write(app.run());

.. _compile:

Compiling the App
-----------------

Use one of the commands in the following table to compile your app.
You must compile your app every time you change it.

.. list-table::
  :widths: 1 2
  :header-rows: 1

  * - Language
    - Compilation Command

  * - TypeScript
    - `npm run prepare`
      (use `npm run watch` in a separate command window to watch for source changes and automatically recompile)

.. _create_cloud_formation:

Synthesizing a CloudFormation Template
--------------------------------------

Use the **cdk synth** command to synthesize a |CFN| template for a stack in your app.
You do not need to synthesize your |CFN| template to deploy it.

.. code-block:: console

   cdk synth

You should see output similar to the following:

.. code-block:: yaml

    Resources:
        MyTopic86869434:
            Type: 'AWS::SNS::Topic'
        MyTopicTopicToQueue2F98E5BA:
            Type: 'AWS::SNS::Subscription'
            Properties:
                Endpoint:
                    'Fn::GetAtt':
                        - MyQueueE6CA6235
                        - Arn
                Protocol: sqs
                TopicArn:
                    Ref: MyTopic86869434
        MyQueueE6CA6235:
            Type: 'AWS::SQS::Queue'
	    Properties:
                VisibilityTimeout: 300
        MyQueuePolicy6BBEDDAC:
            Type: 'AWS::SQS::QueuePolicy'
            Properties:
                PolicyDocument:
                    Statement:
                        -
                            Action: 'sqs:SendMessage'
                            Condition:
                                ArnEquals:
                                    'aws:SourceArn':
                                        Ref: MyTopic86869434
                            Effect: Allow
                            Principal:
                                Service: sns.amazonaws.com
                            Resource:
                                'Fn::GetAtt':
                                    - MyQueueE6CA6235
                                    - Arn
                    Version: '2012-10-17'
                Queues:
                    -
                        Ref: MyQueueE6CA6235


As you can see, the call to :py:meth:`_aws-cdk_sns.TopicRef.subscribeQueue` on
the :py:class:`_aws-cdk_sns.Topic` resulted in:

1. Creating an **AWS::SNS::Subscription** associated with the queue and the topic.
2. Adding a statement to the **AWS::SQS::QueuePolicy**, which allows the topic to send messages to the queue.

.. _deploy_your_stack:

Deploying Your Stack
---------------------

Use **cdk deploy** to deploy the stack. As **cdk deploy** executes you
should see information messages, such as feedback from CloudFormation logs.

.. code-block:: sh

   cdk deploy

.. note:: You must specify your default credentials and region to use the **cdk deploy** command.

   Use the `AWS Command Line Interface <https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html>`_
   ``aws configure`` command to specify your default credentials and region.
   
   Important: make sure that you explicitly specify a **region**.

   You can also set environment variables for your default credentials and region.
   Environment variables take precedence over settings in the credentials or config file.

   * *AWS_ACCESS_KEY_ID* specifies your access key
   * *AWS_SECRET_ACCESS_KEY* specifies your secret access key
   * *AWS_DEFAULT_REGION* specifies your default region

   See `Environment Variables <https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html>`_
   in the CLI User Guide for details.

.. _making_changes:

Making Changes
--------------

Let's change the visibility timeout of the queue from 300 to 500.

.. code-block:: javascript

    const queue = new Queue(this, 'MyQueue', {
        visibilityTimeoutSec: 500
    });

Run the following command to see the difference between the *deployed* stack and your |cdk| project
(if you haven't deployed the stack, you won't see any output):

.. code-block:: sh

   cdk diff

You should see something like the following.

.. code-block:: sh

    [~] 🛠 Updating MyQueueE6CA6235 (type: AWS::SQS::Queue)
     └─ [+] .VisibilityTimeout:
         ├  Old value: 300
         └─ New value: 500

If the changes are acceptable, use **cdk deploy** to update your
infrastructure.
