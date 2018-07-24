using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3
{
    /// <summary>A key to an S3 object.</summary>
    [JsiiClass(typeof(ObjectKey), "@aws-cdk/aws-s3.ObjectKey", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ObjectKey : Token
    {
        public ObjectKey(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ObjectKey(ByRefValue reference): base(reference)
        {
        }

        protected ObjectKey(DeputyProps props): base(props)
        {
        }
    }
}