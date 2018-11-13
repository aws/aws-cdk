.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _cdk_examples:

##############
|cdk| Examples
##############

This topic contains some examples to help you get started using some of the advanced constructs
offered by the |cdk|.

.. _creating_ecs_l2_example:

Creating an |ECS| Construct
===========================

|ECSlong| (|ECS|) is a highly scalable, fast, container management service
that makes it easy to run, stop, and manage Docker containers on a cluster.
You can host your cluster on a serverless infrastructure that is managed by
|ECS| by launching your services or tasks using the Fargate launch type.
For more control you can host your tasks on a cluster of
|EC2long| (|EC2|) instances that you manage by using the EC2 launch type.

Since |ECS| can be used with a number of AWS services,
you should understand how the |ECS| construct that we use in this example
gives you a leg up on using these AWS services:



* Automatic security group opening for LBs
* Automatic ordering dependency between service and LB attaching to target group
* Automatic userdata configuration on ASG 
* Early validation of some tricky param combinations, which saves you deployment time in CFN to discover issues
* Automatic permissions added for ECR if you use an image from ECR
* convenient api for autoscaling 
* Asset support, so deploying source from yer machine to ECS in one go



- |IAM|
- |EC2|
- |ELB|
- |ECR|
- |CFN|


.. _creating_ecs_l2_example_1:

Step 1: Create the Directory and Initialze the |cdk|
----------------------------------------------------

Let's start with creating a new directory to hold our |cdk| code
and create a new app in that directory.

.. code-block:: sh

    mkdir MyEcsConstruct
    cd MyEcsConstruct
    
.. tabs::

    .. group-tab:: TypeScript

        .. code-block:: sh

            cdk init --language typescript

    Update *my_ecs_construct.ts* in the *bin* directory to only contain the following code:

    .. code-block:: ts

        #!/usr/bin/env node
        import cdk = require('@aws-cdk/cdk');

        class MyWidgetServiceStack extends cdk.Stack {
          constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
            super(parent, name, props);


          }
        }

        // Create a new CDK app
        const app = new cdk.App();

        // Add your stack to it
        new MyWidgetServiceStack(app, 'MyWidgetServiceStack');

        app.run();

    Save it and make sure it builds and creates an empty stack.

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
              Modules: >-
                @aws-cdk/cdk=CDK-VERSION,@aws-cdk/cx-api=CDK-VERSION,my_widget_service=0.1.0


    .. group-tab:: Java

        .. code-block:: sh

            cdk init --language java

.. _creating_ecs_l2_example_2:

Step 2: Add the |ECS| Package and ???
-------------------------------------

Install support for |EC2| and |ECS|.

.. tabs::

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm install @aws-cdk/aws-ec2 @aws-cdk/aws-ecs

Create an |ECS| Fargate construct.
Fargate ???

.. tabs::

    .. group-tab:: TypeScript

        Add the following import statements:

        .. code-block:: typescript

            import ec2 = require('@aws-cdk/aws-ec2');
            import ecs = require('@aws-cdk/aws-ecs');

        Add the following code to the end of the constructor:

        .. code-block:: typescript

            // Create a VPC
            const vpc = new ec2.VpcNetwork(this, 'VPC');const vpc = new ec2.VpcNetwork(this, 'TheVPC', {
              cidr: '10.0.0.0/21',
              subnetConfiguration: [
                {
                  cidrMask: 24,
                  name: 'Ingress',
                  subnetType: ec2.SubnetType.Public,
                },
                {
                  cidrMask: 24,
                  name: 'Application',
                  subnetType: ec2.SubnetType.Private,
                },
                {
                  cidrMask: 28,
                  name: 'Database',
                  subnetType: ec2.SubnetType.Isolated,
                }
              ],
            });

            // Create an ECS cluster
            const cluster = new ecs.Cluster(this, 'Cluster', {
              vpc: vpc,
            });

            // Add capacity to the cluster
            cluster.addDefaultAutoScalingGroupCapacity({
              instanceType: new ec2.InstanceType("t2.xlarge"),
              instanceCount: 3,
            });

            // Instantiate an ECS Service with an automatic load balancer
            const ecsService = new ecs.LoadBalancedEc2Service(this, 'Service', {
              cluster,
              memoryLimitMiB: 512,
              image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
            });
