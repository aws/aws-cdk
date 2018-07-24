using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalabletarget.html </remarks>
    [JsiiClass(typeof(ScalableTargetResource_), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalableTargetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalableTargetResourceProps\"}}]")]
    public class ScalableTargetResource_ : Resource
    {
        public ScalableTargetResource_(Construct parent, string name, IScalableTargetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ScalableTargetResource_(ByRefValue reference): base(reference)
        {
        }

        protected ScalableTargetResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ScalableTargetResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}