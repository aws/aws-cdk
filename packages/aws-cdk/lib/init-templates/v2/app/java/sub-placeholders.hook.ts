import { InvokeHook } from '../../../../init';

export const invoke: InvokeHook = async (_, context) => {
  // File cannot be named like regular template because it needs to be
  // processed by dependency updaters.
  await context.substitutePlaceholdersIn('pom.xml');
};
