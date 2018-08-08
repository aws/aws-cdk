.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _cdk_examples:

##############
|cdk| Examples
##############

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

   import { Stack, StackProps } from '@aws-cdk/cdk'

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

   import { App } from '@aws-cdk/cdk'
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

Creating a |DDB| Table
======================

The following example creates a
|DDB| table with the partition key **Alias**
and sort key **Timestamp**.

.. code-block:: js

   import dynamodb = require('@aws-cdk/aws-dynamodb');
   import cdk = require('@aws-cdk/cdk');

   class MyStack extends cdk.Stack {
     constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
       super(parent, name, props);

       const table = new dynamodb.Table(this, 'Table', {
         tableName: 'MyAppTable',
         readCapacity: 5,
         writeCapacity: 5
       });

       table.addPartitionKey('Alias', dynamodb.KeyAttributeType.String);
       table.addSortKey('Timestamp', dynamodb.KeyAttributeType.String);
     }
   }

   const app = new cdk.App(process.argv);

   new MyStack(app, 'MyStack');

   process.stdout.write(app.run());

.. _creating_rds_example:

Creating an |RDS| Database
==========================

The following example creates the Aurora database **MyAuroraDatabase**.

.. code-block:: js

   import ec2 = require('@aws-cdk/aws-ec2');
   import rds = require('@aws-cdk/aws-rds');
   import cdk = require('@aws-cdk/cdk');

   class MyStack extends cdk.Stack {
     constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
       super(parent, name, props);

       const vpc = new ec2.VpcNetwork(this, 'VPC');

       new rds.DatabaseCluster(this, 'MyRdsDb', {
         defaultDatabaseName: 'MyAuroraDatabase',
         masterUser: {
           username: new cdk.Token('admin'),
           password: new cdk.Token('123456')
         },
         engine: rds.DatabaseClusterEngine.Aurora,
         instanceProps: {
           instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
           vpc: vpc,
           vpcPlacement: {
             usePublicSubnets: true
           }
         }
       });
     }
   }

   const app = new cdk.App(process.argv);

   new MyStack(app, 'MyStack');

   process.stdout.write(app.run());

.. _creating_s3_example:

Creating an |S3| Bucket
=======================

The following example creates the |S3| bucket **MyS3Bucket** with server-side KMS
encryption provided by |S3|.

.. code-block:: js

   import s3 = require('@aws-cdk/aws-s3');
   import cdk = require('@aws-cdk/cdk');

   class MyStack extends cdk.Stack {
     constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
       super(parent, name, props);

       new s3.Bucket(this, 'MyBucket', {
         bucketName: 'MyS3Bucket',
         encryption: s3.BucketEncryption.KmsManaged
       });
     }
   }

   const app = new cdk.App(process.argv);

   new MyStack(app, 'MyStack');

   process.stdout.write(app.run());
