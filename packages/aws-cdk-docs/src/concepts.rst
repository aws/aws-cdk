.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _concepts:

########
Concepts
########

This topic describes some of the concepts (the why and how)
behind the |cdk|.

|cdk| apps are represented as a hierarchal structure we call the *construct
tree*. Every node in the tree is a |construct-class| object. The
root of an |cdk| app is typically an |app-class| construct. Apps
contain one or more |stack-class| constructs, which are deployable
units of your app.

This composition of constructs gives you the flexibility to architect your app, such as
having a stack deployed in multiple regions. Stacks contain, either directly or
indirectly through a child construct that represent AWS resources, such as |SQS|
queues, |SNS| topics, |LAM| functions, and |DDB| tables.

This composition of constructs also means you can easily create sharable constructs,
and make changes to any construct and have those changes available to consumers
as shared class libraries.

.. _constructs:

Constructs
==========

Constructs are the building blocks of |cdk| applications. Constructs may have
child constructs, which in turn can have child constructs, forming a
hierarchical tree structure.

This tree structure is a powerful design pattern for composing high-level
abstractions. For example, you can define a ``StorageLayer`` construct that
represents your application's storage layer and include all the AWS resources,
such as |DDB| tables and |S3| buckets, needed to implement your storage layer in
this construct. When your higher-level code uses this construct, it only needs
to instantiate the ``StorageLayer`` construct.

When you initialize a construct,
add the construct to the construct tree by specifying the parent construct as the first initializer parameter,
a identifier for the construct as the second parameter,
and an set of properties for the final parameter,
as shown in the following example.

.. code-block:: js

   new SomeConstruct(parent, name[, props]);

In almost all cases, you will want to pass the keyword ``this`` for the ``parent``
argument, because you will generally initialize new constructs in the context of
the parent construct. Any descriptive string will do for the ``name``
argument,
and an in-line object for the set of properties.

.. code-block:: js

   new BeautifulConstruct(this, 'Foo', {
     applicationName: 'myApp',
     timeout: 300
   });

.. admonition:: Rationale

   The reason we associate the construct to its parent as part of its
   initialization is because the construct occasionally needs contextual
   information from its parent, such as to which the Region the stack is deployed.

Use the following operations to inspect the construct tree.

:py:attr:`aws-cdk.Construct.parent`
   returns the construct's parent construct.

:py:meth:`aws-cdk.Construct.getChildren`
   returns an array of all of the contruct's children.

:py:meth:`aws-cdk.Construct.getChild`
   returns the child construct with the specified ID.


   returns a string representing the construct's tree.

.. _construct_names:

Construct Names
---------------

Every construct in a CDK app must have a **name** unique amongst its siblings.
Names are used to track Constructs in the Construct hierarchy, and to allocate
logical IDs so that CloudFormation can keep track of the generated resources.

When a construct is created, its name is specified as the second
initializer argument:

.. code-block:: js

   const c1 = new MyBeautifulConstruct(this, 'OneBeautiful');
   const c2 = new MyBeautifulConstruct(this, 'TwoBeautiful');
   assert(c1.name === 'OneBeautiful');
   assert(c2.name === 'TwoBeautiful');

Use the :py:attr:`aws-cdk.Construct.path` property to get the path of this
construct from the root of the tree.

Note that the name of a construct does not directly map onto the physical name
of the resource when it is created! If you have a bucket or table that you want
to give a concrete name, then specify the desired name using use the appropriate
property, such as ``bucketName`` or ``tableName``. Example:

.. code-block:: js

    new Bucket(this, 'MyBucket', {
      bucketName: 'physical-bucket-name'
    });

In general however, you should avoid specifying physical names. Instead, let
CloudFormation generate names for you, and use attributes like bucket.bucketName
to discover the generated names and pass them to your application's runtime
code, as described in :ref:`creating_runtime_value`.

When you synthesize an |cdk| tree into a |CFN| template, the |CFN| logical ID
for each resource in the template is allocated according to the path of that
resource in the construct tree. For more information, see :ref:`logical_ids`.

.. _construct_properties:

Construct Properties
--------------------

Constructs can be customized by passing a property object as the third
parameter. Every construct has its own set of parameters, defined as an
interface. You can pass a property object to your construct in two ways:

