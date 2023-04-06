// Script to get Node.js to print its memory usage periodically
//
// Use as follows:
//
// export NODE_OPTIONS="-r $PWD/scripts/log-memory.js ${NODE_OPTIONS:-}"
const { memoryUsage } = require('process');

const MB = 1024 * 1024;

setInterval(() => {
    const now = new Date();
    const HH = `0${now.getHours()}`.slice(-2);
    const MM = `0${now.getMinutes()}`.slice(-2);
    console.error(`[${HH}:${MM}] [node:${process.pid}] rss=${(memoryUsage.rss() / MB).toFixed(1)}`);
}, 60000).unref();
