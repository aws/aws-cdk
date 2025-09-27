/******************************************************************************
 *                               BROWSER
 *****************************************************************************/
/**
 * Permissions for the Browser tool
 * See https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 */
export namespace BrowserPerms {
  /******************************************************************************
   *                         Data Plane Permissions
   *****************************************************************************/
  /**
   * Permissions to manage a specific browser session
   */
  export const SESSION_PERMS = [
    'bedrock-agentcore:GetBrowserSession',
    'bedrock-agentcore:ListBrowserSessions',
    'bedrock-agentcore:StartBrowserSession',
    'bedrock-agentcore:StopBrowserSession',
  ];

  /**
   * Permissions to connect to a browser live view or automation stream
   */
  export const STREAM_PERMS = [
    'bedrock-agentcore:UpdateBrowserStream',
    'bedrock-agentcore:ConnectBrowserAutomationStream',
    'bedrock-agentcore:ConnectBrowserLiveViewStream',
  ];

  /******************************************************************************
   *                         Control Plane Permissions
   *****************************************************************************/
  /**
   * Grants control plane operations to manage the browser (CRUD)
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateBrowser',
    'bedrock-agentcore:DeleteBrowser',
    'bedrock-agentcore:GetBrowser',
    'bedrock-agentcore:ListBrowsers',
  ];

  /**
   * Permissions for reading browser information
   */
  export const READ_PERMS = [
    'bedrock-agentcore:GetBrowser',
    'bedrock-agentcore:GetBrowserSession',
  ];

  /**
   * Permissions for listing browser resources
   */
  export const LIST_PERMS = [
    'bedrock-agentcore:ListBrowsers',
    'bedrock-agentcore:ListBrowserSessions',
  ];

  /**
   * Permissions for using browser functionality
   */
  export const USE_PERMS = [
    'bedrock-agentcore:StartBrowserSession',
    'bedrock-agentcore:UpdateBrowserStream',
    'bedrock-agentcore:StopBrowserSession',
  ];
}

/******************************************************************************
 *                               CODE INTERPRETER
 *****************************************************************************/
/**
 * Permissions for the Code Interpreter tool
 * See https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 */
export namespace CodeInterpreterPerms {
  /******************************************************************************
   *                         Data Plane Permissions
   *****************************************************************************/
  /**
   * Permissions to manage a specific code interpreter session
   */
  export const SESSION_PERMS = [
    'bedrock-agentcore:GetCodeInterpreterSession',
    'bedrock-agentcore:ListCodeInterpreterSessions',
    'bedrock-agentcore:StartCodeInterpreterSession',
    'bedrock-agentcore:StopCodeInterpreterSession',
  ];

  /**
   * Permissions to invoke a code interpreter
   */
  export const INVOKE_PERMS = ['bedrock-agentcore:InvokeCodeInterpreter'];

  /******************************************************************************
   *                         Control Plane Permissions
   *****************************************************************************/
  /**
   * Grants control plane operations to manage the code interpreter (CRUD)
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateCodeInterpreter',
    'bedrock-agentcore:DeleteCodeInterpreter',
    'bedrock-agentcore:GetCodeInterpreter',
    'bedrock-agentcore:ListCodeInterpreters',
  ];

  /**
   * Permissions for reading code interpreter information
   */
  export const READ_PERMS = [
    'bedrock-agentcore:GetCodeInterpreter',
    'bedrock-agentcore:GetCodeInterpreterSession',
  ];

  /**
   * Permissions for listing code interpreter resources
   */
  export const LIST_PERMS = [
    'bedrock-agentcore:ListCodeInterpreters',
    'bedrock-agentcore:ListCodeInterpreterSessions',
  ];

  /**
   * Permissions for using code interpreter functionality
   */
  export const USE_PERMS = [
    'bedrock-agentcore:StartCodeInterpreterSession',
    'bedrock-agentcore:InvokeCodeInterpreter',
    'bedrock-agentcore:StopCodeInterpreterSession',
  ];
}
