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

This topic steps you through creating the resources for a simple widget dispensing
service using the |cdk|.

.. _overview:

Overview
========

This tutorial contains the following steps.

1. Create a |cdk| app

2. Create a |LAMlong| function that gets a list of widgets with: GET /

3. Create the service that calls the |LAM| function

4. Add the service to the |cdk| app

5. Test the app

6. Add |LAM| functions to:

    * create an widget based with: POST /{name}
    * get an widget by name with: GET /{name}
    * delete an widget by name with: DELETE /{name}

.. _create_app:

Step 1: Create a |cdk| App
==========================

Let's create the TypeScript app **MyWidgetService** in in the current folder.

.. code-block:: sh

    mkdir MyWidgetService
    cd MyWidgetService
    cdk init --language typescript

This creates *my_widget_service.ts* in the *bin* directory.
We don't need most of this code,
so for now change it to the following:

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

.. _create_lambda_functions:

Step 2: Create a |LAM| Function to List all Widgets
===================================================

The next step is to create a |LAM| function to list all of the widgets in our
|S3| bucket.

Create the directory *resources* at the same level as the *bin* directory.

.. code-block:: sh

    mkdir resources

Create the following Javascript file, *widgets.js*,
in the *resources* directory.

.. code-block:: js

    const AWS = require('aws-sdk');
    const S3 = new AWS.S3();

    const bucketName = process.env.BUCKET;

    exports.main = async function(event, context) {
      try {
        var method = event.httpMethod;

        if (method === "GET") {
          if (event.path === "/") {
            const data = await S3.listObjectsV2({ Bucket: bucketName }).promise();
            var body = {
              widgets: data.Contents.map(function(e) { return e.Key })
            };
            return {
              statusCode: 200,
              headers: {},
              body: JSON.stringify(body)
            };
          }
        }

        // We only accept GET for now
        return {
          statusCode: 400,
          headers: {},
          body: "We only accept GET /"
        };
      } catch(error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
          statusCode: 400,
            headers: {},
            body: JSON.stringify(body)
        }
      }
    }

Save it and make sure it builds and creates an empty stack.
Note that since we haven't wired the function to our app,
the Lambda file does not appear in the output.

.. code-block:: sh

    npm run build
    cdk synth

.. _create_widgets_service:

Step 3: Create Widgets Service
==============================

Add the |ABP|, |LAM|, and |S3| packages to our app.

.. code-block:: sh

    npm install @aws-cdk/aws-apigateway @aws-cdk/aws-lambda @aws-cdk/aws-s3

Create the directory *lib* at the same level as the *bin* and *resources*
directories.

.. code-block:: sh

    mkdir lib

Create the following Typescript file, *widget_service.ts*,
in the *lib* directory.

