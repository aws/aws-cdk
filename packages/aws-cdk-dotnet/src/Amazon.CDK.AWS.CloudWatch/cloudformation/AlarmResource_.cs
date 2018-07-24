using Amazon.CDK;
using Amazon.CDK.AWS.CloudWatch;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudWatch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cw-alarm.html </remarks>
    [JsiiClass(typeof(AlarmResource_), "@aws-cdk/aws-cloudwatch.cloudformation.AlarmResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.cloudformation.AlarmResourceProps\"}}]")]
    public class AlarmResource_ : Resource
    {
        public AlarmResource_(Construct parent, string name, IAlarmResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected AlarmResource_(ByRefValue reference): base(reference)
        {
        }

        protected AlarmResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(AlarmResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("alarmArn", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.AlarmArn\"}")]
        public virtual AlarmArn AlarmArn
        {
            get => GetInstanceProperty<AlarmArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}