# AWS CDK Roadmap

> Updated 9/3/2024

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

## Themes

Over the course of the last few years, the CDK team has spent time speaking with and learning from its community. We've gathered that there were certain features that were greatly valued from the CDK and other features which would be beneficial to be added to its experience. We appreciate everyone sharing this feedback and we plan on addressing it through the targeted themes and RFCs listed below. Please be aware that the team will periodically work to add RFCs as we look to prioritize more work.

### L2 Abstractions

The CDK team is committed to supporting our existing library of AWS L2 abstractions. We continue to solicit community feedback on where additional L2 coverage makes it simpler and more efficient to build with AWS. Current L2s that the team’s working on are listed below. Please be aware that this list will update throughout the year. If you have feedback on other L2s that should be prioritized by our team, feel free to submit a separate RFC.

* 🚀 [VPC Construct with Full Control](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-ec2-alpha)
* 🚀 [AWS APIGateway_v2 graduation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2-readme.html) 
* 🚀 [AWS Batch graduation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_batch-readme.html) 
* 🚀 [AWS Synthetics graduation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_synthetics-readme.html)  
* 🛠️ [CloudFront Origin Access Control L2](https://github.com/aws/aws-cdk-rfcs/issues/617)
* 🛠️ [AWS Cognito_Identity_pool graduation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cognito-identitypool-alpha-readme.html)
* 🛠️ [AWS Kinesis_firehose graduation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-kinesisfirehose-alpha-readme.html)
* 🚦️ [Rewrite EKS L2](https://github.com/aws/aws-cdk-rfcs/issues/605)
* 🔍 [aws-lambda-python graduation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html)
* 🔍 [Auto-generation of L2 constructs](https://github.com/aws/aws-cdk-rfcs/issues/611) 
* 🔍 [Glue Alpha Construct Graduation](https://github.com/aws/aws-cdk/issues/7534) 
* 🔍 [aws-servicecatalogappregistry](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-servicecatalogappregistry-alpha-readme.html) 

### Updates/Enhancements

- 🚀 [Upgrade custom resources for managed lambda runtime from Node18 to Node20](https://github.com/aws/aws-cdk/issues/29786)
- 🛠️ [Upgrade from the AWS SDK V2 to V3](https://github.com/aws/aws-cdk/issues/29694)

### User Experience

- 🛠️ [Garbage Collection for Assets](https://github.com/aws/aws-cdk-rfcs/issues/64)
- 🚦️ [Programmatic Access of the AWS CDK CLI](https://github.com/aws/aws-cdk-rfcs/issues/300)
- 👂🏽 [CDK Refactoring](https://github.com/aws/aws-cdk-rfcs/issues/162)

### Community contribution call-outs

Thank you to our community members that have contributed to the project. Below are some of the great contributions from the community! We'll continue to update this list as contributions come in, and please feel free to reach out on the cdk.dev slack workspace if you have any questions or feedback.

- 🚀 [EventBridge Pipes Alpha Construct](https://github.com/aws/aws-cdk/pull/28388) - [Raphael Manke](https://github.com/RaphaelManke)
- 🚀 [CodePipeline support for pipeline type V2 with pipeline-level variables and triggers](https://github.com/aws/aws-cdk/pull/28538) - [Kenta Goto](https://github.com/go-to-k)
- 🚀 [Cloudwatch Synthetics: Update to canary runtime support for NodeJS and Python](https://github.com/aws/aws-cdk/pull/29132) - [Henry Wilson](https://github.com/wilhen01)
- 🚀 [EFS File System Replication](https://github.com/aws/aws-cdk/pull/29347) - [
  kazuho cryer-shinozuka](https://github.com/badmintoncryer)

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
