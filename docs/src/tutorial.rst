.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _tutorial:

#######################################
Tutorial: Creating an |cdk| Application
#######################################

This topic walks you through creating and deploying an |cdk| app,
by using the `cdk init` command, as described in the
`Creating a Project from the Template`_ section,
or manually, as described in the
`Creating a Project Manually`_ section.

In either case, the first step is to create the directory for your project,
with an empty Git repository.
All of these instructions use this directory:

.. code-block:: sh

    mkdir hello-cdk
    cd hello-cdk
    git init

.. _template_create_project:

Creating a Project from the Template
====================================

In this section we use the :code:`cdk init` command to create a skeleton project from a
template in any of the supported languages.

.. _template_initialize:

Initializing the Project
------------------------

Run the `cdk init` command to initialize an empty project.
The |cdk| contains templates for all of the supported languages.
To create an empty (no AWS resources in the resulting |CFN| stack),
run the following command, where LANGUAGE is one of the supported programming languages:
**csharp** (C#), **java** (Java), or **typescript** (TypeScript).

.. code-block:: sh

    cdk init --language LANGUAGE

.. _template_compile:

Compiling the Project
---------------------

If needed, compile the code:

.. tabs::

    .. group-tab:: C#

        Compile the code using your IDE or via the dotnet CLI:

        .. code-block:: sh

            dotnet build

    .. group-tab:: JavaScript

        No need to compile

    .. group-tab:: TypeScript

        To compile your program from **.ts** to **.js**:

        .. code-block:: sh

            npm run build

        You can also use the **watch** command to continuously compile your code
        as it changes, so you don't have to invoke the compiler explicitly:

        .. code-block:: sh

            # run in another terminal session
            npm run watch

    .. group-tab:: Java

        Compile your code using your IDE or via the command line via **mvn**:

        .. code-block:: sh

            mvn compile

You have now created your first |cdk| app.
The next section creates a similar app manually,
so you can skip it and continue with the
`Listing the Stacks in the App`_ section.

.. _manual_create_project:

Creating a Project Manually
===========================

In this section we create a new |cdk| project using explicit command-line commands.
Be sure to navigate to the *hello-cdk* directory before you start.

.. _manual_initialize:

Initializing the Project
------------------------

Create an empty project for the |cdk| app.

.. tabs::

    .. group-tab:: C#

        Create a new console application.

        .. code-block:: sh

            dotnet new console

    .. group-tab:: JavaScript

        Create an initial npm **package.json** file:

        .. code-block:: sh

            npm init -y # creates package.json

        Create a **.gitignore** file with the following content:

        .. code-block:: sh

            *.js
            node_modules

    .. group-tab:: TypeScript

        Create an initial npm **package.json** file:

        .. code-block:: sh

            npm init -y # creates package.json

        Create a **.gitignore** file with the following content:

        .. code-block:: sh

            *.js
            *.d.ts
            node_modules

        Add the `build` and `watch` TypeScript commands to **package.json**:

        .. code-block:: json

            {
                "scripts": {
                    "build": "tsc",
                    "watch": "tsc -w"
                }
            }

        Create a minimal **tsconfig.json**:

        .. code-block:: json

            {
                "compilerOptions": {
                    "target": "es2018",
                    "module": "commonjs"
                }
            }

        Create a minimal **cdk.json** (this saves you from including `--app node bin/hello-cdk.js` in every `cdk` command):

        .. code-block:: json
            
            {
                "app": "node bin/hello-cdk.js"
            }

    .. group-tab:: Java

        Create a **.gitignore** file with the following content:

        .. code-block:: sh

            .classpath.txt
            target
            .classpath
            .project
            .idea
            .settings
            .vscode
            *.iml

        Use your favorite IDE to create a Maven-based empty Java 8 project.

        Set the Java **source** and **target** to 1.8 in your **pom.xml** file:

        .. code-block:: xml

            <!-- pom.xml -->
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-compiler-plugin</artifactId>
                        <version>3.1</version>
                        <configuration>
                            <source>1.8</source>
                            <target>1.8</target>
                        </configuration>
                    </plugin>
                </plugins>
            </build>

.. _manual_add_core:

Adding the CDK Core as a Dependency
-----------------------------------

Install the |cdk| core library (:py:mod:`@aws-cdk/cdk`)
This library includes the basic classes needed to write |cdk| stacks and apps.

.. tabs::

    .. group-tab:: C#

        Install the **Amazon.CDK NuGet** package:

        .. code-block:: sh

            dotnet add package Amazon.CDK

    .. group-tab:: JavaScript

        Install the **@aws-cdk/cdk** package:

        .. code-block:: sh

            npm install @aws-cdk/cdk

    .. group-tab:: TypeScript

        Install the **@aws-cdk/cdk** package:

        .. code-block:: sh

            npm install @aws-cdk/cdk

    .. group-tab:: Java

        Add the following to your project's `pom.xml` file:

        .. code-block:: xml

            <dependencies>
                <dependency>
                    <groupId>software.amazon.awscdk</groupId>
                    <artifactId>cdk</artifactId>
                    <version><!-- cdk-version --></version>
                </dependency>
            </dependencies>

.. _manual_define_app:

Defining the |cdk| App
----------------------

|cdk| apps are classes that extend the :py:class:`App <@aws-cdk/cdk.App>`
class. Create an empty **App**:

.. tabs::

    .. group-tab:: C#

        In **Program.cs**

        .. code-block:: c#

            using Amazon.CDK;

            namespace HelloCdk
            {
                class Program
                {
                    static void Main(string[] args)
                    {
                        var myApp = new App();
                        myApp.Run();
                    }
                }
            }

    .. group-tab:: JavaScript

        Create the file **bin/hello-cdk.js**:

        .. code-block:: js

            const cdk = require('@aws-cdk/cdk');

            class MyApp extends cdk.App {
                constructor() {
                    super();
                }
            }

            new MyApp().run();

    .. group-tab:: TypeScript

        Create the file **bin/hello-cdk.ts**:

        .. code-block:: ts

            import cdk = require('@aws-cdk/cdk');
            import { HelloCdkStack } from '../lib/hello-cdkstack';

            const app = new cdk.App();
            new HelloCdkStack(app, 'HelloCdkStack');
            app.run();

        Create the file **lib/hello-cdkstack.ts**:

        .. code-block:: ts

            import cdk = require('@aws-cdk/cdk');

            export class HelloCdkStack extends cdk.Stack {
                constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
                    super(parent, name, props);

                    // The code that defines your stack goes here
                }
            }
            
    .. group-tab:: Java

        In **src/main/java/com/acme/MyApp.java**:

        .. code-block:: java

            package com.acme;

            import software.amazon.awscdk.App;

            import java.util.Arrays;

            public class MyApp {
                public static void main(final String argv[]) {
                    App app = new App();

                    app.run();
                }
            }

