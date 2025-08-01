#!/usr/bin/env python3

import subprocess
import os
from pathlib import Path

def run_integ_test(test_path):
    """Run yarn integ test for a given test file path."""
    # Convert to absolute path if it's relative
    if not os.path.isabs(test_path):
        # Get the directory where this script is located (should be CDK root)
        script_dir = Path(__file__).parent
        test_path = script_dir / test_path
    
    # Extract package directory and test file
    path_obj = Path(test_path)
    test_file = path_obj.name
    
    # Find the package directory (everything before /test/)
    parts = path_obj.parts
    test_index = parts.index('test')
    package_dir = Path(*parts[:test_index])
    
    print(f"Running test: {test_file}")
    print(f"Package directory: {package_dir}")
    print(f"Full test path: {test_path}")
    
    try:
        result = subprocess.run(
            f"yarn integ test/{test_file}",
            shell=True,
            cwd=package_dir,
            capture_output=True,
            text=True
        )
        
        print(f"Exit code: {result.returncode}")
        if result.stdout:
            print(f"Output:\n{result.stdout}")
        if result.stderr:
            print(f"Error:\n{result.stderr}")
        
        return result.returncode == 0
    except Exception as e:
        print(f"Failed to execute test: {e}")
        return False

def main():
    # Add your test file paths here (using relative paths from the CDK root)
    test_files = [
        "packages/@aws-cdk/app-staging-synthesizer-alpha/test/integ.synth-default-encryption.js",
        "packages/@aws-cdk/app-staging-synthesizer-alpha/test/integ.synth-default-resources.js",
        "packages/@aws-cdk/aws-amplify-alpha/test/integ.app-asset-deployment.js",
        "packages/@aws-cdk/aws-applicationsignals-alpha/test/integ.ecs-enablement-replica.js",
        "packages/@aws-cdk/aws-apprunner-alpha/test/integ.service-vpc-ingress-connection.js",
        "packages/@aws-cdk/aws-bedrock-alpha/test/bedrock/agents/integ.api-schema.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.alb-controller.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-addon.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-al2023-nodegroup.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-cluster-imported.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-cluster-private-endpoint.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-helm-asset.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-inference-nodegroup.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-oidc-provider.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-standard-access-entry.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-subnet-updates.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.eks-windows-ng.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.fargate-cluster.js",
        "packages/@aws-cdk/aws-eks-v2-alpha/test/integ.helm-chart-logging.js",
        "packages/@aws-cdk/aws-glue-alpha/test/integ.partition-index.js",
        "packages/@aws-cdk/aws-iot-actions-alpha/test/opensearch/integ.open-search-action.js",
        "packages/@aws-cdk/aws-ivs-alpha/test/integ.ivs-recording-configuration.js",
        "packages/@aws-cdk/aws-msk-alpha/test/integ.add-cluster-user.js",
        "packages/@aws-cdk/aws-msk-alpha/test/integ.cluster-zookeeper.js",
        "packages/@aws-cdk/aws-msk-alpha/test/integ.cluster.js",
        "packages/@aws-cdk/aws-neptune-alpha/test/integ.cluster-port.js",
        "packages/@aws-cdk/aws-neptune-alpha/test/integ.cluster.js",
        "packages/@aws-cdk/aws-neptune-alpha/test/integ.instance-auto-minor-version-upgrade.js",
        "packages/@aws-cdk/aws-pipes-alpha/test/integ.logs.js",
        "packages/@aws-cdk/aws-pipes-alpha/test/integ.pipe.js",
        "packages/@aws-cdk/aws-pipes-enrichments-alpha/test/integ.api-destination.js",
        "packages/@aws-cdk/aws-pipes-enrichments-alpha/test/integ.api-gateway.js",
        "packages/@aws-cdk/aws-pipes-enrichments-alpha/test/integ.lambda.js",
        "packages/@aws-cdk/aws-pipes-targets-alpha/test/integ.api-destination.js",
        "packages/@aws-cdk/aws-pipes-targets-alpha/test/integ.api-gateway.js",
        "packages/@aws-cdk/aws-pipes-targets-alpha/test/integ.firehose.js",
        "packages/@aws-cdk/aws-pipes-targets-alpha/test/integ.lambda.js",
        "packages/@aws-cdk/aws-pipes-targets-alpha/test/integ.sagemaker.js",
        "packages/@aws-cdk/integ-tests-alpha/test/assertions/providers/integ.invoke-function-assertions.js",
    ]
    
    for test_file in test_files:
        print("=" * 60)
        success = run_integ_test(test_file)
        if not success:
            print(f"Test failed: {test_file}")
        print()

if __name__ == "__main__":
    main()