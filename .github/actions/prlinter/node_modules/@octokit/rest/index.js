const Octokit = require("./lib/core");

const CORE_PLUGINS = [
  require("./plugins/authentication"),
  require("./plugins/authentication-deprecated"), // deprecated: remove in v17
  require("./plugins/log"),
  require("./plugins/pagination"),
  require("./plugins/register-endpoints"),
  require("./plugins/rest-api-endpoints"),
  require("./plugins/validate"),

  require("octokit-pagination-methods") // deprecated: remove in v17
];

module.exports = Octokit.plugin(CORE_PLUGINS);
