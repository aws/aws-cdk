import { PropertyUpdater, ConstructsUpdater, EnumsUpdater } from './metadata-updater';

export function main() {
  const dir = '../../../../packages/'

  new PropertyUpdater(dir).execute();
  console.log('Property updater finished.')

  new ConstructsUpdater(dir).execute();
  console.log('Constructs updater finished.');

  new EnumsUpdater(dir).execute();
  console.log('Enums updater finished.');
}