.. _manual_compile:

Compiling the Code
------------------

If needed, compile the code:

.. tabs::

    .. group-tab:: C#

        Compile the code using your IDE or via the dotnet CLI:

        .. code-block:: sh

            dotnet build

    .. group-tab:: JavaScript

        No need to compile

    .. group-tab:: TypeScript

        To compile your program from **.ts** to **.js**:

        .. code-block:: sh

            npm run build

        You can also use the **watch** command to continuously compile your code
        as it changes, so you don't have to invoke the compiler explicitly:

        .. code-block:: sh

            # run in another terminal session
            npm run watch

    .. group-tab:: Java

        Compile your code using your IDE or via the command line via **mvn**:

        .. code-block:: sh

            mvn compile

You have now created your first |cdk| app.
        
.. _list_stacks:

Listing the Stacks in the App
=============================

Use the |cdk| toolkit's **ls** command to list the stacks in the app.

.. code-block:: sh

    cdk ls

The result is just the name of the stack:

.. code-block:: sh

    HelloCdkStack

.. note::

    There is a known issue on Windows with the |cdk| .NET environment.
    Whenever you use a **cdk** command,
    it issues a node warning similar to the following:

    .. code-block:: sh

        (node:27508) UnhandledPromiseRejectionWarning: Unhandled promise rejection
        (rejection id: 1): Error: EPIPE: broken pipe, write
        (node:27508) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated.
        In the future, promise rejections that are not handled will terminate the
        Node.js process with a non-zero exit code.

    You can safely ignore this warning.

.. _define_stack:

Define a Stack
==============

Define a stack and add it to the app.

