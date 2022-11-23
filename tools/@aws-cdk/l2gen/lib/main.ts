import { IGeneratable } from './generatable';

export function generate(...xs: IGeneratable[]) {
  (async () => {
    for (const file of xs.flatMap(x => x.generateFiles())) {
      file.save();
    }
  })().catch(e => {
    console.error(e);
    process.exitCode = 1;
  });
}