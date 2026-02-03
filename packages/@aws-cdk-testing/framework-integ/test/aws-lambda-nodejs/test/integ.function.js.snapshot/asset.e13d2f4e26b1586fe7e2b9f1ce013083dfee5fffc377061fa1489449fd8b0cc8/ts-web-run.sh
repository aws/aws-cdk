#!/bin/sh

# For AWS Lambda Adapter
# https://github.com/awslabs/aws-lambda-web-adapter
export READINESS_CHECK_PATH="${READINESS_CHECK_PATH:-/health}"
export AWS_LAMBDA_EXEC_WRAPPER="${AWS_LAMBDA_EXEC_WRAPPER:-/opt/bootstrap}"
export RUST_LOG="${RUST_LOG:-info}"
export AWS_LWA_ENABLE_COMPRESSION="${AWS_LWA_ENABLE_COMPRESSION:-true}"
export PORT="${PORT:-3001}"

exec node index.js
