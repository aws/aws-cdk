import * as fs from 'fs';
import * as path from 'path';

export enum DependenciesFile {
  PIP = 'requirements.txt',
  POETRY = 'poetry.lock',
  PIPENV = 'Pipfile.lock',
  NONE = ''
}

interface PackagingProps {
  dependenciesFile: DependenciesFile;
  exportCommand?: string;
}

export class Packaging {
  public static PIP = new Packaging({
    dependenciesFile: DependenciesFile.PIP,
  });
  public static PIPENV = new Packaging({
    dependenciesFile: DependenciesFile.PIPENV,
    // By default, pipenv creates a virtualenv in `/.local`, so we force it to create one in the package directory.
    // At the end, we remove the virtualenv to avoid creating a duplicate copy in the Lambda package.
    exportCommand: `PIPENV_VENV_IN_PROJECT=1 pipenv lock -r > ${DependenciesFile.PIP} && rm -rf .venv`,
  });
  public static POETRY = new Packaging({
    dependenciesFile: DependenciesFile.POETRY,
    exportCommand: `poetry export --with-credentials --format ${DependenciesFile.PIP} --output ${DependenciesFile.PIP}`,
  });
  public static NONE = new Packaging({ dependenciesFile: DependenciesFile.NONE });

  public static fromEntry(entry: string): Packaging {
    if (fs.existsSync(path.join(entry, DependenciesFile.PIPENV))) {
      return Packaging.PIPENV;
    } if (fs.existsSync(path.join(entry, DependenciesFile.POETRY))) {
      return Packaging.POETRY;
    } else if (fs.existsSync(path.join(entry, DependenciesFile.PIP))) {
      return Packaging.PIP;
    } else {
      return Packaging.NONE;
    }
  }

  public readonly dependenciesFile: string;
  public readonly exportCommand?: string;
  constructor(props: PackagingProps) {
    this.dependenciesFile = props.dependenciesFile;
    this.exportCommand = props.exportCommand;
  }
}