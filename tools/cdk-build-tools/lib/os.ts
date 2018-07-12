import child_process = require("child_process");

/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export function shell(command: string[]) {
    return child_process.spawnSync(command[0], command.slice(1), {
        // Need this for Windows where we want .cmd and .bat to be found as well.
        shell: true,
    });

    // FIXME: Handle errors gracefully and not by dumping a giant NodeJS stack trace
}

/**
 * Make the script executable on the current platform
 *
 * On UNIX, we'll use chmod to directly execute the file.
 *
 * On Windows, we'll do nothing and expect our other tooling
 * (npm/lerna) to generate appropriate .cmd files when linking.
 */
export function makeExecutable(javascriptFile: string) {
    if (process.platform !== 'win32') {
        require('fs').chmodSync(javascriptFile, 0o755);
    }
}