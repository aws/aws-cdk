import { ResourceMetadataUpdater } from './metadata-updater';

export async function main() {
  const updater = new ResourceMetadataUpdater("../../../../packages/");
  await updater.execute();
}