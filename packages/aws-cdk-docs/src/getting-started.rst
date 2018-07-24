.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. note:: Some of the instructions in this topic will change when the CDK will be published
   to the public package repositories.

.. _getting_started:

#############
Hello, |cdk|!
#############

This topic will walk you through creating and deploying your first CDK app.

The following instructions assume that you have already installed the CDK on
your system. To verify, run the following command to verify that the installed
version matches the version of this guide (|cdk-version|):

.. code-block:: sh

    cdk --version

Initialize the project
----------------------

In this section we will create an empty project structure for your CDK app.

.. tabs::

    .. group-tab:: JavaScript

        Create an empty source-controlled directory for your project and an
        initial npm **package.json** file:

        .. code-block:: sh

            mkdir hello-cdk
            cd hello-cdk
            git init
            npm init -y

    .. group-tab:: TypeScript

        Create an empty source-controlled directory for your project and an
        initial npm **package.json** file:

        .. code-block:: sh

            mkdir hello-cdk
            cd hello-cdk
            git init
            npm init -y # creates package.json

        Create a minimal **tsconfig.json**:

        .. code-block:: json

            {
                "compilerOptions": {
                    "target": "es2018",
                    "module": "commonjs"
                }
            }

        Setup TypeScript build commands in **package.json**:

        .. code-block:: json

            {
                "scripts": {
                    "build": "tsc",
                    "watch": "tsc -w"
                }
            }

    .. group-tab:: Java

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

Add @aws-cdk/cdk as a dependency
---------------------------------

Now, we will install the CDK core library (:py:mod:`_aws-cdk_core`). This
library includes the basic classes needed to write CDK stacks and apps.

.. tabs::

    .. group-tab:: JavaScript

        Use **y-npm** to install the **@aws-cdk/cdk** package:

        .. code-block:: sh

            y-npm install @aws-cdk/cdk

        .. note:: We are using **y-npm** instead of **npm** in order to install npm
            modules from the local npm repository included with your CDK
            installation. These instructions will change once the CDK will be
            published publically.

    .. group-tab:: TypeScript

        Use **y-npm** to install the **@aws-cdk/cdk** package. We also need **@types/node**
        since we will be using **process.argv** in our code:

        .. code-block:: sh

            y-npm install @aws-cdk/cdk @types/node

        .. note:: We are using **y-npm** instead of **npm** in order to install npm
            modules from the local npm repository included with your CDK
            installation. These instructions will change once the CDK will be
            published publically.

    .. group-tab:: Java

        Add the following to your project's `pom.xml` file:

        .. code-block:: xml

            <repositories>
                <!-- Beta only: local CDK maven repo -->
                <repository>
                    <id>cdk</id>
                    <url>file:///${env.HOME}/.cdk/repo/maven</url>
                </repository>
            </repositories>

            <dependencies>
                <dependency>
                    <groupId>com.amazonaws.cdk</groupId>
                    <artifactId>aws-cdk</artifactId>

                    <!-- make sure to use the CDK installed version here (i.e. "0.7.3-beta") -->
                    <version>0.7.3-beta</version>
                </dependency>
            </dependencies>

        .. note:: The **<repository>** section is only needed during private Beta.

Define your CDK app
-------------------

CDK apps are modeled as classes which extend the :py:class:`_aws-cdk_core.App`
class. Let's create our first, empty **App**:

.. tabs::

    .. code-tab:: js

        // index.js

        const cdk = require('@aws-cdk/cdk');

        class MyFirstApp extends cdk.App {
            constructor(argv) {
                super(argv);
            }
        }

        process.stdout.write(new MyFirstApp(process.argv).run());

    .. code-tab:: ts

        // index.ts

        import cdk = require('@aws-cdk/cdk');

        class MyFirstApp extends cdk.App {
            constructor(argv: string[]) {
                super(argv);
            }
        }

        process.stdout.write(new MyFirstApp(process.argv).run());

    .. code-tab:: java

        // src/main/java/com/acme/MyApp.java

        package com.acme;

        import com.amazonaws.cdk.App;

        import java.util.Arrays;
        import java.util.List;

        public class MyApp extends App {
            public MyApp(final List<String> argv) {
                super(argv);
            }

            public static void main(final String[] argv) {
                System.out.println(new MyApp(Arrays.asList(argv)).run());
            }
        }

