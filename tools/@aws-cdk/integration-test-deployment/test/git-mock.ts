import { readFileSync } from 'fs';
import { join } from 'path';

export const gitDiffMock = async (): Promise<string> => {
  return readFileSync(join(__dirname, 'git-diff-snapshot.txt'), 'utf8');
};
