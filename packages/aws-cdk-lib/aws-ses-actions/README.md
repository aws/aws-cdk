# Amazon Simple Email Service Actions Library


This module contains integration classes to add action to SES email receiving rules.
Instances of these classes should be passed to the `rule.addAction()` method.

Currently supported are:

* [Add header](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-add-header.html)
* [Bounce](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-bounce.html)
* [Lambda](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-lambda.html)
* [S3](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-s3.html)
* [SNS](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-sns.html)
* [Stop](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-action-stop.html)

See the README of `@aws-cdk/aws-ses` for more information.
