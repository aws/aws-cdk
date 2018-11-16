.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _getting_started:

#####################################
Creating Your First |cdk| Application
#####################################

This topic walks you through creating and deploying your first |cdk| app.

.. _setup:

Setting up the |cdk|
====================

.. _setup_prerequisites:

Prerequisites
-------------

You must install
`Node.js (>= 8.11.x) <https://nodejs.org/en/download>`_ to use the command-line
toolkit and language bindings.

If you use Java, you must set the `JAVA_HOME` environment variable to the path to where you have
installed the JDK on your machine to build an |cdk| app in Java.

Specify your credentials and region with the
`AWS CLI <https://aws.amazon.com/cli>`_.
You must specify both your credentials and a region to use the toolkit.
See :ref:`credentials <credentials>` for information on using the AWS CLI to
specify your credentials.

.. _setup_install:

Installing the Command-Line Toolkit
-----------------------------------

Install the toolkit using the following `npm <https://www.npmjs.org>`_ command:

.. code-block:: sh

    npm install -g aws-cdk

Run the following command to see the currently installed version of the toolkit
(this guide was written for |version|):

.. code-block:: sh

    cdk --version

.. _initializing:

Initializing the Project
========================

.. note::

    This guide walks you through the process of creating an |cdk| project.
    You can also use the
    :code:`cdk init` command to create a skeleton project from a
    template in any of the supported languages.

Create an empty project structure for the |cdk| app.

.. The cdk init -l typescript version of package.json also includes
   a "cdk": "cdk"
   entry in "scripts"

.. tabs::

    .. group-tab:: C#

        Create a new empty, source controlled directory and then create a new
        console application.

        .. code-block:: sh

            mkdir HelloCdk
            cd HelloCdk
            dotnet new console

    .. group-tab:: JavaScript

        Create an empty source-controlled directory for your project and an
        initial npm **package.json** file:

        .. code-block:: sh

            mkdir hello-cdk
            cd hello-cdk
            git init
            npm init -y # creates package.json

        Create a **.gitignore** file with the following content:

        .. code-block:: sh

            *.js
            node_modules

    .. group-tab:: TypeScript

        Create an empty source-controlled directory for your project and an
        initial npm **package.json** file:

        .. code-block:: sh

            mkdir hello-cdk
            cd hello-cdk
            git init
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

    .. group-tab:: Java

        Create an empty source-controlled directory for your project:

        .. code-block:: sh

            mkdir hello-cdk
            cd hello-cdk
            git init

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

.. _add_core:

Adding @aws-cdk/cdk as a Dependency
===================================

Install the |cdk| core library (:py:mod:`@aws-cdk/cdk`). This
library includes the basic classes needed to write |cdk| stacks and apps.

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

.. _define_app:

Defining the |cdk| App
======================

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

            class MyApp extends cdk.App {
                constructor() {
                    super();
                }
            }

            new MyApp().run();

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

.. _complie_code:

Compiling the Code
==================

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

.. _credentials:

Configuring the |cdk| Toolkit
=============================

Use the |cdk| toolkit to view the contents of an app.

.. note::

    You must specify your default credentials and region to use the toolkit.

    Use the `AWS Command Line Interface <https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html>`_
    ``aws configure`` command to specify your default credentials and region.

    You can also set environment variables for your default credentials and region.
    Environment variables take precedence over settings in the credentials or config file.

    * *AWS_ACCESS_KEY_ID* specifies your access key
    * *AWS_SECRET_ACCESS_KEY* specifies your secret access key
    * *AWS_DEFAULT_REGION* specifies your default region

    See `Environment Variables <https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html>`_
    in the CLI User Guide for details.

.. include:: region-note.rst

The |cdk| toolkit needs to know how to execute your |cdk| app. It requires that the
:code:`--app` command-line option points to an executable program that adheres
to the toolkit's protocol.
Although you can include an :code:`--app` option every time you use the toolkit,
we recommend that you instead create a :code:`cdk.json` file at the root of
your project directory with the following content:

