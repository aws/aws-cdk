package cdk_rules.gamelift

import rego.v1

# Cross-field GameLift invariants ported from the aws-gamelift-alpha L2
# constructs (build-fleet.ts, fleet-base.ts, alias.ts). Only checks the
# CloudFormation resource schema cannot express are included here — schema
# limits (lengths, item counts, per-field ranges, patterns) are already
# covered by the engine's built-in rules (F3031-F3034).
#
# Because these run on the synthesized template, they also cover L1
# constructs, escape hatches, and CfnInclude, and token-valued properties
# are already resolved.

# An ingress rule's port range must not be inverted (FromPort <= ToPort)
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	permissions := resolve(name, "Properties.EC2InboundPermissions")
	is_array(permissions)
	some i, permission in permissions
	from_port := permission.FromPort
	to_port := permission.ToPort
	is_number(from_port)
	is_number(to_port)
	from_port > to_port
	v := make_diag_at(
		"CDK-GameLift-001", "ERROR", name,
		sprintf("Properties.EC2InboundPermissions.%d.FromPort", [i]),
		sprintf("Ingress rule port range is inverted: FromPort %v is greater than ToPort %v", [from_port, to_port]),
	)
}

# A location's capacity must satisfy MinSize <= MaxSize
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	locations := resolve(name, "Properties.Locations")
	is_array(locations)
	some i, location in locations
	min_size := location.LocationCapacity.MinSize
	max_size := location.LocationCapacity.MaxSize
	is_number(min_size)
	is_number(max_size)
	min_size > max_size
	v := make_diag_at(
		"CDK-GameLift-002", "ERROR", name,
		sprintf("Properties.Locations.%d.LocationCapacity.MinSize", [i]),
		sprintf("Location capacity MinSize %v is greater than MaxSize %v", [min_size, max_size]),
	)
}

# A location's DesiredEC2Instances must lie within [MinSize, MaxSize]
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	locations := resolve(name, "Properties.Locations")
	is_array(locations)
	some i, location in locations
	desired := location.LocationCapacity.DesiredEC2Instances
	min_size := location.LocationCapacity.MinSize
	max_size := location.LocationCapacity.MaxSize
	is_number(desired)
	is_number(min_size)
	is_number(max_size)
	min_size <= max_size # avoid double-reporting on top of CDK-GameLift-002
	outside_range(desired, min_size, max_size)
	v := make_diag_at(
		"CDK-GameLift-003", "ERROR", name,
		sprintf("Properties.Locations.%d.LocationCapacity.DesiredEC2Instances", [i]),
		sprintf("Location capacity DesiredEC2Instances %v is outside the range [MinSize %v, MaxSize %v]", [desired, min_size, max_size]),
	)
}

outside_range(value, lower, upper) if value < lower

outside_range(value, lower, upper) if value > upper

# An alias with SIMPLE routing must not carry a terminal Message
violation contains v if {
	some name, res in input.resources
	res.resourceType == "AWS::GameLift::Alias"
	res.properties.RoutingStrategy.Type == "SIMPLE"
	res.properties.RoutingStrategy.Message
	v := make_diag_at(
		"CDK-GameLift-004", "ERROR", name,
		"Properties.RoutingStrategy.Message",
		"Alias with SIMPLE routing must not set a terminal Message; either route to a fleet or set a terminal message, not both",
	)
}

# An alias with TERMINAL routing must not point at a fleet
violation contains v if {
	some name, res in input.resources
	res.resourceType == "AWS::GameLift::Alias"
	res.properties.RoutingStrategy.Type == "TERMINAL"
	res.properties.RoutingStrategy.FleetId
	v := make_diag_at(
		"CDK-GameLift-005", "ERROR", name,
		"Properties.RoutingStrategy.FleetId",
		"Alias with TERMINAL routing must not reference a fleet; either route to a fleet or set a terminal message, not both",
	)
}
