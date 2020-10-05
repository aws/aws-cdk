import { AssetManifest } from '../lib';

export async function list(args: {
  path: string;
}) {
  const manifest = AssetManifest.fromPath(args.path);
  // eslint-disable-next-line no-console
  console.log(manifest.list().join('\n'));
}