// A proxy that will throw, used to replace imports of 'os', 'fs', etc.

module.exports = new Proxy({}, {
  get(_target, prop, _receiver) {
    if (prop === '__esModule') {
      return this;
    }

    throw new Error(`Using a Node module that's not available: ${String(prop)}`);
  },
});