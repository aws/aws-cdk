using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volumeattachment.html </remarks>
    [JsiiClass(typeof(VolumeAttachmentResource), "@aws-cdk/aws-ec2.cloudformation.VolumeAttachmentResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.VolumeAttachmentResourceProps\"}}]")]
    public class VolumeAttachmentResource : Resource
    {
        public VolumeAttachmentResource(Construct parent, string name, IVolumeAttachmentResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected VolumeAttachmentResource(ByRefValue reference): base(reference)
        {
        }

        protected VolumeAttachmentResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(VolumeAttachmentResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}