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

This topic is a step-by-step tutorial that creates a simple apple dispensing service
using the |cdk|.

The tutorial uses the following services:

- API Gateway to ...
- |S3| to store ...
- |LAMBDA| to ...

.. _step_zero:

Step Zero: Install the |cdk|
===========================

If you haven't installed the |cdk|,
go to our GitHub repository, |git-repo|,
click **Releases** and select the latest release.

Follow the instructions in the *README* file to configure the |cdk| on your machine.

Once you've finished configuring the |cdk|, run **cdk --version**
and make sure it matches the version you installed.

.. _step_one:

Step One: Create a New |cdk| Project
====================================

Create an *apples* directory and navigate into it.

.. tabs::

   .. group-tab:: Linux/Mac

      .. code-block:: sh

         mkdir ~/apples
         cd ~/apples

   .. group-tab:: Windows

      .. code-block:: sh

         mkdir %%USERPROFILE%\\apples
         cd %%USERPROFILE%\\apples

Create the **apples** project in TypeScript.

.. code-block:: sh

   cdk init --language TypeScript

This creates a skeleton |cdk| app with the following files and directories (folders on Windows):

- README.md contains some useful information about how to interact with your new package
- bin contains three source files:

  - apples.d.ts contains type information for your TypeScript app
  - apples.js contains the JavaScript compiled from the TypeScript file
  - apples.ts contains the source of your TypeScript app

- cdk.json contains a directive so that your **cdk** commands need not include a **-a** option
- node_modules contains the (3500+) Node.js library files
- package-lock.json is the Git lock file for *package.json*
- package.json contains metadata for the app
- tsconfig.json contains configuration information for the TypeScript compilerOptions

.. _step_two:

Step Two: Install the |cdk| libraries
=====================================

Run the following command to install the |S3|,
???, and ??? libraries:

.. code-block: sh

   y-npm i @aws-cdk/s3 ???

.. _step_three:

Step Three: Create an Apple Service
===================================

Create a *lib* directory at the same level as the *bin* directory,
then create the file *AppleService.js* in the *lib* directory
with the following code:

.. code-block:: ts

   import { Construct } from "../node_modules/@aws-cdk/core";

   export class AppleService extends Construct {
       constructor(parent: Construct, name: string) {
           super(parent, name);
       }
   }

.. _step_three:

Step Three: Add an Apple Service to our Stack
=============================================

Replace the **import** statements for |SNS| and |SQS| with the following:

.. code-block: ts

   import { AppleService } from '../lib/apple_service';

Replace the |SNS| topic and |SQS| queue in **AppleStack** with the following code:

.. code-block:: ts

   new AppleService(this, 'Apples');

.. _step_four:

Step Four: Add an |S3| Bucket to the Apple Service
==================================================

Our service is pretty useless, so to make it useful,
add an |S3| bucket to the service so we can store our apples.

Add the following **import** statement to *apple_service.ts*:

.. code-block: ts

   import { Bucket } from '@aws-cdk/s3';

And add the following code to the end of the constructor for the **AppleService** class:

.. code-block: ts

   new Bucket(this, 'AppleStore');

Let's see what we have so far.
Run the following command to see the current |CFN| template:

.. code-block: sh

   cdk synth

Oops, what happened?
We forgot to compile our TypeScript code into JavaScript.
To avoid this,
run the following command in a separate window to
automatically compile our TypeScript code into JavaScript as we save the file:

.. code-block: sh

   npm run watch

Rerun **cdk synth**.
You should see something like the following:

.. code-block: json

   Resources:
       ApplesAppleStoreE5F233DA:
           Type: 'AWS::S3::Bucket'
