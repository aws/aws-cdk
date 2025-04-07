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

/**
 * Knowledge base can split your source data into chunks. A chunk refers to an
 * excerpt from a data source that is returned when the knowledge base that it
 * belongs to is queried. You have the following options for chunking your
 * data. If you opt for NONE, then you may want to pre-process your files by
 * splitting them up such that each file corresponds to a chunk.
 */
enum ChunkingStrategyType {
  /**
   * Amazon Bedrock splits your source data into chunks of the approximate size
   * that you set in the `fixedSizeChunkingConfiguration`.
   */
  FIXED_SIZE = 'FIXED_SIZE',
  /**
   * Splits documents into layers of chunks where the first layer contains large
   * chunks, and the second layer contains smaller chunks derived from the first
   * layer. You set the maximum parent chunk token size and the maximum child
   * chunk token size. You also set the absolute number of overlap tokens between
   * consecutive parent chunks and consecutive child chunks.
   */
  HIERARCHICAL = 'HIERARCHICAL',
  /**
   * Splits documents into semantically similar text chunks or groups of
   * sentences by using a foundation model. Note that there are additional
   * costs to using semantic chunking due to its use of a foundation model.
   */
  SEMANTIC = 'SEMANTIC',
  /**
   * Amazon Bedrock treats each file as one chunk. If you choose this option,
   * you may want to pre-process your documents by splitting them into separate
   * files.
   */
  NONE = 'NONE',
}

export interface HierarchicalChunkingProps {
  /**
   * The overlap tokens between adjacent chunks.
   */
  readonly overlapTokens: number;
  /**
   * Maximum number of tokens that a parent chunk can contain.
   * Keep in mind the maximum chunk size depends on the embedding model chosen.
   */
  readonly maxParentTokenSize: number;
  /**
   * Maximum number of tokens that a child chunk can contain.
   * Keep in mind the maximum chunk size depends on the embedding model chosen.
   */
  readonly maxChildTokenSize: number;
}

export abstract class ChunkingStrategy {
  // ------------------------------------------------------
  // Static Constants for Easy Customization
  // ------------------------------------------------------
  /**
   * Fixed Sized Chunking with the default chunk size of 300 tokens and 20% overlap.
   */
  public static readonly DEFAULT = ChunkingStrategy.fixedSize(
    { maxTokens: 300, overlapPercentage: 20 },
  );
  /**
   * Fixed Sized Chunking with the default chunk size of 300 tokens and 20% overlap.
   * You can adjust these values based on your specific requirements using the
   * `ChunkingStrategy.fixedSize(params)` method.
   */
  public static readonly FIXED_SIZE = ChunkingStrategy.fixedSize(
    { maxTokens: 300, overlapPercentage: 20 },
  );
  /**
   * Hierarchical Chunking with the default for Cohere Models.
   * - Overlap tokens: 30
   * - Max parent token size: 500
   * - Max child token size: 100
   */
  public static readonly HIERARCHICAL_COHERE = ChunkingStrategy.hierarchical(
    { overlapTokens: 60, maxParentTokenSize: 500, maxChildTokenSize: 300 },
  );

  /**
   * Hierarchical Chunking with the default for Titan Models.
   * - Overlap tokens: 60
   * - Max parent token size: 1500
   * - Max child token size: 300
   */
  public static readonly HIERARCHICAL_TITAN = ChunkingStrategy.hierarchical(
    { overlapTokens: 60, maxParentTokenSize: 1500, maxChildTokenSize: 300 },
  );
  /**
   * Semantic Chunking with the default of bufferSize: 0,
   * breakpointPercentileThreshold: 95, and maxTokens: 300.
   * You can adjust these values based on your specific requirements using the
   * `ChunkingStrategy.semantic(params)` method.
   */
  public static readonly SEMANTIC = ChunkingStrategy.semantic(
    { bufferSize: 0, breakpointPercentileThreshold: 95, maxTokens: 300 },
  );
  /**
   * Amazon Bedrock treats each file as one chunk. Suitable for documents that
   * are already pre-processed or text split.
   */
  public static readonly NONE = ChunkingStrategy.noChunking();

  // ------------------------------------------------------
  // Static Methods for Customization
  // ------------------------------------------------------
  /** Method for customizing a fixed sized chunking strategy. */
  public static fixedSize(props: CfnDataSource.FixedSizeChunkingConfigurationProperty): ChunkingStrategy {
    return {
      configuration: {
        chunkingStrategy: ChunkingStrategyType.FIXED_SIZE,
        fixedSizeChunkingConfiguration: props,
      },
    };
  }

  /**
   * Method for customizing a hierarchical chunking strategy.
   * For custom chunking, the maximum token chunk size depends on the model.
   * - Amazon Titan Text Embeddings: 8192
   * - Cohere Embed models: 512
  */
  public static hierarchical(props: HierarchicalChunkingProps): ChunkingStrategy {
    return {
      configuration: {
        chunkingStrategy: ChunkingStrategyType.HIERARCHICAL,
        hierarchicalChunkingConfiguration: {
          overlapTokens: props.overlapTokens,
          levelConfigurations: [
            { maxTokens: props.maxParentTokenSize },
            { maxTokens: props.maxChildTokenSize },
          ],
        },
      },
    };
  }

  /**
   * Method for customizing a semantic chunking strategy.
   * For custom chunking, the maximum token chunk size depends on the model.
   * - Amazon Titan Text Embeddings: 8192
   * - Cohere Embed models: 512
  */
  public static semantic(props: CfnDataSource.SemanticChunkingConfigurationProperty): ChunkingStrategy {
    return {
      configuration: {
        chunkingStrategy: ChunkingStrategyType.SEMANTIC,
        semanticChunkingConfiguration: props,
      },
    };
  }

  /** Method for defining a no chunking strategy. */
  private static noChunking(): ChunkingStrategy {
    return {
      configuration: {
        chunkingStrategy: ChunkingStrategyType.NONE,
      },
    };
  }
  // ------------------------------------------------------
  // Properties
  // ------------------------------------------------------
  /** The CloudFormation property representation of this configuration */
  public abstract configuration: CfnDataSource.ChunkingConfigurationProperty;

  private constructor() { }
}