.. tabs::

    .. group-tab:: C#

        Create **MyStack.cs**:

        .. code-block:: c#

            using Amazon.CDK;

            namespace HelloCdk
            {
                public class MyStack: Stack
                {
                    public MyStack(App parent, string name) : base(parent, name, null)
                    {
                    }
                }
            }

        In **Program.cs**:

        .. code-block:: c#
            :emphasize-lines: 10

            using Amazon.CDK;

            namespace HelloCdk
            {
                class Program
                {
                    static void Main(string[] args)
                    {
                        var myApp = new App();
                        new MyStack(myApp, "hello-cdk");
                        myApp.Run();
                    }
                }
            }

    .. group-tab:: JavaScript

        In **index.js**:

        .. code-block:: js
            :emphasize-lines: 3,4,5,6,7,13

            const cdk = require('@aws-cdk/cdk');

            class MyStack extends cdk.Stack {
                constructor(parent, id, props) {
                    super(parent, id, props);
                }
            }

            class MyApp extends cdk.App {
                constructor(argv) {
                    super(argv);

                    new MyStack(this, 'hello-cdk');
                }
            }

            new MyApp().run();

    .. group-tab:: TypeScript

        Nothing to do.

    .. group-tab:: Java

        In **src/main/java/com/acme/MyStack.java**:

        .. code-block:: java

            package com.acme;

            import software.amazon.awscdk.App;
            import software.amazon.awscdk.Stack;
            import software.amazon.awscdk.StackProps;

            public class MyStack extends Stack {
                public MyStack(final App parent, final String name) {
                    this(parent, name, null);
                }

                public MyStack(final App parent, final String name, final StackProps props) {
                    super(parent, name, props);
                }
            }

        In **src/main/java/com/acme/MyApp.java**:

        .. code-block:: java
            :emphasize-lines: 12

            package com.acme;

            import software.amazon.awscdk.App;
            import java.util.Arrays;

            public class MyApp {
                public static void main(final String argv[]) {
                    App app = new App();

                    new MyStack(app, "hello-cdk");

                    app.run();
                }
            }

The initializer signature of **cdk.Stack** includes the arguments: **parent**,
**id**, and **props**. This is the signature for every class in the |cdk|
framework. These classes are called **"constructs"** and they are composed
together into a tree:

* **parent** represents the parent construct. By specifying the parent construct
  upon initialization, constructs can obtain contextual information when they
  are initialized. For example, the region a stack is deployed to can be
  obtained via a call to :py:meth:`Stack.find(this).requireRegion() <@aws-cdk/cdk.Stack.requireRegion>`.
  See :doc:`context` for more information.
* **id** is a string that locally identifies this construct within the tree.
  Constructs must have a unique ID amongst their siblings.
* **props** is the set of initialization properties for this construct.

Compile your program:

.. tabs::

    .. group-tab:: C#

        We configured *cdk.json* to run `dotnet run`, which
        restores dependencies, builds, and runs your application,
        run `cdk`.

        .. code-block:: sh

            cdk

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile

.. _define_bucket:

Define an |S3| Bucket
=====================

Now, what can we do with this app? Nothing yet. Our stack is still empty, so
there's nothing to deploy.

Let's define an |S3| bucket.

Install the **@aws-cdk/aws-s3** package:

.. tabs::

    .. group-tab:: C#

        .. code-block:: sh

            dotnet add package Amazon.CDK.AWS.S3

    .. group-tab:: JavaScript

        .. code-block:: sh

            npm install @aws-cdk/aws-s3

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm install @aws-cdk/aws-s3

    .. group-tab:: Java

        Edit your **pom.xml** file:

        .. code-block:: sh

            <dependency>
                <groupId>software.amazon.awscdk</groupId>
                <artifactId>s3</artifactId>
                <version><!-- cdk-version --></version>
            </dependency>

Next, define an |S3| bucket in the stack. |S3| buckets are represented by
the :py:class:`Bucket <@aws-cdk/aws-s3.Bucket>` class:

