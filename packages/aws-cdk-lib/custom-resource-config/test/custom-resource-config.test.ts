import { Capture, Template, Match } from '../../assertions';
import * as cdk from '../../core'
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as ses from '../../aws-ses';
import * as s3deploy from '../../aws-s3-deployment';
import * as events from "../../aws-events";
import * as targets from "../../aws-events-targets";
import * as iam from "../../aws-iam";
import { CustomResourceConfig } from '../custom-resource-config';

describe('CustomResourceConfig empty retention', ()=> {
    test('catch thrown error if no retention', ()=> {
        const app = new cdk.App();
        try {
            CustomResourceConfig.of(app).addLogRetentionLifetime()
        } catch (e) {
            expect(e.message).toBe("Retention must have a value");
        }
    })
})
describe('aws-ses drop spams', () => {
    test('Drop spams - UnModified by Aspects', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        new ses.ReceiptRuleSet(stack, 'RuleSet', {
            dropSpam: true,
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::Logs::LogGroup', 0);
    })
    test('Drop spams - Modified by Aspects', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        new ses.ReceiptRuleSet(stack, 'RuleSet', {
            dropSpam: true,
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::Logs::LogGroup', 1);
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION
        })
        template.hasResourceProperties('AWS::Lambda::Function', {
            LoggingConfig: {
                LogGroup: {
                    Ref: Match.stringLikeRegexp('SingletonLambda')
                }
            }
        })
    })
    test('Drop spams - snapshot', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        new ses.ReceiptRuleSet(stack, 'RuleSet', {
            dropSpam: true,
        });

        const template = Template.fromStack(stack);

        expect(template.toJSON()).toMatchSnapshot();
    })
})
describe('aws-events-targets awsapi', () => {
    test('UnModified by Aspects', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        const connection = new events.Connection(stack, "Connection", {
            authorization: events.Authorization.apiKey(
                "x-api-key",
                cdk.SecretValue.unsafePlainText("no-secret")
            ),
            description: "Connection with API Key x-api-key",
        });
        const destination = new events.ApiDestination(stack, "Destination", {
            connection,
            endpoint: "https://amazon.com",
            description: "Calling example.com with API key x-api-key",
        });
        const rule = new events.Rule(stack, "Rule", {
            schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
            targets: [new targets.ApiDestination(destination)],
        });
        const awsApi = new targets.AwsApi({
            action: "action",
            service: "service",
            apiVersion: "apiVersion",
            catchErrorPattern: "catchErrorPattern",
            parameters: "hello-world",
            policyStatement: new iam.PolicyStatement({
                actions: ["s3:GetObject"],
                resources: ["*"],
            }),
        });
        rule.addTarget(awsApi);

        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::Logs::LogGroup', 0);
        template.hasResourceProperties('AWS::Lambda::Function', {
            LoggingConfig: Match.absent(),
        })
    })
    test('Modified by Aspects', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const connection = new events.Connection(stack, "Connection", {
            authorization: events.Authorization.apiKey(
                "x-api-key",
                cdk.SecretValue.unsafePlainText("no-secret")
            ),
            description: "Connection with API Key x-api-key",
        });
        const destination = new events.ApiDestination(stack, "Destination", {
            connection,
            endpoint: "https://amazon.com",
            description: "Calling example.com with API key x-api-key",
        });
        const rule = new events.Rule(stack, "Rule", {
            schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
            targets: [new targets.ApiDestination(destination)],
        });
        const awsApi = new targets.AwsApi({
            action: "action",
            service: "service",
            apiVersion: "apiVersion",
            catchErrorPattern: "catchErrorPattern",
            parameters: "hello-world",
            policyStatement: new iam.PolicyStatement({
                actions: ["s3:GetObject"],
                resources: ["*"],
            }),
        });
        rule.addTarget(awsApi);

        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::Logs::LogGroup', 1);
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION
        })
        template.hasResourceProperties('AWS::Lambda::Function', {
            LoggingConfig: {
                LogGroup: {
                    Ref: Match.stringLikeRegexp('AWS')
                }
            }
        })
    })
    test('awsapi - snapshot', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const connection = new events.Connection(stack, "Connection", {
            authorization: events.Authorization.apiKey(
                "x-api-key",
                cdk.SecretValue.unsafePlainText("no-secret")
            ),
            description: "Connection with API Key x-api-key",
        });
        const destination = new events.ApiDestination(stack, "Destination", {
            connection,
            endpoint: "https://amazon.com",
            description: "Calling example.com with API key x-api-key",
        });
        const rule = new events.Rule(stack, "Rule", {
            schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
            targets: [new targets.ApiDestination(destination)],
        });
        const awsApi = new targets.AwsApi({
            action: "action",
            service: "service",
            apiVersion: "apiVersion",
            catchErrorPattern: "catchErrorPattern",
            parameters: "hello-world",
            policyStatement: new iam.PolicyStatement({
                actions: ["s3:GetObject"],
                resources: ["*"],
            }),
        });
        rule.addTarget(awsApi);

        const template = Template.fromStack(stack);

        expect(template.toJSON()).toMatchSnapshot();
    })
})

