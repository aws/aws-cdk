using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// An Amazon Resource Name (ARN).
    /// http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
    /// </summary>
    [JsiiClass(typeof(Arn), "@aws-cdk/cdk.Arn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Arn : Token
    {
        public Arn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Arn(ByRefValue reference): base(reference)
        {
        }

        protected Arn(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Creates an ARN from components.
        /// If any component is the empty string,
        /// an empty string will be inserted into the generated ARN
        /// at the location that component corresponds to.
        /// </summary>
        [JsiiMethod("fromComponents", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}", "[{\"name\":\"components\",\"type\":{\"fqn\":\"@aws-cdk/cdk.ArnComponents\"}}]")]
        public static Arn FromComponents(IArnComponents components)
        {
            return InvokeStaticMethod<Arn>(typeof(Arn), new object[]{components});
        }

        /// <summary>
        /// Given an ARN, parses it and returns components.
        /// 
        /// The ARN it will be parsed and validated. The separator (`sep`) will be
        /// set to '/' if the 6th component includes a '/', in which case, `resource`
        /// will be set to the value before the '/' and `resourceName` will be the
        /// rest. In case there is no '/', `resource` will be set to the 6th
        /// components and `resourceName` will be set to the rest of the string.
        /// </summary>
        /// <returns>
        /// an ArnComponents object which allows access to the various
        /// components of the ARN.
        /// </returns>
        [JsiiMethod("parse", "{\"fqn\":\"@aws-cdk/cdk.ArnComponents\"}", "[{\"name\":\"arn\",\"type\":{\"primitive\":\"string\"}}]")]
        public static IArnComponents Parse(string arn)
        {
            return InvokeStaticMethod<IArnComponents>(typeof(Arn), new object[]{arn});
        }

        /// <summary>
        /// Given a Token evaluating to ARN, parses it and returns components.
        /// 
        /// The ARN cannot be validated, since we don't have the actual value yet
        /// at the time of this function call. You will have to know the separator
        /// and the type of ARN.
        /// 
        /// The resulting `ArnComponents` object will contain tokens for the
        /// subexpressions of the ARN, not string literals.
        /// 
        /// WARNING: this function cannot properly parse the complete final
        /// resourceName (path) out of ARNs that use '/' to both separate the
        /// 'resource' from the 'resourceName' AND to subdivide the resourceName
        /// further. For example, in S3 ARNs:
        /// 
        ///       arn:aws:s3:::my_corporate_bucket/path/to/exampleobject.png
        /// 
        /// After parsing the resourceName will not contain 'path/to/exampleobject.png'
        /// but simply 'path'. This is a limitation because there is no slicing
        /// functionality in CloudFormation templates.
        /// </summary>
        /// <param name = "arn">The input token that contains an ARN</param>
        /// <param name = "sep">The separator used to separate resource from resourceName</param>
        /// <param name = "hasName">
        /// Whether there is a name component in the ARN at all.
        /// For example, SNS Topics ARNs have the 'resource' component contain the
        /// topic name, and no 'resourceName' component.
        /// </param>
        /// <returns>
        /// an ArnComponents object which allows access to the various
        /// components of the ARN.
        /// </returns>
        [JsiiMethod("parseToken", "{\"fqn\":\"@aws-cdk/cdk.ArnComponents\"}", "[{\"name\":\"arn\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Token\"}},{\"name\":\"sep\",\"type\":{\"primitive\":\"string\",\"optional\":true}},{\"name\":\"hasName\",\"type\":{\"primitive\":\"boolean\",\"optional\":true}}]")]
        public static IArnComponents ParseToken(Token arn, string sep, bool? hasName)
        {
            return InvokeStaticMethod<IArnComponents>(typeof(Arn), new object[]{arn, sep, hasName});
        }
    }
}