.. note:: The code that reads **argv**, runs the app and writes the output to **STDOUT** is
    currently needed in order to allow the CDK Toolkit to interact with your app. In the future
    the toolkit will include per-language shims that will remove this boilerplate.

Compile your code
-----------------

If needed, compile the code:

.. tabs::

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

This is it, you now created your first, alas empty, CDK app.

Configure CDK toolkit via **cdk.json**
--------------------------------------

We will now use the CDK toolkit to view the contents of this app.

.. note::

    You must specify your default credentials and region to use the toolkit,

    Use the `AWS Command Line Interface <https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html>`_
    ``aws configure`` command to specify your default credentials and region.

    Important: make sure that you explicitly specify a **region**.

    You can also set environment variables for your default credentials and region.
    Environment variables take precedence over settings in the credentials or config file.

    * *AWS_ACCESS_KEY_ID* specifies your access key
    * *AWS_SECRET_ACCESS_KEY* specifies your secret access key
    * *AWS_DEFAULT_REGION* specifies your default region

    See `Environment Variables <https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html>`_
    in the CLI User Guide for details.

The CDK toolkit needs to know how to execute your CDK app. It requires that the
:code:`--app` command-line option will point to an executable program that adhere's
to the toolkit's protocol (this is what the **ARGV/STDOUT** boilerplate
implements). Alternatively to explicitly specifying :code:`--app` every time you use
the toolkit, we recommend that you create a :code:`cdk.json` file at the root of
your project directory:

.. tabs::

    .. group-tab:: JavaScript

        Define the :code:`--app` option in **cdk.json** to execute **index.js**
        using **node**:

        .. code-block:: json

            {
              "app": "node index.js"
            }

    .. group-tab:: TypeScript

        Define the :code:`--app` option in **cdk.json** to execute **index.js**
        using **node**:

        .. code-block:: json

            {
              "app": "node index.js"
            }

    .. group-tab:: Java

        In order to execute our Java program, we will need to specify a
        **CLASSPATH** which contains both our compiled code and dependencies.
        We will use **maven-dependency-plugin** to produce a file **.classpath.txt**
        whenever the project is compiled:

        .. code-block:: xml

            <!-- pom.xml -->

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

        Run **mvn compile** and verify the **.classpath.txt** exist:

        .. code-block:: sh

            mvn compile
            ls .classpath.txt

        Now, create a shim **app.sh** which will be used to execute our CDK Java app:

        .. code-block:: sh

            #!/bin/bash
            exec java -cp target/classes:$(cat .classpath.txt) com.acme.MyApp app $@

        And now we can define the :code:`-- app` option in **cdk.json**:

        .. code-block:: json

            {
              "app": "/bin/bash ./app.sh"
            }

List all stacks in your app
---------------------------

To list the stacks in this app, you can use the CDK toolkit's **ls** command.

.. code-block:: sh

    cdk ls -l

The result will be quite disappointing:

.. code-block:: sh

    []

An empty array, which makes sense, since our app still doesn't have any stacks
in it.

Define a stack
--------------

Now, let's define our first stack and add it to our app.