describe('LogGroup', () => {
    test('s3LogGroup - UnModified by Aspects', () => {
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;

        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
        new s3deploy.BucketDeployment(stack, 's3deployLogGroup', {
            sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
            destinationBucket: websiteBucket,
            logGroup: new logs.LogGroup(stack, 'LogGroup', {
                retention: LOCALLY_SET_LOG_RETENTION,
            }),
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::Logs::LogGroup', 1);
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: LOCALLY_SET_LOG_RETENTION,
        });
        template.hasResourceProperties('AWS::Lambda::Function', {
            LoggingConfig: {
                LogGroup: {
                    Ref: Match.stringLikeRegexp('LogGroup')
                }
            }
        })
    });

    test('s3LogGroup - update lambda logGroup to SET_LOG_RETENTION', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
        new s3deploy.BucketDeployment(stack, 's3deployLogGroup', {
            sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
            destinationBucket: websiteBucket,
            logGroup: new logs.LogGroup(stack, 'LogGroup', {
                retention: LOCALLY_SET_LOG_RETENTION,
            }),
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::Logs::LogGroup', 1);
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION,
        });
    });

    test('s3LogGroupExtraLogGroup - assert extra non-custom logGroup is ignored and does not change', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;
        const DEFAULT_LOG_GROUP_RETENTION = logs.RetentionDays.TWO_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const ignored = new logs.LogGroup(stack, 'ignored', {});
        const websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});
        new s3deploy.BucketDeployment(stack, 's3deployLogGroup', {
            sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
            destinationBucket: websiteBucket,
            logGroup: new logs.LogGroup(stack, 'LogGroup', {
                retention: LOCALLY_SET_LOG_RETENTION,
            }),
        });

        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::Logs::LogGroup', 2);
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION,
        });
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: DEFAULT_LOG_GROUP_RETENTION,
        });
    });
    test('s3LogGroup - Duplicate logGroup, one will be ignored, one set by Log Retention for singleton lambda', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployLogGroup1", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
            logGroup: new logs.LogGroup(stack, "LogGroup1", {
                retention: LOCALLY_SET_LOG_RETENTION
            }),
        });
        new s3deploy.BucketDeployment(stack, "s3deployLogGroup2", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
            logGroup: new logs.LogGroup(stack, "LogGroup2", {
                retention: LOCALLY_SET_LOG_RETENTION
            }),
        });

        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::Lambda::Function', {
            LoggingConfig: {
                LogGroup: {
                    Ref: Match.stringLikeRegexp('LogGroup1')
                }
            }
        })
        template.resourceCountIs('AWS::Logs::LogGroup', 2)
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION
        })
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: LOCALLY_SET_LOG_RETENTION
        })
    });
    test('s3LogGroup - snapshot', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const template = Template.fromStack(stack);
        expect(template.toJSON()).toMatchSnapshot();
    });
});

