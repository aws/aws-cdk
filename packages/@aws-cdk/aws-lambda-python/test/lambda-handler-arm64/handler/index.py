from itertools import count
from flupy import flu

def handler(event, context):
  # Example flupy processing an infinite sequence
  pipeline = (
    flu(count())
    .map(lambda x: x**2)
    .filter(lambda x: x % 517 == 0)
    .chunk(5)
    .take(3)
  )
  for item in pipeline:
    print(item)

  return 200
