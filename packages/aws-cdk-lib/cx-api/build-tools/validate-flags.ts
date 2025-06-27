import { CURRENT_MV, FLAGS } from '../lib/features';
import { MAGIC_V2NEXT } from '../lib/private/flag-modeling';

export function validateFlags() {
  for (const [flagName, flag] of Object.entries(FLAGS)) {
    if (flag.introducedIn[CURRENT_MV] !== undefined) {
      if (!/^[0-9.]+$/.test(flag.introducedIn[CURRENT_MV]) && flag.introducedIn[CURRENT_MV] != MAGIC_V2NEXT) {
        // eslint-disable-next-line @cdklabs/no-throw-default-error
        throw new Error(`Flag '${flagName}': introducedIn is not a valid version or the magic string. Did you misspell the magic string?`);
      }
    }
  }
}