.. tabs::

    .. group-tab:: C#

        Define the :code:`--app` option in a **cdk.json** file:

        .. code-block:: json

            {
              "app": "dotnet run --project HelloCdk.csproj"
            }

    .. group-tab:: JavaScript

        Define the :code:`--app` option in **cdk.json** to execute **hello-cdk.js**
        using **node**:

        .. code-block:: json

            {
              "app": "node bin/hello-cdk.js"
            }

    .. group-tab:: TypeScript

        Define the :code:`--app` option in **cdk.json** to execute **hello-cdk.js**
        using **node**:

        .. code-block:: json

            {
              "app": "node bin/hello-cdk.js"
            }

    .. group-tab:: Java

        Specify a
        **CLASSPATH**, which contains both the compiled code and dependencies,
        to execute the Java program.

        Use **maven-dependency-plugin** in your **pom.xml** file to produce the file **.classpath.txt**
        whenever the project is compiled:

        .. code-block:: xml

            <build>
                <plugins>
                    <!-- ... -->

                    <!-- Emit the classpath to ./.classpath.txt so cdk.json can use it -->
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-dependency-plugin</artifactId>
                        <version>2.8</version>
                        <executions>
                        <execution>
                            <id>build-classpath</id>
                            <phase>generate-sources</phase>
                            <goals>
                                <goal>build-classpath</goal>
                            </goals>
                            <configuration>
                                <outputFile>.classpath.txt</outputFile>
                            </configuration>
                        </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>

        Run **mvn compile** and verify that **.classpath.txt** exists:

        .. code-block:: sh

            mvn compile
            ls .classpath.txt

        Create a shim **app.sh** to execute the |cdk| Java app:

        .. code-block:: sh

            #!/bin/bash
            exec java -cp target/classes:$(cat .classpath.txt) com.acme.MyApp app $@

        Define the :code:`--app` option in **cdk.json**:

        .. code-block:: json

            {
              "app": "/bin/bash ./app.sh"
            }

.. _list_stacks:

List the Stacks in the App
==========================

Use the |cdk| toolkit's **ls** command to list the stacks in the app.

.. code-block:: sh

    cdk ls -l

The result is an empty array:

.. code-block:: sh

    []

An empty array makes sense, since our app doesn't have any stacks.

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

        In **index.ts**:

        .. code-block:: ts
            :emphasize-lines: 3,4,5,6,7,13

            import cdk = require('@aws-cdk/cdk');

            class MyStack extends cdk.Stack {
                constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
                    super(parent, id, props);
                }
            }

            class MyApp extends cdk.App {
                constructor() {
                    super();
                    new MyStack(this, 'hello-cdk');
                }
            }

            new MyApp().run();

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

        We have configured cdk.json to run "dotnet run", which will
        restore dependencies, build, and run your application.
        Therefore, you just need to run the CDK command.

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile

Run **cdk ls** to see that the app includes a single
stack:

.. code-block:: sh

    cdk ls -l
    -
        name: hello-cdk
        environment:
            name: <your-account-id>/<your-default-region>
            account: '<your-account-id>'
            region: <your-default-region>

Notice that your stack has been automatically associated with the default AWS
account and region configured in the AWS CLI. See :doc:`environments` for more
details on how to associate stacks to environments.

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

        In **index.ts**:

        .. code-block:: ts
            :emphasize-lines: 2,8,9,10

            import cdk = require('@aws-cdk/cdk');
            import s3 = require('@aws-cdk/aws-s3');

            class MyStack extends cdk.Stack {
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

        We have configured cdk.json to run "dotnet run", which will
        restore dependencies, build, and run your application.
        Therefore, you just need to run the CDK command.

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

    cdk synth hello-cdk

.. note:: Since the |cdk| app only contains a single stack, you can omit :code:`hello-cdk`.

This command executes the |cdk| app and synthesize an |CFN| template for the
**hello-cdk** stack:

.. code-block:: yaml

    Resources:
        MyFirstBucketB8884501:
            Type: 'AWS::S3::Bucket'
            Properties:
                VersioningConfiguration:
                    Status: Enabled
        CDKMetadata:
            Type: 'AWS::CDK::Metadata'
            Properties:
                Modules: # ...

You can see that the stack contains an **AWS::S3::Bucket** resource with the desired
versioning configuration.

.. note::

    The **AWS::CDK::Metadata** resource was automatically added to your template
    by the toolkit. This allows us to learn which libraries were used in your
    stack. See :ref:`version-reporting` for more details and how to
    :ref:`opt-out <version-reporting-opt-out>`.

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

        We have configured cdk.json to run "dotnet run", which will
        restore dependencies, build, and run your application.
        Therefore, you just need to run the CDK command.

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

