using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WorkSpaces.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html </remarks>
    [JsiiInterface(typeof(IWorkspaceResourceProps), "@aws-cdk/aws-workspaces.cloudformation.WorkspaceResourceProps")]
    public interface IWorkspaceResourceProps
    {
        /// <summary>``AWS::WorkSpaces::Workspace.BundleId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-bundleid </remarks>
        [JsiiProperty("bundleId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object BundleId
        {
            get;
            set;
        }

        /// <summary>``AWS::WorkSpaces::Workspace.DirectoryId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-directoryid </remarks>
        [JsiiProperty("directoryId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DirectoryId
        {
            get;
            set;
        }

        /// <summary>``AWS::WorkSpaces::Workspace.UserName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-username </remarks>
        [JsiiProperty("userName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object UserName
        {
            get;
            set;
        }

        /// <summary>``AWS::WorkSpaces::Workspace.RootVolumeEncryptionEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-rootvolumeencryptionenabled </remarks>
        [JsiiProperty("rootVolumeEncryptionEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RootVolumeEncryptionEnabled
        {
            get;
            set;
        }

        /// <summary>``AWS::WorkSpaces::Workspace.UserVolumeEncryptionEnabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-uservolumeencryptionenabled </remarks>
        [JsiiProperty("userVolumeEncryptionEnabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object UserVolumeEncryptionEnabled
        {
            get;
            set;
        }

        /// <summary>``AWS::WorkSpaces::Workspace.VolumeEncryptionKey``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-volumeencryptionkey </remarks>
        [JsiiProperty("volumeEncryptionKey", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VolumeEncryptionKey
        {
            get;
            set;
        }
    }
}