using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// The intrinsic function Fn::Base64 returns the Base64 representation of the input string.
    /// This function is typically used to pass encoded data to Amazon EC2 instances by way of
    /// the UserData property.
    /// </summary>
    [JsiiClass(typeof(FnBase64), "@aws-cdk/cdk.FnBase64", "[{\"name\":\"data\",\"type\":{\"primitive\":\"any\"}}]")]
    public class FnBase64 : Fn
    {
        public FnBase64(object data): base(new DeputyProps(new object[]{data}))
        {
        }

        protected FnBase64(ByRefValue reference): base(reference)
        {
        }

        protected FnBase64(DeputyProps props): base(props)
        {
        }
    }
}