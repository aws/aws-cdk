# AWS CDK Roadmap

The roadmap priorities for the AWS CDK (Cloud Development Kit) are informed by what we hear from customers and interactions on Github, CDK.dev Slack, Stack Overflow, and Twitter. This document outlines the high level direction we are working towards, and for each project there is a tracking issue where you can leave feedback. We update this doc on a quarterly basis to reflect any changing priorities. 

Follow <a href="https://www.youtube.com/@CDK-Live">CDK Live!</a> and <a href="https://cdk.dev/">cdk.dev</a> to learn what's new in AWS CDK.

Security and stability of the CDK is a top priority. If you think you’ve found a potential security issue, please do not post it as an issue or a discussion thread in this repository. Instead, please follow the instructions <a href="https://aws.amazon.com/security/vulnerability-reporting/">here</a> or directly email <a href="mailto:aws-security@amazon.com">AWS security</a>.


[aws-cdk]: https://github.com/aws/aws-cdk
[aws-cdk-rfcs]: https://github.com/aws/aws-cdk-rfcs
[jsii]: https://github.com/aws/jsii

## Our Core Tenets (which guide prioritization decisions)

* **We empower CDK builders to innovate with confidence, without sacrificing security.** The CDK provides customers with conviction by providing a clear and streamlined direction to building secure, modernized, industry leading innovations with AWS.
* **Productivity through simplicity.** The CDK measurably improves developer productivity in building with AWS. We make Infrastructure as Code simple to define, understand, change, and troubleshoot.
* **Be transparent.** The AWS CDK team’s current work should be easily visible.
* **Listen to customers.** Allow them to participate in design decisions and to vote on and propose new AWS CDK features. We will periodically reprioritize the roadmap based on customer feedback.

## List of Annotations

  <table>
  <tr>
    <th>Symbol</th>
    <th>Description</th>
    </tr>
  <tr>
    <td>🔍</td>
    <td>Exploration</td>
    </tr>
  <tr>
    <td>👂🏽</td>
    <td>Waiting for feedback</td>
    </tr>
  <tr>
    <td>🚦</td>
    <td>Work ready to begin</td>
    </tr>
  <tr>
    <td>🛠️</td>
    <td>Work in progress</td>
    </tr>
  <tr>
    <td>🚀</td>
    <td>Released</td>
    </tr>
</table>

## Themes

### User Experience 
*  🚀<a href="https://aws.amazon.com/blogs/devops/enhancing-resource-isolation-in-aws-cdk-with-the-app-staging-synthesizer/">App Staging Synthesizer for Resource Isolation</a> - This feature enhances resource isolation and cleanup control by creating separate staging resources for each application
* 👂🏽<a href="https://github.com/aws/aws-cdk-rfcs/issues/162">CDK Refactoring</a> - We’re looking into providing built-in support for builder refactoring work.
* 🛠️ <a href="https://github.com/aws/aws-cdk-rfcs/issues/586">Understand deployment progress within CloudFormation</a> - This will help builders understand what CloudFormation is doing as deployments are in progress.

### Speed up development and testing 
* 🚀 <a href="https://github.com/aws/aws-cdk/blob/6004a17c593728e36ad4f5c3dcdd578ff46fa9bb/packages/aws-cdk/README.md#cdk-migrate">Enable CloudFormation builders to migrate existing infrastructure to CDK</a> - CloudFormation builders can now generate a CDK application using an existing CloudFormation template in JSON or YAML format using cdk migrate!
* 🚀 <a href="https://docs.aws.amazon.com/cdk/v2/guide/policy-validation-synthesis.html">Policy Validation at Synth</a> - Builders can now check their policies immediately after synthesis using CloudFormation Guard or OPA!
* 👂🏽 <a href="https://github.com/aws/aws-cdk/issues/25418">Adding more resource support to Hotswap</a> - Apart from Lambda, we are looking into expanding resource support for Hotswap. Please share your feedback in this linked ticket!
* 🔍 <a href="https://github.com/aws/aws-cdk-rfcs/issues/585">Local application testing</a> - We are investigating how to improve CDK testing on builders’ locals. We would love to hear everyone’s feedback here on what they would like to see as part of this experience.
* 🔍 <a href="https://github.com/aws/aws-cdk-rfcs/issues/583">Upgrade deployment debugging experience</a> - We also are looking into providing more debugging support at time of deployment.  Please drop a note in this tagged ticket if you have any opinions related to this experience!

### CI/CD
* 🚀 <a href="https://aws.amazon.com/blogs/devops/secure-cdk-deployments-with-iam-permission-boundaries/">Secure CDK Deployments with IAM Permission Boundaries</a> - CDK builders can now enact IAM permission boundaries, which help to ensure that all actions are within the overlap of the users permissions and the boundary, and ensure that any IAM entities that are created also have the same boundary applied!
* 👂🏽 <a href="https://github.com/aws/aws-cdk-rfcs/issues/300">CDK CLI Upgrade</a> - We are looking into how to further improve the CLI experience. This includes allowing builders to automate necessary tasks and integrate the CDK into CI/CD pipelines if they desire to. Please share your feedback in this ticket if you have anything you would like noted!
* 👂🏽 <a href="https://github.com/aws/aws-cdk-rfcs/issues/228">CDK CLI Triggers</a> - CLI enhancements are also being considered for post command hooks. 

### L2 Abstractions
* 🔍 <a href="https://github.com/aws/aws-cdk-rfcs/issues/491">CloudFront Origin Access Control L2</a>

We are currently investigating other L2s to build out next. Feel free to create an RFC to request.

## Community Engagement
We would love to hear from you on how the CDK operates today and how it should grow in the future. To report a bug or create a small feature request, please <a href="https://github.com/aws/aws-cdk/issues/new/choose">create an issue here</a>. If you are seeking to request a change in strategic direction or make a CDK core framework change, please <a href="https://github.com/aws/aws-cdk-rfcs/issues/new/choose">create a Request for Comments (RFC) ticket here</a>. If you are ever unsure about where your feature request should live, it is best to follow the first link within the aws-cdk repo.

<img width="1174" alt="image" src="https://github.com/aws/aws-cdk/assets/142322013/ea006330-caa7-4c00-8eba-8e8fe379ef6b">


Listening and working with the open source community is really important to us. If you would like to give us your feedback on how we are doing, feel free to reach out to our team via cdk.dev slack.

## Educational Content

To make the CDK more accessible and easier to understand, we publish educational content like blog posts, videos and workshops. Here are some from AWS.

* [Workshop] <a href="https://cdkworkshop.com/">The AWS CDK Workshop</a>
* [Workshop] <a href="https://catalog.us-east-1.prod.workshops.aws/workshops/071bbc60-6c1f-47b6-8c66-e84f5dc96b3f/en-US">Extended CDK Workshop</a>
* [Workshop] <a href="https://catalog.workshops.aws/localzone-cdk/en-US">Automating your workload deployments in AWS Local Zones</a>
* [Blogpost] <a href="https://aws.amazon.com/blogs/devops/using-aws-cloudformation-and-aws-cloud-development-kit-to-provision-multicloud-resources/">Using AWS CloudFormation and AWS Cloud Development Kit to provision multicloud resources</a>
* [Blogpost] <a href="https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/">CDK Pipelines: Continuous delivery for AWS CDK applications</a>
* [Blogpost] <a href="https://aws.amazon.com/blogs/compute/better-together-aws-sam-and-aws-cdk/">Better together: AWS SAM and AWS CDK</a>
* [Videos] <a href="https://www.youtube.com/@CDK-Live">CDK Live!</a>
* [CDK Day] <a href="https://www.youtube.com/watch?v=qlUR5jVBC6c">Track 1 (English) for CDK Day 2023</a>
* [CDK Day] <a href="https://www.youtube.com/watch?v=b-nSH18gFQk">Track 2 (English) for CDK Day 2023</a>
* [CDK Day] <a href="https://www.youtube.com/watch?v=ZAQC-cOXL4M">Track 3 (Spanish) for CDK Day 2023</a>
* [re:Invent Content] Search through <a href="https://www.youtube.com/@amazonwebservices">all content here</a>

## 2024 Updates

Stay tuned for more updates for 2024!

## Disclaimer

The AWS CDK team values feedback and guidance from its community of users, although final decisions on inclusion into the project will be made by AWS. We determine the high-level direction for our open roadmap based on customer feedback and popularity (👍🏽 and comments), security and operational impacts, and business value. Where features don’t meet our goals and longer-term strategy, we will communicate that clearly and openly as quickly as possible with an explanation of why the decision was made.

## FAQs

Q: Why did you build an open roadmap?
A: Your feedback and suggestions would help in ensuring that we are working on the most important and impactful issues. And if you are making decisions and plans based on what we are developing, this will provide insights on what is coming down the road for the CDK.

Q: Why are there no dates on your roadmap?
A: Because security and operational stability are our highest priorities, the above new features cannot be provided specific target dates. The roadmap is subject to change at any time, and roadmap issues in this repository do not guarantee a feature will be launched as proposed.

Q: Is everything on the roadmap?
A: We will publish high-level direction that is within the scope of the CDK. Minor features and performance improvement tasks are not on the roadmap currently, but we are constantly trying to improve the roadmap so please leave your suggestions <a href="https://github.com/aws/aws-sam-cli/issues/3267">here</a>.

Q: How can I provide feedback or ask for more information?
A: When in doubt, please create an issue! Issues will be reviewed and/or forwarded appropriately. A great time to provide feedback is when the project is in Exploration, RFC stage, or when the feature is in beta release. As always, we listen to your feedback and adapt our plans if needed.

Q: Can I 👍🏽 existing issues?
A: We strongly encourage you to do so, as it helps us understand which issues will have the widest impact. You can navigate to the issue details page and add a reaction (👍🏽).

Q: How can I request a feature be added to the roadmap?
A: We encourage you to open an issue, even if you’ve requested it before via other channels. Issues submitted will be reviewed by the roadmap maintainers. If you find an issue already created for the feature, please upvote it (👍🏽) and leave comments specific to your use case. To report a bug or create a small feature request, please <a href="https://github.com/aws/aws-cdk/issues/new/choose">create an issue here</a>. If you are seeking to request a change in the CDK’s strategic direction or make a CDK core framework change, please <a href="https://github.com/aws/aws-cdk-rfcs/issues/new/choose">create a Request for Comments (RFC) ticket here</a>.

Please do not be discouraged if your ticket is closed—that may happen if it is not a priority during the quarter it was submitted. The CDK team closes tickets in an effort to display what is prioritized at a given moment. If this happens, we invite you to try submitting it again later in the year.
