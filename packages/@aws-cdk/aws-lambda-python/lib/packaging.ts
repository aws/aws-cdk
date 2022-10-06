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

class PoetryPackagingProps {
  /**
   * Whether to export Poetry dependencies without hashes. This can fix build issues when some dependencies are exporting
   * with hashes and others are not, causing pip to fail the build.
   *
   * @see https://github.com/aws/aws-cdk/issues/19232
   * @default Hashes are included in the exported `requirements.txt` file
   */
  readonly poetryExcludeHashes?: boolean;
}

export class Packaging {

  /**
   * Standard packaging with `pip`.
   */
  public static withPip(): Packaging {
    return new Packaging({
      dependenciesFile: DependenciesFile.PIP,
    });
  }

  /**
   * Packaging with `pipenv`.
   */
  public static withPipenv(): Packaging {
    return new Packaging({
      dependenciesFile: DependenciesFile.PIPENV,
      // By default, pipenv creates a virtualenv in `/.local`, so we force it to create one in the package directory.
      // At the end, we remove the virtualenv to avoid creating a duplicate copy in the Lambda package.
      exportCommand: `PIPENV_VENV_IN_PROJECT=1 pipenv lock -r > ${DependenciesFile.PIP} && rm -rf .venv`,
    });
  }

  /**
   * Packaging with `poetry`.
   */
  public static withPoetry(props?: PoetryPackagingProps) {
    return new Packaging({
      dependenciesFile: DependenciesFile.POETRY,
      // Export dependencies with credentials available in the bundling image.
      exportCommand: props?.poetryExcludeHashes ?
        `poetry export --without-hashes --with-credentials --format ${DependenciesFile.PIP} --output ${DependenciesFile.PIP}` :
        `poetry export --with-credentials --format ${DependenciesFile.PIP} --output ${DependenciesFile.PIP}`,
    });
  }

  /**
   * No dependencies or packaging.
   */
  public static withNoPackaging(): Packaging {
    return new Packaging({ dependenciesFile: DependenciesFile.NONE });
  }

  public static fromEntry(entry: string, poetryExcludeHashes?: boolean): Packaging {
    if (fs.existsSync(path.join(entry, DependenciesFile.PIPENV))) {
      return this.withPipenv();
    } if (fs.existsSync(path.join(entry, DependenciesFile.POETRY))) {
      return this.withPoetry({ poetryExcludeHashes });
    } else if (fs.existsSync(path.join(entry, DependenciesFile.PIP))) {
      return this.withPip();
    } else {
      return this.withNoPackaging();
    }
  }

  public readonly dependenciesFile: string;
  public readonly exportCommand?: string;
  constructor(props: PackagingProps) {
    this.dependenciesFile = props.dependenciesFile;
    this.exportCommand = props.exportCommand;
  }
}