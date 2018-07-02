.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _versionReporting:

#######################
|cdk| Version Reporting
#######################

In order to gain insights in how the |cdk| is used, the versions of libraries used by |cdk| applications are collected
and reported using a resource identified as ``CDKMetadata`` that is added to CloudFormation templates, and can easily
be reviewed. This information may also be used to identify stacks using a package with known serious security or
reliability issues and contact their users with important information.

The |cdk| reports the name and version of npm modules that are loaded into the application at synthesis time, unless
their ``package.json`` file contains the ``"private": true`` attribute.

The ``CDKMetadata`` resource looks like the following:

.. code-block:: yaml

   CDKMetadata:
     Type: "AWS::CDK::Metadata"
     Properties:
       Modules: "@aws-cdk/core=0.7.2-beta,@aws-cdk/s3=0.7.2-beta,lodash=4.17.10"

Opting Out
==========

Opting out of version reporting can be done in one of the following ways:

- Add the ``--no-version-reporting`` argument to ``cdk`` command invokations
- Add ``"versionReporting": false`` to the project's ``cdk.json`` file or your ``~/.cdk.json`` file
