import json

def get_type(propspec):
  return propspec.get('PrimitiveType', '???')

model = json.load(open('spec-source/000_CloudFormationResourceSpecification.json'))

types = ['PropertyTypes', 'ResourceTypes']
for type in types:
  for name, typespec in model[type].items():
    for propname, propspec in typespec['Properties'].items():
      if 'policy' in propname.lower():
        print('%s:%s -> %s' % (name, propname, get_type(propspec)))