.. code-block:: js

   // Inline (recommended)
   new Queue(this, 'MyQueue', {
     visibilityTimeout: 300
   });

   // Instantiate separate property object
   const props: QueueProps = {
     visibilityTimeout: 300
   };

   new Queue(this, 'MyQueue', props);

.. _construct_metadata:

Construct Metadata
------------------

You can attach metadata to a construct using the
py:meth:`aws-cdk.Construct.addMetadata` operation. Metadata entries
automatically include the stack trace from which the metadata entry was added,
so at any level of a construct you can find the code location, even if metadata
was created by a lower-level library that you don't own.

.. _stacks:

Stacks
======

A |stack| is an |cdk| construct that can be deployed into an AWS environment.
The combination of region and account becomes the stack's *environment*, as
described in `Environments`_. Most production apps consist of multiple stacks of
resources that are deployed as a single transaction using a resource
provisioning service like |CFN|. Any resources added directly or indirectly as
children of a stack are included in the stack's template as it is synthesized by
your |cdk| program.

Define an application stack by extending the |stack-class| class, as
shown in the following example.

.. code-block:: js

   import { Stack, StackProps } from '@aws-cdk/core'

   interface MyStackProps extends StackProps {
       encryptedStorage: boolean;
   }

   class MyStack extends Stack {
       constructor(parent: Construct, name: string, props?: MyStackProps) {
           super(parent, name, props);

           new MyStorageLayer(this, 'Storage', { encryptedStorage: props.encryptedStorage });
           new MyControlPlane(this, 'CPlane');
           new MyDataPlane(this, 'DPlane');
       }
   }

And then, add instances of this class to your app:

.. code-block:: js

    const app = new App(process.argv);

    new MyStack(app, 'NorthAmerica', { env: { region: 'us-east-1' } });
    new MyStack(app, 'Europe', { env: { region: 'us-west-2' } });

.. _logical_ids:

Logical IDs
===========

When you synthesize a stack into a |CFN| template,
the |cdk| assigns a
`logical ID <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html>`_,
which must be unique within the template,
to each resource in the stack.

.. important::

    When you update the template, |CFN| uses these logical IDs to plan the update
    and apply changes. Therefore, logical IDs must remain "stable" across updates.
    If you make a modification in your code that results in a change to a logical ID
    of a resource, |CFN| deletes the resource and recreates a new resource when it
    updates the stack.

Each resource in the construct tree has a unique path that represents its
location within the tree. The logical ID of a resource is formed by
concatenating the names of all of the constructs in the resource's path, and
appending an eight-character MD5 hash of the path. This final component is
necessary since CloudFormation logical IDs cannot include the delimiting slash
character (/), so simply concatenating the component values does not work. For
example, concatenating the components of the path */a/b/c* produces **abc**,
which is the same as concatenating the components of the path */ab/c*.

Since logical IDs may only use alphanumeric characters and also restricted in
length, we are unable to simply use a delimited path as the logical ID. Instead
IDs are allocated by concatenating a human-friendly rendition from the path
(concatenation, de-duplicate, trim) with a short MD5 hash of the delimited path:

.. code-block:: text

    VPCPrivateSubnet2RouteTable0A19E10E
    <-----------human---------><-hash->

Resources that are direct children of the |stack-class| class use
their name as their logical ID without modification. This makes it easier to
port existing templates into a CDK app.

This scheme ensures that:

Logical IDs have a human-friendly portion
   This is useful when interacting directly with the synthesized |CFN|
   template during development and deployment.

Logical IDs are unique within the stack
   This is ensured by the MD5 component,
   which is based on the absolute path to the resource,
   which is unique within a stack.

Logical IDs remain unchanged across updates
   This is true as long as their location within the construct tree doesn't change.
   See :ref:`creating_runtime_value`
   for information on how to retain
   logical IDs despite structural changes in your stack.

The |cdk| applies some heuristics to improve the human-friendliness of the prefix:

- If a path component is **Resource**, it is omitted.
  This postfix does not normally contribute any additional useful information to the ID.
- If two subsequent names in the path are the same, only one is retained.
- If the prefix exceeds 240 characters, it is trimmed to 240 characters.
  This ensures that the total length of the logical ID does not exceed the 255 character
  |CFN| limit for logical IDs.

