.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _stacks:

######
Stacks
######

A |stack| is an |cdk| construct that can be deployed into an AWS environment.
The combination of region and account becomes the stack's *environment*, as
described in :ref:`environments`. Most production apps consist of multiple stacks of
resources that are deployed as a single transaction using a resource
provisioning service like |CFN|. Any resources added directly or indirectly as
children of a stack are included in the stack's template as it is synthesized by
your |cdk| program.

Define an application stack by extending the |stack-class| class, as
shown in the following example.

.. code-block:: js

   import { Stack, StackProps } from '@aws-cdk/cdk'

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
