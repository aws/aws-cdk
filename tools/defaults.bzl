"""Re-export of some bazel rules with repository-wide defaults."""

load("@build_bazel_rules_nodejs//:defs.bzl", _nodejs_binary = "nodejs_binary", _npm_package = "npm_package")
load("@npm_bazel_jasmine//:index.bzl", _jasmine_node_test = "jasmine_node_test")
load("@npm_bazel_typescript//:index.bzl", _ts_library = "ts_library")

load("//tools:cfn2ts.bzl", "cfn2ts")

_DEFAULT_TSCONFIG_TEST = "//packages:tsconfig-test"

VERSION_PLACEHOLDER_REPLACEMENTS = {
}

def _default_module_name(testonly):
    """ Provide better defaults for package names.
    e.g. rather than aws_cdk/packages/@aws-cdk/cdk/testing we want @aws-cdk/cdk/testing
    TODO: we ought to supply a default module name for every library in the repo.
    But we short-circuit below in cases that are currently not working.
    """
    pkg = native.package_name()

    if testonly:
        # Some tests currently rely on the long-form package names
        return None

    if pkg.startswith("packages/@aws-cdk/"):
        return pkg[len("packages/"):]

    return None

def ts_library(tsconfig = None, testonly = False, deps = [], module_name = None, **kwargs):
    """Default values for ts_library"""
    deps = deps + ["@npm//tslib"]
    if testonly:
        # Match the types[] in //packages:tsconfig-test.json
        deps.append("@npm//@types/jasmine")
        deps.append("@npm//@types/node")
    if not tsconfig and testonly:
        tsconfig = _DEFAULT_TSCONFIG_TEST

    if not module_name:
        module_name = _default_module_name(testonly)

    _ts_library(
        tsconfig = tsconfig,
        testonly = testonly,
        deps = deps,
        module_name = module_name,
        **kwargs
    )

def cdk_library(scope, outputs, tsconfig = None, testonly = False, srcs = [], module_name = None, **kwargs):
    cfngen = cfn2ts(
        name = "cfngen",
        scope = scope,
        outputs = outputs,
    )

    ts_library(
        tsconfig = tsconfig,
        testonly = testonly,
        srcs = [":cfngen"] + srcs,
        module_name = module_name,
        **kwargs
    )

def npm_package(name, replacements = {}, **kwargs):
    """Default values for npm_package"""
    _npm_package(
        name = name,
        replacements = dict(replacements, **VERSION_PLACEHOLDER_REPLACEMENTS),
        **kwargs
    )

def nodejs_binary(data = [], **kwargs):
    """Default values for nodejs_binary"""
    _nodejs_binary(
        # Pass-thru --define=compile=foo as an environment variable
        configuration_env_vars = ["compile"],
        data = data + ["@npm//source-map-support"],
        **kwargs
    )

def jasmine_node_test(deps = [], **kwargs):
    """Default values for jasmine_node_test"""
    deps = deps + [
        # Very common dependencies for tests
        "@npm//jasmine-core",
        "@npm//tslib",
    ]
    _jasmine_node_test(
        deps = deps,
        # Pass-thru --define=compile=foo as an environment variable
        configuration_env_vars = ["compile"],
        **kwargs
    )
