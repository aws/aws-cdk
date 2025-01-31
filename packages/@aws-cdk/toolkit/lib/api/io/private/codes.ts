import { IoMessageCode } from '../io-message';

export const CODES = {
  // Default codes -- all 0000 codes
  CDK_TOOLKIT_I0000: 'Default toolkit info code',
  CDK_TOOLKIT_E0000: 'Default toolkit error code',
  CDK_TOOLKIT_W0000: 'Default toolkit warning code',
  CDK_SDK_I0000: 'Default sdk info code',
  CDK_SDK_E0000: 'Default sdk error code',
  CDK_SDK_WOOOO: 'Default sdk warning code',
  CDK_ASSETS_I0000: 'Default assets info code',
  CDK_ASSETS_E0000: 'Default assets error code',
  CDK_ASSETS_W0000: 'Default assets warning code',
  CDK_ASSEMBLY_I0000: 'Default assembly info code',
  CDK_ASSEMBLY_E0000: 'Default assembly error code',
  CDK_ASSEMBLY_W0000: 'Default assembly warning code',

  // Toolkit Info codes
  CDK_TOOLKIT_I0001: 'Display stack data',
  CDK_TOOLKIT_I0002: 'Successfully deployed stacks',
  CDK_TOOLKIT_I3001: 'Informs about any log groups that are traced as part of the deployment',
  CDK_TOOLKIT_I5001: 'Display synthesis times',
  CDK_TOOLKIT_I5050: 'Confirm rollback',
  CDK_TOOLKIT_I5060: 'Confirm deploy security sensitive changes',
  CDK_TOOLKIT_I7010: 'Confirm destroy stacks',

  // Toolkit Warning codes

  // Toolkit Error codes

  // Assembly Info codes
  CDK_ASSEMBLY_I0042: 'Writing updated context',
  CDK_ASSEMBLY_I0241: 'Fetching missing context',

  // Assembly Warning codes

  // Assembly Error codes
  CDK_ASSEMBLY_E1111: 'Incompatible CDK CLI version. Upgrade needed.',
};

// If we give CODES a type with key: IoMessageCode,
// this dynamically generated type will generalize to allow all IoMessageCodes.
// Instead, we will validate that VALID_CODE must be IoMessageCode with the '&'.
export type VALID_CODE = keyof typeof CODES & IoMessageCode;
