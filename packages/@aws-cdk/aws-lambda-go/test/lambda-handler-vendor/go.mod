module aws-lambda-golang

go 1.16

require (
	github.com/aws/aws-lambda-go v1.19.1
	github.com/go-check/check v0.0.0-20200902074654-038fdea0a05b // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/niemeyer/pretty v0.0.0-20200227124842-a10e7caefd8e // indirect
)

replace (
	gopkg.in/check.v1 => github.com/go-check/check v0.0.0-20200902074654-038fdea0a05b
	gopkg.in/yaml.v2 => github.com/go-yaml/yaml v2.1.0+incompatible
	gopkg.in/yaml.v3 => github.com/go-yaml/yaml v0.0.0-20200615113413-eeeca48fe776
)
