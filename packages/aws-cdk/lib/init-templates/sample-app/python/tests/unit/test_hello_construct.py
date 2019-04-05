import unittest

from aws_cdk import cdk

from hello.hello_construct import HelloConstruct

class TestHelloConstruct(unittest.TestCase):

    def setUp(self):
        self.app = cdk.App()
        self.stack = cdk.Stack(self.app, "TestStack")
    
    def test_num_buckets(self):
        num_buckets = 10
        hello = HelloConstruct(self.stack, "Test1", num_buckets)
        assert len(hello.buckets) == num_buckets