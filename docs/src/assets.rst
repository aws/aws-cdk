.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

######
Assets
######

Assets are local files or directories which can be bundled into CDK constructs
and apps. A common example is a directory which contains the handler code for an
AWS Lambda function, but assets can represent any artifact that is needed for
the app’s operation.

When deploying an AWS CDK app that includes constructs with assets, the toolkit
will first upload all the assets to S3, and only then deploy the stacks. The S3
locations of the uploaded assets will be passed in as CloudFormation Parameters
to the relevant stacks.

For more details, see the :py:doc:`Assets <refs/_aws-cdk_assets>` library documentation.