.. code-block:: ts

    import cdk = require('@aws-cdk/cdk');
    import apigateway = require('@aws-cdk/aws-apigateway');
    import lambda = require('@aws-cdk/aws-lambda');
    import s3 = require('@aws-cdk/aws-s3');

    export class WidgetService extends cdk.Construct {
      constructor(parent: cdk.Construct, name: string) {
        super(parent, name);

        // Use S3 bucket to store our widgets
        const bucket = new s3.Bucket(this, 'WidgetStore');

        // Create a handler that calls the function main
        // in the source file widgets(.js) in the resources directory
        // to handle requests through API Gateway
        const handler = new lambda.Function(this, 'WidgetHandler', {
          runtime: lambda.Runtime.NodeJS810,
          code: lambda.Code.directory('resources'),
          handler: 'widgets.main',
          environment: {
            BUCKET: bucket.bucketName // So runtime has the bucket name
          }
        });

        bucket.grantReadWrite(handler.role);

        // Create an API Gateway REST API
        const api = new apigateway.RestApi(this, 'widgets-api', {
          restApiName: 'Widget Service',
          description: 'This service serves widgets.'
        });

        // Pass the request to the handler
        const getWidgetsIntegration = new apigateway.LambdaIntegration(handler);

        // Use the getWidgetsIntegration when there is a GET request
        api.root.addMethod('GET', getWidgetsIntegration);   // GET /
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
*my_widget_service.ts*.

.. code-block:: ts

    import widget_service = require('../lib/widget_service');

Add the following line of code at the end of the constructor in *my_widget_service.ts*.

.. code-block:: ts

    new widget_service.WidgetService(this, 'Widgets');

Make sure it builds and creates a stack
(we don't show the stack as it's almost 300 lines).

.. code-block:: sh

    npm run build
    cdk synth

.. _deploy_and_test:

Step 5: Deploy and Test the App
===============================

Before you can deploy your first |cdk| app,
you must bootstrap your deployment,
which creates some AWS infracture that the |cdk|
needs.
See the **bootstrap** section of the :doc:`tools` topic for details.

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

You can test your app by getting the list of widgets (currently empty) by navigating to this URL in a
browser or use the following **curl** command.

.. code-block:: sh

    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'

You can also open the |console|,
navigate to the |ABP| service,
find **Widget Service** in the list.
Select **GET** and **Test** to test the function.
Since we haven't stored any widgets yet, the output should be similar to the following
(there may be some slight differences in whitespace and quotation marks).

.. code-block:: sh

    { "widgets": [] }

.. _adding_functions:

Step 6: Add the Individual Widget Functions
===========================================

The next step is to create |LAM| functions to create, show, and delete
individual widgets.
Replace the existing **exports.main** function in *widgets.js* with the following code.

.. code-block:: js

    exports.main = async function(event, context) {
      try {
        var method = event.httpMethod;
        // Get name, if present
        var widgetName = event.path.startsWith('/') ? event.path.substring(1) : event.path;

        if (method === "GET") {
          // GET / to get the names of all widgets
          if (event.path === "/") {
            const data = await S3.listObjectsV2({ Bucket: bucketName }).promise();
            var body = {
              widgets: data.Contents.map(function(e) { return e.Key })
            };
            return {
              statusCode: 200,
              headers: {},
              body: JSON.stringify(body)
            };
          }

          if (widgetName) {
            // GET /name to get info on widget name
            const data = await S3.getObject({ Bucket: bucketName, Key: widgetName}).promise();
            var body = data.Body.toString('utf-8');

            return {
              statusCode: 200,
              headers: {},
              body: JSON.stringify(body)
            };
          }
        }

        if (method === "POST") {
          // POST /name
          // Return error if we do not have a name
          if (!widgetName) {
            return {
              statusCode: 400,
              headers: {},
              body: "Widget name missing"
            };
          }

          // Create some dummy data to populate object
          const now = new Date();
          var data = widgetName + " created: " + now;

          var base64data = new Buffer(data, 'binary');

          await S3.putObject({
            Bucket: bucketName,
            Key: widgetName,
            Body: base64data,
            ContentType: 'application/json'
          }).promise();

          return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(event.widgets)
          };
        }

        if (method === "DELETE") {
          // DELETE /name
          // Return an error if we do not have a name
          if (!widgetName) {
            return {
              statusCode: 400,
              headers: {},
              body: "Widget name missing"
            };
          }

          await S3.deleteObject({
            Bucket: bucketName, Key: widgetName
          }).promise();

          return {
            statusCode: 200,
            headers: {},
            body: "Successfully deleted widget " + widgetName
          };
        }

        // We got something besides a GET, POST, or DELETE
        return {
          statusCode: 400,
          headers: {},
          body: "We only accept GET, POST, and DELETE, not " + method
        };
      } catch(error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
          statusCode: 400,
          headers: {},
          body: body
        }
      }
    }

Wire these functions up to our |ABP| code in *widget_service.ts*
by adding the following code at the end of the constructor.

.. code-block:: ts

    const widget = api.root.addResource('{name}');

    // Add new widget to bucket with: POST /{name}
    const postWidgetIntegration = new apigateway.LambdaIntegration(handler);

    // Get a specific widget from bucket with: GET /{name}
    const getWidgetIntegration = new apigateway.LambdaIntegration(handler);

    // Remove a specific widget from the bucket with: DELETE /{name}
    const deleteWidgetIntegration = new apigateway.LambdaIntegration(handler);

    widget.addMethod('POST', postWidgetIntegration);    // POST /{name}
    widget.addMethod('GET', getWidgetIntegration);       // GET /{name}
    widget.addMethod('DELETE', deleteWidgetIntegration); // DELETE /{name}

Save, build, and deploy the app.

Now we should be able to store, show, or delete an individual widget.
Use the following **curl** commands to list the widgets,
create the widget *dummy*,
list all of the widgets,
show the contents of *dummy* (it should show today's date),
and delete *dummy*,
and again show the list of widgets.

.. code-block:: sh

    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'
    curl -X POST 'https://GUID.execute-REGION.amazonaws.com/prod/dummy'
    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'
    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod/dummy'
    curl -X DELETE 'https://GUID.execute-REGION.amazonaws.com/prod/dummy'
    curl -X GET 'https://GUID.execute-REGION.amazonaws.com/prod'

You can also use the |ABP| console to test these functions.
You'll have to set the **name** entry to the name of an widget,
such as **dummy**.
