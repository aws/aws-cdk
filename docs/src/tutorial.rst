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

This topic steps you through creating the resources for a simple apple dispensing
service using the |cdk|.

.. _overview:

Overview
========

This tutorial contains the following steps.

1. Create a |cdk| app

2. Create a |LAMlong| function that gets a list of apples with: GET /

3. Create the service that calls the |LAM| function

4. Add the service to the |cdk| app

5. Test the app

6. Add |LAM| functions to:

    * create an apple based with: POST /{name}
    * get an apple by name with: GET /{name}
    * delete an apple by name with: DELETE /{name}

.. _create_app:

Step 1: Create a |cdk| App
==========================

Let's create the TypeScript app **MyAppleService** in in the current folder.

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
                Modules: '@aws-cdk/cdk=CDK-VERSION,@aws-cdk/cx-api=CDK-VERSION,js-base64=2.4.9,my_apple_service=0.1.0'

.. _create_lambda_functions:

Step 2: Create a |LAM| Function to List all Apples
==================================================

The next step is to create a |LAM| function to list all of the apples in our
|S3| bucket.

Create the directory *resource* at the same level as the *bin* directory.

.. code-block:: sh

    mkdir resources

Create the following Javascript file, *apples.js*,
in the *resources* directory.

.. code-block:: js

    const AWS = require('aws-sdk');
    const S3 = new AWS.S3();

    const bucketName = process.env.BUCKET;

    // For now we only handle GET /:
    exports.main = function(event, context, callback) {
      if (event.httpMethod == "GET") {
        if (event.path.length == 1) {
          S3.listObjectsV2({ Bucket: bucketName })
            .promise()
            .then(function(data) {
              var body = { apples: data.Contents.map(function(e) { return e.Key }) };
              var response = {
                statusCode: 200,
                headers: {},
                body: JSON.stringify(body)
              };
              callback(null, response);
            })
            .catch(rejectedPromise);
        }
      }

      function rejectedPromise(error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        var response = makeError(body);
        callback(null, response);
      }
    }

Save it and make sure it builds and creates an empty stack.
Note that since we haven't wired the function to our app,
the Lambda file does not appear in the output.

.. code-block:: sh

    npm run build
    cdk synth

.. _create_apples_service:

Step 3: Create Apples Service
=============================

Add the |APIGATEWAY|, |LAM|, and |S3| packages to our app.

.. code-block:: sh

    npm install @aws-cdk/aws-apigateway
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
    import lambda = require('@aws-cdk/aws-lambda');
    import s3 = require('@aws-cdk/aws-s3');

    export class AppleService extends cdk.Construct {
      constructor(parent: cdk.Construct, name: string) {
        super(parent, name);

        const bucket = new s3.Bucket(this, 'AppleStore');

        const handler = new lambda.Function(this, 'AppleHandler', {
          runtime: lambda.Runtime.NodeJS610,
          code: lambda.Code.directory('resources'),
          handler: 'apples.main',
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
	  requestTemplates:  { "application/json": '{ "statusCode": "200" }' }
        });

        api.root.addMethod('GET', getApplesIntegration);   // GET /
      }
    }

Save it and make sure it builds and creates a (still empty) stack.

.. code-block:: sh

    npm run build
    cdk synth

.. _add_service:

Step 4: Add the Service to the App
==================================

To add the service to our app,
add the following line of code after the existing **import** statement in
*my_apple_service.ts*.

.. code-block:: ts

    import apple_service = require('../lib/apple_service');

Add the following line of code at the end of the constructor in *my_apple_service.ts*.

.. code-block:: ts

    new apple_service.AppleService(this, 'Apples');

Make sure it builds and creates a stack
(we don't show the stack as it's about 350 lines).

.. code-block:: sh

    npm run build
    cdk synth

.. _deploy_and_test:

Step 5: Deploy and Test the App
===============================

Before you can deploy your app the first time,
you must bootstrap your deployment,
which creates some AWS infracture that the |cdk|
needs.

.. code-block:: sh

    cdk bootstrap

Run the following command to deploy your app.

.. code-block:: sh

    cdk deploy

If the deployment is successfull,
save the URL for your server, which appears in the last line in the window,
where GUID is an alpha-numeric GUID and REGION is your region.

.. code-block:: sh

    https://GUID.execute-REGION.amazonaws.com/prod/

You can get the list of apples (currently empty) by navigating to this URL in a
browser or use the following **curl** command.

.. code-block:: sh

    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'

You can also open the AWS Console,
navigate to the API Gateway service,
find **Apple Service** in the list.
Select **GET** and **Test** to test the function.
Since we haven't stored any apples yet, the output should be similar to the following
(there may be some slight differences in whitespace and quotation marks).

.. code-block:: sh

    { "apples": [] }

.. _adding_functions:

