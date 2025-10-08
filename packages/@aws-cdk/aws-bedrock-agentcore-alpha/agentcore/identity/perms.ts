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

export namespace IdentityPerms {
  export namespace API_KEY {
    /******************************************************************************
     *                         Control Plane Permissions
     *****************************************************************************/
    /**
     * Permissions to read API key identity.
     */
    export const READ_PERMS = ['bedrock-agentcore:GetResourceApiKey'];

    /**
     * Permissions to update API key identity.
     */
    export const UPDATE_PERMS = ['bedrock-agentcore:UpdateApiKeyCredentialProvider'];

    /**
     * Permissions to list all API Key Credential Providers in the Token Vault
     */
    export const LIST_PERMS = ['bedrock-agentcore:ListApiKeyCredentialProviders'];
  }

  export namespace OAUTH {
    /******************************************************************************
     *                         Control Plane Permissions
     *****************************************************************************/
    /**
     * Permissions to read OAuth identity.
     */
    export const READ_PERMS = ['bedrock-agentcore:GetResourceOauth2Token'];

    /**
     * Permissions to update OAuth identity.
     */
    export const UPDATE_PERMS = ['bedrock-agentcore:UpdateOauth2CredentialProvider'];

    /**
     * Permissions to list all OAuth2 Credential Providers in the Token Vault
     */
    export const LIST_PERMS = ['bedrock-agentcore:ListOauth2CredentialProviders'];
  }

  export const GET_SECRET_PERMS = ['secretsmanager:GetSecretValue'];
}