.. tabs::

    .. code-tab:: js
        :emphasize-lines: 4,5,6,7,8,14

        // index.js
        const cdk = require('@aws-cdk/cdk');

        class MyFirstStack extends cdk.Stack {
            constructor(parent, id, props) {
                super(parent, id, props);
            }
        }

        class MyFirstApp extends cdk.App {
            constructor(argv) {
                super(argv);

                new MyFirstStack(this, 'hello-cdk');
            }
        }

        process.stdout.write(new MyFirstApp(process.argv).run());

    .. code-tab:: ts
        :emphasize-lines: 4,5,6,7,8,14

        // index.ts
        import cdk = require('@aws-cdk/cdk');

        class MyFirstStack extends cdk.Stack {
            constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
                super(parent, id, props);
            }
        }

        class MyFirstApp extends cdk.App {
            constructor(argv: string[]) {
                super(argv);

                new MyFirstStack(this, 'hello-cdk');
            }
        }

        process.stdout.write(new MyFirstApp(process.argv).run());

    .. code-tab:: java
        :emphasize-lines: 1,2,3,4,5,6,7,8,9,10,11,25

        // src/main/java/com/acme/MyStack.java

        package com.acme;

        import com.amazonaws.cdk.App;
        import com.amazonaws.cdk.Stack;

        public class MyStack extends Stack {
            public MyStack(final App parent, final String id) {
                super(parent, id);
            }
        }

        // src/main/java/com/acme/MyApp.java
        package com.acme;

        import com.amazonaws.cdk.App;

        import java.util.Arrays;
        import java.util.List;

        public class MyApp extends App {
            public MyApp(final List<String> argv) {
                super(argv);

                new MyStack(this, "hello-cdk");
            }

            public static void main(final String[] argv) {
                System.out.println(new MyApp(Arrays.asList(argv)).run());
            }
        }

The initializer signature of **cdk.Stack** includes three arguments: **parent**,
**id** and **props**. This is the signature for every class in the CDK
framework. These classes are called **"constructs"** and they are composed
together to a tree:

* **parent** represents the parent construct. By specifying the parent construct
  upon initialization, constructs can obtain contextual information when they
  are initialized. For example, the region a stack is deployed to can be
  obtained via a call to **Stack.find(this).requireRegion()**. See Context for
  more information.
* **id** is a local string identifier of the construct within the tree.
  Constructs must have a unique ID amongst their siblings.
* **props** is the set of initialization properties for this construct.

Compile your program:

.. tabs::

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile


Now, when we run **cdk ls**, the result shows that your app includes a single
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
account and region configured in the AWS CLI.

Define an S3 bucket
-------------------

Now, what can we do with this app? Nothing yet. Our stack is still empty so,
there's nothing to deploy.

Let's define an S3 bucket.

First, we need to install the **@aws-cdk/aws-s3** package:

.. tabs::

    .. group-tab:: JavaScript

        .. code-block:: sh

            y-npm install @aws-cdk/aws-s3

    .. group-tab:: TypeScript

        .. code-block:: sh

            y-npm install @aws-cdk/aws-s3

    .. group-tab:: Java

        During beta, we bundled all CDK modules into the aws-cdk Maven package, so
        there is no need to explicitly install the S3 library.

Now, let's define an S3 bucket in our stack. S3 buckets are represented by
the :py:class:`_aws-cdk_s3.Bucket` class:

.. tabs::

    .. code-tab:: js
        :emphasize-lines: 3,9,10,11

        // index.js
        const s3 = require('@aws-cdk/aws-s3');
        const cdk = require('@aws-cdk/cdk');

        class MyFirstStack extends cdk.Stack {
            constructor(parent, id, props) {
                super(parent, id, props);

                new s3.Bucket(this, 'MyFirstBucket', {
                    versioned: true
                });
            }
        }

    .. code-tab:: ts
        :emphasize-lines: 3,9,10,11

        // index.ts
        import s3 = require('@aws-cdk/aws-s3');
        import cdk = require('@aws-cdk/cdk');

        class MyFirstStack extends cdk.Stack {
            constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
                super(parent, id, props);

                new s3.Bucket(this, 'MyFirstBucket', {
                    versioned: true
                });
            }
        }

    .. code-tab:: java
        :emphasize-lines: 6,7,13,14,15

        // src/main/java/com/acme/MyStack.java
        package com.acme;

        import com.amazonaws.cdk.App;
        import com.amazonaws.cdk.Stack;
        import com.amazonaws.cdk.aws.s3.Bucket;
        import com.amazonaws.cdk.aws.s3.BucketProps;

        public class MyStack extends Stack {
            public MyStack(final App parent, final String id) {
                super(parent, id);

                new Bucket(this, "MyFirstBucket", BucketProps.builder()
                        .withVersioned(true)
                        .build());
            }
        }

A few things to notice:

