.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _passing_in_values:

############################################
Passing in External Values to Your |cdk| App
############################################

.. See https://github.com/awslabs/aws-cdk/issues/603 (includes work from the following PR)
       https://github.com/awslabs/aws-cdk/pull/183

There may be cases where you want to parameterize one or more of your stack resources.
Therefore, you want to be able to pass values into your app from outside your app.
Currently, you can get values into your app from outside your app through any of the following.

- Using a context variable
- Using an environment variable
- Using an SSM Parameter Store variable
- Using a value from another stack
- Using a |CFN| parameter
- Using a resource in an existing |CFN| template

Each of these techniques is described in the following sections.

.. _passing_in_values_from_context:

Getting a Value from a Context Variable
=======================================

You can specify a context variable either as
part of a |toolkit| command,
or in a **context** section of *cdk.json*.

To create a command-line context variable,
use the **--context** (**-c**) option of a |toolkit| command,
as shown in the following example.

.. code-block:: sh

    cdk synth -c bucket_name=mygroovybucket

To specify the same context variable and value in *cdk.json*:

.. code-block:: json

    {
        "context": {
            "bucket_name": "myotherbucket"
        }
    }

To get the value of a context variable in your app,
use code like the following,
which gets the value of the context variable **bucket_name**.

.. code-block:: ts

    const bucket_name string = this.getContext("bucket_name");

.. _passing_in_value_from_env_vars:

Getting a Value from an Environment Variable
============================================

To get the value of an environment variable,
use code like the following,
which gets the value of the environment variable **MYBUCKET**.

.. code-block:: ts

    const bucket_name = process.env.MYBUCKET;

.. _passing_in_value_from_ssm:

Getting a Value from an SSM Store Variable
==========================================

To get the value of an SSM parameter store variable,
use code like the following,
which uses the value of the SSM variable **my-awesome-value**.

.. code-block:: ts

    const myvalue = new SSMParameterProvider(this).getString("my-awesome-value");

See the :doc:`context` topic for information about the :py:class:`SSMParameterProvider <@aws-cdk/cdk.SSMParameterProvider>`.

.. _passing_in_value_between_stacks:

Passing in a Value From Another Stack
=====================================

You can pass a value from one stack to another stack in the same app
by using the **export** method in one stack and the **import** method in the other stack.

The following example creates a bucket on one stack
and passes a reference to that bucket to the other stack through an interface.

First create a stack with a bucket.
The stack includes a a property we use to pass the bucket's properties to the other stack.
Note how we use the **export** method on the bucket to get it's properties and save them
in the stack property.

.. code-block:: ts

    class HelloCdkStack extends cdk.Stack {
        // Property that defines the stack you are exporting from
        public readonly myBucketRefProps: s3.BucketRefProps;

	constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
            super(parent, name, props);

            const mybucket = new s3.Bucket(this, "MyFirstBucket");

            // Save bucket's *BucketRefProps*
            this.myBucketRefProps = mybucket.export();
	}
    }

Create an interface for the second stack's properties.
We use this interface to pass the bucket properties between the two stacks.

.. code-block:: ts

    // Interface we'll use to pass the bucket's properties to another stack
    interface MyCdkStackProps {
        theBucketRefProps: s3.BucketRefProps;
    }

Create the second stack that gets a reference to the other bucket
from the properties passed in through the constructor.

.. code-block:: ts

    // The class for the other stack
    class MyCdkStack extends cdk.Stack {
        constructor(parent: cdk.App, name: string, props: MyCdkStackProps) {
            super(parent, name);

            const myOtherBucket = s3.Bucket.import(this, "MyOtherBucket", props.theBucketRefProps);

	    // Do something with myOtherBucket
        }
    }

Finally, connect the dots in your app.

.. code-block:: ts

    const app = new cdk.App(process.argv);

    const myStack = new HelloCdkStack(app, "HelloCdkStack");

    new MyCdkStack(app, "MyCdkStack", {
        theBucketRefProps: myStack.myBucketRefProps
    });

    process.stdout.write(app.run());

.. _using_cfn_parameter:

Using an |CFN| Parameter
========================

See the
`Parameters <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html>`_
topic for information about using the optional *Parameters* section to customize your |CFN| templates.

You can also get a reference to a resource in an existing |CFN| template,
as described in :doc:`concepts`.

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

   import cdk = require("@aws-cdk/cdk");
   import fs = require("fs");
   
   new cdk.Include(this, "ExistingInfrastructure", {
      template: JSON.parse(fs.readFileSync("my-template.json").toString())
   });

Then to access an attribute of the resource, such as the bucket's ARN:

.. code-block:: ts

   const bucketArn = new cdk.FnGetAtt("S3Bucket", "Arn");
