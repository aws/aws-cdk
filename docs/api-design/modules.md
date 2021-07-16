## Modules

AWS resources are organized into modules based on their AWS service. For
example, the "Bucket" resource, which is offered by the Amazon S3 service will
be available under the **@aws-cdk/aws-s3** module. We will use the “aws-” prefix
for all AWS services, regardless of whether their marketing name uses an
“Amazon” prefix (e.g. “Amazon S3”). Non-AWS services supported by AWS
CloudFormation (like the Alexa::ASK namespace) will be **@aws-cdk/alexa-ask**.

The name of the module is based on the AWS namespace of this service, which is
consistent with the AWS SDKs and AWS CloudFormation _[awslint:module-name]_.

All major versions of an AWS namespace will be mastered in the AWS Construct
Library under the root namespace. For example resources of the **ApiGatewayV2**
namespace will be available under the **@aws-cdk/aws-apigateway** module (and
not under “v2) _[awslint:module-v2]_.

In some cases, it makes sense to introduce secondary modules for a certain
service (e.g. aws-s3-notifications, aws-lambda-event-sources, etc). The name of
the secondary module will be
**@aws-cdk/aws-xxx-\<secondary-module\>**_[awslint:module-secondary]_.

Documentation for how to use secondary modules should be in the main module. The
README file should refer users to the central module
_[awslint:module-secondary-readme-redirect]_.