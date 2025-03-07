import { ConstructsUpdater, EnumLikeUpdater, EnumsUpdater, MethodsUpdater, PropertyUpdater } from './metadata-updater';

export function main() {
  const dir = '../../../../packages/'

  new ConstructsUpdater(dir).execute();
  console.log('Constructs updater finished.');

  new PropertyUpdater(dir).execute();
  console.log('Property updater finished.')

  new EnumsUpdater(dir).execute();
  console.log('Enums updater finished.');

  new MethodsUpdater(dir).execute();
  console.log('Methods updater finished.');

  new EnumLikeUpdater(dir).execute();
  console.log('Enum-like updater finished.');
}