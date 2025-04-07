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

export enum CharacterFilterType {
  ICU_NORMALIZER = 'icu_normalizer',
}

// Currently we only support Kuromoji and ICU tokenizers.
// Also see the following link for more information regarding supported plugins:
// https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html#serverless-plugins
export enum TokenizerType {
  /**
   * Kuromoji tokenizer is used for Japanese text analysis and segmentation
   */
  KUROMOJI_TOKENIZER = 'kuromoji_tokenizer',
  /**
   * ICU tokenizer is used for Unicode text segmentation based on UAX #29 rules
   */
  ICU_TOKENIZER = 'icu_tokenizer',
  /**
   * Nori tokenizer is used for Korean text analysis and segmentation
   */
  NORI_TOKENIZER = 'nori_tokenizer',
}

/**
 * TokenFilterType defines the available token filters for text analysis.
 * Token filters process tokens after they have been created by the tokenizer.
 * They can modify, add, or remove tokens based on specific rules.
 */
export enum TokenFilterType {
  /**
   * Converts inflected Japanese words to their base form
   */
  KUROMOJI_BASEFORM = 'kuromoji_baseform',
  /**
   * Tags words with their parts of speech in Japanese text analysis
   */
  KUROMOJI_PART_OF_SPEECH = 'kuromoji_part_of_speech',
  /**
   * Reduces Japanese words to their stem form
   */
  KUROMOJI_STEMMER = 'kuromoji_stemmer',
  /**
   * Normalizes CJK width differences by converting all characters to their fullwidth or halfwidth variants
   */
  CJK_WIDTH = 'cjk_width',
  /**
   * Removes Japanese stop words from text
   */
  JA_STOP = 'ja_stop',
  /**
   * Converts all characters to lowercase
   */
  LOWERCASE = 'lowercase',
  /**
   * Applies Unicode folding rules for better text matching
   */
  ICU_FOLDING = 'icu_folding',
  /**
   * Tags words with their parts of speech in Korean text analysis
   */
  NORI_PART_OF_SPEECH = 'nori_part_of_speech',
  /**
   * Converts Korean text to its reading form
   */
  NORI_READINGFORM = 'nori_readingform',
  /**
   * Normalizes Korean numbers to regular Arabic numbers
   */
  NORI_NUMBER = 'nori_number',
}
