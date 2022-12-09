def handler(event, context):
  # read testfile and return contents, so the test can verify it
  #
  with open('test.txt', 'r') as f:
    return f.readline().rstrip().strip('\n')
