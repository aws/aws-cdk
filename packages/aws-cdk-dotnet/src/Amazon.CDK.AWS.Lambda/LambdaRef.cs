using Amazon.CDK;
using Amazon.CDK.AWS.CloudWatch;
using Amazon.CDK.AWS.Events;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.Logs;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(LambdaRef), "@aws-cdk/aws-lambda.LambdaRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class LambdaRef : Construct, IIEventRuleTargetProps, IILogSubscriptionDestination
    {
        protected LambdaRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected LambdaRef(ByRefValue reference): base(reference)
        {
        }

        protected LambdaRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The name of the function.</summary>
        [JsiiProperty("functionName", "{\"fqn\":\"@aws-cdk/aws-lambda.FunctionName\"}")]
        public virtual FunctionName FunctionName
        {
            get => GetInstanceProperty<FunctionName>();
        }

        /// <summary>The ARN fo the function.</summary>
        [JsiiProperty("functionArn", "{\"fqn\":\"@aws-cdk/aws-lambda.FunctionArn\"}")]
        public virtual FunctionArn FunctionArn
        {
            get => GetInstanceProperty<FunctionArn>();
        }

        /// <summary>The IAM role associated with this function.</summary>
        [JsiiProperty("role", "{\"fqn\":\"@aws-cdk/aws-iam.Role\",\"optional\":true}")]
        public virtual Role Role
        {
            get => GetInstanceProperty<Role>();
        }

        /// <summary>
        /// Whether the addPermission() call adds any permissions
        /// 
        /// True for new Lambdas, false for imported Lambdas (they might live in different accounts).
        /// </summary>
        [JsiiProperty("canCreatePermissions", "{\"primitive\":\"boolean\"}")]
        protected virtual bool CanCreatePermissions
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>
        /// Returns a RuleTarget that can be used to trigger this Lambda as a
        /// result from a CloudWatch event.
        /// </summary>
        [JsiiProperty("eventRuleTarget", "{\"fqn\":\"@aws-cdk/aws-events.EventRuleTarget\"}")]
        public virtual IEventRuleTarget EventRuleTarget
        {
            get => GetInstanceProperty<IEventRuleTarget>();
        }

        /// <summary>
        /// Creates a Lambda function object which represents a function not defined
        /// within this stack.
        /// 
        ///       Lambda.import(this, 'MyImportedFunction', { lambdaArn: new LambdaArn('arn:aws:...') });
        /// </summary>
        /// <param name = "parent">The parent construct</param>
        /// <param name = "name">The name of the lambda construct</param>
        /// <param name = "@ref">
        /// A reference to a Lambda function. Can be created manually (see
        /// example above) or obtained through a call to `lambda.export()`.
        /// </param>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"ref\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRefProps\"}}]")]
        public static LambdaRef Import(Construct parent, string name, ILambdaRefProps @ref)
        {
            return InvokeStaticMethod<LambdaRef>(typeof(LambdaRef), new object[]{parent, name, @ref});
        }

        /// <summary>Return the given named metric for this Lambda</summary>
        [JsiiMethod("metricAll", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"metricName\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAll(string metricName, IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{metricName, props});
        }

        /// <summary>Metric for the number of Errors executing all Lambdas</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricAllErrors", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAllErrors(IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{props});
        }

        /// <summary>Metric for the Duration executing all Lambdas</summary>
        /// <remarks>default: average over 5 minutes</remarks>
        [JsiiMethod("metricAllDuration", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAllDuration(IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{props});
        }

        /// <summary>Metric for the number of invocations of all Lambdas</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricAllInvocations", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAllInvocations(IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{props});
        }

        /// <summary>Metric for the number of throttled invocations of all Lambdas</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricAllThrottles", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAllThrottles(IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{props});
        }

        /// <summary>Metric for the number of concurrent executions across all Lambdas</summary>
        /// <remarks>default: max over 5 minutes</remarks>
        [JsiiMethod("metricAllConcurrentExecutions", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAllConcurrentExecutions(IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{props});
        }

        /// <summary>Metric for the number of unreserved concurrent executions across all Lambdas</summary>
        /// <remarks>default: max over 5 minutes</remarks>
        [JsiiMethod("metricAllUnreservedConcurrentExecutions", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public static Metric MetricAllUnreservedConcurrentExecutions(IMetricCustomization props)
        {
            return InvokeStaticMethod<Metric>(typeof(LambdaRef), new object[]{props});
        }

        /// <summary>Adds a permission to the Lambda resource policy.</summary>
        /// <param name = "name">A name for the permission construct</param>
        [JsiiMethod("addPermission", null, "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"permission\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaPermission\"}}]")]
        public virtual void AddPermission(string name, ILambdaPermission permission)
        {
            InvokeInstanceVoidMethod(new object[]{name, permission});
        }

        [JsiiMethod("addToRolePolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToRolePolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

        /// <summary>Return the given named metric for this Lambda</summary>
        [JsiiMethod("metric", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"metricName\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric Metric(string metricName, IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{metricName, props});
        }

        /// <summary>Metric for the Errors executing this Lambda</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricErrors", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricErrors(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>Metric for the Duration of this Lambda</summary>
        /// <remarks>default: average over 5 minutes</remarks>
        [JsiiMethod("metricDuration", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricDuration(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>Metric for the number of invocations of this Lambda</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricInvocations", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricInvocations(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>Metric for the number of throttled invocations of this Lambda</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricThrottles", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricThrottles(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>
        /// Return the properties required to send subscription events to this destination.
        /// 
        /// If necessary, the destination can use the properties of the SubscriptionFilter
        /// object itself to configure its permissions to allow the subscription to write
        /// to it.
        /// 
        /// The destination may reconfigure its own permissions in response to this
        /// function call.
        /// </summary>
        [JsiiMethod("logSubscriptionDestination", "{\"fqn\":\"@aws-cdk/aws-logs.LogSubscriptionDestination\"}", "[{\"name\":\"sourceLogGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}}]")]
        public virtual ILogSubscriptionDestination LogSubscriptionDestination(LogGroup sourceLogGroup)
        {
            return InvokeInstanceMethod<ILogSubscriptionDestination>(new object[]{sourceLogGroup});
        }

        /// <summary>Export this Function (without the role)</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRefProps\"}", "[]")]
        public virtual ILambdaRefProps Export()
        {
            return InvokeInstanceMethod<ILambdaRefProps>(new object[]{});
        }
    }
}