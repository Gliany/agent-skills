---
name: super-pharm-stock
description: "Check live product or prescription-medicine availability at specific Super-Pharm Israel branches using its official stock-check application. Use for requests about מלאי סופר פארם, סופר־פארם, Super-Pharm stock, or availability at a named Super-Pharm branch. This capability is for Super-Pharm stock lookup, not medical advice or purchasing."
---

# Super-Pharm stock

Check the live Super-Pharm inventory UI and answer in Hebrew. A product listing, search-engine result, or earlier successful lookup is not a stock result.

## Site-specific entry points

- Public entry: https://shop.super-pharm.co.il/stock-check
- Official inventory application observed inside that page: https://spinventoryapp.super-pharm.co.il/inventory
- Prefer the direct inventory application for lookup. On the observed site, clicking suggestions through the embedded iframe repeatedly failed with `Click target is no longer available`; the same controls worked when the application was opened as the top-level page.
- If the direct application changes or fails, open the public entry and inspect its current rendered iframe URL. Use that observed URL rather than guessing replacement paths or undocumented API endpoints.

Use the available browser-control surface and its first-use documentation. For concrete `cua_repl` / Playwright calls and recovery, read [references/browser-workflow.md](references/browser-workflow.md).

## Exact lookup sequence

1. Resolve the requested product, pack/strength when relevant, city, and branch. Search prescription medicines by English brand name. Ask only if different product variants or branches remain materially ambiguous.
2. On the inventory application, fill the textbox whose placeholder is `חיפוש מוצר, תרופה (באנגלית), מותג, ברקוד...`. Wait for suggestions, then click the exact matching product text. Confirm the product appears as a selected chip and the search textbox clears. Typing the name without selecting a suggestion does not select a product.
3. Use the `סניף` search mode. Fill the textbox `בחירת יישוב`, then click the matching city button in the suggestions. The `חיפוש סניף` textbox becomes enabled only after selecting the city.
4. Click `חיפוש סניף` and choose the branch button by both branch name and street address. Entering a city or branch name without selecting the suggestion is incomplete.
5. Click the enabled `בדיקת מלאי` button. A loading indicator is an intermediate state. Read the completed `תוצאות החיפוש שלך` section.
6. Match the result card to the branch name/address and the exact product/pack. Report the status next to the product. `הכל זמין במלאי` summarizes a branch card; for multi-product requests, inspect each product rather than applying that summary to unlisted items.
7. Save a screenshot containing the branch, product and status, and record the actual check time in `Asia/Jerusalem`. Once this evidence is present, stop; do not open ordering flows to validate availability.

## Interpreting Super-Pharm results

- `זמין במלאי`: the site reports available at the selected branch at the check time. Do not invent a unit count.
- If the site displays limited stock or unavailable wording, preserve its exact wording and distinguish it from full availability.
- No matching product, no result card, a disabled button, loading that never completes, or a browser failure means availability was **not verified**; it does not establish out of stock.
- An online product page or an add-to-cart button does not establish local branch availability.
- The application's notice excludes Clalit HMO inventory and external-seller products. Do not claim coverage of that stock. State this exclusion when the user's question depends on it.
- Use the exact requested medicine/strength/pack. Do not substitute medicines or infer clinical suitability from inventory.

## Output and boundaries

Answer with product/pack, branch/address, exact displayed status, check date/time, a link to the public stock checker and the saved screenshot. Briefly mention the site's notice that displayed stock may differ from actual stock. State a blocker plainly if unverified.

Example format (replace fields with current observations):

`לפי מערכת המלאי של סופר־פארם, [מוצר ואריזה] מופיע כ־[סטטוס] בסניף [שם, כתובת], בבדיקה ב־[תאריך ושעה, שעון ישראל]. המלאי עשוי להשתנות.`

This capability authorizes read-only inventory lookup only. The `להזמנת מרשם דיגיטלי` button, reservation, purchase, prescription upload, account changes and contacting the pharmacy are separate actions requiring their own authorization. Do not send patient identifiers or infer who the medicine is for.

Reference examples use task inputs and do not establish current availability.
