# AWS Glue Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## README

[AWS Glue](https://aws.amazon.com/glue/) is a serverless data integration
service that makes it easier to discover, prepare, move, and integrate data
from multiple sources for analytics, machine learning (ML), and application
development.

Wihout an L2 construct, developers define Glue data sources, connections,
jobs, and workflows for their data and ETL solutions via the AWS console,
the AWS CLI, and Infrastructure as Code tools like CloudFormation and the
CDK. However, there are several challenges to defining Glue resources at
scale that an L2 construct can resolve. First, developers must reference
documentation to determine the valid combinations of job type, Glue version,
worker type, language versions, and other parameters that are required for specific
job types. Additionally, developers must already know or look up the
networking constraints for data source connections, and there is ambiguity
around how to securely store secrets for JDBC connections. Finally,
developers want prescriptive guidance via best practice defaults for
throughput parameters like number of workers and batching.

The Glue L2 construct has convenience methods working backwards from common
use cases and sets required parameters to defaults that align with recommended
best practices for each job type. It also provides customers with a balance
between flexibility via optional parameter overrides, and opinionated
interfaces that discouraging anti-patterns, resulting in reduced time to develop
and deploy new resources.

### References

* [Glue Launch Announcement](https://aws.amazon.com/blogs/aws/launch-aws-glue-now-generally-available/)
* [Glue Documentation](https://docs.aws.amazon.com/glue/index.html)
* [Glue L1 (CloudFormation) Constructs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_Glue.html)
* Prior version of the [@aws-cdk/aws-glue-alpha module](https://github.com/aws/aws-cdk/blob/v2.51.1/packages/%40aws-cdk/aws-glue/README.md)

## Create a Glue Job

A Job encapsulates a script that connects to data sources, processes
them, and then writes output to a data target. There are four types of Glue
Jobs: Spark (ETL and Streaming), Python Shell, Ray, and Flex Jobs. Most
of the required parameters for these jobs are common across all types,
but there are a few differences depending on the languages supported
and features provided by each type. For all job types, the L2 defaults
to AWS best practice recommendations, such as:

* Use of Secrets Manager for Connection JDBC strings
* Glue job autoscaling
* Default parameter values for Glue job creation

This iteration of the L2 construct introduces breaking changes to
the existing glue-alpha-module, but these changes streamline the developer
experience, introduce new constants for defaults, and replacing synth-time
validations with interface contracts for enforcement of the parameter combinations
that Glue supports. As an opinionated construct, the Glue L2 construct does
not allow developers to create resources that use non-current versions
of Glue or deprecated language dependencies (e.g. deprecated versions of Python).
As always, L1s allow you to specify a wider range of parameters if you need
or want to use alternative configurations.

Optional and required parameters for each job are enforced via interface
rather than validation; see [Glue's public documentation](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api.html)
for more granular details.

### Spark Jobs

1. **ETL Jobs**

ETL jobs support pySpark and Scala languages, for which there are separate but
similar constructors. ETL jobs default to the G2 worker type, but you can
override this default with other supported worker type values (G1, G2, G4
and G8). ETL jobs defaults to Glue version 4.0, which you can override to 3.0.
The following ETL features are enabled by default:
`—enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.`
You can find more details about version, worker type and other features in
[Glue's public documentation](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-job.html).

Reference the pyspark-etl-jobs.test.ts and scalaspark-etl-jobs.test.ts unit tests
for examples of required-only and optional job parameters when creating these
types of jobs.

**Streaming Jobs**

Streaming jobs are similar to ETL jobs, except that they perform ETL on data
streams using the Apache Spark Structured Streaming framework. Some Spark
job features are not available to Streaming ETL jobs. They support Scala
and pySpark languages. PySpark streaming jobs default Python 3.9,
which you can override with any non-deprecated version of Python. It
defaults to the G2 worker type and Glue 4.0, both of which you can override.
The following best practice features are enabled by default:
`—enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log`.

Reference the pyspark-streaming-jobs.test.ts and scalaspark-streaming-jobs.test.ts 
unit tests for examples of required-only and optional job parameters when creating
these types of jobs.

**Flex Jobs**

The flexible execution class is appropriate for non-urgent jobs such as
pre-production jobs, testing, and one-time data loads. Flexible jobs default
to Glue version 3.0 and worker type `G_2X`. The following best practice
features are enabled by default:
`—enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log`

Reference the pyspark-flex-etl-jobs.test.ts and scalaspark-flex-etl-jobs.test.ts 
unit tests for examples of required-only and optional job parameters when creating
these types of jobs.

### Python Shell Jobs

Python shell jobs support a Python version that depends on the AWS Glue
version you use. These can be used to schedule and run tasks that don't
require an Apache Spark environment. Python shell jobs default to
Python 3.9 and a MaxCapacity of `0.0625`. Python 3.9 supports pre-loaded
analytics libraries using the `library-set=analytics` flag, which is
enabled by default.

Reference the pyspark-shell-job.test.ts unit tests for examples of 
required-only and optional job parameters when creating these types of jobs.

### Ray Jobs

Glue Ray jobs use worker type Z.2X and Glue version 4.0. These are not
overrideable since these are the only configuration that Glue Ray jobs
currently support. The runtime defaults to Ray2.4 and min workers defaults to 3.

Reference the ray-job.test.ts unit tests for examples of required-only and
optional job parameters when creating these types of jobs.

### Uploading scripts from the CDK app repository to S3

Similar to other L2 constructs, the Glue L2 automates uploading / updating
scripts to S3 via an optional fromAsset parameter pointing to a script
in the local file structure. You provide the existing S3 bucket and
path to which you'd like the script to be uploaded.

Reference the unit tests for examples of repo and S3 code target examples.

### Workflow Triggers

You can use Glue workflows to create and visualize complex
extract, transform, and load (ETL) activities involving multiple crawlers,
jobs, and triggers. Standalone triggers are an anti-pattern, so you must
create triggers from within a workflow using the L2 construct.

Within a workflow object, there are functions to create different
types of triggers with actions and predicates. You then add those triggers
to jobs.

StartOnCreation defaults to true for all trigger types, but you can
override it if you prefer for your trigger not to start on creation.

Reference the workflow-triggers.test.ts unit tests for examples of creating
workflows and triggers.

1. **On-Demand Triggers**

On-demand triggers can start glue jobs or crawlers. This construct provides
convenience functions to create on-demand crawler or job triggers. The constructor
takes an optional description parameter, but abstracts the requirement of an
actions list using the job or crawler objects using conditional types.

1. **Scheduled Triggers**

You can create scheduled triggers using cron expressions. This construct
provides daily, weekly, and monthly convenience functions,
as well as a custom function that allows you to create your own
custom timing using the [existing event Schedule class](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events.Schedule.html)
without having to build your own cron expressions. The L2 extracts
the expression that Glue requires from the Schedule object. The constructor
takes an optional description and a list of jobs or crawlers as actions.

#### **3. Notify  Event Triggers**

There are two types of notify event triggers: batching and non-batching.
For batching triggers, you must specify `BatchSize`. For non-batching
triggers, `BatchSize` defaults to 1. For both triggers, `BatchWindow`
defaults to 900 seconds, but you can override the window to align with
your workload's requirements.

#### **4. Conditional Triggers**

Conditional triggers have a predicate and actions associated with them.
The trigger actions are executed when the predicateCondition is true.

### Connection Properties

A `Connection` allows Glue jobs, crawlers and development endpoints to access
certain types of data stores.

***Secrets Management
    **You must specify JDBC connection credentials in Secrets Manager and
    provide the Secrets Manager Key name as a property to the job connection.

* **Networking - the CDK determines the best fit subnet for Glue connection
configuration
    **The prior version of the glue-alpha-module requires the developer to
    specify the subnet of the Connection when it’s defined. Now, you can still
    specify the specific subnet you want to use, but are no longer required
    to. You are only required to provide a VPC and either a public or private
    subnet selection. Without a specific subnet provided, the L2 leverages the
    existing [EC2 Subnet Selection](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_ec2/SubnetSelection.html)
    library to make the best choice selection for the subnet.

## Public FAQ

### What are we launching today?

We’re launching new features to an AWS CDK Glue L2 Construct to provide
best-practice defaults and convenience methods to create Glue Jobs, Connections,
Triggers, Workflows, and the underlying permissions and configuration.

### Why should I use this Construct?

Developers should use this Construct to reduce the amount of boilerplate
code and complexity each individual has to navigate, and make it easier to
create best-practice Glue resources.

### What’s not in scope?

Glue Crawlers and other resources that are now managed by the AWS LakeFormation
team are not in scope for this effort. Developers should use existing methods
to create these resources, and the new Glue L2 construct assumes they already
exist as inputs. While best practice is for application and infrastructure code
to be as close as possible for teams using fully-implemented DevOps mechanisms,
in practice these ETL scripts are likely managed by a data science team who
know Python or Scala and don’t necessarily own or manage their own
infrastructure deployments. We want to meet developers where they are, and not
assume that all of the code resides in the same repository, Developers can
automate this themselves via the CDK, however, if they do own both.

Validating Glue version and feature use per AWS region at synth time is also
not in scope. AWS’ intention is for all features to eventually be propagated to
all Global regions, so the complexity involved in creating and updating region-
specific configuration to match shifting feature sets does not out-weigh the
likelihood that a developer will use this construct to deploy resources to a
region without a particular new feature to a region that doesn’t yet support
it without researching or manually attempting to use that feature before
developing it via IaC. The developer will, of course, still get feedback from
the underlying Glue APIs as CloudFormation deploys the resources similar to the
current CDK L1 Glue experience.
