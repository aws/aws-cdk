.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _welcome:

#######
Welcome
#######

Welcome to the |cdk-long| (|cdk|) User Guide.
The |cdk| is a software development framework for defining cloud infrastructure in code.
It consists of a core framework library,
which implements the basic programming model;
a command-line toolkit;
and a set of AWS-vended class libraries for defining AWS resources
using rich object-oriented APIs.

Here's a short example of creating an |SNS| topic, an |SQS| queue,
and subscribing the topic to the queue.
We'll explain the code in more detail,
including how to see your |CFN| template before you deploy it,
in :doc:`getting-started`.

.. tabs::

   .. code-tab:: js

      const sns = require('@aws-cdk/aws-sns');
      const sqs = require('@aws-cdk/aws-sqs');
      const cdk = require('@aws-cdk/cdk');

      class HelloStack extends cdk.Stack {
        constructor(parent, id, props) {
          super(parent, id, props);

          const topic = new Topic(this, 'MyTopic');
          const queue = new Queue(this, 'MyQueue', {
            visibilityTimeoutSec: 300
          });

          topic.subscribeQueue(queue);
        }
      }

   .. code-tab:: ts

      import sns = require('@aws-cdk/aws-sns');
      import sqs = require('@aws-cdk/aws-sqs');
      import cdk = require('@aws-cdk/cdk');

      class HelloStack extends cdk.Stack {
        constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
          super(parent, name, props);

          const topic = new sns.Topic(this, 'MyTopic');

          const queue = new sqs.Queue(this, 'MyQueue', {
            visibilityTimeoutSec: 300
          });

          topic.subscribeQueue(queue);
        }
      }

   .. code-tab:: java

      import com.amazonaws.cdk.App;
      import com.amazonaws.cdk.Stack;
      import com.amazonaws.cdk.StackProps;
      import com.amazonaws.cdk.aws.sns.Topic;
      import com.amazonaws.cdk.aws.sns.TopicProps;
      import com.amazonaws.cdk.aws.sqs.Queue;
      import com.amazonaws.cdk.aws.sqs.QueueProps;

      public class HelloStack extends Stack {
          public HelloStack(final App parent, final String name, final StackProps props) {
              super(parent, name, props);

              Topic topic = new Topic(this, "MyTopic");

              Queue queue = new Queue(this, "MyQueue", QueueProps.builder()
                      .withVisibilityTimeoutSec(300)
                      .build());

              topic.subscribeQueue(queue);
          }
      }

The process of creating your AWS resources using the |cdk| is straightforward:

1. Follow the setup instructions to Install the |cdk| on your development machine.
2. Run the **cdk init** command to create the skeleton of your program
   in one of the supported programming languages
3. Use your favorite development environment to define your AWS application infrastructure
   using the |l2|
4. Compile your code, if necessary
5. (Optional) Run the |cdk| toolkit **cdk synth** command to see what your |CFN| template looks like
6. Run the |cdk| toolkit **cdk deploy** command to deploy the resulting |CFN| template
   and create the AWS resources in your AWS account
7. Repeats steps 3-6 until you are satisfied with your resources

.. note:: There is no charge for using the |cdk|, however you may incur AWS charges for creating or using AWS
          `chargeable resources <http://docs.aws.amazon.com/general/latest/gr/glos-chap.html#chargeable-resources>`_,
          such as running |EC2| instances or using |S3| storage.
          Use the
          `AWS Simple Monthly Calculator <http://calculator.s3.amazonaws.com/index.html>`_
          to estimate charges for the use of various AWS resources.

.. _aws_cdk_additional_resources:

Additional Documentation and Resources
======================================

In addition to this guide, the following are other resources available to |cdk| users:

* `AWS Developer blog <https://aws.amazon.com/blogs/developer/>`_
* `GitHub repository <https://github.com/awslabs/aws-cdk>`_

  * `Documentation source <https://github.com/awslabs/aws-cdk/tree/master/packages/aws-cdk-docs/src>`_
  * `Issues <https://github.com/awslabs/aws-cdk/issues>`_
  * `License <https://github.com/awslabs/aws-cdk/blob/master/LICENSE.md>`_

* :doc:`getting-started`
* `TypeScriptLang.org <https://www.typescriptlang.org/>`_

.. TBD:
   * FAQ (link)
   * Installing the |cdk| (video) (link)

.. _about-aws:

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
