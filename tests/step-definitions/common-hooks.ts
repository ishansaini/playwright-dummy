import { ICustomWorld } from "./custom-world";
import * as core from '@actions/core';
import {
	ChromiumBrowser,
	chromium
} from '@playwright/test'
import { After, AfterAll, Before, BeforeAll } from '@cucumber/cucumber'

let browser: ChromiumBrowser

BeforeAll(async function() {
    browser = await chromium.launch({ headless: true })
  });
  
Before(async function(this: ICustomWorld) {
  this.context = await browser.newContext()
  this.page = await this.context.newPage()
});

After(async function(this: ICustomWorld) {
  await this.page?.close()
  await this.context?.close()
  await core.summary
    .addHeading('E2E test results')
    .addCodeBlock("Explore playwright", "js")
    .addTable([
      [{data: 'File', header: true}, {data: 'Result', header: true}],
      ['foo.js', 'Pass ✅'],
      ['bar.js', 'Fail ❌'],
      ['test.js', 'Pass ✅']
    ])
    .addLink('View staging deployment!', 'https://github.com')
    .write()
});
  
AfterAll(async function() {
  await browser.close()
});