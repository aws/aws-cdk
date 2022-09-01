import * as fs from 'fs';
import * as path from 'path';

export enum DependenciesFile {
  PIP = 'requirements.txt',
  POETRY = 'poetry.lock',
  PIPENV = 'Pipfile.lock',
  NONE = ''
}

export interface PackagingProps {
  /**
   * Dependency file for the type of packaging.
   */
  readonly dependenciesFile: DependenciesFile;
  /**
   * Command to export the dependencies into a pip-compatible `requirements.txt` format.
   *
   * @default - No dependencies are exported.
   */
  readonly exportCommand?: string;
}

export class Packaging {

  /**
   * Standard packaging with `pip`.
   */
  public static readonly PIP = new Packaging({
    dependenciesFile: DependenciesFile.PIP,
  });

  /**
   * Packaging with `pipenv`.
   */
  public static readonly PIPENV = new Packaging({
    dependenciesFile: DependenciesFile.PIPENV,
    // By default, pipenv creates a virtualenv in `/.local`, so we force it to create one in the package directory.
    // At the end, we remove the virtualenv to avoid creating a duplicate copy in the Lambda package.
    exportCommand: `export PIPENV_VENV_IN_PROJECT=1; pipenv lock && pipenv requirements > ${DependenciesFile.PIP} && rm -rf .venv`,
  });

  /**
   * Packaging with `poetry`.
   */
  public static readonly POETRY = new Packaging({
    dependenciesFile: DependenciesFile.POETRY,
    // Export dependencies with credentials avaiable in the bundling image.
    exportCommand: `poetry export --with-credentials --format ${DependenciesFile.PIP} --output ${DependenciesFile.PIP}`,
  });

  /**
   * No dependencies or packaging.
   */
  public static readonly NONE = new Packaging({ dependenciesFile: DependenciesFile.NONE });

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