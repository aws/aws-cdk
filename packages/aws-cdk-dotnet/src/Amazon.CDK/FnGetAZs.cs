using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// The intrinsic function Fn::GetAZs returns an array that lists Availability Zones for a
    /// specified region. Because customers have access to different Availability Zones, the intrinsic
    /// function Fn::GetAZs enables template authors to write templates that adapt to the calling
    /// user's access. That way you don't have to hard-code a full list of Availability Zones for a
    /// specified region.
    /// </summary>
    [JsiiClass(typeof(FnGetAZs), "@aws-cdk/cdk.FnGetAZs", "[{\"name\":\"region\",\"type\":{\"primitive\":\"string\",\"optional\":true}}]")]
    public class FnGetAZs : Fn
    {
        public FnGetAZs(string region): base(new DeputyProps(new object[]{region}))
        {
        }

        protected FnGetAZs(ByRefValue reference): base(reference)
        {
        }

        protected FnGetAZs(DeputyProps props): base(props)
        {
        }
    }
}