.. tabs::

    .. group-tab:: C#

        Create **MyStack.cs**:

        .. code-block:: c#
            :emphasize-lines: 2,10,11,12,13

            using Amazon.CDK;
            using Amazon.CDK.AWS.S3;

            namespace HelloCdk
            {
                public class MyStack : Stack
                {
                    public MyStack(App parent, string name) : base(parent, name, null)
                    {
                        new Bucket(this, "MyFirstBucket", new BucketProps
                        {
                            Versioned = true
                        });
                    }
                }
            }

    .. group-tab:: JavaScript

        In **index.js**:

        .. code-block:: js
            :emphasize-lines: 2,8,9,10

            const cdk = require('@aws-cdk/cdk');
            const s3 = require('@aws-cdk/aws-s3');

            class MyStack extends cdk.Stack {
                constructor(parent, id, props) {
                    super(parent, id, props);

                    new s3.Bucket(this, 'MyFirstBucket', {
                        versioned: true
                    });
                }
            }

    .. group-tab:: TypeScript

        In **lib/**:

        .. code-block:: ts
            :emphasize-lines: 2,8,9,10

            import cdk = require('@aws-cdk/cdk');
            import s3 = require('@aws-cdk/aws-s3');

            export class HelloCdkStack extends cdk.Stack {
                constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
                    super(parent, id, props);

                    new s3.Bucket(this, 'MyFirstBucket', {
                        versioned: true
                    });
                }
            }

    .. group-tab:: Java

        In **src/main/java/com/acme/MyStack.java**:

        .. code-block:: java
            :emphasize-lines: 6,7,13,14,15

            package com.acme;

            import software.amazon.awscdk.App;
            import software.amazon.awscdk.Stack;
            import software.amazon.awscdk.StackProps;
            import software.amazon.awscdk.services.s3.Bucket;
            import software.amazon.awscdk.services.s3.BucketProps;

            public class MyStack extends Stack {
                public MyStack(final App parent, final String name) {
                    this(parent, name, null);
                }

                public MyStack(final App parent, final String name, final StackProps props) {
                    super(parent, name, props);

                    new Bucket(this, "MyFirstBucket", BucketProps.builder()
                            .withVersioned(true)
                            .build());
                }
            }

A few things to notice:

* :py:class:`Bucket <@aws-cdk/aws-s3.Bucket>` is a construct.
  This means it's initialization signature has **parent**, **id**, and **props**.
  In this case, the bucket is an immediate child of **MyStack**.
* ``MyFirstBucket`` is the **logical id** of the bucket construct, **not** the physical name of the
  S3 bucket. The logical ID is used to uniquely identify resources in your stack
  across deployments. See :doc:`logical-ids` for more details on how to work
  with logical IDs. To specify a physical name for your bucket, you can set the
  :py:meth:`bucketName <@aws-cdk/aws-s3.BucketProps.bucketName>` property when
  you define your bucket.
* Since the bucket's :py:meth:`versioned <@aws-cdk/aws-s3.BucketProps.versioned>`
  property is :code:`true`, `versioning <https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html>`_
  is enabled on the bucket.

Compile your program:

.. tabs::

    .. group-tab:: C#

        We configured *cdk.json* to run `dotnet run`, which
        restores dependencies, builds, and runs your application,
        run `cdk`.

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile

.. _synthesize_template:

Synthesize an |CFN| Template
============================

Synthesize a |cfn| template for the stack:

.. code-block:: sh

    cdk synth HelloCdkStack

.. note:: Since the |cdk| app only contains a single stack, you can omit :code:`HelloCdkStack`.

This command executes the |cdk| app and synthesize an |CFN| template for the
**HelloCdkStack** stack.
You should see something similar to the following,
where VERSION is the version of the |cdk|.

.. code-block:: yaml

    Resources:
      MyFirstBucketB8884501:
        Type: AWS::S3::Bucket
        Properties:
          VersioningConfiguration:
            Status: Enabled
        Metadata:
          aws:cdk:path: HelloCdkStack/MyFirstBucket/Resource
      CDKMetadata:
        Type: AWS::CDK::Metadata
        Properties:
          Modules: "@aws-cdk/aws-codepipeline-api=VERSION,@aws-cdk/aws-events=VERSION,@aws-c\
            dk/aws-iam=VERSION,@aws-cdk/aws-kms=VERSION,@aws-cdk/aws-s3=VERSION,@aws-c\
            dk/aws-s3-notifications=VERSION,@aws-cdk/cdk=VERSION,@aws-cdk/cx-api=VERSION\
            .0,hello-cdk=0.1.0"

You can see that the stack contains an **AWS::S3::Bucket** resource with the desired
versioning configuration.

.. note::

    The **AWS::CDK::Metadata** resource was automatically added to your template
    by the toolkit. This allows us to learn which libraries were used in your
    stack. See :ref:`version_reporting` for more details and how to
    :ref:`opt-out <version_reporting_opt_out>`.

.. _deploy_stack:

Deploying the Stack
===================

Use **cdk deploy** to deploy the stack:

.. code-block:: sh

    cdk deploy

The **deploy** command synthesizes an |CFN| template from the stack
and then invokes the |CFN| create/update API to deploy it into your AWS
account. The command displays information as it progresses.

.. _modify_cde:

Modifying the Code
==================

Configure the bucket to use KMS managed encryption:

.. tabs::

    .. group-tab:: C#

        .. code-block:: c#
            :emphasize-lines: 4

            new Bucket(this, "MyFirstBucket", new BucketProps
            {
                Versioned = true,
                Encryption = BucketEncryption.KmsManaged
            });

    .. group-tab:: JavaScript

        .. code-block:: js
            :emphasize-lines: 3

            new s3.Bucket(this, 'MyFirstBucket', {
                versioned: true,
                encryption: s3.BucketEncryption.KmsManaged
            });

    .. group-tab:: TypeScript

        .. code-block:: ts
            :emphasize-lines: 3

            new s3.Bucket(this, 'MyFirstBucket', {
                versioned: true,
                encryption: s3.BucketEncryption.KmsManaged
            });

    .. group-tab:: Java

        .. code-block:: java
            :emphasize-lines: 3

            new Bucket(this, "MyFirstBucket", BucketProps.builder()
                    .withVersioned(true)
                    .withEncryption(BucketEncryption.KmsManaged)
                    .build());

Compile the program:

.. tabs::

    .. group-tab:: C#

        We configured *cdk.json* to run `dotnet run`, which
        restores dependencies, builds, and runs your application,
        run `cdk`.                   

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile

.. _prepare_deployment:

Preparing for Deployment
========================

Before you deploy the updated stack, use the ``cdk diff`` command to evaluate
the difference between the |cdk| app and the deployed stack:

.. code-block:: sh

    cdk diff

The toolkit queries your AWS account for the current |CFN| template for the
**hello-cdk** stack, and compares the result with the template synthesized from the app.
The output should look like the following:

.. code-block:: sh

    [~] 🛠 Updating MyFirstBucketB8884501 (type: AWS::S3::Bucket)
    └─ [+] .BucketEncryption:
        └─ New value: {"ServerSideEncryptionConfiguration":[{"ServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms"}}]}

As you can see, the diff indicates that the
**ServerSideEncryptionConfiguration** property of the bucket is now set to
enable server-side encryption.

You can also see that the bucket is not going to be replaced but rather updated
("**Updating MyFirstBucketB8884501**").

Run **cdk deploy** to update the stack:

.. code-block:: sh

    cdk deploy

The toolkit updates the bucket configuration to enable server-side KMS
encryption for the bucket:

.. code-block:: sh

    ⏳  Starting deployment of stack hello-cdk...
    [0/2] UPDATE_IN_PROGRESS  [AWS::S3::Bucket] MyFirstBucketB8884501
    [1/2] UPDATE_COMPLETE     [AWS::S3::Bucket] MyFirstBucketB8884501
    [1/2] UPDATE_COMPLETE_CLEANUP_IN_PROGRESS  [AWS::CloudFormation::Stack] hello-cdk
    [2/2] UPDATE_COMPLETE     [AWS::CloudFormation::Stack] hello-cdk
    ✅  Deployment of stack hello-cdk completed successfully

.. _whats_next:

What Next?
==========

 * Learn more about :doc:`CDK Concepts <concepts>`
 * Check out the `examples directory <https://github.com/awslabs/aws-cdk/tree/master/examples>`_ in your GitHub repository
 * Learn about the rich APIs offered by the :doc:`AWS Construct Library <aws-construct-lib>`
 * Work directly with CloudFormation using the :doc:`AWS CloudFormation Library <cloudformation>`
 * Come talk to us on `Gitter <https://gitter.im/awslabs/aws-cdk>`_

