.PHONY: run
run:
	php -S localhost:8080 -t .

.PHONY: test
test:
	npm test
