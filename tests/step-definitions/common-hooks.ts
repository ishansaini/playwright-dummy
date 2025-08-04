import { ICustomWorld } from "./custom-world";
import * as core from "@actions/core";
import { ChromiumBrowser, chromium } from "@playwright/test";
import {
  After,
  AfterAll,
  AfterStep,
  Before,
  BeforeAll,
} from "@cucumber/cucumber";

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true, slowMo: 2000 });
});

Before(async function (this: ICustomWorld, scenario) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

AfterStep(async function (this: ICustomWorld, scenario) {
  console.log(scenario.pickleStep.text);
});

After(async function (this: ICustomWorld, scenario) {
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
