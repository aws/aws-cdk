import { PropertyUpdater, ConstructsUpdater } from './metadata-updater';

export function main() {
  const dir = '../../../../packages/'

  new PropertyUpdater(dir).execute();
  console.log('Property updater finished.')

  new ConstructsUpdater(dir).execute();
  console.log('Constructs updater finished.');
}