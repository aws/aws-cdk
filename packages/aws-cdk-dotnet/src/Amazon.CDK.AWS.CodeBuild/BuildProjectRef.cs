using Amazon.CDK;
using Amazon.CDK.AWS.CloudWatch;
using Amazon.CDK.AWS.Events;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>
    /// Represents a reference to a CodeBuild Project.
    /// 
    /// If you're managing the Project alongside the rest of your CDK resources,
    /// use the {@link BuildProject} class.
    /// 
    /// If you want to reference an already existing Project
    /// (or one defined in a different CDK Stack),
    /// use the {@link import} method.
    /// </summary>
    [JsiiClass(typeof(BuildProjectRef), "@aws-cdk/aws-codebuild.BuildProjectRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class BuildProjectRef : Construct, IIEventRuleTargetProps
    {
        protected BuildProjectRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected BuildProjectRef(ByRefValue reference): base(reference)
        {
        }

        protected BuildProjectRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of this Project. </summary>
        [JsiiProperty("projectArn", "{\"fqn\":\"@aws-cdk/aws-codebuild.ProjectArn\"}")]
        public virtual ProjectArn ProjectArn
        {
            get => GetInstanceProperty<ProjectArn>();
        }

        /// <summary>The human-visible name of this Project. </summary>
        [JsiiProperty("projectName", "{\"fqn\":\"@aws-cdk/aws-codebuild.ProjectName\"}")]
        public virtual ProjectName ProjectName
        {
            get => GetInstanceProperty<ProjectName>();
        }

        /// <summary>The IAM service Role of this Project. Undefined for imported Projects. </summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
        }

        /// <summary>Allows using build projects as event rule targets.</summary>
        [JsiiProperty("eventRuleTarget", "{\"fqn\":\"@aws-cdk/aws-events.EventRuleTarget\"}")]
        public virtual IEventRuleTarget EventRuleTarget
        {
            get => GetInstanceProperty<IEventRuleTarget>();
        }

        /// <summary>
        /// Import a Project defined either outside the CDK,
        /// or in a different CDK Stack
        /// (and exported using the {@link export} method).
        /// </summary>
        /// <param name = "parent">the parent Construct for this Construct</param>
        /// <param name = "name">the logical name of this Construct</param>
        /// <param name = "props">the properties of the referenced Project</param>
        /// <returns>a reference to the existing Project</returns>
        /// <remarks>
        /// note: if you're importing a CodeBuild Project for use
        /// in a CodePipeline, make sure the existing Project
        /// has permissions to access the S3 Bucket of that Pipeline -
        /// otherwise, builds in that Pipeline will always fail.
        /// </remarks>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProjectRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProjectRefProps\"}}]")]
        public static BuildProjectRef Import(Construct parent, string name, IBuildProjectRefProps props)
        {
            return InvokeStaticMethod<BuildProjectRef>(typeof(BuildProjectRef), new object[]{parent, name, props});
        }

        /// <summary>Export this Project. Allows referencing this Project in a different CDK Stack.</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildProjectRefProps\"}", "[]")]
        public virtual IBuildProjectRefProps Export()
        {
            return InvokeInstanceMethod<IBuildProjectRefProps>(new object[]{});
        }

        /// <summary>
        /// Defines a CloudWatch event rule triggered when the build project state
        /// changes. You can filter specific build status events using an event
        /// pattern filter on the `build-status` detail field:
        /// 
        ///       const rule = project.onStateChange('OnBuildStarted', target);
        ///       rule.addEventPattern({
        ///           detail: {
        ///               'build-status': [
        ///                   "IN_PROGRESS",
        ///                   "SUCCEEDED",
        ///                   "FAILED",
        ///                   "STOPPED"
        ///               ]
        ///           }
        ///       });
        /// 
        /// You can also use the methods `onBuildFailed` and `onBuildSucceeded` to define rules for
        /// these specific state changes.
        /// </summary>
        /// <remarks>see: https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html</remarks>
        [JsiiMethod("onStateChange", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnStateChange(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>
        /// Defines a CloudWatch event rule that triggers upon phase change of this
        /// build project.
        /// </summary>
        /// <remarks>see: https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html</remarks>
        [JsiiMethod("onPhaseChange", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnPhaseChange(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines an event rule which triggers when a build starts.</summary>
        [JsiiMethod("onBuildStarted", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnBuildStarted(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines an event rule which triggers when a build fails.</summary>
        [JsiiMethod("onBuildFailed", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnBuildFailed(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>Defines an event rule which triggers when a build completes successfully.</summary>
        [JsiiMethod("onBuildSucceeded", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnBuildSucceeded(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <param name = "metricName">The name of the metric</param>
        /// <param name = "props">Customization properties</param>
        /// <returns>a CloudWatch metric associated with this build project.</returns>
        [JsiiMethod("metric", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"metricName\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\"}}]")]
        public virtual Metric Metric(string metricName, IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{metricName, props});
        }

        /// <summary>
        /// Measures the number of builds triggered.
        /// 
        /// Units: Count
        /// 
        /// Valid CloudWatch statistics: Sum
        /// </summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricBuilds", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricBuilds(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>
        /// Measures the duration of all builds over time.
        /// 
        /// Units: Seconds
        /// 
        /// Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
        /// </summary>
        /// <remarks>default: average over 5 minutes</remarks>
        [JsiiMethod("metricDuration", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricDuration(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>
        /// Measures the number of successful builds.
        /// 
        /// Units: Count
        /// 
        /// Valid CloudWatch statistics: Sum
        /// </summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricSucceededBuilds", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricSucceededBuilds(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>
        /// Measures the number of builds that failed because of client error or
        /// because of a timeout.
        /// 
        /// Units: Count
        /// 
        /// Valid CloudWatch statistics: Sum
        /// </summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricFailedBuilds", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricFailedBuilds(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }
    }
}