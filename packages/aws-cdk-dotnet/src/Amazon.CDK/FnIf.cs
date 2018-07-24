using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Returns one value if the specified condition evaluates to true and another value if the
    /// specified condition evaluates to false. Currently, AWS CloudFormation supports the Fn::If
    /// intrinsic function in the metadata attribute, update policy attribute, and property values
    /// in the Resources section and Outputs sections of a template. You can use the AWS::NoValue
    /// pseudo parameter as a return value to remove the corresponding property.
    /// </summary>
    [JsiiClass(typeof(FnIf), "@aws-cdk/cdk.FnIf", "[{\"name\":\"condition\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"valueIfTrue\",\"type\":{\"primitive\":\"any\"}},{\"name\":\"valueIfFalse\",\"type\":{\"primitive\":\"any\"}}]")]
    public class FnIf : FnCondition
    {
        public FnIf(string condition, object valueIfTrue, object valueIfFalse): base(new DeputyProps(new object[]{condition, valueIfTrue, valueIfFalse}))
        {
        }

        protected FnIf(ByRefValue reference): base(reference)
        {
        }

        protected FnIf(DeputyProps props): base(props)
        {
        }
    }
}