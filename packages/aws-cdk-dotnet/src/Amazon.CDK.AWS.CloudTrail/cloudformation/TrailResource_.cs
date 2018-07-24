using Amazon.CDK;
using Amazon.CDK.AWS.CloudTrail;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudTrail.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudtrail-trail.html </remarks>
    [JsiiClass(typeof(TrailResource_), "@aws-cdk/aws-cloudtrail.cloudformation.TrailResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudtrail.cloudformation.TrailResourceProps\"}}]")]
    public class TrailResource_ : Resource
    {
        public TrailResource_(Construct parent, string name, ITrailResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TrailResource_(ByRefValue reference): base(reference)
        {
        }

        protected TrailResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TrailResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("trailArn", "{\"fqn\":\"@aws-cdk/aws-cloudtrail.TrailArn\"}")]
        public virtual TrailArn TrailArn
        {
            get => GetInstanceProperty<TrailArn>();
        }

        /// <remarks>cloudformation_attribute: SnsTopicArn</remarks>
        [JsiiProperty("trailSnsTopicArn", "{\"fqn\":\"@aws-cdk/aws-cloudtrail.TrailSnsTopicArn\"}")]
        public virtual TrailSnsTopicArn TrailSnsTopicArn
        {
            get => GetInstanceProperty<TrailSnsTopicArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}