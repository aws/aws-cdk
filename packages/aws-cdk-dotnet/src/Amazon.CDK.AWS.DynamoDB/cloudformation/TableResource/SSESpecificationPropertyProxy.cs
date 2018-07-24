using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html </remarks>
    [JsiiInterfaceProxy(typeof(ISSESpecificationProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.SSESpecificationProperty")]
    internal class SSESpecificationPropertyProxy : DeputyBase, ISSESpecificationProperty
    {
        private SSESpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TableResource.SSESpecificationProperty.SSEEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html#cfn-dynamodb-table-ssespecification-sseenabled </remarks>
        [JsiiProperty("sseEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SseEnabled
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}