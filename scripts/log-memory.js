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
    const SS = `0${now.getSeconds()}`.slice(-2);
    
    const usage = memoryUsage();
    const rss = (usage.rss / MB).toFixed(1);
    const heapUsed = (usage.heapUsed / MB).toFixed(1);
    const heapTotal = (usage.heapTotal / MB).toFixed(1);
    const external = (usage.external / MB).toFixed(1);
    
    console.error(`[${HH}:${MM}:${SS}] [node:${process.pid}] Memory: RSS=${rss}MB, Heap=${heapUsed}/${heapTotal}MB, External=${external}MB`);
}, 60000).unref();
