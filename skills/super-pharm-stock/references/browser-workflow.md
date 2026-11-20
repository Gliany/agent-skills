# Super-Pharm inventory browser workflow

Read this when executing the lookup with `mcp__cua_repl`. These are patterns for the supported runtime, not a standalone script. Follow current browser-tool documentation if its API differs. Do not hardcode browser IDs or accessibility element numbers from an earlier run.

## Bind a browser and open the inventory application

On a fresh `cua_repl` session, make exactly the first entry-point call required by the tool. When browser inventory is needed:

```javascript
await cua.getState();
```

Read its output and select the browser according to the tool's browser-selection policy. Reuse the selected browser in subsequent calls. For a background lookup, create a tab with its actual inventory ID:

```javascript
var inventoryTab = await cua.createBrowserTab(
  browserId,
  'https://spinventoryapp.super-pharm.co.il/inventory',
  { visible: false }
);
```

`browserId` is an input taken from the current browser inventory, not the literal string `browserId`. Read the returned documentation and initial page state before interacting. If the binding does not expose `playwright`, use only its documented equivalent methods.

## Select the requested product and branch

Use the current page snapshot to resolve the product query, exact product label, city, and exact branch label from the user's request. The variables below are inputs resolved from current observations, not literal labels or stored personal lookup examples.

```javascript
await inventoryTab.playwright.getByRole('textbox', {
  name: 'חיפוש מוצר, תרופה (באנגלית), מותג, ברקוד...', exact: true
}).fill(productQuery);
nodeRepl.write(await inventoryTab.playwright.domSnapshot());
```

Wait for the exact observed suggestion with a supported locator wait. Distinguish strengths and packs; equivalent duplicate labels require checking the selected product card. Select the product, then fill `בחירת יישוב` with `cityName` and select the actual city suggestion. Open `חיפוש סניף` and select the exact branch observed in the snapshot. Typed text alone does not establish selection.

Click `בדיקת מלאי`, wait for the actual result card (the previously observed heading was `תוצאות החיפוש שלך`), and inspect the requested product under the selected branch. Read each dependent state before continuing. A missing result or changed UI means availability is unverified.

## Evidence

Use the documented screenshot method, save its bytes with supported local file I/O, inspect the saved screenshot, and embed the absolute image path in the answer. The evidence must include the product, branch/address and status. The screenshot may require scrolling into view or a full-page capture. Save it in the task's permitted evidence location or local temporary artifact storage; do not overwrite an earlier capture.

```javascript
var stockScreenshot = await inventoryTab.screenshot({ fullPage: true });
var stockCheckedAt = new Intl.DateTimeFormat('he-IL', {
  timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'short'
}).format(new Date());
nodeRepl.write(stockCheckedAt);
```

If the tool instead documents `getScreenshot()`, use that method; do not assume screenshot methods are interchangeable across runtimes. In the live validation, `screenshot({ fullPage: true })` failed while the wrapper's documented `getScreenshot()` succeeded. When this happens, capture the viewport with `getScreenshot()` and verify that all result details are visible. Do not repeat a failing full-page capture or print raw image bytes or base64.

## Specific recovery paths

- **Embedded iframe controls fail despite matching labels:** On the public stock-check page, inspect the rendered inventory iframe `src`. In the observed page it was `https://spinventoryapp.super-pharm.co.il/inventory`. Navigate the existing tab to the observed source and redo the selection on the top-level application. This resolved repeated stale-target failures for both accessibility indices and iframe-scoped Playwright locators.
- **A click opens a new tab:** List tabs in the already selected browser and bind the tab with the stock-check title/URL. Do not assume the original tab navigated.
- **Product suggestions have not loaded:** Wait for the specific observed candidate, not arbitrary delays. The same applies to city suggestions.
- **Branch field disabled:** Select the city suggestion. Filling its textbox alone is insufficient.
- **Stock-check button disabled:** Verify both the product chip and selected branch; a typed query is not a selection.
- **Old tab missing after a turn:** Temporary lookup tabs can close at turn end. Create a fresh tab in the same selected browser. Saved screenshots remain historical evidence only.
- **Direct inventory page no longer works:** Recover through the official public entry and inspect its current iframe source. If neither official path yields a result, report unverified availability and the concrete failure. Do not claim that the product is absent.
