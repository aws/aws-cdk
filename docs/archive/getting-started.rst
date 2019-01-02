.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _getting_started:

##############################
Getting Started with the |cdk|
##############################

This topic describes how to download, install, and configure the |cdk|.

.. _installing_cdk:

Installing the |cdk|
====================

This section describes how to install the |cdk|,
and lists the prerequsites for each supported language.

.. _installing_prerequisites:

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

.. _installing_toolkit:

Installing the Command-Line Toolkit
-----------------------------------

Install the toolkit using the following `npm <https://www.npmjs.org>`_ command:

.. code-block:: sh

    npm install -g aws-cdk

Run the following command to see the currently installed version of the toolkit
(this guide was written for |version|):

.. code-block:: sh

    cdk --version

.. _credentials:

Configuring the |cdk|
=====================

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

