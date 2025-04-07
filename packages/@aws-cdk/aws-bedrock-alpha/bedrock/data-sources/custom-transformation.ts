/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { Stack } from 'aws-cdk-lib';
import { CfnDataSource } from 'aws-cdk-lib/aws-bedrock';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Defines the step in the ingestion process where the custom transformation is applied.
 */
export enum TransformationStep {
  /**
   * Processes documents after they have been converted into chunks.
   * This allows for custom chunk-level metadata addition or custom post-chunking logic.
   */
  POST_CHUNKING = 'POST_CHUNKING',
}

/**
 * Properties for configuring a Lambda-based custom transformation.
 */
export interface LambdaCustomTransformationProps {
  /**
   * The Lambda function to use for custom document processing.
   */
  readonly lambdaFunction: IFunction;

  /**
   * An S3 bucket URL/path to store input documents for Lambda processing
   * and to store the output of the processed documents.
   * @example "s3://my-bucket/chunk-processor/"
   */
  readonly s3BucketUri: string;

  // Commented as only one supported at the time this code is written.
  // /**
  //  * When in the ingestion process to apply the transformation step.
  //  * @default TransformationStep.POST_CHUNKING
  //  */
  // readonly stepToApply?: TransformationStep;
}

/**
 * Represents a custom transformation configuration for a data source ingestion.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-chunking-parsing.html#kb-custom-transformation
 */
export abstract class CustomTransformation {

  // ------------------------------------------------------
  // Lambda Transformation Strategy
  // ------------------------------------------------------
  /**
   * This feature allows you to use a Lambda function to inject your own logic
   * into the knowledge base ingestion process.
   * @see https://github.com/aws-samples/amazon-bedrock-samples/blob/main/knowledge-bases/features-examples/02-optimizing-accuracy-retrieved-results/advanced_chunking_options.ipynb
   */
  public static lambda(props: LambdaCustomTransformationProps): CustomTransformation {

    class LambdaCustomTransformation extends CustomTransformation {
      public readonly configuration = {
        intermediateStorage: {
          s3Location: {
            uri: props.s3BucketUri,
          },
        },
        transformations: [
          {
            stepToApply: TransformationStep.POST_CHUNKING,
            // To uncomment when more steps are available
            // stepToApply: props.stepToApply ?? TransformationStep.POST_CHUNKING,
            transformationFunction: {
              transformationLambdaConfiguration: {
                lambdaArn: props.lambdaFunction.functionArn,
              },
            },
          },
        ],
      };
      public generatePolicyStatements(scope: Construct): PolicyStatement[] {
        return [
          new PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [`${props.lambdaFunction.functionArn}:*`],
            conditions: {
              StringEquals: {
                'aws:ResourceAccount': Stack.of(scope).account,
              },
            },
          }),
        ];
      }
    }
    return new LambdaCustomTransformation();
  }
  // ------------------------------------------------------
  // Properties
  // ------------------------------------------------------
  /**
   * The CloudFormation property representation of this custom transformation configuration.
   */
  public abstract configuration: CfnDataSource.CustomTransformationConfigurationProperty;

  public abstract generatePolicyStatements(scope: Construct): PolicyStatement[];

}