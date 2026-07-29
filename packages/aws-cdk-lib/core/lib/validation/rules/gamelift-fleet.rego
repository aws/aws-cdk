package cdk_rules.gamelift

import rego.v1

# Port of the aws-gamelift-alpha BuildFleet L2 construct validations
# (packages/@aws-cdk/aws-gamelift-alpha/lib/build-fleet.ts) to Rego, so the
# same checks apply to any template — L1 escape hatches, CfnInclude, raw
# CloudFormation — not only apps that use the L2 construct.

# Fleet name can not be longer than 1024 characters
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	fleet_name := resolve(name, "Properties.Name")
	is_string(fleet_name)
	count(fleet_name) > 1024
	v := make_diag_at(
		"CDK-GameLift-001", "ERROR", name,
		"Properties.Name",
		sprintf("Fleet name can not be longer than 1024 characters but has %d characters", [count(fleet_name)]),
	)
}

# Fleet description can not be longer than 1024 characters
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	description := resolve(name, "Properties.Description")
	is_string(description)
	count(description) > 1024
	v := make_diag_at(
		"CDK-GameLift-002", "ERROR", name,
		"Properties.Description",
		sprintf("Fleet description can not be longer than 1024 characters but has %d characters", [count(description)]),
	)
}

# No more than 100 locations (home region + 99 remote) are allowed per fleet
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	locations := resolve(name, "Properties.Locations")
	is_array(locations)
	count(locations) > 100
	v := make_diag_at(
		"CDK-GameLift-003", "ERROR", name,
		"Properties.Locations",
		sprintf("No more than 100 locations are allowed per fleet, given %d", [count(locations)]),
	)
}

# No more than 50 ingress rules are allowed per fleet
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	permissions := resolve(name, "Properties.EC2InboundPermissions")
	is_array(permissions)
	count(permissions) > 50
	v := make_diag_at(
		"CDK-GameLift-004", "ERROR", name,
		"Properties.EC2InboundPermissions",
		sprintf("No more than 50 ingress rules are allowed per fleet, given %d", [count(permissions)]),
	)
}

# Location capacity: DesiredEC2Instances, MinSize and MaxSize cannot be negative
violation contains v if {
	some name in resources_of_type("AWS::GameLift::Fleet")
	locations := resolve(name, "Properties.Locations")
	is_array(locations)
	some i, location in locations
	some field in ["DesiredEC2Instances", "MinSize", "MaxSize"]
	value := location.LocationCapacity[field]
	is_number(value)
	value < 0
	v := make_diag_at(
		"CDK-GameLift-005", "ERROR", name,
		sprintf("Properties.Locations.%d.LocationCapacity.%s", [i, field]),
		sprintf("%s for the Fleet cannot be lower than 0, given %v", [field, value]),
	)
}
