workspace(name = "aws_cdk")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Uncomment for local bazel rules development
#local_repository(
#    name = "build_bazel_rules_nodejs",
#    path = "../rules_nodejs",
#)
#local_repository(
#    name = "npm_bazel_typescript",
#    path = "../rules_typescript",
#)

# Fetch rules_nodejs so we can install our npm dependencies
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "1db950bbd27fb2581866e307c0130983471d4c3cd49c46063a2503ca7b6770a4",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.29.0/rules_nodejs-0.29.0.tar.gz"],
)

# Check the bazel version and download npm dependencies
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "check_rules_nodejs_version", "node_repositories", "npm_install")

# Bazel version must be at least v0.21.0 because:
#   - 0.21.0 Using --incompatible_strict_action_env flag fixes cache when running `yarn bazel`
#            (see https://github.com/angular/angular/issues/27514#issuecomment-451438271)
check_bazel_version(
    message = """
You no longer need to install Bazel on your machine.
Angular has a dependency on the @bazel/bazel package which supplies it.
Try running `yarn bazel` instead.
    (If you did run that, check that you've got a fresh `yarn install`)
""",
    minimum_bazel_version = "0.21.0",
)

# The NodeJS rules version must be at least v0.15.3 because:
#   - 0.15.2 Re-introduced the prod_only attribute on yarn_install
#   - 0.15.3 Includes a fix for the `jasmine_node_test` rule ignoring target tags
#   - 0.16.8 Supports npm installed bazel workspaces
#   - 0.26.0 Fix for data files in yarn_install and npm_install
#   - 0.27.12 Adds NodeModuleSources provider for transtive npm deps support
check_rules_nodejs_version("0.27.12")

# Setup the Node.js toolchain
node_repositories(
    node_version = "10.9.0",
    package_json = ["//:package.json"],
    preserve_symlinks = True,
    # yarn 1.13.0 under Bazel has a regression on Windows that causes build errors on rebuilds:
    # ```
    # ERROR: Source forest creation failed: C:/.../fyuc5c3n/execroot/angular/external (Directory not empty)
    # ```
    # See https://github.com/angular/angular/pull/29431 for more information.
    # It possible that versions of yarn past 1.13.0 do not have this issue, however, before
    # advancing this version we need to test manually on Windows that the above error does not
    # happen as the issue is not caught by CI.
    yarn_version = "1.12.1",
)

npm_install(
    name = "npm",
    data = [],
    package_json = "//:package.json",
    # Don't install devDependencies, they are large and not used under Bazel
    prod_only = True,
    package_lock_json = "//:package-lock.json",
)

# Install all bazel dependencies of the @npm npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup the rules_typescript tooolchain
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()
