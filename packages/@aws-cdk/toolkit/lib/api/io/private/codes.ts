import { IoMessageCode } from '../io-message';

export const CODES = {
  CDK_TOOLKIT_I0001: 'Display stack data',
  CDK_TOOLKIT_I0002: 'Successfully deployed stacks',
  CDK_TOOLKIT_I5001: 'Display synthesis times',
  CDK_TOOLKIT_I5050: 'Confirm rollback',
  CDK_TOOLKIT_I5060: 'Confirm deploy security sensitive changes',
  CDK_TOOLKIT_I7010: 'Confirm destroy stacks',
};

// If we give CODES a type with key: IoMessageCode,
// this dynamically generated type will generalize to allow all IoMessageCodes.
// Instead, we will validate that VALID_CODE must be IoMessageCode with the '&'.
export type VALID_CODE = keyof typeof CODES & IoMessageCode;
