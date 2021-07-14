/*
 * index.js
 * descript-web-v2
 *
 * Last modified by marcello on 5/19/20, 2:51 PM
 * Copyright © 2020 Descript, Inc. All rights reserved.
 */

const { DefaultReporter } = require('@jest/reporters');

// Based on https://github.com/mozilla/addons-frontend/blob/ea33d5edd7e1ec805226789f159404014e69ef0f/tests/jest-reporters/fingers-crossed.js
module.exports = class GithubReporter extends DefaultReporter {
    printTestFileHeader(testPath, config, result) {
        // Hide console if tests passed
        if (result.numFailingTests === 0) {
            result.console = undefined;
        }
        super.printTestFileHeader(testPath, config, result);
    }

    onTestResult(test, testResult, aggregatedResults) {
        super.onTestResult(test, testResult, aggregatedResults);
        if (process.env.GITHUB_ACTIONS !== 'true') {
            return;
        }
        // Based on https://github.com/stefanbuck/jest-matcher/pull/2/files
        const { testResults, testFilePath } = testResult;
        for (const { failureMessages } of testResults) {
            for (const failureMessage of failureMessages) {
                const [, line, col] = failureMessage.match(/:([0-9]+):([0-9]+)/);
                const message = failureMessage.replace(/\n/g, '%0A');
                process.stderr.write(
                    `::error file=${testFilePath},line=${line},col=${col}::${message}\n`,
                );
            }
        }
    }
};
