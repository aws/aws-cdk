.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. note:: These instructions are only for the Amazon-internal preview of the |cdk|.

.. _getting_started:

###############
Getting Started
###############

This topic provides information for those getting started with the |cdk-long| (|cdk|),
including information about how to install and set up the |cdk|.

.. _requirements:

Requirements
============

To run the |cdk|, you must have the following software installed on your system:

* `Node.js <https://nodejs.org/en/download/>`_ version 8.x or later

.. _installation:

Installing the |CDK|
====================

These instructions describe how to install the following |cdk| components on your system:

* The |cdk| shared libraries
* The |cdk| Toolkit - the ``cdk`` command-line interface

By default these are installed in:

* ~/.cdk on Linux or MacOS
* %USERPROFILE% on Windows

The various installers also add the *bin* directory within the installation directory to your
**PATH** environment variable.

.. _javascript_installation:

Installing the AWS CDK for JavaScript/TypeScript Development
------------------------------------------------------------

To install the |cdk| for TypeScript/JavaScript development,
use the following command.

.. code-block:: sh

   npm install -g aws-cdk-tools

To update the |cdk| after you have installed it,
use the following command.

.. code-block:: sh

   npm update -g aws-cdk-tools

.. _java_installation:

Installing the AWS CDK for Java Development
-------------------------------------------

To use the public beta release of the |cdk| for Java development,
declare the following in your *pom.xml* file.

.. code-block:: xml

   <dependencies>
    <dependency>
      <groupId>aws-cdk</groupId>
      <artifactId>aws-cdk</artifactId>
      <version>0.6</version>
    </dependency>
   </dependencies>

.. _dotnet_installation:

Installing the AWS CDK for .NET Development
-------------------------------------------

To install the |cdk| for .NET development,
use the following command.

.. code-block:: sh

   nuget install aws-cdk

To update the |cdk| after you have installed it,
use the following command.

.. code-block:: sh

   nuget update aws-cdk

.. _verifying_installation:

Verifying your CDK Installation
===============================

To verify the |cdk| is installed on your system, open a terminal/PowerShell console and run:

.. code-block:: sh

   cdk --version

This displays the current version of the |cdk|, which is |cdk-version|.

.. _credentials_and_region:

AWS Credentials and Region
==========================

Use the `AWS Command Line Interface <https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html>`_
``aws configure`` command to specify your default credentials and region.

You can also set environment variables for your default credentials and region.
Environment variables take precedence over settings in the credentials or config file.

* *AWS_ACCESS_KEY_ID* specifies your access key
* *AWS_SECRET_ACCESS_KEY* specifies your secret access key
* *AWS_DEFAULT_REGION* specifies your default region

See the `Environment Variables <https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html>`_
topic in the CLI User Guide for details.

.. _hello-stack:

Hello, CDK!
===========

Enough about installing, let's see some code!

Let's use the |cdk| to create an |CFN| template that
creates an |SQS| queue, |SNS| topic, a subscription between the topic and the queue,
and an |IAM| policy document that enables the
topic to send messages to the queue.

.. _create_dirs:

Create Your Project Structure
-----------------------------

Use **cdk init** to create a skeleton for your CDK project.
Currently only TypeScript is supported.

.. code-block:: sh

   mkdir hello-cdk
   cd hello-cdk
   cdk init typescript

**cdk init** creates a skeleton |cdk| program for you to work with
and displays some useful commands to help you get started.

Replace the contents of the file *index.ts* with the following code to create a class that
extends **Stack**, and include some construction logic.

.. code-block:: js

    import { App, Stack, StackProps } from "aws-cdk";
    import { Topic } from 'aws-cdk-sns';
    import { Queue } from 'aws-cdk-sqs';

    class HelloStack extends Stack {
        constructor(parent: App, name: string, props?: StackProps) {
            super(parent, name, props);

            const topic = new Topic(this, 'MyTopic');
            const queue = new Queue(this, 'MyQueue');

            topic.subscribeQueue('TopicToQueue', queue);
        }
    }

    const app = new App(process.argv);
    new HelloStack(app, 'hello-cdk');
    process.stdout.write(app.run());

.. _compile:

Compiling the App
-----------------

Use the following command to compile the TypeScript app *index.ts* into the JavaScript code *index.js*.
You must compile your app from TypeScript to JavaScript every time you change it.

.. code-block:: sh

   npm run prepare

You can have **npm** watch for source changes and automatically re-compile
those changes using the **watch** option.
Do not run the command in the background (Linux or MacOS).

.. code-block:: sh

   npm run watch

.. note:: You can use an IDE, such as
   `Microsoft Visual Code <https://code.visualstudio.com/>`_,
   `Sublime Text <https://www.sublimetext.com/>`_ with the
   `Sublime TypeScript <https://github.com/Microsoft/TypeScript-Sublime-Plugin>`_ plugin, or
   `Atom <https://atom.io/>`_ with the
   `Atom TypeScript <https://atom.io/packages/atom-typescript>`_ plugin,
   to get auto-completion in your Typescript code.

.. _create_cloud_formation:

Synthesizing a CloudFormation Template
--------------------------------------

Use the **cdk synth** command to synthesize a CloudFormation template for a stack in your app.

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


As you can see, the call to :py:meth:`aws-cdk-sns.TopicRef.subscribeQueue` on
the :py:class:`aws-cdk-sns.Topic` resulted in:

1. Creating an **AWS::SNS::Subscription** associated with the queue and the topic.
2. Adding a statement to the **AWS::SQS::QueuePolicy**, which allows the topic to send messages to the queue.

.. _deploy_your_stack:

Deploying your Stack
---------------------

Use **cdk deploy** to deploy the stack. As *cdk deploy* executes you
should see information messages, such as feedback from CloudFormation logs.

.. code-block:: sh

   cdk deploy

.. _making_changes:

Making changes
--------------

Let's change the visibility timeout of the queue from 300 to 500.

.. code-block:: javascript

    const queue = new Queue(this, 'MyQueue', {
        visibilityTimeoutSec: 500
    });

Run the following command to see the difference between the *deployed* stack and your CDK project:

.. code-block:: sh

   cdk diff

You should see something like the following.

.. code-block:: sh

    [~] 🛠 Updating MyQueueE6CA6235 (type: AWS::SQS::Queue)
    └─ [+] .VisibilityTimeout:
        └─ New value: 300

If the changes area acceptable, use **cdk deploy** to update your
infrastructure.
