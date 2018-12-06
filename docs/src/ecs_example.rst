.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _ecs_example:

#############
|ECS| Example
#############

This example walks you through creating a Fargate service running on an ECS cluster fronted by an internet-facing
application load balancer.

|ECSlong| (|ECS|) is a highly scalable, fast, container management service
that makes it easy to run, stop, and manage Docker containers on a cluster.
You can host your cluster on a serverless infrastructure that is managed by
|ECS| by launching your services or tasks using the Fargate launch type.
For more control you can host your tasks on a cluster of
|EC2long| (|EC2|) instances that you manage by using the EC2 launch type.

This example shows you how to launch some services using the Fargate launch type.
If you've ever used the console to create a Fargate service,
you know that there are many steps you must follow to accomplish that task.
AWS has a number of tutorials and documentation topics that walk you through
creating a Fargate service,
including:

* `How to Deploy Docker Containers - AWS <https://aws.amazon.com/getting-started/tutorials/deploy-docker-containers/>`_

* `Setting up with Amazon ECS <https://docs.aws.amazon.com/AmazonECS/latest/developerguide/get-set-up-for-amazon-ecs.html>`_ and 
  `Getting Started with Amazon ECS using Fargate <https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_GetStarted.html>`_

This example creates a similar Fargate service in |cdk| code.

Since |ECS| can be used with a number of AWS services,
you should understand how the |ECS| construct that we use in this example
gives you a leg up on using AWS services by providing the following benefits:

* Automatically configures a load balancer.

* Automatic security group opening for load balancers,
  which enables load balancers to communicate with instances
  without you explictly creating a security group.

* Automatic ordering dependency between service and load balancer attaching to a target group,
  where the |cdk| enforces the correct order of creating the listener before an instance is created

* Automatic userdata configuration on auto-scaling group,
  which creates the correct configuration to associate a cluster to AMI(s).
  
* Early validation of parameter combinations, which exposes |CFN| issues earlier, thus saving you deployment time.
  For example, depending upon the task, it is easy to mis-configure the memory settings.
  Previously you would not encounter an error until you deployed your app,
  but now the |cdk| can detect a misconfiguration and emit an error when you synthesize your app.

* Automatically adds permissions for |ECR| if you use an image from |ECR|
  When you use an image from |ECR|, the |cdk| adds the correct permissions.

* Automatic autoscaling
  The |cdk| supplies a method so you can autoscaling instances when you use an |EC2| cluster;
  this functionality is done automatically when you use an instance in a Fargate cluster.

  In addition, the |cdk| will prevent instances from being deleted when
  autoscaling tries to kill an instance,
  but either a task is running or is scheduled on that instance.

  Previously, you had to create a Lambda function to have this functionality.
  
* Asset support, so that you can deploy source from your machine to |ECS| in one step
  Previously, to use application source you had to perform a number of manual steps
  (upload to |ECR|, create Docker image, etc.).
 
.. _creating_ecs_l2_example_1:

Step 1: Create the Directory and Initialize the |cdk|
-----------------------------------------------------

Let's start with creating a new directory to hold our |cdk| code
and create a new app in that directory.

.. code-block:: sh

    mkdir MyEcsConstruct
    cd MyEcsConstruct

.. tabs::

    .. group-tab:: TypeScript

        .. code-block:: sh

            cdk init --language typescript

        Build the app and confirm that it creates an empty stack.

        .. code-block:: sh

            npm run build
            cdk synth

        You should see a stack like the following,
        where CDK-VERSION is the version of the CDK.

        .. code-block:: sh

            Resources:
              CDKMetadata:
                Type: 'AWS::CDK::Metadata'
                Properties:
                  Modules: @aws-cdk/cdk=CDK-VERSION,@aws-cdk/cx-api=CDK-VERSION,my_ecs_construct=0.1.0

.. _creating_ecs_l2_example_2:

Step 2: Add the |EC2| and |ECS| Packages
----------------------------------------

Install support for |EC2| and |ECS|.

.. tabs::

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm install @aws-cdk/aws-ec2 @aws-cdk/aws-ecs

.. _creating_ecs_l2_example_3:

Step 3: Create a Fargate Service
--------------------------------

There are two different ways of running your container tasks with |ECS|:

- Using the **Fargate** launch type,
  where |ECS| manages the physical machines that your containers are running on for you
- Using the **EC2** launch type, where you do the managing, such as specifying autoscaling

The following example creates a Fargate service running on an ECS cluster fronted by an internet-facing
application load balancer.

.. tabs::

    .. group-tab:: TypeScript

        Add the following import statements to *lib/my_ecs_construct-stack.ts*:

        .. code-block:: typescript

            import ec2 = require('@aws-cdk/aws-ec2');
            import ecs = require('@aws-cdk/aws-ecs');

        Replace the comment at the end of the constructor with the following code:

        .. code-block:: typescript

            const vpc = new ec2.VpcNetwork(this, 'MyVpc', {
              maxAZs: 3 // Default is all AZs in region
            });

            const cluster = new ecs.Cluster(this, 'MyCluster', {
              vpc: vpc
            });

            // Create a load-balanced Fargate service and make it public
            new ecs.LoadBalancedFargateService(this, 'MyFargateService', {
              cluster: cluster,  // Required
              cpu: '512', // Default is 256
              desiredCount: 6,  // Default is 1
              image: ecs.ContainerImage.fromDockerHub('amazon/amazon-ecs-sample'), // Required
              memoryMiB: '2048',  // Default is 512
              publicLoadBalancer: true  // Default is false
            });

        Save it and make sure it builds and creates a stack.

        .. code-block:: sh

            npm run build
            cdk synth

        The stack is hundreds of lines, so we won't show it here.
        The stack should contain one default instance, a private subnet and a public subnet
        for the three availability zones, and a security group.

        Deploy the stack.

        .. code-block:: sh

            cdk deploy

        |CFN| displays information about the dozens of steps that
        it takes as it deploys your app.

That's how easy it is to create a Fargate service to run a Docker image.
