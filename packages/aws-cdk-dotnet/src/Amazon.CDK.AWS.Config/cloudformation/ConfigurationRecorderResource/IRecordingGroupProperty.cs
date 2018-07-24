using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Config.cloudformation.ConfigurationRecorderResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html </remarks>
    [JsiiInterface(typeof(IRecordingGroupProperty), "@aws-cdk/aws-config.cloudformation.ConfigurationRecorderResource.RecordingGroupProperty")]
    public interface IRecordingGroupProperty
    {
        /// <summary>``ConfigurationRecorderResource.RecordingGroupProperty.AllSupported``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-allsupported </remarks>
        [JsiiProperty("allSupported", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AllSupported
        {
            get;
            set;
        }

        /// <summary>``ConfigurationRecorderResource.RecordingGroupProperty.IncludeGlobalResourceTypes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-includeglobalresourcetypes </remarks>
        [JsiiProperty("includeGlobalResourceTypes", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object IncludeGlobalResourceTypes
        {
            get;
            set;
        }

        /// <summary>``ConfigurationRecorderResource.RecordingGroupProperty.ResourceTypes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-config-configurationrecorder-recordinggroup.html#cfn-config-configurationrecorder-recordinggroup-resourcetypes </remarks>
        [JsiiProperty("resourceTypes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object ResourceTypes
        {
            get;
            set;
        }
    }
}