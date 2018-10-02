.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _tutorial:

##############
|cdk| Tutorial
##############

This topic steps you through creating the resources for a simple apple dispensing service using the |cdk|.

.. _overview:

Overview
========

There are N steps in this tutorial.

1. Create a new |cdk| app

2. Create the |LAMBDA| functions that:

  * gets list of apples (GET /apples)
  * creates an apple based on json input (POST /apples/{apple_id})
  * gets an apple by name (GET /apples/{apple_id})
  * deletes an apple by name (DELETE /apples/{apple_id})

3. Create the service that calls the |LAMBDA| functions

4. Add the service to our |cdk| app

.. _create_app:

Create a |cdk| App
==================

Let's create the app **MyAppleService** in Typescript
in the current folder.

.. code-block:: sh

    mkdir MyAppleService
    cd MyAppleService
    cdk init --language typescript

This creates *my_apple_service.ts* in the *bin* directory.
We don't need most of this code,
so for now change it to the following:

.. code-block:: ts

    #!/usr/bin/env node
    import cdk = require('@aws-cdk/cdk');

    class MyAppleServiceStack extends cdk.Stack {
      constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);


      }
    }

    const app = new cdk.App(process.argv);

    new MyAppleServiceStack(app, 'MyAppleServiceStack');

    process.stdout.write(app.run());

Make sure it builds and creates an empty stack.

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
                Modules: '@aws-cdk/cdk=CDK-VERSION,@aws-cdk/cx-api=CDK-VERSION,js-base64=2.4.9,my_apple_service=0.1.0'

.. _create_lambda_functions:

Create |LAMBDA| Functions
=========================

The next step is to add the |LAMBDA| functions we need to
list the apples,
create an apple,
get an apple by name,
or delete an apple by name.

Create the directory *resource* at the same level as the *bin* directory.

.. code-block:: sh

    mkdir resources

Create the following Javascript file, *apples.js*,
in the *resources* directory.

.. code-block:: js

    const AWS = require('aws-sdk');
    const S3 = new AWS.S3();

    const bucketName = process.env.BUCKET;

    exports.main = function(event, context, callback) {
      switch (event.operation) {
      case "list":
        S3.listObjectsV2({ Bucket: bucketName })
          .promise()
          .then(function(data) {
            callback(null, { apples: data.Contents.map(function(e) { return e.Key }) });
        })
          .catch(rejectedPromise);
        break;
      default:
        return callback("Unknown operation: " + event.operation, null);
      }

      function rejectedPromise(error) {
        callback(error.stack || JSON.stringify(error, null, 2), null);
      }
    }

Make sure it builds and creates an empty stack
(we haven't wired the functions to our app yet).

.. code-block:: sh

    npm run build
    cdk synth

.. _create_apples_service:

Create Apples Service
=====================

Add the |APIGATEWAY|, |IAM|, |LAMBDA|, and |S3| packages to our app.

.. code-block:: sh

    npm install @aws-cdk/aws-apigateway
    npm install @aws-cdk/aws-iam
    npm install @aws-cdk/aws-lambda
    npm install @aws-cdk/aws-s3

Create the directory *lib* at the same level as the *bin* and *resources*
directories.

.. code-block:: sh

    mkdir lib

Create the following Typescript file, *apple_service.ts*,
in the *lib* directory.

.. code-block:: ts

    import cdk = require('@aws-cdk/cdk');
    import apigateway = require('@aws-cdk/aws-apigateway');
    import iam = require('@aws-cdk/aws-iam');
    import lambda = require('@aws-cdk/aws-lambda');
    import s3 = require('@aws-cdk/aws-s3');

    export class AppleService extends cdk.Construct {
      constructor(parent: cdk.Construct, name: string) {
        super(parent, name);

        const bucket = new s3.Bucket(this, 'AppleStore');

        const handler = new lambda.Function(this, 'AppleHandler', {
          runtime: lambda.Runtime.NodeJS610,
          code: lambda.Code.directory('resources'),
          handler: 'index.main',
          environment: {
            BUCKET: bucket.bucketName
          }
        });

        bucket.grantReadWrite(handler.role);

        const api = new apigateway.RestApi(this, 'apples-api', {
          restApiName: 'Apple Service',
          description: 'This service serves apples.'
        });

        const getApplesIntegration = new apigateway.LambdaIntegration(handler, {
          requestTemplates: { 'application/json': '{ "operation": "list"}' },
          integrationResponse: [ { statusCode: '200' } ]
        });

        apples.addMethod('GET', getApplesIntegration);   // GET /apples
      }
    }

Make sure it builds and creates a (still empty) stack.

.. code-block:: sh

    npm run build
    cdk synth

.. _add_service:

Add the Service to the App
==========================

To add the service to our app,
add the following line of code after the existing **import** statement
.

.. code-block:: ts

    import apple_service = require('../lib/apple_service')

Add the following line of code at the end of the constructor in *my_apple_service.ts*.

.. code-block:: ts

    new apple_service.AppleService(this, 'Apples');

Make sure it builds and creates a stack
(we don't show the stack as it's about 700 lines).

.. code-block:: sh

    npm run build
    cdk synth

.. _deploy_and_test:

Deploy and Test the App
=======================

Run the following command to deploy your app.

.. code-block:: sh

    cdk deploy

Once your app is deployed (it should take about a minute),
open the AWS Console,
navigate to the API Gateway service,
find your app in the list,
and test the GET function.

Since we haven't stored any apples, the list should be empty.
Let's manually store an apple.

1. Create the file **my_groovy_apple** and add the following content.

    .. code-block:: sh

        {
            "key1": "value1"
        }

2. Navigate to the S3 Console and find your apple bucket
   (its name should start with the string **myappleservicestack**).

3. Select the bucket, select **Upload file**, and upload **my_groovy_apple**.
4. Navigate to the API Gateway console.
5. Select **Apple Service**.
6. Select the **GET** method.
7. Select **Test**, **Test**.
8. You should get the following response body.

    .. code-block:: sh

        {
            "key1": "value1"
        }

Adding apples manually to our S3 bucket is a pain.
Since we want to enable all CRUD (create, read, update, delete) operations,
add the following to *apples.js*, after the **list** case and before the
**default** case.

.. code-block:: ts

    case "create":
      S3.putObject({
        Bucket: bucketName,
        Key: event.apples.name,
        Body: JSON.stringify(event.apples, null, 2),
        ContentType: 'application/json'
      }).promise()
        .then(function() { callback(null, event.apples); })
        .catch(rejectedPromise);
      break;
    case "show":
      S3.getObject({ Bucket: bucketName, Key: event.name})
        .promise()
        .then(function(data) {
          callback(null, JSON.parse(data.Body.toString('utf-8')));
      })
        .catch(rejectedPromise);
      break;
    case "delete":
      S3.deleteObject({ Bucket: bucketName, Key: event.name })
        .promise()
        .then(function(data) {
          callback(null, { success: true });
      })
        .catch(rejectedPromise);
      break;

Now we should be able to store, show, or delete an apple.
Use the API Gateway console to test these functions.
You'll have to pass in the name of an apple,
so set the **name** entry to the name of an apple.
Since we added the apple **my_groovy_apple** to the S3 bucket,
you can use it as the name for any of these operations.
