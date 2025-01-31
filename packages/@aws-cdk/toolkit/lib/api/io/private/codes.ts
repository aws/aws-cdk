import { IoMessageCode } from '../io-message';

export const CODES = {
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
  CDK_ASSEMBLY_I1000: 'Cloud assembly output starts',
  CDK_ASSEMBLY_I1001: 'Output lines emitted by the cloud assembly to stdout',
  CDK_ASSEMBLY_E1002: 'Output lines emitted by the cloud assembly to stderr',
  CDK_ASSEMBLY_I1003: 'Cloud assembly output finished',
  CDK_ASSEMBLY_E1111: 'Incompatible CDK CLI version. Upgrade needed.',
};

// If we give CODES a type with key: IoMessageCode,
// this dynamically generated type will generalize to allow all IoMessageCodes.
// Instead, we will validate that VALID_CODE must be IoMessageCode with the '&'.
export type VALID_CODE = keyof typeof CODES & IoMessageCode;
