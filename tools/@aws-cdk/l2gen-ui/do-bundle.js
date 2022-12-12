const { build, formatMessagesSync } = require('esbuild');
const { isTypeQueryNode } = require('typescript');

build({
  entryPoints: ['lib/main.tsx'],
  bundle: true,
  outfile: 'resources/build/main.js',
  platform: 'browser',
  loader: {
    '.woff': 'file',
    '.woff2': 'file',
    '.eot': 'file',
    '.ttf': 'file',
  },
  alias: {
    'fs': './lib/throwing-proxy',
    'fs-extra': './lib/throwing-proxy',
    'os': './lib/throwing-proxy',
    'path': './lib/throwing-proxy',
    'assert': './lib/throwing-proxy',
    'stream': './lib/throwing-proxy',
    'constants': './lib/throwing-proxy',
    'crypto': './lib/throwing-proxy',
  },
  watch: process.argv.includes('--watch'),
  sourcemap: 'linked',
}).catch(() => {
  // Messages have already been printed
  process.exitCode = 1;
});
