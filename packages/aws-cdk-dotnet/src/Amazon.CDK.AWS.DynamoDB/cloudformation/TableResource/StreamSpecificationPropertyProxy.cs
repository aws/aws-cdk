using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IStreamSpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.StreamSpecificationProperty")]
    internal class StreamSpecificationPropertyProxy : DeputyBase, IStreamSpecificationProperty
    {
        private StreamSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TableResource.StreamSpecificationProperty.StreamViewType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-streamspecification.html#cfn-dynamodb-streamspecification-streamviewtype </remarks>
        [JsiiProperty("streamViewType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object StreamViewType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}