Step 6: Add the Individual Apple Functions
==========================================

The next step is to create |LAM| functions to create, show, and delete
individual apples.
Replace the existing **exports.main** function with the following code.

.. code-block:: js

    exports.main = function(event, context, callback) {
      if (event.httpMethod != null) {
        if (event.httpMethod != "") {
          if (event.httpMethod == "GET") {
            // GET / or GET /name?
            var pathLength = event.path.length

            if (pathLength == 1) {
              // GET /
              console.log("GET /");

              S3.listObjectsV2({ Bucket: bucketName })
                .promise()
                .then(function(data) {
                  var body = { apples: data.Contents.map(function(e) { return e.Key }) };
                  console.log("Body for GET /: " + body);
                  var response = makeResponse(body);
                    console.log("GET / response: \n" + response);
                  callback(null, response);
              })
                .catch(rejectedPromise);
            }
            else {
              // GET /name
              name = getName(event.path);

              S3.getObject({ Bucket: bucketName, Key: name})
                .promise()
                .then(function(data) {
                  var body = data.Body.toString('utf-8');
                  var response = makeResponse(body);
                  callback(null, response);
              })
                .catch(rejectedPromise);
            }
          }
          else if (event.httpMethod == "POST") {
            // POST /name
            // Make sure we have a name
            var pathLength = event.path.length

            if (pathLength == 1) {
              // Return error
              var body = "NAME arg missing (/ supplied, not /name)";
              console.log(body);
              var response = makeError(body);
              callback(null, response);
            }
            else {
              name = getName(event.path);

              // Create some dummy data to populate object
              const now = new Date();
              var data = name + " created: " + now;

              var base64data = new Buffer(data, 'binary');

              S3.putObject({
                Bucket: bucketName,
                Key: name,
                Body: base64data,
                ContentType: 'application/json'
              }).promise()
                .then(function() {
                  var response = makeResponse(event.apples);
                  console.log("POST /name response: " + response);
                  callback(null, response);
                })
                .catch(rejectedPromise);
            }
          }
          else if (event.httpMethod == "DELETE") {
            // DELETE /name
            // Make sure we have a name
            var pathLength = event.path.length

            if (pathLength == 1) {
              // Return error
              var body = "NAME arg missing (/ supplied, not /name)";
              var response = makeError(body);
              callback(null, response);
            }
            else {
              name = getName(event.path);

              S3.deleteObject({ Bucket: bucketName, Key: name })
                .promise()
                .then(function(data) {
                  var body = { success: true }
                  var response = makeResponse(body);
                  callback(null, response);
              })
                .catch(rejectedPromise);
            }
          }
          else {
            // Return error
            var body = "HTTP method " + event.httpMethod + " not supported";
            var response = makeError(body);
            callback(null, response);
          }
        }
      }

      function rejectedPromise(error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        var response = makeError(body);
        callback(null, response);
      }
    }

You probably noticed we also introduced three new helper functions:
**getName**, **makeResponse**, and **makeError**.
Add these to *apples.js*.

.. code-block:: js

    // Get name from path /name
    function getName(path) {
      var name = path.substring(1, path.length);
      return name;
    }

    // Create JSON response from body
    function makeResponse(responseBody) {
      var response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(responseBody)
      };

      return response;
    }

    // For bad requests
    function makeError(body) {
      var response = {
        statusCode: 404,
        headers: {},
        body: JSON.stringify(body)
      };

      return response;
    }

Wire these functions up to our API Gateway code in *apple_service.ts*
by adding the following code at the end of the constructor.

.. code-block:: ts

    const apple = api.root.addResource('{name}');

    // Add new apple to bucket with: POST /{name}
    const postAppleIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }'
      }
    });

    // Get a specific apple from bucket with: GET /{name}
    const getAppleIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }'
      }
    });

    // Remove a specific apple from the bucket with: DELETE /{name}
    const deleteAppleIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }'
      }
    });

    apple.addMethod('POST', postAppleIntegration);    // POST /{name}
    apple.addMethod('GET', getAppleIntegration);       // GET /{name}
    apple.addMethod('DELETE', deleteAppleIntegration); // DELETE /{name}

Save, build, and deploy the app.

Now we should be able to store, show, or delete an individual apple.
Use the following **curl** commands to lists the apples,
creates *dummy*,
lists all of the apples,
shows the contents of *dummy*,
deletes *dummy*,
and again shows the list of apples.

.. code-block:: sh

    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'
    curl -X POST 'https://GUID.execute-REGION.amazonaws.com/prod/dummy'
    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'
    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod/dummy'
    curl -X DELETE 'https://GUID.execute-REGION.amazonaws.com/prod/dummy'
    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'

You can also use the API Gateway console to test these functions.
You'll have to set the **name** entry to the name of an apple,
such as **dummy**.
