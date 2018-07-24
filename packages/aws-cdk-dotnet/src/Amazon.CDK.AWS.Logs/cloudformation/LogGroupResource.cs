using Amazon.CDK;
using Amazon.CDK.AWS.Logs;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html </remarks>
    [JsiiClass(typeof(LogGroupResource), "@aws-cdk/aws-logs.cloudformation.LogGroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.cloudformation.LogGroupResourceProps\",\"optional\":true}}]")]
    public class LogGroupResource : Resource
    {
        public LogGroupResource(Construct parent, string name, ILogGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LogGroupResource(ByRefValue reference): base(reference)
        {
        }

        protected LogGroupResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LogGroupResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("logGroupArn", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroupArn\"}")]
        public virtual LogGroupArn LogGroupArn
        {
            get => GetInstanceProperty<LogGroupArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}