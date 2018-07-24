using Amazon.CDK;
using Amazon.CDK.AWS.SSM.cloudformation.AssociationResource;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SSM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html </remarks>
    [JsiiInterface(typeof(IAssociationResourceProps), "@aws-cdk/aws-ssm.cloudformation.AssociationResourceProps")]
    public interface IAssociationResourceProps
    {
        /// <summary>``AWS::SSM::Association.DocumentName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-name </remarks>
        [JsiiProperty("documentName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DocumentName
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.AssociationName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-associationname </remarks>
        [JsiiProperty("associationName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AssociationName
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.DocumentVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-documentversion </remarks>
        [JsiiProperty("documentVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DocumentVersion
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.InstanceId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-instanceid </remarks>
        [JsiiProperty("instanceId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstanceId
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.OutputLocation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-outputlocation </remarks>
        [JsiiProperty("outputLocation", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.AssociationResource.InstanceAssociationOutputLocationProperty\"}]},\"optional\":true}")]
        object OutputLocation
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.AssociationResource.ParameterValuesProperty\"}]}}}}]},\"optional\":true}")]
        object Parameters
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.ScheduleExpression``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-scheduleexpression </remarks>
        [JsiiProperty("scheduleExpression", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScheduleExpression
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::Association.Targets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-association.html#cfn-ssm-association-targets </remarks>
        [JsiiProperty("targets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.AssociationResource.TargetProperty\"}]}}}}]},\"optional\":true}")]
        object Targets
        {
            get;
            set;
        }
    }
}