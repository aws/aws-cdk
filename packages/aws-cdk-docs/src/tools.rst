.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _tools:

#####
Tools
#####

cdk
====

Here is the output from **cdk --help**:

.. code-block:: sh

   Usage: cdk -a <cloud-executable> COMMAND

   Commands:
     list                        Lists all stacks in the cloud executable (alias:
                                 ls)
     synth [STACKS..]            Synthesizes and prints the cloud formation
                                 template for this stack (alias: synthesize,
                                 construct, cons)
     bootstrap [ENVIRONMENTS..]  Deploys the CDK toolkit stack into an AWS
                                 environment
     deploy [STACKS...]          Deploys the stack(s) named STACKS into your AWS
                                 account
     destroy [STACKS...]         Destroy the stack(s) named STACKS
     diff [STACK]                Compares the specified stack with the deployed
                                 stack or a local template file
     metadata [STACK]            Returns all metadata associated with this stack
     init [TEMPLATE]             Create a new, empty CDK project from a template
   
   Options:
     --help         Show help                                             [boolean]
     --version      Show version number                                   [boolean]
     --app, -a      REQUIRED: Command-line of cloud executable (e.g. "node
                    bin/my-app.js")                                        [string]
     --context, -c  Add contextual string parameter.                        [array]
     --rename       Rename stack name if different then the one defined in the
                    cloud executable                                       [string]
     --trace        Print trace for stack warnings                        [boolean]
     --strict       Do not construct stacks with warnings                 [boolean]
     --json, -j     Use JSON output instead of YAML                       [boolean]
     --verbose, -v  Show debug logs                                       [boolean]
   
   If your app has a single stack, there is no need to specify the stack name
   
   If one of cdk.json or ~/.cdk.json exists, options specified there will be used
   as defaults. Settings in cdk.json take precedence.

.. _jsii:

jsii
====

.. Hang on, we tell them to use
   npm run prepare
   to compile and
   npm run watch
   in the getting started topic. Which is it???

Use this tool to compile your |cdk| TypeScript code into JavaScript.
You can add the **-w** option to have the tool watch for changes in your code,
and automatically compile the changes, using **jsii**, as you save the file.
