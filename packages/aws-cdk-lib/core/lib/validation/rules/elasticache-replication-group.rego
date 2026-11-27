package cdk_rules.elasticache

import rego.v1

# Cross-property and cross-resource invariants for ElastiCache replication
# groups. `AWS::ElastiCache::ReplicationGroup` has no L2 construct — not in
# aws-cdk-lib, and not in aws-elasticache-alpha, which covers serverless
# caches and users only — so there is no construct-level validation these
# checks could live in instead: every replication group in a CDK app is
# written as an L1.
#
# All four catch verified deploy-time failures: CreateReplicationGroup rejects
# each of these shapes, so the mistake otherwise surfaces as a CloudFormation
# rollback mid-deployment. Each property on its own is schema-valid; it is the
# combination the service refuses, which the resource schema cannot state.
#
# Rule 001 is cross-resource: it joins a replication group to the parameter
# group it names through the template's Ref graph, because cluster mode is a
# property of the *parameter group*, not of the replication group — an
# invariant no single construct can check in isolation. The join only exists
# when the parameter group is defined in the same template; one referenced by
# name (`default.redis7.cluster.on`, or a group created outside the app) is
# not checked, since its parameters are not knowable from the template.
#
# Because these run on the synthesized template, they also cover resources
# defined through escape hatches and `CfnInclude`, and token-valued properties
# are already resolved. A value the template still leaves open at synthesis —
# a `Ref` to a stack parameter without a default — is never judged: every rule
# needs the template to spell the offending combination out.

# More than one node group needs a parameter group with cluster mode on
violation contains v if {
	some name in resources_of_type("AWS::ElastiCache::ReplicationGroup")
	node_groups := to_number(property(name, "NumNodeGroups"))
	node_groups > 1
	parameter_group := resolve(name, "Properties.CacheParameterGroupName")
	parameter_group in resources_of_type("AWS::ElastiCache::ParameterGroup")
	cluster_mode_off(parameter_group)
	v := make_diag_at(
		"CDK-ElastiCache-001", "ERROR", name,
		"Properties.CacheParameterGroupName",
		sprintf("NumNodeGroups is %v but parameter group %v does not set cluster-enabled to yes; the create fails with \"Use a parameter group with cluster-enabled parameter to create more than one node group.\"", [node_groups, parameter_group]),
	)
}

# A parameter group that carries no parameters at all leaves cluster mode at
# the family default, which is off.
cluster_mode_off(parameter_group) if not property(parameter_group, "Properties")

cluster_mode_off(parameter_group) if {
	parameters := resolve(parameter_group, "Properties.Properties")
	is_object(parameters)
	cluster_enabled := object.get(parameters, "cluster-enabled", "no")
	is_string(cluster_enabled)
	lower(cluster_enabled) != "yes"
}

# User group based access control needs encryption in transit
violation contains v if {
	some name in resources_of_type("AWS::ElastiCache::ReplicationGroup")
	user_groups := resolve(name, "Properties.UserGroupIds")
	is_array(user_groups)
	count(user_groups) > 0
	transit_encryption_off(name)
	v := make_diag_at(
		"CDK-ElastiCache-002", "ERROR", name,
		"Properties.UserGroupIds",
		"UserGroupIds is set without encryption in transit; the create fails with \"User group based access control requires encryption-in-transit to be enabled on the replication group.\"",
	)
}

# An AUTH token needs encryption in transit
violation contains v if {
	some name in resources_of_type("AWS::ElastiCache::ReplicationGroup")
	property(name, "AuthToken")
	transit_encryption_off(name)
	v := make_diag_at(
		"CDK-ElastiCache-003", "ERROR", name,
		"Properties.AuthToken",
		"AuthToken is set without encryption in transit; the create fails with \"The AUTH token is only supported when encryption-in-transit is enabled\"",
	)
}

# Encryption in transit is off when the template says so: the property is
# missing, or it is written out as false.
transit_encryption_off(name) if not property(name, "TransitEncryptionEnabled")

transit_encryption_off(name) if boolean_false(property(name, "TransitEncryptionEnabled"))

# Data tiering only runs on r6gd node types
violation contains v if {
	some name in resources_of_type("AWS::ElastiCache::ReplicationGroup")
	boolean_true(property(name, "DataTieringEnabled"))
	node_type := resolve(name, "Properties.CacheNodeType")
	is_string(node_type)
	startswith(node_type, "cache.")
	not r6gd_node_type(node_type)
	v := make_diag_at(
		"CDK-ElastiCache-004", "ERROR", name,
		"Properties.DataTieringEnabled",
		sprintf("data tiering is enabled on node type %v; the create fails with \"Data tiering is not supported for the node type %v.\"", [node_type, node_type]),
	)
}

r6gd_node_type(node_type) if {
	parts := split(node_type, ".")
	count(parts) >= 2
	parts[1] == "r6gd"
}

# A property as the template spells it. `resolve()` is undefined both for a
# property that is absent and for one whose value is still open at synthesis,
# and the rules above have to tell those two apart.
property(name, key) := value if {
	properties := input.resources[name].properties
	is_object(properties)
	value := properties[key]
}

# CloudFormation accepts a boolean written as a string, so both spellings are
# read. Anything else — an unresolved `Ref` among them — is neither.
boolean_true(value) if value == true

boolean_true(value) if lower(value) == "true"

boolean_false(value) if value == false

boolean_false(value) if lower(value) == "false"
