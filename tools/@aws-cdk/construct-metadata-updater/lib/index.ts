import { EnumLikeUpdater } from './metadata-updater';
// TODO: Uncomment out the rest of the updaters and tweak the import before raising a PR.
//       If you're reading this on GitHub, someone forgot to double-check!
export function main() {
  const dir = '../../../../packages/'

  // new ConstructsUpdater(dir).execute();
  // console.log('Constructs updater finished.');

  // new PropertyUpdater(dir).execute();
  // console.log('Property updater finished.')

  // new EnumsUpdater(dir).execute();
  // console.log('Enums updater finished.');

  // new MethodsUpdater(dir).execute();
  // console.log('Methods updater finished.');

  new EnumLikeUpdater(dir).TEST();
  // console.log('Enum-like updater finished.');
}