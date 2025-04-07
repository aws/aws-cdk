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
import { IInvokable } from '../models';

/**
 * Enum representing the type of context enrichment.
 */
export enum ContextEnrichmentType {
  /**
     * Uses a Bedrock Foundation Model for context enrichment.
     */
  BEDROCK_FOUNDATION_MODEL = 'BEDROCK_FOUNDATION_MODEL',
}

/**
 * Enum representing the method to be used for enrichment strategy.
 */
export enum EnrichmentStrategyConfigurationType {

  CHUNK_ENTITY_EXTRACTION = 'CHUNK_ENTITY_EXTRACTION',
}

/**
 * Properties for configuring a Foundation Model enrichment strategy.
 */
export interface FoundationModelContextEnrichmentProps {
  /**
   * The Bedrock Foundation Model configuration for context enrichment.
   */
  readonly enrichmentModel: IInvokable;
}

/**
 * Abstract class representing a context enrichment strategy.
 * The enrichment stategy used to provide additional context.
 * For example, Neptune GraphRAG uses Amazon Bedrock foundation
 * models to perform chunk entity extraction.
 */
export abstract class ContextEnrichment {

  // ------------------------------------------------------
  // FM Enrichment Strategy
  // ------------------------------------------------------
  /**
   * Creates a Foundation Model-based enrichment strategy used to provide additional context
   * to the RAG application.
   */
  public static foundationModel(props: FoundationModelContextEnrichmentProps): ContextEnrichment {
    class FoundationModelContextEnrichment extends ContextEnrichment {
      public readonly configuration = {
        type: ContextEnrichmentType.BEDROCK_FOUNDATION_MODEL,
        bedrockFoundationModelConfiguration: {
          modelArn: props.enrichmentModel.invokableArn,
          enrichmentStrategyConfiguration: {
            method: EnrichmentStrategyConfigurationType.CHUNK_ENTITY_EXTRACTION,
          },
        },
      };

      public generatePolicyStatements(): PolicyStatement[] {
        return [
          new PolicyStatement({
            actions: ['bedrock:InvokeModel*'],
            resources: [props.enrichmentModel.invokableArn],
          }),
        ];
      }
    }

    return new FoundationModelContextEnrichment();
  }
  // ------------------------------------------------------
  // Properties
  // ------------------------------------------------------
  /** The CloudFormation property representation of this configuration */
  public abstract configuration: CfnDataSource.ContextEnrichmentConfigurationProperty;

  public abstract generatePolicyStatements(): PolicyStatement[];
}