* **s3.Bucket** is construct. This means it's initialization signature will have
  **parent**, **id** and **props**. In this case, the bucket is an immediate
  child of **MyStack**, it's id is 'MyFirstBucket'.
* We configured out bucket to have versioning enabled by setting the
  :code:`versioned` property to :code:`true`.

Compile your program:

.. tabs::

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile

Synthesize a CloudFormation template
------------------------------------

Now, that our stack contains a bucket, we can ask the toolkit to synthesize a
CloudFormation template for our stack (don't forget to compile your project):

.. code-block:: sh

    cdk synth hello-cdk

.. note:: Since our CDK app only contains a single stack, you can omit :code:`hello-cdk`.

This command will execute our CDK app and synthesize a CloudFormation template for the
**hello-cdk** stack:

.. code-block:: yaml

    Resources:
        MyFirstBucketB8884501:
            Type: 'AWS::S3::Bucket'
            Properties:
                VersioningConfiguration:
                    Status: Enabled

You can see that the stack contains an **AWS::S3::Bucket** resource with the desired
versioning configuration.

Deploying our stack
-------------------

To deploy our stack, use **cdk deploy**:

.. code-block:: sh

    cdk deploy hello-cdk

The **deploy** command will synthesize a CloudFormation template from your stack
and then invoke the CloudFormation create/update API to deploy it into your AWS
account. Progress will be emitted to your console.

Modifying your code
-------------------

Let's configure our bucket to use KMS managed encryption:

.. tabs::

    .. code-tab:: js
        :emphasize-lines: 3

        new s3.Bucket(this, 'MyFirstBucket', {
            versioned: true,
            encryption: s3.BucketEncryption.KmsManaged
        });


    .. code-tab:: ts
        :emphasize-lines: 3

        new s3.Bucket(this, 'MyFirstBucket', {
            versioned: true,
            encryption: s3.BucketEncryption.KmsManaged
        });

    .. code-tab:: java
        :emphasize-lines: 3

        new Bucket(this, "MyFirstBucket", BucketProps.builder()
                .withVersioned(true)
                .withEncryption("MANAGED")
                .build());

Compile your program:

.. tabs::

    .. group-tab:: JavaScript

        Nothing to compile.

    .. group-tab:: TypeScript

        .. code-block:: sh

            npm run build

    .. group-tab:: Java

        .. code-block:: sh

            mvn compile

Preparing for deployment using **cdk diff**
-------------------------------------------

Before we deploy our updated stack, we can use the **cdk diff* command to evaluate
the difference between our CDK app and the deployed stack:

.. code-block:: sh

    cdk diff hello-cdk

The toolkit will query your AWS account for the current CloudFormation template for the
**hello-cdk** stack, and will compare the result with the template synthesized from your app.
The output should look like this:

.. code-block:: sh

    [~] 🛠 Updating MyFirstBucketB8884501 (type: AWS::S3::Bucket)
    └─ [+] .BucketEncryption:
        └─ New value: {"ServerSideEncryptionConfiguration":[{"ServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms"}}]}

As you can see, the diff indicates that the
**ServerSideEncryptionConfiguration** property of the bucket is now set to
enable server-side encryption.

You can also that the bucket is not going to be replaced but rather updated
("**Updating MyFirstBucketB8884501**").

Now, run **cdk deploy** to update your stack:

.. code-block:: sh

    cdk deploy

The toolkit will update your bucket configuration to enable server-side KMS
encryption for your bucket:

.. code-block:: sh

    ⏳  Starting deployment of stack hello-cdk...
    [0/2] UPDATE_IN_PROGRESS  [AWS::S3::Bucket] MyFirstBucketB8884501
    [1/2] UPDATE_COMPLETE     [AWS::S3::Bucket] MyFirstBucketB8884501
    [1/2] UPDATE_COMPLETE_CLEANUP_IN_PROGRESS  [AWS::CloudFormation::Stack] hello-cdk
    [2/2] UPDATE_COMPLETE     [AWS::CloudFormation::Stack] hello-cdk
    ✅  Deployment of stack hello-cdk completed successfully
