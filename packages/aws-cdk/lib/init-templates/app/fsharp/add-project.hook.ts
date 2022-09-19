import * as path from 'path';
import { InvokeHook } from '../../../init';
import { shell } from '../../../os';

export const invoke: InvokeHook = async (targetDirectory: string, context) => {
  const pname = context.placeholder('name.PascalCased');
  const slnPath = path.join(targetDirectory, 'src', `${pname}.sln`);
  const fsprojPath = path.join(targetDirectory, 'src', pname, `${pname}.fsproj`);
  try {
    await shell(['dotnet', 'sln', slnPath, 'add', fsprojPath]);
  } catch (e) {
    throw new Error(`Could not add project ${pname}.fsproj to solution ${pname}.sln. ${e.message}`);
  }
};
