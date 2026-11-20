# Navigation and access baseline

Baseline inspected on 2026-10-25. This is a starting map, not a guarantee of future routes, authentication, or feature operation. Re-observe the live site on each task.

## Official entry points observed

| Section | Entry point |
| --- | --- |
| Home | https://www.yad2.co.il/ |
| Property for sale | https://www.yad2.co.il/realestate/forsale |
| Property for rent | https://www.yad2.co.il/realestate/rent |
| Commercial property | https://www.yad2.co.il/realestate/commercial |
| New developments | https://www.yad2.co.il/yad1 |
| Cars | https://www.yad2.co.il/vehicles/cars |
| Vehicle price list | https://www.yad2.co.il/price-list |
| Second-hand marketplace | https://www.yad2.co.il/market |
| Publishing entry | https://www.yad2.co.il/publish |
| Personal area / My ads | https://www.yad2.co.il/my-ads |
| Favorites | https://www.yad2.co.il/my-favorites |
| Alerts | https://www.yad2.co.il/my-alerts |
| Recent searches | https://www.yad2.co.il/latestsearches |

The live menu also exposed other vehicle types, pets, business listings, service professionals, overseas property, and external job search. Discover their current targets through the menu. Do not treat external partner sites as covered by the same authentication or permissions.

## Connection model

Normal Chrome browser access was used. Sign-in and personal-area access were verified through the visible account menu and My ads page. No account identity, credentials, or private account content belongs in this shared skill. Session continuity must be checked at use time.

No official Yad2 API or MCP connection has been established by this skill. Community instructions for rentals and second-hand ad drafting were reviewed but do not provide authenticated full-site connectivity. Community MCP implementations that advertise stealth challenge bypass were not installed. This custom skill uses the normal supported browser flow.

## Validation scope

| Read check | Observed result on baseline date |
| --- | --- |
| Authentication | Account menu exposed Logout; personal area loaded the signed-in profile and My ads state. |
| Rental navigation | Rental landing page and one rental detail opened; price, transaction type, area, recurring fee, and broker label were readable. No personalized filtered search was executed. |
| Cars | Cars feed and filter controls loaded; one vehicle detail opened with year, mileage, owner-count label, registration, price, and original-ownership label. Filters were not submitted. |
| Second-hand products | Marketplace loaded and one product detail opened with price, description, condition, dimensions, category, and seller section. No personalized filtered search was executed. |
| Publishing entry | Category chooser loaded for property, vehicles, products, and other sections; no category form was filled and no ad was created. |

Public detail pages used for the read checks were rental `https://www.yad2.co.il/realestate/item/tel-aviv-area/jswpoqak`, vehicle `https://www.yad2.co.il/vehicles/item/x8palenz`, and product `https://www.yad2.co.il/market/item/15427949068348`. These are access evidence, not recommendations or guaranteed active listings.

Some listing links open a new tab. Inspect the newly opened task tab rather than treating an unchanged feed as failure or clicking again. Property amenity lists may expose labels for both available and unavailable features in accessibility text; inspect the visible state or indicators before claiming an amenity is present. Preserve distinctions such as total listed area versus built area and original company ownership versus owner count.

Publishing, ad changes/removal, chat sends, saved-search/favorite changes, payments, and external partner integrations have not been tested through a write operation. Favorites, alerts, and chat menu visibility alone does not establish their end-to-end operation. The instruction package passed the Skill Creator structural validator; this does not prove every future site workflow.
