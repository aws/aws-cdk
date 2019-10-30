// Slightly refactored version of fs-extra mkdirpSync
// https://github.com/jprichardson/node-fs-extra/blob/d1a01e735e81688e08688557d7a254fa8297d98e/lib/mkdirs/mkdirs.js

import fs = require('fs');
import path = require('path');

const INVALID_PATH_CHARS = /[<>:"|?*]/;
const o777 = parseInt('0777', 8);

function getRootPath(p: string) {
    const paths = path.normalize(path.resolve(p)).split(path.sep);
    if (paths.length > 0) { return paths[0]; }
    return null;
}

function invalidWin32Path(p: string) {
    const rp = getRootPath(p);
    p = p.replace(rp || '', '');
    return INVALID_PATH_CHARS.test(p);
}

export function mkdirpSync(p: string, opts?: any, made?: any) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    let mode = opts.mode;
    const xfs = opts.fs || fs;

    if (process.platform === 'win32' && invalidWin32Path(p)) {
        const errInval = new Error(p + ' contains invalid WIN32 path characters.');
        // @ts-ignore
        errInval.code = 'EINVAL';
        throw errInval;
    }

    if (mode === undefined) {
        // tslint:disable-next-line: no-bitwise
        mode = o777 & (~process.umask());
    }
    if (!made) { made = null; }

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    } catch (err0) {
        if (err0.code === 'ENOENT') {
            if (path.dirname(p) === p) { throw err0; }
            made = mkdirpSync(path.dirname(p), opts, made);
            mkdirpSync(p, opts, made);
        } else {
            // In the case of any other error, just see if there's a dir there
            // already. If so, then hooray!  If not, then something is borked.
            let stat;
            try {
                stat = xfs.statSync(p);
            } catch (err1) {
                throw err0;
            }
            if (!stat.isDirectory()) { throw err0; }
        }
    }

    return made;
}