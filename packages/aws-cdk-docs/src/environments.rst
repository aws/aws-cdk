.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _environments:

###############################
Environments and Authentication
###############################

The |cdk| refers to the combination of an account ID and a Region as an *environment*.
The simplest environment is the one you get by default,
which is the one you get when you have set up your credentials and a default Region as described in
:ref:`credentials`.

When you create a |stack-class| instance, you can supply the target deployment environment
for the stack using the **env** property, as shown in the following example,
where REGION is the Region in which you want to create the stack and ACCOUNT is your account ID.

.. code:: js

   new MyStack(app, { env: { region: 'REGION', account: 'ACCOUNT' } });

For each of the two arguments **region** and **account**, the |cdk| uses the
following lookup procedure:

- If **region** or **account** are provided directly as an property to the
  Stack, use that.
- Otherwise, read **default-account** and **default-region** from the application's context.
  These can be set in the |toolkit| in either the local |cx-json| file or the global version in
  *$HOME/.cdk* on Linux or MacOS or *%USERPROFILE%\\.cdk* on Windows.
- If these are not defined, it will determine them as follows:
  
  - **account**: use account from default SDK credentials. Environment
    variables are tried first (**AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**),
    followed by credentials in *$HOME/.aws/credentials* on Linux or MacOS
    or *%USERPROFILE%\\.aws\\credentials* on Windows.
  - **region**: use the default region configured in *$HOME/.aws/config* on
    Linux or MacOS or *%USERPROFILE%\\.aws\\config* on Windows.
  - You can set these defaults manually, but we recommend you use ``aws
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

