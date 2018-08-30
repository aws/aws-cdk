.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _sharing:

#############################################
Adding External Information to Your |cdk| App
#############################################

There are a number of ways you can get information into your app from outside your app.

- Using command-line context
- Using environment variables
- Using SSM Parameter Store values
- Using the built-in export/import functionality

Each of these techniques is described in the following sections.

.. _sharing_from_command_line:

Getting Information from the Command Line
=========================================

You can get information from the command line when you run a |toolkit| command using the **--context** (**-c**) option,
as shown in the following example.

.. code-block:: sh

    cdk synth -c bucket_name=mygroovybucket

To get and use this value in the constructor of a TypeScript |cdk| app's stack,
use code like the following.

.. code-block:: ts

    const bucket_name string = this.getContext("bucket_name");

    new s3.Bucket(this, "MyFirstBucket", {
        versioned: true,
        bucket_name: bucket_name
    });

.. _sharing_from_ssm:

Getting Information from the SSM Store
======================================

You can get information from SSM Parameter Store values using code like the following.

.. code-block:: ts
		
    const myvalue string = new SSMParameterProvider(this).getString("my-awesome-value");

See the :doc:`context` topic for information about the :py:class:`SSMParameterProvider <@aws-cdk/cdk.SSMParameterProvider>`.

.. _sharing_between_stacks:

Sharing Information Between Stacks
==================================

You can share information between two stacks in the same app
by using the **export** method on one stack and the **import** method on the other stack.

The following example defines an |S3| bucket in one stack and exports it.

.. code-block:: ts

    

.. _sharing_from_template:

Getting Information from an |CFN| Template
==========================================

To share information between stacks,
you can use Outputs and Parameters, and Exports and Fn::ImportValues.

CDK to CloudFormation
---------------------

If you define a VPC inside a CDK app and want to use it from a CFN template, it actually functions much the same as how you would share the template between plain CFN templates. You would output/export in the one template and parameter/import in the other.

The exporting works by calling vpc.export() inside your CDK app. What that does is create Exports for all attributes of your VPC that another CDK stack would need to import it again... but those outputs and exports are available to any CFN stack as well! Deploy a template and pick your favorite method of getting the VPC information into your template.

If you're unhappy about the default names of the Exports (understandable since they are designed to be consumed transparently), you're free to add some new Output()s to your CDK stack, which translate directly into CloudFormation Outputs and can be made into Exports as well.

CloudFormation to CDK
---------------------

So you already have an existing VPC (deployed through CloudFormation or otherwise) that you want to consume in a CDK application. As you figured out, what you want to do is get a VpcNetworkRef instance from VpcNetworkRef.import(), which expects a number of properties (https://awslabs.github.io/aws-cdk/refs/_aws-cdk_aws-ec2.html#@aws-cdk/aws-ec2.VpcNetworkRefProps):

vpcId, availabilityZones, publicSubnetIds, privateSubnetIds

Again, use your favorite way of getting those values in there. You now have 3 options:

    CloudFormation Parameters--add a new Parameter() to your Stack and use that as the value (but you're now responsible of specifying the parameter when deploying your synthesized template, which you can no longer do through the CDK toolkit).
    CloudFormation Imports--use a new FnImportValue() expression with the name of the existing export for your VPC.
    Synthesis-time parameters: not ideal in all cases, but you can choose to pass in the concrete values when RUNNING the CDK app (either as context values, or as a parameter to your constructs that are hardcoded into main.ts with different values for every account/region, for example) so the CloudFormation template comes out with the identifiers already filled in.

Of all these, Exports and Imports will give you the most transparent experience.

And from your example, I love how you abstract away the importing of the VPC inside a VpcCFNDemoStack class. For consumers, it is totally awesome to be able to write:

const vpc = OurStandardVPC.obtain(this);

new ThingThatNeedsAVPC(..., { vpc });

Or similar, and not have to worry where the VPC is coming from. It might be constructed on the spot, it might be loaded from another environment.


Sharing between higher-level and lower-level Constructs
=======================================================

If this is what you're trying to do, it depends on how you want to deploy: in a single stack or across multiple stacks.
Multiple stacks

If it's across multiple stacks, the solution will be basically the same as what I described in my previous post, except the CloudFormation template will not be handwritten but generated by CDK. The mechanism used will be the same.

To make matters simpler, in the consuming stack you could forego the VpcNetworkRef.import() and just use the properties of VpcNetworkRefProps directly; you probably don't need the logic built into the VpcNetwork class anymore anyway.
Single stack

This would be even easier, because you can simply access the properties of VpcNetwork directly, such as vpc.vpcId.
