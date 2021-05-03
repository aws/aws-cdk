target:
	@$(MAKE) pr

dev:
	pip3 install --upgrade pip pipenv
	pipenv install --dev

test:
	pipenv run coverage run -m unittest discover

coverage: test
	pipenv run coverage report

coverage-html: test
	pipenv run coverage html

pr: test
