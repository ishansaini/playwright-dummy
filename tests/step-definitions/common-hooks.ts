import { ICustomWorld } from "./custom-world";
import * as core from '@actions/core' 
import {
	ChromiumBrowser,
	chromium
} from '@playwright/test'
import { After, AfterAll, Before, BeforeAll } from '@cucumber/cucumber'

let browser: ChromiumBrowser

BeforeAll(async function() {
    browser = await chromium.launch({ headless: false })
  });
  
Before(async function(this: ICustomWorld) {
  this.context = await browser.newContext()
  this.page = await this.context.newPage()
});

After(async function(this: ICustomWorld) {
  await this.page?.close()
  await this.context?.close()
});
  
AfterAll(async function() {
  await core.summary
  .addHeading('Test Results')
  .addCodeBlock("generateTestResults()", "js")
  .addTable([
    [{data: 'File', header: true}, {data: 'Result', header: true}],
    ['foo.js', 'Pass ✅'],
    ['bar.js', 'Fail ❌'],
    ['test.js', 'Pass ✅']
  ])
  .addLink('View staging deployment!', 'https://github.com')
  .write()
  await browser.close()
});