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

.. See https://github.com/awslabs/aws-cdk/issues/603 (includes work from the following PR)
       https://github.com/awslabs/aws-cdk/pull/183

There are a number of ways you can get information into your app from outside your app.

- Using a command-line context variable
- Using an environment variable
- Using an SSM Parameter Store variable
- Using a value from another stack
- Using a |CFN| template value

Each of these techniques is described in the following sections.

.. _sharing_from_command_line:

Getting a Value from a Command-Line Context Variable
====================================================

To pass the value of a command-line context value to your app,
run a |toolkit| command using the **--context** (**-c**) option,
as shown in the following example.

.. code-block:: sh

    cdk synth -c bucket_name=mygroovybucket

To get the value of a command-line context value in your app,
use code like the following,
which gets the value of the context variable **bucket_name**.

.. code-block:: ts

    const bucket_name string = this.getContext("bucket_name");

.. _sharing_from_env_vars:

Getting a Value from an Environment Variable
============================================

To get the value of an environment variable,
use code like the following,
which gets the value of the environment variable **MYBUCKET**.

.. code-block:: ts

    const bucket_name = process.env.MYBUCKET;

.. _sharing_from_ssm:

Getting a Value from an SSM Store Variable
==========================================

To get the value of an SSM parameter store variable,
use code like the following,
which uses the value of the SSM variable **my-awesome-value**.

.. code-block:: ts
		
    const myvalue = new SSMParameterProvider(this).getString("my-awesome-value");

See the :doc:`context` topic for information about the :py:class:`SSMParameterProvider <@aws-cdk/cdk.SSMParameterProvider>`.

.. _sharing_between_stacks:

Sharing Information Between Stacks
==================================

You can share information between two stacks in the same app
by using the **export** method on one stack and the **import** method on the other stack.

First add a property to the class that defines the stack you are exporting from.
The following example shows a stack with the property **myBucketRefProps**.

.. code-block:: ts

    class HelloCdkStack extends cdk.Stack {
        public readonly myBucketRefProps: s3.BucketRefProps;

	constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
            super(parent, name, props);

Next create a bucket and export it's *BucketRefProps* to the **myBucketRefProps** property.

.. code-block:: ts

    const mybucket = new s3.Bucket(this, "MyFirstBucket");

    this.myBucketRefProps = mybucket.export();

Create an interface, with one property, an **BucketRefProps** object.
We'll use this interface to pass the reference to the bucket,
as a set of bucket properties,
to another stack.

.. code-block:: ts

    interface XferBucketProps {
        theBucketRefProps: s3.BucketRefProps;
    }

Now create the class for the other stack.

.. code-block:: ts

    class MyCdkStack extends cdk.Stack {
        constructor(parent: cdk.App, name: string, props: XferBucketProps) {
            super(parent, name);

            const myOtherBucket = s3.Bucket.import(this, "MyOtherBucket", props.theBucketRefProps);

	    // Do something with myOtherBucket
        }
    }

Finally, connect the dots.

.. code-block:: ts

    const app = new cdk.App(process.argv);

    const myStack = new HelloCdkStack(app, "HelloCdkStack");
    new MyCdkStack(app, "MyCdkStack", {
        theBucketRefProps: myStack.myBucketRefProps
    });

    process.stdout.write(app.run());

.. _using_cfn_template:

Using an Existing |CFN| Template
================================

The |cdk| provides a mechanism that you can use to
incorporate resources from an existing |CFN| template
into your |cdk| app.
For example, suppose you have a template,
*my-template.json*,
with the following resource,
where **S3Bucket** is the logical ID of the bucket in your template:

.. code-block:: json

   "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
          ...
      }
   }   
   
You can include this bucket in your |cdk| app,
as shown in the following example
(note that you cannot use this method in an |l2| construct):

.. code-block:: ts

   import { FnGetAtt } from '@aws-cdk/core';
   import { readFileSync } from 'fs'
   
   new Include(this, "ExistingInfrastructure", {
      template: JSON.parse(readFileSync('my-template.json').toString())
   })

Then to access an attribute of the resource, such as the bucket's ARN:

.. code-block:: ts

   const bucketArn = new FnGetAtt('S3Bucket', 'Arn');
