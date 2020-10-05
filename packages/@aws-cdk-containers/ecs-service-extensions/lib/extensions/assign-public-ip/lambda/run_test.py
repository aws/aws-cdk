import unittest

if __name__ == "__main__":
    test_suite = unittest.defaultTestLoader.discover('.')
    unittest.TextTestRunner().run(test_suite)
