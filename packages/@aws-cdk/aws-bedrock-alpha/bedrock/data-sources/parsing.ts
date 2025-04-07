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

import { CfnDataSource } from 'aws-cdk-lib/aws-bedrock';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DEFAULT_PARSING_PROMPT } from './default-parsing-prompt';
import { IInvokable } from '../models';

export enum ParsingModality {
  /**
   * Specifies whether to enable parsing of multimodal data, including both text and/or images.
   */
  MULTIMODAL = 'MULTIMODAL',
}
/**
 * Enum representing the types of parsing strategies available for Amazon Bedrock Knowledge Bases.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-advanced-parsing.html
 */
export enum ParsingStategyType {
  /**
   * Uses a Bedrock Foundation Model for advanced parsing of non-textual information from documents.
   */
  FOUNDATION_MODEL = 'BEDROCK_FOUNDATION_MODEL',
  /**
   * Processes multimodal data using Bedrock Data Automation (BDA). It leverages
   * generative AI to automate the transformation of multi-modal data into structured formats.
   * If you choose a foundation model or Amazon Bedrock Data Automation for parsing and it fails
   * to parse a file, the Amazon Bedrock default parser is used instead.
   */
  DATA_AUTOMATION = 'BEDROCK_DATA_AUTOMATION',
}

/**
 * Properties for configuring a Foundation Model parsing strategy.
 */
export interface FoundationModelParsingStategyProps {
  /**
   * The Foundation Model to use for parsing non-textual information.
   * Currently supported models are Claude 3 Sonnet and Claude 3 Haiku.
   */
  readonly parsingModel: IInvokable;

  /**
   * Custom prompt to instruct the parser on how to interpret the document.
   *
   * @default - Uses the default instruction prompt as provided in the AWS Console.
   */
  readonly parsingPrompt?: string;

  /**
   * Specifies whether to enable parsing of multimodal data, including both text and/or images.
   *
   * @default undefined - Text only
   */
  readonly parsingModality?: ParsingModality;
}

/**
 * Represents an advanced parsing strategy configuration for Knowledge Base ingestion.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-chunking-parsing.html#kb-advanced-parsing
 */
export abstract class ParsingStategy {
  // ------------------------------------------------------
  // FM Parsing Strategy
  // ------------------------------------------------------
  /**
   * Creates a Foundation Model-based parsing strategy for extracting non-textual information
   * from documents such as tables and charts.
   * - Additional costs apply when using advanced parsing due to foundation model usage.
   * - There are limits on file types (PDF) and total data that can be parsed using advanced parsing.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-ds.html#kb-ds-supported-doc-formats-limits
   */
  public static foundationModel(props: FoundationModelParsingStategyProps): ParsingStategy {
    class FoundationModelTransformation extends ParsingStategy {
      /** The CloudFormation property representation of this configuration */
      public readonly configuration = {
        bedrockFoundationModelConfiguration: {
          modelArn: props.parsingModel.invokableArn,
          parsingPrompt: {
            parsingPromptText: props.parsingPrompt ?? DEFAULT_PARSING_PROMPT,
          },
        },
        parsingStrategy: ParsingStategyType.FOUNDATION_MODEL,
      };

      public generatePolicyStatements(): PolicyStatement[] {
        return [
          new PolicyStatement({
            actions: ['bedrock:InvokeModel'],
            resources: [props.parsingModel.invokableArn],
          }),
        ];
      }
    }

    return new FoundationModelTransformation();
  }
  // ------------------------------------------------------
  // Properties
  // ------------------------------------------------------
  /** The CloudFormation property representation of this configuration */
  public abstract configuration: CfnDataSource.ParsingConfigurationProperty;

  public abstract generatePolicyStatements(): PolicyStatement[];
}
