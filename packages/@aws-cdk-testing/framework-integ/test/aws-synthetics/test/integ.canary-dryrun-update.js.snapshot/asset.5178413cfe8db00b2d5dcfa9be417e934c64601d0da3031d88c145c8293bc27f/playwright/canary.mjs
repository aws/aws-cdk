import { URL } from 'url';
import { synthetics } from '@amzn/synthetics-playwright';

const loadBlueprints = async function () {
    const urls = [process.env.URL];

    const browser = await synthetics.launch();
    const browserContext = await browser.newContext();
    let page = await synthetics.newPage(browserContext);

    for (const url of urls) {
        await loadUrl(page, url);
    }

    // Ensure browser is closed
    await synthetics.close();
};

// Reset the page in-between
const resetPage = async function(page) {
    try {
        // Set page.goto timeout to 30 seconds, adjust as needed
        // See https://playwright.dev/docs/api/class-page for page.goto options
        await page.goto('about:blank', { waitUntil: 'load', timeout: 30000 });
    } catch (e) {
        console.error('Unable to open a blank page. ', e);
    }
};

const loadUrl = async function (page, url) {
    let stepName = null;
    let domcontentloaded = false;

    try {
        stepName = new URL(url).hostname;
    } catch (e) {
        const errorString = `Error parsing url: ${url}. ${e}`;
        log.error(errorString);
        /* If we fail to parse the URL, don't emit a metric with a stepName based on it.
          It may not be a legal CloudWatch metric dimension name and we may not have an alarms
          setup on the malformed URL stepName.  Instead, fail this step which will
          show up in the logs and will fail the overall canary and alarm on the overall canary
          success rate.
        */
        throw e;
    };

    await synthetics.executeStep(stepName, async function () {
      try {
        /* You can customize the wait condition here.
          'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
          'load' - consider operation to be finished when the load event is fired.
          'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
          'commit' - consider operation to be finished when network response is received and the document started loading.

          Set page.goto timeout to 30 seconds, adjust as needed
          See https://playwright.dev/docs/api/class-page for page.goto options
        */
        const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        if (response) {
            domcontentloaded = true;
            const status = response.status();
            console.log(`Response status: ${status}`);

            // If the response status code is not a 2xx success code
            if (status < 200 || status > 299) {
                console.error(`Failed to load url: ${url}, status code: ${status}`);
                throw new Error('Failed');
            }
        } else {
            console.error(`No response returned for url: ${url}`);
            throw new Error(logNoResponseString);
        }
      } catch (e) {
        const errorString = `Error navigating to url: ${url}. ${e}`;
        console.error(errorString);
        throw e;
      }
    });

    // Reset page
    await resetPage(page);
};

export const handler = async (event, context) => {
    return await loadBlueprints();
};