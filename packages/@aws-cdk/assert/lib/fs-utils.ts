import fs = require('fs');
import os = require('os');
import path = require('path');

interface FromTreeOutput {
  /**
   * Absolute path of the created temporary directory, containing the generated structure
   */
  readonly directory: string;
  /**
   * Cleanup function that will remove the generated files once called
   */
  readonly cleanup: () => void;
}

/**
 * Collection of file-system utility methods
 */
export class FsUtils {
  /**
   * Generates a filesystem structure from a string,
   * formatted like the output of a `tree` shell command
   *
   * @param tmpPrefix temp directory prefix, used by {@link fs.mkdtemp}
   * @param tree
   * @param content the content
   *
   * @returns an array containing the absolute path of the created directory,
   *          and a cleanup function that will remove the generated files when called
   */
  public static fromTree(tmpPrefix: string, tree: string, content = 'content'): FromTreeOutput {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), tmpPrefix));

    const directories: string[] = [];
    const files: string[] = [];
    const symlinks: Array<[string, string]> = [];

    // we push an element at the end because we push the files/directories during the previous iteration
    const lines = [...tree.replace(/^\n+/, '').trimRight().split('\n'), ''];
    const initialIndentLevel = (lines[0].match(/^\s*/) || [''])[0].length;

    lines.reduce<[string, number, boolean]>(([previousDir, previousIndentLevel, wasDirectory], line) => {
      const indentCharacters = (line.match(FsUtils.INDENT_CHARACTERS_REGEX) || [''])[0];
      const indentLevel = (indentCharacters.length - initialIndentLevel) / 4;

      const fileName = line.slice(indentCharacters.length).replace(FsUtils.TRAILING_CHARACTERS_REGEX, '').trimRight();

      const current = indentLevel <= previousIndentLevel ?
        path.join(...previousDir.split(path.sep).slice(0, indentLevel - 1), fileName) :
        path.join(previousDir, fileName);

      if (previousDir) {
        if (indentLevel > previousIndentLevel || wasDirectory) {
          directories.push(previousDir);
        } else if (previousDir.includes('->')) {
          const [link, target] = previousDir.split(/\s*->\s*/);
          symlinks.push([link, target]);
        } else {
          files.push(previousDir);
        }
      }

      return [current, indentLevel, FsUtils.IS_DIRECTORY_REGEX.test(line)];
    }, ['', 0, false]);

    for (const _directory of directories) {
      fs.mkdirSync(path.join(directory, _directory));
    }
    for (const file of files) {
      fs.writeFileSync(path.join(directory, file), content);
    }
    for (const [link, target] of symlinks) {
      fs.symlinkSync(target, path.join(directory, link));
    }

    return {
      directory,
      cleanup: () => {
        for (const [link] of symlinks) {
          fs.unlinkSync(path.join(directory, link));
        }
        for (const file of files) {
          fs.unlinkSync(path.join(directory, file));
        }
        for (const _directory of directories.reverse()) {
          fs.rmdirSync(path.join(directory, _directory));
        }

        fs.rmdirSync(directory);
      }
    };
  }

  private static readonly INDENT_CHARACTERS_REGEX = /^[\s├─│└]+/;
  private static readonly TRAILING_CHARACTERS_REGEX = /(\/|\(D\))$/i;
  private static readonly IS_DIRECTORY_REGEX = /\(D\)\s*$/i;

}