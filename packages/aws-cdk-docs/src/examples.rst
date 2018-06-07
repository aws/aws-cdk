.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _cdk_examples:

########
Examples
########

This topic contains some usage examples to help you get started understanding
the |cdk|.

.. We'll include this if we ever implement DeploymentPipeline
   _multiple_stacks_example:

   Creating an App with Multiple Stacks
   ====================================

   The following example creates the following stacks and one deployment pipeline:

   - **Dev** uses the default environment
   - **PreProd** in the **us-west-2** Region
   - **NAEast** in the **us-east-1** Region
   - **NAWest** in the **us-west-2** Region
   - **EU** in the **eu-west-1** Region
   - **DeploymentPipeline** in the **us-east-1** Region

   Implement the class **MyStack** in the *my-stack* sub-folder,
   that extends the |stack-class| class
   (this is the same code as shown in the :doc:`concepts` topic).

   code-block:: js

   import { Stack, StackProps } from '@aws-cdk/core'

   interface MyStackProps extends StackProps {
     encryptedStorage: boolean;
   }

   export class MyStack extends Stack {
     constructor(parent: Construct, name: string, props?: MyStackProps) {
       super(parent, name, props);

       new MyStorageLayer(this, 'Storage', { encryptedStorage: props.encryptedStorage });
       new MyControlPlane(this, 'CPlane');
       new MyDataPlane(this, 'DPlane');
     }
   }

   Implement the class **DeploymentPipeline** in the *my-deployment* sub-folder,
   that extends the |stack-class| class
   (this is the same code as shown in the :doc:`concepts` topic).

   code-block:: js

   Use **MyStack** and **DeploymentPipeline** to create the stacks and deployment pipeline.

   code-block:: js

   import { App } from '@aws-cdk/core'
   import { MyStack } from './my-stack'
   import { DeploymentPipeline } from './my-deployment'

   const app = new App(process.argv);

   // Use the default environment
   new MyStack(app, { name: 'Dev' });

   // Pre-production stack
   const preProd = new MyStack(app, {
     name: 'PreProd',
     env: { region: 'us-west-2' },
     preProd: true
   });

   // Production stacks
   const prod = [
     new MyStack(app, {
       name: 'NAEast',
	     env: { region: 'us-east-1' }
   }),

   new MyStack(app, {
     name: 'NAWest',
     env: { region: 'us-west-2' }
   }),

   new MyStack(app, {
     name: 'EU',
     env: { region: 'eu-west-1' },
       encryptedStorage: true
     })
   ]

   // CI/CD pipeline stack
   new DeploymentPipeline(app, {
     env: { region: 'us-east-1' },
      strategy: DeploymentStrategy.Waved,
      preProdStages: [ preProd ],
      prodStages: prod
   });

   app.exec()
      .then(stdout => process.stdout.write(stdout))
      .catch(e => { throw e });

.. _dynamodb_example:

Creating a |ddb| Table
===========================

The following example creates a
|dynamodb| table with the partition key **Alias**
and sort key **Timestamp**.

.. code-block:: js

   import { App, Stack, StackProps } from '@aws-cdk/core';
   import { KeyAttributeType, Table } from '@aws-cdk/dynamodb'

   class MyStack extends Stack {
     constructor(parent: App, name: string, props?: StackProps) {
       super(parent, name, props);

       const table = new Table(this, 'Table', {
         tableName: 'MyAppTable',
         readCapacity: 5,
         writeCapacity: 5
       });

       table.addPartitionKey('Alias', KeyAttributeType.String);
       table.addSortKey('Timestamp', KeyAttributeType.String);
     }
   }

   const app = new App(process.argv);

   new MyStack(app, 'MyStack');

   process.stdout.write(app.run());

.. _creating_rds_example:

Creating an |rds| Database
==========================

The following example creates the Aurora database **MyAuroraDatabase**.

.. code-block:: js

   import { App, Stack, StackProps, Token } from '@aws-cdk/core';
   import { InstanceClass, InstanceSize, InstanceTypePair, VpcNetwork } from '@aws-cdk/ec2';
   import { DatabaseCluster, DatabaseClusterEngine } from '@aws-cdk/rds';

   class MyStack extends Stack {
     constructor(parent: App, name: string, props?: StackProps) {
       super(parent, name, props);

       const vpc = new VpcNetwork(this, 'VPC');

       new DatabaseCluster(this, 'MyRdsDb', {
         defaultDatabaseName: 'MyAuroraDatabase',
         masterUser: {
           username: new Token('admin'),
           password: new Token('123456')
         },
         engine: DatabaseClusterEngine.Aurora,
         instanceProps: {
           instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
           vpc: vpc,
           vpcPlacement: {
             usePublicSubnets: true
           }
         }
       });
     }
   }

   const app = new App(process.argv);

   new MyStack(app, 'MyStack');

   process.stdout.write(app.run());

.. _creating_s3_example:

Creating an |s3| Bucket
=======================

The following example creates the |s3| bucket **MyS3Bucket** with server-side KMS
encryption provided by |s3|.

.. code-block:: js

   import { App, Stack, StackProps } from '@aws-cdk/core';
   import { Bucket, BucketEncryption } from '@aws-cdk/s3';

   class MyStack extends Stack {
     constructor(parent: App, name: string, props?: StackProps) {
       super(parent, name, props);

       new Bucket(this, 'MyBucket', {
         bucketName: 'MyS3Bucket',
         encryption: BucketEncryption.KmsManaged
       });
     }
   }

   const app = new App(process.argv);

   new MyStack(app, 'MyStack');

   process.stdout.write(app.run());

.. _compiling_the_examples:

Compiling the Examples
======================

Compile the TypeScript app *index.ts* into the JavaScript code *index.js* using **jsii**.

:code:`jsii`

**jsii** creates the file *tsconfig.json* to get code completion in a TypeScript IDE, such as
`Microsoft Visual Code <https://code.visualstudio.com/>`_,
`Sublime Text <https://www.sublimetext.com/>`_ with the
`TypeScript <https://github.com/Microsoft/TypeScript-Sublime-Plugin>`_ plugin,
or
`Atom <https://atom.io/>`_ with the
`TypeScript <https://atom.io/packages/atom-typescript>`_ plugin.

You can have **jsii** watch for source changes and automatically re-compile those changes using the **watch** option.

:code:`jsii -w`

.. _create_cloud_formation:

Creating a CloudFormation Template
==================================

Use the |cx-synth-bold| command to create an |CFN| template from the stack in your app.
You should see output similar to the following for your |dynamodb| table.

.. code-block:: yaml

   Resources:
       TableCD117FA1:
           Type: 'AWS::DynamoDB::Table'
           Properties:
               AttributeDefinitions:
                   -
                       AttributeName: Alias
                       AttributeType: S
                   -
                       AttributeName: Timestamp
                       AttributeType: S
               KeySchema:
                   -
                       AttributeName: Alias
                       KeyType: HASH
                   -
                       AttributeName: Timestamp
                       KeyType: RANGE
               ProvisionedThroughput:
                   ReadCapacityUnits: 5
                   WriteCapacityUnits: 5
               TableName: MyAppTable

.. _deploy_your_stack:

Deploying your Stack
====================

Use |cx-deploy-bold| to deploy the stack. As |cx-deploy-bold| executes you should see information messages, such as feedback from CloudFormation logs.

.. _making_changes:
