# AWS CDK Roadmap

The [AWS CDK Roadmap] lets developers know about our upcoming features and priorities to help them plan how to best leverage the CDK and identify opportunities to contribute to the project. The roadmap provides a high-level view of our work in progress across the [aws-cdk], [aws-cdk-rfcs], and [jsii] repositories, and creates an opportunity for customers to engage in a conversation with AWS CDK engineers to give us direct feedback.

[AWS CDK Roadmap]: https://github.com/orgs/aws/projects/7
[aws-cdk]: https://github.com/aws/aws-cdk
[aws-cdk-rfcs]: https://github.com/aws/aws-cdk-rfcs
[jsii]: https://github.com/aws/jsii

## Roadmap FAQs

**Q: How do you manage the roadmap?**

A: We know that our customers are making decisions and plans based on what we
are developing, and we want to provide the information they need to be successful. Our roadmap management tenets are:

* **Be transparent** with customers about the AWS CDK team’s work in progress
* **Listen to customers,** allowing them to participate in design decisions and to vote on and propose new AWS CDK
  features. We will periodically re-prioritize the roadmap based on customer feedback
* **Stay up-to-date,** or we will lose customer trust
* **Provide the right level of detail** so customers can easily see what we’re working on at a glance, without being
  overwhelmed by minutiae
* **Guide the community** on what AWS CDK constructs or features to contribute without the risk of conflicting with work
  already in progress

**Q: What do the roadmap project board columns mean?**

A: There are four columns on the roadmap project board:

* **Researching** - We’re thinking about it, but cannot commit if, or when, we will work on items in this list.
  This means we are still designing the feature and evaluating how it might work. This is the phase when we collect
  customer use cases and feedback on how they want to see something implemented. There is no firm commitment to deliver
  functionality listed in the Researching column, and there might be situations that require us to move items from the
  roadmap back to the backlog.
* **We’re working on it** - In progress, but further out. We have made an implied commitment to work on items in this
  bucket, they have some level of design spec’ed out, and a developer assigned to them. Items might linger in this
  bucket as we work through the implementation details, or scope stuff out. Think several months out until a developer
  preview release, give or take.
* **Developer preview** - It’s available now as a release candidate. Items will spend extended periods of time in
  developer preview as we conduct user acceptance testing and accumulate sufficient usage to declare the API stable and
  ready for general availability. We will only make breaking changes to developer preview modules when we need to address unforeseen use cases or issues. Not all
  features, such as enhancements to the CDK CLI, will have a developer preview phase. In these cases the tracking issue
  is moved directly to the Shipped bucket when released.
* **Shipped** - It’s available now, fully supported by AWS, and we guarantee the API is stable and safe to use in
  production.

**Q: How do items on the roadmap move across the project board?**

A:  The [AWS Construct Library module lifecycle
document](https://github.com/aws/aws-cdk-rfcs/blob/master/text/0107-construct-library-module-lifecycle.md) describes how
we graduate packages from experimental, to developer preview, to generally available.

**Q: Why are there no dates on this roadmap?**

A: Security and operational stability are our main priority and we will not ship a feature until these criteria are met,
therefore we generally don’t provide specific target dates for releases.

**Q: Is every feature on the roadmap?**

A: The AWS Cloud Development Kit roadmap provides transparency on our priority for adding new programming languages,
developer experience improvements, and service coverage in the AWS Construct Library. The AWS CDK toolkit and AWS
Construct Library are such a large surface areas we are intentionally keeping the roadmap at a high-level, so not every
CDK feature request will appear on the roadmap. Instead, the roadmap will include a tracking issue
for each deliverable that provides a feature overview and contains links to relevant, more granular issues and pull
requests. If you want to track the status of a specific issue or pull request, you can do so by monitoring that work
item in the [aws-cdk] GitHub repository.

**Q: What is a tracking issue?**

A: We create a tracking issue for each CDK feature, AWS Construct Library module, and jsii-supported programming language. Tracking issues provide a brief summary of the feature and a consolidated view of the work scoped for the release. They include links to design documentation, implementation details, and relevant issues. Tracking issues are living documents that start from a basic template and grow more robust over time as we experiment and learn. You can easily find tracking issues by filtering on the [management/tracking label](https://github.com/aws/aws-cdk/labels/management%2Ftracking).

**Q: How can I provide feedback on the roadmap or ask for more information about a feature?**

A: Please open an issue!

**Q: How can I request a feature be added to the roadmap?**

A: Please open an issue! Community submitted issues will be tagged “feature-request” and will be reviewed by the team.

**Q: Can I “+1” tracking issues and feature requests?**

A: We strongly encourage you to do so, as it helps us understand which issues will have the broadest impact. You can navigate to the issue details page and add a reaction. There are six types of reactions (thumbs up “+1”, thumbs down “-1”, confused, heart, watching, laugh, and hooray) you can use to help us decide which items will benefit you most.

**Q: Will you accept a pull request to the aws-cdk repo?**

A: Yes! We take PRs very seriously and will review for inclusion. You can read how to contribute to the CDK [here](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md).
