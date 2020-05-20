// Print a big banner before every test, much more readable output
jasmine.getEnv().addReporter({
  specStarted: currentTest => {
    process.stdout.write('================================================================\n');
    process.stdout.write(`${currentTest.fullName}\n`);
    process.stdout.write('================================================================\n');
  }
});