.. _changing_logical_ids:

Changing Logical IDs
--------------------

In some cases changing a resource
results in a structural change,
which results in a different path,
thus changing the logical ID of the resource.

When a resource's logical ID changes,
|CFN| eventually deletes the old resource and create a new resource,
as it cannot determine that the two resources are the same.
Depending on the nature of the resource,
this can be disastrous in production, such as when deleting a |DDB| table.

You could use
`CloudFormation Stack Policies
<https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html>`_
to protect critical resources in your stack from accidental deletion.
Although this |CFN| feature is not supported in the |cdk| and |toolkit|,
the |cdk| does provide a few other mechanisms to help deal with logical ID changes.

If you have CDK stacks deployed with persistent resources such as S3 buckets or
DynamoDB tables, you may want to explicitly "rename" the new logical IDs to
match your existing resources.

First, make sure you compare the newly synthesized template with any deployed
stacks. `cdk diff` will tell you which resources are about to be destroyed:

.. code:: shell

    [-] ☢️ Destroying MyTable (type: AWS::DynamoDB::Table)
    [+] 🆕 Creating MyTableCD117FA1 (type: AWS::DynamoDB::Table)

# :py:meth:`aws-cdk.Stack.renameLogical` where :code:`from` is either an explicit logical ID or a path.
  Call this method after the resource has been added to the stack.
# :py:attr:`aws-cdk.Resource.logicalId` allows assigning a fixed logical ID to a resource,
  and opt-out from using the scheme described above.

.. _environments:

Environments and authentication
===============================

The |cdk| refers to the combination of an account ID and a Region as an *environment*.
The simplest environment is the one you get by default,
which is the one you get when you have set up your credentials and a default Region as described in
:ref:`credentials_and_region`.

When you create a |stack-class| instance, you can supply the target deployment environment
for the stack using the **env** property, as shown in the following example,
where REGION is the Region in which you want to create the stack and ACCOUNT is your account ID.

.. code:: js

   new MyStack(app, { env: { region: 'REGION', account: 'ACCOUNT' } });

For each of the two arguments **region** and **account**, the |cdk| uses the
following lookup procedure:

#. If **region** or **account** are provided directly as an property to the
   Stack, use that.
#. Otherwise, read **default-account** and **default-region** from the application's context.
   These can be set in the |toolkit| in either the local |cx-json| file or the global version in
   *$HOME/.cdk* on Linux or MacOS or *%USERPROFILE%\\.cdk* on Windows.
#. If these are not defined, it will determine them as follows:
    * **account**: use account from default SDK credentials. Environment
      variables are tried first (**AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**),
      followed by credentials in *$HOME/.aws/credentials* on Linux or MacOS
      or *%USERPROFILE%\\.aws\\credentials* on Windows.
    * **region**: use the default region configured in *$HOME/.aws/config* on
      Linux or MacOS or *%USERPROFILE%\\.aws\\config* on Windows.
    * You can set these defaults manually, but we recommend you use ``aws
      configure``, as described in the :doc:`getting-started` topic.

We recommend you use the default environment for development stacks,
and explicitly specify accounts and Regions for production stacks.

.. note::

   Note that even though the region and account might explicitly be set on your
   Stack, if you run ``cdk deploy`` the |cdk| will still use the
   currently-configured SDK credentials, as provided via the **AWS_**
   environment variables or ``aws configure``. This means that if you want to
   deploy stacks to multiple accounts, you will have to set the correct
   credentials for each invocation to ``cdk deploy STACK``.

   In the future, we will provide the ability to specify credential sources for
   individual accounts so that you can deploy to multiple accounts using one
   invocation of ``cdk deploy``, but this feature is not available yet.

.. _environment_context:

Environmental Context
---------------------

When you synthesize a stack to create a |CFN| template, the |cdk| may need information based on the
environment (account and Region), such as the availability zones or AMIs available in the Region.
To enable this feature, the |toolkit| uses *context providers*,
and saves the context information into |cx-json|
the first time you call |cx-synth-code|.

The |cdk| currently supports the following context providers.

:py:class:`_aws-cdk_core.AvailabilityZoneProvider`
   Use this provider to get the list of all supported availability zones in this environment.
   For example, the following code iterates over all of the AZs in the current environment.

