# AWS CDK Roadmap

> Updated 2/17/2025

The roadmap priorities for the AWS CDK (Cloud Development Kit) are informed by what we hear from customers and interactions on Github, CDK.dev Slack, Stack Overflow, X, Bluesky, and any other place the community gathers and engages. This document outlines the high level direction we are working towards, and for each project there is a tracking issue where you can leave feedback. We update this doc on a quarterly basis to reflect any changing priorities. Please be aware that this list will update throughout the year and is subject to change. If you have feedback on items that should be prioritized by our team, feel free to submit a separate issue on GitHub.

Follow [cdk.dev](https://cdk.dev/) and [CDK Live!](https://www.youtube.com/@CDK-Live) to learn what's new in AWS CDK.

Security and stability of the CDK is a top priority. If you think you’ve found a potential security issue, please do not post it as an issue or a discussion thread in this repository. Instead, please follow the instructions [here](https://aws.amazon.com/security/vulnerability-reporting/) or directly email [AWS security](mailto:aws-security@amazon.com).

[aws-cdk]: https://github.com/aws/aws-cdk
[aws-cdk-rfcs]: https://github.com/aws/aws-cdk-rfcs
[jsii]: https://github.com/aws/jsii

### Community contribution call-outs

Thank you to our community members that have contributed to the project. Below are some of the great contributions from the community! We'll continue to update this list as contributions come in, and please feel free to reach out on the cdk.dev slack workspace if you have any questions or feedback.

* [fix(autoscaling): AutoScalingGroup requireImdsv2 with launchTemplate or mixedInstancesPolicy throws unclear error](https://github.com/aws/aws-cdk/issues/32775) - by shinebleu
* [key rotation is not enabled while creating KMS encrypted S3 buckets](https://github.com/aws/aws-cdk/pull/32064) - by mellevanderlinde
* [fix(apigateway): move url property to RestApiBase](https://github.com/aws/aws-cdk/pull/27742) - by hariprakash-j
* [fix(stepfunctions-task): elasticloadbalancingv2 service policy](https://github.com/aws/aws-cdk/pull/32419) - by nmussy
* [feat(ec2): instance support passing IAM instance profile ](https://github.com/aws/aws-cdk/pull/32073) - by phuhung273
* [feat(custom-resource): add serviceTimeout property for custom resources](https://github.com/aws/aws-cdk/pull/30911) - by mazyu36
* [feat(s3): replicating objects](https://github.com/aws/aws-cdk/pull/30966) - by badmintoncryer
* [fix(batch): support cfn parameters for managed compute environment properties minvcpus, maxvcpus, and spotbidpercentage](https://github.com/aws/aws-cdk/pull/32954) - by bdoyle0182
* [fix(apigatewayv2): incorrect arn function causing unwanted behavior](https://github.com/aws/aws-cdk/pull/33100) - by IkeNefcy
* [feat(stepfunctions): add support JSONata and variables](https://github.com/aws/aws-cdk/pull/32343) - by WinterYukky
* [feat(appsync): add L2 constructs for AWS AppSync Events](https://github.com/aws/aws-cdk/pull/32505) - by kwwendt

## Themes

In 2025, we will focus our efforts on: 1/ enhancing and expanding the CDK L2 construct library 2/ improving the CDK developer experience and 3/ supporting extensible infrastructure.

### Objective 1 - Enhance and expand the L2 construct library

Our vision is to provide L2 constructs for all AWS services, and timely maintain and enhance existing L2 constructs as their underlying services evolve. In 2025 we will continue to grow and maintain the L2 construct library, and in parallel develop additional tools and mechanisms to streamline L2 construct generation and maintenance. We’ll do this by: 1/ responding to community reported bugs and PRs, 2/ resolving top P1 feature requests for the most used L2 constructs, 3/ graduating five alpha constructs to GA, 4/ releasing three new, stable L2 constructs, and 5/ creating a generative AI-powered tool to enable the creation of new, stable L2 constructs with reduced engineering effort. We will also work to accelerate construct maintenance by creating mechanisms and tools to enable other AWS teams to create and maintain L2 constructs, and increase the adoption of 3rd party created and maintained L2 constructs by delivering improvements to Construct Hub, and mechanisms to increase community trust in such constructs.

For reference, below are the stages of a construct module lifecycle.

1. **Stage 0 - CFN Resources:** All construct library modules start in stage 0 when they are auto-generated from the CloudFormation resource specification. These are also referred to as CDK L1 constructs. 
2. **Stage 1 - Experimental:** The goal of the experimental stage is to iterate on the design and functionality of a construct library module with the freedom, and understanding of customers, to make breaking changes when desirable or necessary
3. **Stage 2 - Developer Preview:** The goal of developer preview is to deliver a release candidate with a stable API to conduct user acceptance testing and accumulate sufficient usage to declare a module is ready for general availability. We will only make breaking changes to developer preview modules when required to address unforeseen customer use cases or issues.
4. **Stage 3 - General Availability(GA):** The module is generally available with a backwards compatible guarantee across minor versions.

Kindly refer to the [construct module lifecyle](https://github.com/aws/aws-cdk-rfcs/blob/main/text/0107-construct-library-module-lifecycle.md) for details on the different stages of a construct. 

**_Recent Releases_**
 
* **General Availability of AWS Kinesis_firehose L2 construct:** AWS CDK now includes [L2 construct support for Amazon Data Firehose delivery streams](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_kinesisfirehose-readme.html), enabling developers to define and deploy streaming data infrastructure as code.
* **General Availability of App Sync events L2 construct:** The new [AWS AppSync Events construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_appsync-readme.html#events:~:text=in%20your%20language%3F-,Events,-Example) allows developers to create serverless WebSocket APIs that can broadcast real-time data to millions of subscribers without managing infrastructure or connection state.
* **Experimental release of EKS v2 L2 construct:** The [eks-v2-alpha module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-eks-v2-alpha-readme.html) is a rewrite of the existing [aws-eks module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_eks-readme.html). This new iteration leverages native L1 CFN resources, replacing the previous custom resource approach for creating EKS clusters and Fargate Profiles. 
* **Experimental release of the Glue L2 construct:** The [new L2 construct for Glue](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-glue-alpha-readme.html) simplifies the correct configuration of Glue jobs, workflows, and triggers. Learn more in this [release blog post](https://aws.amazon.com/blogs/devops/announcing-the-aws-cdk-glue-l2-construct/)
* **Developer Preview release of the VPC v2 L2 construct:** This new [VPC v2 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-ec2-alpha-readme.html) addresses many of the gaps with the stable VPC construct, and provides higher-level abstractions for Amazon EC2 resources, offering more intuitive APIs.

**_Work in progress_**
  
* **Resolution of top P1 bugs and community Pull Request (PR) reviews:** The CDK engineering team allocates dedicated resources to address high-priority P1 bugs and review and merge pull requests submitted by community contributors. This regular initiative ensures we maintain code quality while fostering active community participation in CDK's development.
* **General Availability release of AWS Cognito_Identity_pool L2 construct:** The [Amazon Cognito Identity Pools L2 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cognito-identitypool-alpha-readme.html) enables you to grant your users access to other AWS services. We plan to graduate this experimental construct to GA.
* **General Availability release of Amazon EventBridge Scheduler L2 construct:** The [Amazon EventBridge Scheduler L2 construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-scheduler-alpha-readme.html) allows you to create, run, and manage scheduled tasks at scale with Amazon EventBridge.
* **Experimental release of Amazon Bedrock L2 construct:** This new [L2 construct for Amazon Bedrock](https://github.com/aws/aws-cdk-rfcs/pull/688) provides an easy way to build and scale generative AI applications with foundation models. There is an [rfc](https://github.com/aws/aws-cdk-rfcs/issues/686) in progress to add support for this L2 construct.
* **Experimental release of VPC Lattice L2 construct:** This new [L2 construct for VPC Lattice](https://github.com/aws/aws-cdk/issues/25452) simplifies service-to-service connectivity, security, and monitoring. There is an [rfc](https://github.com/aws/aws-cdk-rfcs/issues/631) in progress to add support for this L2 construct. 
* **Experimental release of AWS CloudWatch Application Signals L2 construct:** This new [L2 construct for AWS CloudWatch Applications signals](https://github.com/aws/aws-cdk-rfcs/issues/686) provides the ability to automatically instrument your applications on AWS so that you can monitor current application health and track long-term application performance against your business objectives.
* **Developer Preview release of aws-lambda-python construct:** This [module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html) provides constructs for Python Lambda functions.
* **Improve generation of L2 constructs:** This [proposal](https://github.com/aws/aws-cdk-rfcs/issues/611) is to automate parts of the L2 generation process to reduce the engineering effort required to create new L2 constructs.

**_Work Planned_**

* **L2 construct support for the following:**
  - [WAF v2](https://github.com/aws/aws-cdk/issues/6878)
  - [Certificate Manager](https://github.com/aws/aws-cdk/issues/25343)
  - [Stacksets](https://github.com/aws/aws-cdk-rfcs/issues/66)
* **Graduate experimental constructs to General Availability**
  - [Lambda-Go-alpha](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-go-alpha-readme.html)
  - [Amplify](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-amplify-alpha-readme.html)
  - [Sagemaker](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-sagemaker-alpha-readme.html)
 
**_Research Items_**

* **Community Construct Adoption:** Increase the adoption of 3rd party created and maintained L2 constructs by delivering 1/ improvements to Construct Hub and 2/ mechanisms to increase community trust in such constructs.
* **Service-led L2s:** Explore mechanism and tools to enable AWS service teams to create and maintain L2 constructs to support CDK to scale L2 support across all AWS services.

### Objective 2 - Continue to improve the CDK Developer Experience

Developers love CDK because it provides them with the ability to configure and manage their infrastructure using modern languages, IDEs, developer tools, and workflows. In 2025 we will address the most requested developer experience feature requirements by delivering: 1/ CDK upgrade tooling to help customers upgrade CDK applications , 2/ enhanced L1 constructs with support support for enums, resource interfaces, and CFN constraints, 3/ programmatic access to the CDK CLI toolkit, and 4/ CDK Stack refactoring and 5/ Give display names to assets. We will also explore enhanced troubleshooting capabilities, and developing tools to enable CDK users to leverage generative AI to create custom CDK constructs, and CDK applications.

**_Recent Releases_**

* **Upgrade from the AWS SDK v2 to v3:** The AWS SDK for JavaScript v2 is being deprecated. The CDK CLI has been migrated to [use AWS SDK for JS v3](https://github.com/aws/aws-cdk/issues/29694)
* **Garbage Collection for Assets:** Assets which are uploaded to the CDK’s S3 bucket and ECR repository are never deleted, incurring costs. This [feature](https://github.com/aws/aws-cdk-rfcs/issues/64) provides the functionality to delete unused assets, saving costs for customers.

**_Work in progress_**

* **CDK CLI split:** - This [change](https://github.com/aws/aws-cdk/issues/32775) supports decoupling the release cycles of the CDK CLI and the CDK Construct Library, allowing each to have its own cadence and versioning.
* **Programmatic access to the CDK CLI Toolkit:** This [feaeture](https://github.com/aws/aws-cdk-rfcs/issues/300) enable CDK users to programmatically trigger AWS CDK CLI commands, facilitating integration with existing tools and workflows. 
* **CDK Stack Refactoring:** This [feature](https://github.com/aws/aws-cdk-rfcs/issues/162) release will enable users to easily reorganize their constructs within the same or across different stacks.
* **CDK Upgrade tool:** An automated CDK upgrade tool that analyzes customer applications to identify outdated components, including deprecated constructs, properties, and features. The tool streamlines the upgrade process by providing targeted code modification suggestions and step-by-step migration guidance, enabling customers to modernize their CDK applications with reduced manual intervention and lower risk of deployment failures.

**_Work Planned_**
 
* **Give assets a display name:** This [feature](https://github.com/aws/aws-cdk/issues/9628) allows specifying a display name for AWS CDK assets to improve clarity in asset publishing and deployment.
* **Enhanced L1 constructs:** This [rfc](https://github.com/aws/aws-cdk-rfcs/pull/657) is a proposal to enhance the L1 constructs by adding support for enums, resource interfaces, and CFN contraints to generated L1s.
* **CLI: Enable client-side telemetry and analytics:** This [change]((https://github.com/aws/aws-cdk/issues/32010)) is to enable client-side telemetry and analytics collection in the CDK CLI.

**_Research Items_**

* **Generative CDK:** Enable CDK users to leverage AI models to generate CDK applications, and custom L2/3 constructs. This may include the ability to "generate/migrate from" other IaC or non-IaC to CDK, and visualize the generated CDK app/construct.
* **CDK Troubleshooting:** Improved troubleshooting through better traceability between CDK and CFN code.

### Objective 3 - Extensible infrastructure

These features allow CDK to grow beyond its initial scope and adapt to different infrastructure needs, while maintaining consistent patterns and practices.

**_Work in progress_**

* **Continued support for CDK8s library:** This roadmap item is to provide continued support to the CDK8s library, including resolving GitHub issues and reviewing Pull Requests (PRs). This addresses the open [GitHub discussion](https://github.com/cdk8s-team/cdk8s/discussions/2052) on CDK8s maintenance state.

**_Research Items_**

* **Improved governance and compliance capabilities:** We'll explore developing a native policy-as-code features with pre-defined rule packs for common security guardrails (IAM policy restrictions, encryption requirements, public access controls) and enable custom rule-pack creation that integrates the CDK development lifecycle. This aims to provide Central IT teams better control and allows them to build guardrails to adhere to organizational best practices. 

* **Partner integrations** Explore partner opportunities to accelerate adoption of CDK by Terraform, Pulumi, and Open Tofu users through joint intiatives with partner organizations.

## Community Engagement

**Contributor Council Proposal Update:** We have completed phase one of the Contributor Council Charter (see [RFC #676](https://github.com/aws/aws-cdk-rfcs/pull/679)), which focused on community input. During this period, we collected feedback from customers, maintainers, contributors, and the broader AWS CDK community. Our next step is to review these responses to finalize the council’s structure, processes, and next steps. Additional updates outside of this roadmap document will be shared as we transition into phase two. 

We would love to hear from you on how the CDK operates today and how it should grow in the future. To report a bug or create a small feature request, please [create an issue here](https://github.com/aws/aws-cdk/issues/new/choose). If you are seeking to request a change in strategic direction or make a CDK core framework change, please [create a Request for Comments (RFC) ticket here](https://github.com/aws/aws-cdk-rfcs/issues/new/choose). If you are ever unsure about where your feature request should live, it is best to follow the first link within the aws-cdk repo.

![image](https://github.com/aws/aws-cdk/assets/142322013/ea006330-caa7-4c00-8eba-8e8fe379ef6b)

Listening and working with the open source community is really important to us. If you would like to give us your feedback on how we are doing, feel free to reach out to our team via cdk.dev slack.

## Educational Content

To make the CDK more accessible and easier to understand, we publish educational content like blog posts, videos and workshops. Here are some from AWS.

- [Blog] [How the PGA Tour speeds up development with the AWS CDK](https://aws.amazon.com/blogs/devops/driving-development-forward-how-the-pga-tour-speeds-up-development-with-the-aws-cdk/)
- [Workshop/Livestream] [CDK Workshop Series on CDK Live!](https://youtube.com/playlist?list=PLp1wJE9SAACOLvdtKL2P2Kq_N_AiYIj8N&si=hH14gEVmM_35xivq)
- [Livestream] [Learn how to build and publish AWS CDK Constructs](https://www.youtube.com/live/kUfSoFy4Mgg?si=aDMMacUT3lq6ZeKw)
- [Workshop] [AWS CDK Immersion Day Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/10141411-0192-4021-afa8-2436f3c66bd8/en-US)
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
