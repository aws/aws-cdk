using Amazon.CDK;
using Amazon.CDK.AWS.StepFunctions;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.StepFunctions.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html </remarks>
    [JsiiClass(typeof(ActivityResource), "@aws-cdk/aws-stepfunctions.cloudformation.ActivityResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-stepfunctions.cloudformation.ActivityResourceProps\"}}]")]
    public class ActivityResource : Resource
    {
        public ActivityResource(Construct parent, string name, IActivityResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ActivityResource(ByRefValue reference): base(reference)
        {
        }

        protected ActivityResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ActivityResource));
        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("activityName", "{\"fqn\":\"@aws-cdk/aws-stepfunctions.ActivityName\"}")]
        public virtual ActivityName ActivityName
        {
            get => GetInstanceProperty<ActivityName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}