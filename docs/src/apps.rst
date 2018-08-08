.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _apps:

####
Apps
####

The main artifact of an |cdk| program is called a *CDK App*.
This is an executable program that can be used to synthesize deployment artifacts
that can be deployed by supporting tools like the |toolkit|,
which are described in :doc:`tools`.

Tools interact with apps through the program's **argv**/**stdout** interface,
which can be easily implemented using the **App** class,
as shown in the following example.

.. code-block:: js

   import { App } from '@aws-cdk/cdk'

   const app = new App(process.argv); // input: ARGV

   // <add stacks here>

   process.stdout.write(app.run());

An |app-construct| is a collection of |stack| objects, as shown in the following
example.

.. code-block:: js

   import { App } from '@aws-cdk/cdk'
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
