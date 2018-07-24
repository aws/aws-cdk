.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _applets:

#######
Applets
#######

.. note:: Currently the |cdk| only supports applets published as JavaScript modules.

Applets are files in the YAML or JSON format that have the following root attribute,
where MODULE can represent
a local file, such as :code:`./my-module`,
a local dependency, such as :code:`my-dependency`,
or a global module, such as :code:`@aws-cdk/aws-s3`
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

To execute the applet and synthesize an |CFN| template,
use the following command.

.. code-block:: sh

   cdk synth --app "./build.yaml"

To avoid needing **--app** for every invocation,
add the following entry to *cdk.json*.

.. code-block:: json

   {
      "app": "./build.yaml"
   }
