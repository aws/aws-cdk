import { IoMessageCode } from '../io-message';

/**
 * We have a rough system by which we assign message codes:
 * - First digit groups messages by action, e.g. synth or deploy
 * - X000-X009 are reserved for timings
 * - X900-X999 are reserved for results
 */
export const CODES = {
  // 1: Synth
  CDK_TOOLKIT_I1000: 'Provides synthesis times',
  CDK_TOOLKIT_I1901: 'Provides stack data',
  CDK_TOOLKIT_I1902: 'Successfully deployed stacks',

  // 2: List
  CDK_TOOLKIT_I2901: 'Provides details on the selected stacks and their dependencies',

  // 3: Import & Migrate
  CDK_TOOLKIT_E3900: 'Resource import failed',

  // 4: Diff

  // 5: Deploy & Watch
  CDK_TOOLKIT_I5000: 'Provides deployment times',
  CDK_TOOLKIT_I5001: 'Provides total time in deploy action, including synth and rollback',
  CDK_TOOLKIT_I5002: 'Provides time for resource migration',
  CDK_TOOLKIT_I5031: 'Informs about any log groups that are traced as part of the deployment',
  CDK_TOOLKIT_I5050: 'Confirm rollback during deployment',
  CDK_TOOLKIT_I5060: 'Confirm deploy security sensitive changes',
  CDK_TOOLKIT_I5900: 'Deployment results on success',

  CDK_TOOLKIT_E5001: 'No stacks found',

  // 6: Rollback
  CDK_TOOLKIT_I6000: 'Provides rollback times',

  CDK_TOOLKIT_E6001: 'No stacks found',
  CDK_TOOLKIT_E6900: 'Rollback failed',

  // 7: Destroy
  CDK_TOOLKIT_I7000: 'Provides destroy times',
  CDK_TOOLKIT_I7010: 'Confirm destroy stacks',

  CDK_TOOLKIT_E7010: 'Action was aborted due to negative confirmation of request',
  CDK_TOOLKIT_E7900: 'Stack deletion failed',

  // 9: Bootstrap

  // Assembly codes
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