.. code:: js

   const zones: string[] = new AvailabilityZoneProvider(this).availabilityZones;

   for (let zone of zones) {
      // do somethning for each zone!
   }

:py:class:`_aws-cdk_core.SSMParameterProvider`
   Use this provider to read values from the current Region's SSM parameter store.
   For example, the follow code returns the value of the 'my-awesome-value' key:

.. code:: js

   const ami: string = new SSMParameterProvider(this).getString('my-awesome-value');

.. _apps:

Apps
====

The main artifact of an |cdk| program is called a *CDK App*.
This is an executable program that can be used to synthesize deployment artifacts
that can be deployed by supporting tools like the |toolkit|,
which are described in :doc:`tools`.

Tools interact with apps through the program's **argv**/**stdout** interface,
which can be easily implemented using the **App** class,
as shown in the following example.

.. code-block:: js

   import { App } from '@aws-cdk/core'

   const app = new App(process.argv); // input: ARGV

   // <add stacks here>

   process.stdout.write(app.run());

An |app-construct| is a collection of |stack| objects, as shown in the following
example.

.. code-block:: js

   import { App } from '@aws-cdk/core'
   import { MyStack } from './my-stack'

   const app = new App(process.argv);

   const dev = new MyStack(app, { name: 'Dev', region: 'us-west-2', dev: true })
   const preProd = new MyStack(app, { name: 'PreProd', region: 'us-west-2', preProd: true })
   const prod = [
       new MyStack(app, { name: 'NAEast', region: 'us-east-1' }),
       new MyStack(app, { name: 'NAWest', region: 'us-west-2' }),
       new MyStack(app, { name: 'EU', region: 'eu-west-1', encryptedStorage: true })
   ]

   new DeploymentPipeline(app, {
       region: 'us-east-1',
       strategy: DeploymentStrategy.Waved,
       preProdStages: [ preProd ],
       prodStages: prod
   });

   process.stdout.write(app.run());

Use the |toolkit| to list the stacks in this executable,
as shown in the following example.

.. code-block:: sh

   cdk list
   [
      { name: "Dev", region: "us-west-2" }
      { name: "PreProd", region: "us-west-2" },
      { name: "NAEast", region: "us-east-1" },
      { name: "NAWest", region: "us-west-2" },
      { name: "EU", region: "eu-west-1" },
      { name: "DeploymentPipeline", region: 'us-east-1' }
   ]

Or deploy one of the stacks,
as shown in the following example.

.. code-block:: sh

   cdk deploy Dev
   ...

.. _applets:

Applets
=======

.. note:: Currently the |cdk| only supports applets published as JavaScript modules.

Applets are files in the YAML or JSON format that have the following root attribute,
where MODULE can represent
a local file, such as :code:`./my-module`,
a local dependency, such as :code:`my-dependency`,
or a global module, such as :code:`aws-cdk-codebuild`
and CLASS is the name of a class exported by the module.

.. code:: js

   applet: MODULE[:CLASS]

If CLASS is not specified, :code:`Applet` is used as the default class name.
Therefore, you need only refer to |cdk| construct libraries that export
an :code:`Applet` class by their library name.

The rest of the YAML file is applet-dependent.
The object is passed as :code:`props` when the applet object is instantiated
and added to an |cdk| app created by **cdk-applet-js**.

Use **cdk-applet-js** *applet* to run the applet, create an |cdk| app,
and use that with the |cdk| tools, as shown in the following example.

.. code-block:: sh

   cdk --app "cdk-applet-js ./my-applet.yaml" synth

To make the applet file executable and use the host as a shebang
on Unix-based systems, such as Linux, MacOS, or Windows Bash shell,
create a script similar to the following.

.. code-block:: sh

   #!/usr/bin/env cdk-applet-js

   applet: aws-cdk-codebuild
   source: arn:aws:codecommit:::my-repository
   image: node:8.9.4
   compute: large
   build:
      - npm install --unsafe-perm
      - npm test
      - npm pack --unsafe-perm

To execute the applet and synthesize a CloudFormation template,
use the following command.

.. code-block:: sh

   cdk synth --app "./build.yaml"

To avoid needing **--app** for every invocation,
add the following entry to *cdk.json*.

.. code-block:: json

   {
      "app": "./build.yaml"
   }