describe('LogRetention', () => {
    test('s3LogRetention - UnModified by Aspects', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;

        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployLogRetention", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
            logRetention: LOCALLY_SET_LOG_RETENTION
        });

        const template = Template.fromStack(stack);

        const captureRetentionInDays = new Capture();
        template.hasResourceProperties('Custom::LogRetention', {
            RetentionInDays: captureRetentionInDays,
        });
        expect(captureRetentionInDays.asNumber()).toEqual(
            LOCALLY_SET_LOG_RETENTION
        );
        expect(captureRetentionInDays.asNumber()).not.toEqual(
            SET_LOG_RETENTION,
        );
    });

    test('s3LogRetention - Update the Custom LogRetention to SET_LOG_RETENTION', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployLogRetention", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
            logRetention: LOCALLY_SET_LOG_RETENTION
        });
        const template = Template.fromStack(stack);

        const captureRetentionInDays = new Capture();
        template.hasResourceProperties('Custom::LogRetention', {
            RetentionInDays: captureRetentionInDays,
        });
        expect(captureRetentionInDays.asNumber()).toEqual(SET_LOG_RETENTION);
        expect(captureRetentionInDays.asNumber()).not.toEqual(
            LOCALLY_SET_LOG_RETENTION
        );
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION
        })
    });

    test('s3LogRetentionWithExtraLogGroup - assert that extra logGroup is unchanged', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;
        const DEFAULT_LOG_GROUP_RETENTION = logs.RetentionDays.TWO_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const ignored = new logs.LogGroup(stack, "ignored", {});
        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployLogGroup", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
            logRetention: LOCALLY_SET_LOG_RETENTION
        });

        const template = Template.fromStack(stack);

        template.hasResourceProperties('Custom::LogRetention', {
            RetentionInDays: SET_LOG_RETENTION,
        });
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: DEFAULT_LOG_GROUP_RETENTION,
        });
        template.hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: SET_LOG_RETENTION
        })
    });
    test('s3LogRetention - snapshot', () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const LOCALLY_SET_LOG_RETENTION = logs.RetentionDays.ONE_WEEK;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployLogRetention", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
            logRetention: LOCALLY_SET_LOG_RETENTION
        });

        const template = Template.fromStack(stack);

        expect(template.toJSON()).toMatchSnapshot();
    });
});

describe("s3None", () => {
    test("s3None - UnModified by Aspects", () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployNone", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
        });

        const template = Template.fromStack(stack);

        template.hasResourceProperties("AWS::Lambda::Function", {
            LoggingConfig: Match.absent(),
        });
        template.resourceCountIs("AWS::Logs::LogGroup", 0);
    });
    test("s3None - Updated LogGroup to SET_LOG_RETENTION", () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployNone", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
        });

        const template = Template.fromStack(stack);

        template.hasResourceProperties("AWS::Lambda::Function", {
            LoggingConfig: {
                LogGroup: {
                    Ref: Match.stringLikeRegexp("CustomCDKBucketDeployment"),
                },
            },
        });
        template.resourceCountIs("AWS::Logs::LogGroup", 1);
        template.hasResourceProperties("AWS::Logs::LogGroup", {
            RetentionInDays: SET_LOG_RETENTION,
        });
    });
    test("s3None - assert that extra logGroup is unchanged", () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;
        const DEFAULT_LOG_GROUP_RETENTION = logs.RetentionDays.TWO_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const ignored = new logs.LogGroup(stack, "ignored", {});
        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployNone", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
        });

        const template = Template.fromStack(stack);

        template.hasResourceProperties("AWS::Lambda::Function", {
            LoggingConfig: {
                LogGroup: {
                    Ref: Match.stringLikeRegexp("CustomCDKBucketDeployment"),
                },
            },
        });
        template.resourceCountIs("AWS::Logs::LogGroup", 2);
        template.hasResourceProperties("AWS::Logs::LogGroup", {
            RetentionInDays: SET_LOG_RETENTION,
        });
        template.hasResourceProperties("AWS::Logs::LogGroup", {
            RetentionInDays: DEFAULT_LOG_GROUP_RETENTION,
        });
    });
    test("s3None - snapshot", () => {
        const SET_LOG_RETENTION = logs.RetentionDays.TEN_YEARS;

        const app = new cdk.App();
        CustomResourceConfig.of(app).addLogRetentionLifetime(SET_LOG_RETENTION);
        const stack = new cdk.Stack(app);

        const websiteBucket = new s3.Bucket(stack, "WebsiteBucket", {});
        new s3deploy.BucketDeployment(stack, "s3deployNone", {
            sources: [s3deploy.Source.jsonData("file.json", { a: "b" })],
            destinationBucket: websiteBucket,
        });

        const template = Template.fromStack(stack);

        expect(template.toJSON()).toMatchSnapshot();
    });
});