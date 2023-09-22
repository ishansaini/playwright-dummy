import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { ICustomWorld } from './custom-world'

Given('User visits playwright homepage', async function (this: ICustomWorld) {
    const page = this.page!
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/end-to-end/);
})

When('User clicks on "GET STARTED" button', async function (this: ICustomWorld) {
    const page = this.page!
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installing Playwright' })).toBeVisible();
})

Then('User is able to navigate to community tab', async function (this: ICustomWorld) {
    const page = this.page!
    await page.getByRole('link', { name: 'Community' }).click();
    await expect(page.getByRole('heading', {name: 'Ambassadors'})).toBeVisible
})