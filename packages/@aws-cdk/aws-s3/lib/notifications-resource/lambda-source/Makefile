target:
	@$(MAKE) pr

dev:
	pip3 install --upgrade pip pipenv
	pipenv install --dev --pre

test:
	pipenv run coverage run -m unittest discover
	pipenv run coverage report

coverage-html: test
	pipenv run coverage html

pr: test
