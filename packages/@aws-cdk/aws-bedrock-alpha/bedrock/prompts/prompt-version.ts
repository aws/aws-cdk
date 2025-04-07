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

import { aws_bedrock as bedrock } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Prompt } from './prompt';


export interface PromptVersionProps {
  /**
   * The prompt to use for this version.
   */
  readonly prompt: Prompt;

  /**
   * The description of the prompt version.
   */
  readonly description?: string;
}

/**
 * Creates a version of the prompt.
 *
 * Use this to create a static snapshot of your prompt that can be deployed
 * to production. Versions allow you to easily switch between different
 * configurations for your prompt and update your application with the most
 * appropriate version for your use-case.
 * @resource AWS::Bedrock::PromptVersion
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management-deploy.html
 */
export class PromptVersion extends Construct {
  /**
   * The Amazon Resource Name (ARN) of the prompt version.
   * @example "arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345:1"
   */
  public readonly versionArn: string;

  /**
   * The prompt used by this version.
   */
  public readonly prompt: Prompt;

  /**
   * The version of the prompt that was created.
   */
  public readonly version: string;

  /**
   * Instance of prompt version.
   */
  private readonly _resource: bedrock.CfnPromptVersion;

  constructor(scope: Construct, id: string, props: PromptVersionProps) {
    super(scope, id);

    this.prompt = props.prompt;

    // L1 instantiation
    this._resource = new bedrock.CfnPromptVersion(this, id, {
      description: props.description,
      promptArn: props.prompt.promptArn,
    });

    this.versionArn = this._resource.attrArn;
    this.version = this._resource.attrVersion;

  }

}