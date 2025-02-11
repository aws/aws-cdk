# AWS CDK Roadmap

> Updated 2/12/2025

The roadmap priorities for the AWS CDK (Cloud Development Kit) are informed by what we hear from customers and interactions on Github, CDK.dev Slack, Stack Overflow, and Twitter. This document outlines the high level direction we are working towards, and for each project there is a tracking issue where you can leave feedback. We update this doc on a quarterly basis to reflect any changing priorities.

Follow [CDK Live!](https://www.youtube.com/@CDK-Live) and [cdk.dev](https://cdk.dev/) to learn what's new in AWS CDK.

Security and stability of the CDK is a top priority. If you think you’ve found a potential security issue, please do not post it as an issue or a discussion thread in this repository. Instead, please follow the instructions [here](https://aws.amazon.com/security/vulnerability-reporting/) or directly email [AWS security](mailto:aws-security@amazon.com).

[aws-cdk]: https://github.com/aws/aws-cdk
[aws-cdk-rfcs]: https://github.com/aws/aws-cdk-rfcs
[jsii]: https://github.com/aws/jsii

## Our Core Tenets (which guide prioritization decisions)

- **We empower CDK builders to innovate with confidence, without sacrificing security.** The CDK provides customers with conviction by providing a clear and streamlined direction to building secure, modernized, industry leading innovations with AWS.
- **Productivity through simplicity.** The CDK measurably improves developer productivity in building with AWS. We make Infrastructure as Code simple to define, understand, change, and troubleshoot.
- **Be transparent.** The AWS CDK team’s current work should be easily visible.
- **Listen to customers.** Allow them to participate in design decisions and to vote on and propose new AWS CDK features. We will periodically reprioritize the roadmap based on customer feedback.

## List of Annotations

| Symbol |     Description      |
| :----- | :------------------: |
| 🔍     |     Exploration      |
| 👂🏽     | Waiting for feedback |
| 🚦     | Work ready to begin  |
| 🛠️     |   Work in progress   |
| 🚀     |       Released       |
| 🚫     |    Not on roadmap    |

For reference, below are the stages of a construct module lifecycle.

1. **Stage 0 - CFN Resources:** All construct library modules start in stage 0 when they are auto-generated from the CloudFormation resource specification. These are also referred to as CDK L1 constructs. 
2. **Stage 1 - Experimental:** The goal of the experimental stage is to iterate on the design and functionality of a construct library module with the freedom, and understanding of customers, to make breaking changes when desirable or necessary
3. **Stage 2 - Developer Preview:** The goal of developer preview is to deliver a release candidate with a stable API to conduct user acceptance testing and accumulate sufficient usage to declare a module is ready for general availability. We will only make breaking changes to developer preview modules when required to address unforeseen customer use cases or issues.
4. **Stage 3 - General Availability(GA):** The module is generally available with a backwards compatible guarantee across minor versions.

Kindly refer to the [construct module lifecyle](https://github.com/aws/aws-cdk-rfcs/blob/main/text/0107-construct-library-module-lifecycle.md) for details on the different stages of a construct. 

## Themes

Over the course of the last few years, the CDK team has spent time speaking with and learning from its community. We've gathered that there were certain features that were greatly valued from the CDK and other features which would be beneficial to be added to its experience. We appreciate everyone sharing this feedback and we plan on addressing it through the targeted themes and RFCs listed below. Please be aware that the team will periodically work to add RFCs as we look to prioritize more work.

### Enhance and expand the L2 construct library

The CDK team is committed to supporting and enhancing our existing library of AWS CDK L2 abstractions. We continue to solicit community feedback on where additional L2 coverage makes it simpler and more efficient to build with AWS. Current L2s that the team’s working on are listed below. Please be aware that this list will update throughout the year. If you have feedback on other L2s that should be prioritized by our team, feel free to submit a separate issue on GitHub.
 
* 🚀 **General Availability of AWS Kinesis_firehose L2 construct:** AWS CDK now includes [L2 construct support for Amazon Data Firehose delivery streams](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_kinesisfirehose-readme.html), enabling developers to define and deploy streaming data infrastructure as code.
* 🚀 **General Availability of App Sync events L2 construct:** The new [AWS AppSync Events construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_appsync-readme.html#events:~:text=in%20your%20language%3F-,Events,-Example) allows developers to create serverless WebSocket APIs that can broadcast real-time data to millions of subscribers without managing infrastructure or connection state.
* 🚀 **Experimental release of EKS v2 L2 construct:** The [eks-v2-alpha module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-eks-v2-alpha-readme.html) is a rewrite of the existing [aws-eks module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_eks-readme.html). This new iteration leverages native L1 CFN resources, replacing the previous custom resource approach for creating EKS clusters and Fargate Profiles. 
* 🚀 **Experimental release of the Glue L2 construct:** The [new L2 construct for Glue](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-glue-alpha-readme.html) simplifies the correct configuration of Glue jobs, workflows, and triggers. Learn more in this [release blog post](https://aws.amazon.com/blogs/devops/announcing-the-aws-cdk-glue-l2-construct/)
* 🚀 **Developer Preview release of the VPC v2 L2 construct:** This new [VPC v2 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-ec2-alpha-readme.html) addresses many of the gaps with the stable VPC construct, and provides higher-level abstractions for Amazon EC2 resources, offering more intuitive APIs.
* 🛠️ **General Availability release of AWS Cognito_Identity_pool L2 construct** [Amazon Cognito Identity Pools L2 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cognito-identitypool-alpha-readme.html) enables you to grant your users access to other AWS services. We plan to graduate this experimental construct to GA.
* **General Availability release of Amazon EventBridge Scheduler L2 construct:** The [Amazon EventBridge Scheduler L2 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-scheduler-alpha-readme.html) allows you to create, run, and manage scheduled tasks at scale with Amazon EventBridge.
* 🛠️ **Experimental release of Amazon Bedrock L2 construct:** This new [L2 construct for Amazon Bedrock](https://github.com/aws/aws-cdk-rfcs/pull/688) provides an easy way to build and scale generative AI applications with foundation models. There is an [rfc](https://github.com/aws/aws-cdk-rfcs/issues/686) in progress to add support for this L2 construct.
* 🛠️ **Experimental release of VPC Lattice L2 construct:** This new [L2 construct for VPC Lattice](https://github.com/aws/aws-cdk/issues/25452) simplifies service-to-service connectivity, security, and monitoring. There is an [rfc](https://github.com/aws/aws-cdk-rfcs/issues/631) in progress to add support for this L2 construct. 
* 🛠️ **Experimental release of AWS CloudWatch Application Signals L2 construct:** This new [L2 construct for AWS CloudWatch Applications signals](https://github.com/aws/aws-cdk-rfcs/issues/686) provides the ability to automatically instrument your applications on AWS so that you can monitor current application health and track long-term application performance against your business objectives.
* 🛠️ **Developer Preview release of aws-lambda-python construct:** This [module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html) provides constructs for Python Lambda functions.
* 🛠️ **Improve generation of L2 constructs:** This [proposal](https://github.com/aws/aws-cdk-rfcs/issues/611) is to automate parts of the L2 generation process to reduce the engineering effort required to create new L2 constructs.
* 🚦 **L2 construct support for the following:**
  - [Stacksets](https://github.com/aws/aws-cdk-rfcs/issues/66)
  - [WAF v2](https://github.com/aws/aws-cdk/issues/6878)
  - [Certificate Manager](https://github.com/aws/aws-cdk/issues/25343)
* 🚦 **Graduate experimental constructs to General Availability**
  - [Lambda-Go-alpha](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-go-alpha-readme.html)
  - [Amplify](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-amplify-alpha-readme.html)
  - [Sagemaker](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-sagemaker-alpha-readme.html)

### Continue to improve the CDK Developer Experience

* 🚀 **Upgrade from the AWS SDK v2 to v3:** The AWS SDK for JavaScript v2 is being deprecated. The CDK CLI has been migrated to [use AWS SDK for JS v3](https://github.com/aws/aws-cdk/issues/29694)
* 🚀 **Garbage Collection for Assets:** Assets which are uploaded to the CDK’s S3 bucket and ECR repository are never deleted, incurring costs. This [feature](https://github.com/aws/aws-cdk-rfcs/issues/64) provides the functionality to delete unused assets, saving costs for customers.
* 🚀 **Continued support for CDK8s library:** This roadmap item is to provide continued support to the CDK8s library, including resolving GitHub issues and reviewing Pull Requests (PRs). This addresses the open [GitHub discussion](https://github.com/cdk8s-team/cdk8s/discussions/2052) on CDK8s maintenance state.
* 🛠️ **CDK CLI split:** - This [feature](https://github.com/aws/aws-cdk/issues/32775) supports decoupling the release cycles of the CDK CLI and the CDK Construct Library, allowing each to have its own cadence and versioning.
* 🛠️ **Programmatic Toolkit:** This [feature](https://github.com/aws/aws-cdk-rfcs/issues/300) enable CDK users to programmatically trigger AWS CDK CLI commands, facilitating integration with existing tools and workflows. 
* 🛠️ **CDK Stack Refactoring:** This [feature](https://github.com/aws/aws-cdk-rfcs/issues/162) release will enable users to easily reorganize their constructs within the same or across different stacks.
* 🚦 **cli: Enable client-side telemetry and analytics:** This [feature]((https://github.com/aws/aws-cdk/issues/32010)) is to enable client-side telemetry and analytics collection in the CDK CLI.
* 🚦 **Give assets a display name:** This [feature](https://github.com/aws/aws-cdk/issues/9628) allows specifying a display name for AWS CDK assets to improve clarity in asset publishing and deployment.
* 👂🏽 **Enhanced L1 constructs:** This [rfc](https://github.com/aws/aws-cdk-rfcs/pull/657) is a proposal to enhance the L1 constructs by adding support for enums, resource interfaces, and CFN contraints to generated L1s.
  

### Community contribution call-outs

Thank you to our community members that have contributed to the project. Below are some of the great contributions from the community! We'll continue to update this list as contributions come in, and please feel free to reach out on the cdk.dev slack workspace if you have any questions or feedback.

* 🚀 [fix(autoscaling): AutoScalingGroup requireImdsv2 with launchTemplate or mixedInstancesPolicy throws unclear error](https://github.com/aws/aws-cdk/issues/32775) - by shinebleu
* 🚀 [key rotation is not enabled while creating KMS encrypted S3 buckets](https://github.com/aws/aws-cdk/pull/32064) - by mellevanderlinde
* 🚀 [fix(apigateway): move url property to RestApiBase](https://github.com/aws/aws-cdk/pull/27742) - by hariprakash-j
* 🚀 [fix(stepfunctions-task): elasticloadbalancingv2 service policy](https://github.com/aws/aws-cdk/pull/32419) - by nmussy
* 🚀 [feat(ec2): instance support passing IAM instance profile ](https://github.com/aws/aws-cdk/pull/32073) - by phuhung273
* 🚀 [feat(custom-resource): add serviceTimeout property for custom resources](https://github.com/aws/aws-cdk/pull/30911) - by mazyu36
* 🚀 [feat(s3): replicating objects](https://github.com/aws/aws-cdk/pull/30966) - by badmintoncryer
* 🚀 [fix(batch): support cfn parameters for managed compute environment properties minvcpus, maxvcpus, and spotbidpercentage](https://github.com/aws/aws-cdk/pull/32954) - by bdoyle0182
* 🚀 [fix(apigatewayv2): incorrect arn function causing unwanted behavior](https://github.com/aws/aws-cdk/pull/33100) - by IkeNefcy
* 🚀 [feat(stepfunctions): add support JSONata and variables](https://github.com/aws/aws-cdk/pull/32343) - by WinterYukky
* 🚀 [feat(appsync): add L2 constructs for AWS AppSync Events](https://github.com/aws/aws-cdk/pull/32505) - by kwwendt

## Community Engagement

We would love to hear from you on how the CDK operates today and how it should grow in the future. To report a bug or create a small feature request, please [create an issue here](https://github.com/aws/aws-cdk/issues/new/choose). If you are seeking to request a change in strategic direction or make a CDK core framework change, please [create a Request for Comments (RFC) ticket here](https://github.com/aws/aws-cdk-rfcs/issues/new/choose). If you are ever unsure about where your feature request should live, it is best to follow the first link within the aws-cdk repo.

![image](https://github.com/aws/aws-cdk/assets/142322013/ea006330-caa7-4c00-8eba-8e8fe379ef6b)

Listening and working with the open source community is really important to us. If you would like to give us your feedback on how we are doing, feel free to reach out to our team via cdk.dev slack.

## Educational Content

To make the CDK more accessible and easier to understand, we publish educational content like blog posts, videos and workshops. Here are some from AWS.

- [Blog] [How the PGA Tour speeds up development with the AWS CDK](https://aws.amazon.com/blogs/devops/driving-development-forward-how-the-pga-tour-speeds-up-development-with-the-aws-cdk/)
- [Workshop/Livestream] [CDK Workshop Series on CDK Live!](https://youtube.com/playlist?list=PLp1wJE9SAACOLvdtKL2P2Kq_N_AiYIj8N&si=hH14gEVmM_35xivq)
- [Livestream] [Learn how to build and publish AWS CDK Constructs](https://www.youtube.com/live/kUfSoFy4Mgg?si=aDMMacUT3lq6ZeKw)
- [Workshop] [The AWS CDK Workshop](https://cdkworkshop.com/)
- [Workshop] [Extended CDK Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/071bbc60-6c1f-47b6-8c66-e84f5dc96b3f/en-US)
- [Workshop] [Automating your workload deployments in AWS Local Zones](https://catalog.workshops.aws/localzone-cdk/en-US)
- [Blogpost] [Using AWS CloudFormation and AWS Cloud Development Kit to provision multicloud resources](https://aws.amazon.com/blogs/devops/using-aws-cloudformation-and-aws-cloud-development-kit-to-provision-multicloud-resources/)
- [Blogpost] [CDK Pipelines: Continuous delivery for AWS CDK applications](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/)
- [Blogpost] [Better together: AWS SAM and AWS CDK](https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/)
- [Videos] [CDK Live!](https://www.youtube.com/@CDK-Live)
- [CDK Day] [Track 1 (English) for CDK Day 2023](https://www.youtube.com/watch?v=qlUR5jVBC6c)
- [CDK Day] [Track 2 (English) for CDK Day 2023](https://www.youtube.com/watch?v=b-nSH18gFQk)
- [CDK Day] [Track 3 (Spanish) for CDK Day 2023](https://www.youtube.com/watch?v=ZAQC-cOXL4M)
- [re:Invent Content] Search through [all content here](https://www.youtube.com/@amazonwebservices)

## Disclaimer

The AWS CDK team values feedback and guidance from its community of users, although final decisions on inclusion into the project will be made by AWS. We determine the high-level direction for our open roadmap based on customer feedback and popularity (👍🏽 and comments), security and operational impacts, and business value. Where features don’t meet our goals and longer-term strategy, we will communicate that clearly and openly as quickly as possible with an explanation of why the decision was made.

## FAQs

**Q: Why did you build an open roadmap?**
A: Your feedback and suggestions would help in ensuring that we are working on the most important and impactful issues. And if you are making decisions and plans based on what we are developing, this will provide insights on what is coming down the road for the CDK.

**Q: Why are there no dates on your roadmap?**
A: Because security and operational stability are our highest priorities, the above new features cannot be provided specific target dates. The roadmap is subject to change at any time, and roadmap issues in this repository do not guarantee a feature will be launched as proposed.

**Q: Is everything on the roadmap?**
A: We will publish high-level direction that is within the scope of the CDK. Minor features and performance improvement tasks are not on the roadmap currently, but we are constantly trying to improve the roadmap so please leave your suggestions [here](https://github.com/aws/aws-sam-cli/issues/3267).

**Q: How can I provide feedback or ask for more information?**
A: When in doubt, please create an issue! Issues will be reviewed and/or forwarded appropriately. A great time to provide feedback is when the project is in Exploration, RFC stage, or when the feature is in beta release. As always, we listen to your feedback and adapt our plans if needed.

**Q: Can I 👍🏽 existing issues?**
A: We strongly encourage you to do so, as it helps us understand which issues will have the widest impact. You can navigate to the issue details page and add a reaction (👍🏽).

**Q: How can I request a feature be added to the roadmap?**
A: We encourage you to open an issue, even if you’ve requested it before via other channels. Issues submitted will be reviewed by the roadmap maintainers. If you find an issue already created for the feature, please upvote it (👍🏽) and leave comments specific to your use case. To report a bug or create a small feature request, please [create an issue here](https://github.com/aws/aws-cdk/issues/new/choose). If you are seeking to request a change in the CDK’s strategic direction or make a CDK core framework change, please [create a Request for Comments (RFC) ticket here](https://github.com/aws/aws-cdk-rfcs/issues/new/choose).

Please do not be discouraged if your ticket is closed—that may happen if it is not a priority during the quarter it was submitted. The CDK team closes tickets in an effort to display what is prioritized at a given moment. If this happens, we invite you to try submitting it again later in the year.
