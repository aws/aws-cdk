using Amazon.CDK;
using Amazon.CDK.AWS.GameLift.cloudformation.BuildResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GameLift.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html </remarks>
    public class BuildResourceProps : DeputyBase, IBuildResourceProps
    {
        /// <summary>``AWS::GameLift::Build.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-name </remarks>
        [JsiiProperty("buildName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BuildName
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Build.StorageLocation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-storagelocation </remarks>
        [JsiiProperty("storageLocation", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-gamelift.cloudformation.BuildResource.S3LocationProperty\"}]},\"optional\":true}", true)]
        public object StorageLocation
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Build.Version``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-build.html#cfn-gamelift-build-version </remarks>
        [JsiiProperty("version", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Version
        {
            get;
            set;
        }
    }
}