const { chromium } = require("playwright");
module.exports = async function (word) {
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();
	const page = await context.newPage();
	const baseURL = "https://www.yodobashi.com";
	await page.goto(baseURL);
	await page.waitForLoadState("networkidle");
	await page.locator("#getJsonData").fill(word);
	await page.locator("#js_keywordSearchBtn").click();
	await page.waitForLoadState("networkidle");
	const items = page.locator(".pListBlock > a");
	const count = await items.count();
	// console.log(count);
	let itemLinks = [],
		link;
	for (var i = 0; i < count; i++) {
		link = await items.nth(i).getAttribute("href");
		console.log(link);
		itemLinks.push(link);
	}
	let datasets = [],
		item = {};
	for (var k of itemLinks) {
		await page.goto(baseURL + k);
		// await page.waitForLoadState("networkidle");
		// Get Item Tile
		try {
			await page.waitForSelector("products_maintitle", {
				timeout: 3000,
			});
			item.title = await page.innerText("#products_maintitle");
		} catch (e) {
			item.title = "";
		}
		// Get item description
		try {
			await page.waitForSelector("#pinfo_productSummury", { timeout: 3000 });
			item.desc = await page.innerText("#pinfo_productSummury");
		} catch (e) {
			item.desc = "";
		}
		// Get item unit price
		try {
			await page.waitForSelector("#js_scl_unitPrice", { timeout: 3000 });
			item.price = await page.innerText("#js_scl_unitPrice");
		} catch (e) {
			item.price = "";
		}
		datasets.push(item);
	}

	console.log(datasets);

	// await page.screenshot({ path: `example.png` });
	// Create pages, interact with UI elements, assert values
	await context.close();
	await browser.close();
};
