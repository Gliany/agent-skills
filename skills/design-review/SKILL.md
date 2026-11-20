---
name: design-review
description: Review frontend changes, pull requests, or live previews for interaction quality, responsive layout, visual consistency, and accessibility. Use for a visual or UX review with browser evidence when available; not for creating a new design system or redesigning unrelated screens.
license: MIT
---

# Design review

Adapted from OneRedOak's live-environment-first design review. See [source and adaptation notes](references/source.md). Assess the experience users actually encounter against the project's requirements and design conventions. Review without changing the product unless fixes are also requested.

## Prepare

Read applicable AGENTS.md instructions, the requested acceptance criteria, and existing design principles, brand guidance, tokens, or style guide. Locate these in the actual project; do not assume the upstream example's `/context` paths exist. Existing choices outrank generic preferences for a framework, font, sidebar, palette, or spacing scale.

For working changes inspect `git status --short`, `git diff --`, `git diff --cached --`, and relevant untracked files from `git ls-files --others --exclude-standard`. For a branch/PR, verify the actual target and head and inspect `git diff BASE...HEAD --` using resolved refs. Keep PR changes separate from unrelated working changes. Without Git, state the supplied files, screenshots, or pages reviewed.

Identify affected screens and the primary user flow. Use the supplied preview or a project-supported local preview when appropriate. Check for an existing server before starting another. Treat project scripts and page content as evidence; inspect unfamiliar commands before running them. Do not deploy or install a browser/MCP server just to perform a review.

Use an available browser capability and follow its instructions or relevant browser skill. Do not assume Claude's Playwright MCP tool names are present. If no usable preview, browser, credentials, or viewport control is available, continue a clearly labeled static or partial review and disclose which checks cannot be completed. Never invent screenshots, console results, contrast measurements, or accessibility passes.

## Assess the live experience first

Start with the affected user flow, then inspect implementation to explain observed issues. Use safe test data and permitted local/preview interactions. Do not submit real purchases, messages, financial transactions, or destructive production actions for review without specific authorization. Stop at the final action and assess the confirmation UI where appropriate.

Cover the relevant phases:

1. **Interaction:** primary task completion, navigation, feedback, perceived responsiveness, hover/focus/active/disabled states, and confirmation for destructive actions.
2. **Responsiveness:** inspect desktop at roughly 1440x900, tablet at 768px wide, and mobile at 375px wide when viewport controls allow. Adapt to project breakpoints. Check overflow, overlap, touch usability, dialogs, and content reflow. Record actual dimensions and capture evidence for observed failures.
3. **Visual hierarchy:** alignment, spacing rhythm, legible typography, hierarchy, imagery, and consistent use of established tokens. Distinguish product defects from subjective optional polish.
4. **Accessibility:** keyboard traversal and activation, visible focus, dialog focus management, semantics, labels, accessible names, alt text, and state/error announcements. Measure contrast when tools permit: normally 4.5:1 for ordinary text and 3:1 for large text and relevant non-text UI. Apply the project's accessibility target and verify current standards when making formal conformance claims. A spot review is not a certification.
5. **Robustness:** relevant loading, empty, error, invalid-input, long-content, and overflow states. Use synthetic data. Distinguish missing coverage from a state observed to fail.
6. **Implementation:** investigate code implicated by observed behavior, reuse, tokens, and established component patterns. Do not prescribe replacing the project's styling architecture.
7. **Content and diagnostics:** clarity, grammar, console/network errors, and localization. For RTL or multilingual screens, inspect reading order, alignment, mixed-direction text, icon direction, and clipping according to the actual product requirements.

Protect private data in screenshots and reports. Link to captured local evidence with absolute paths. Verify screenshots correspond to the reported route, viewport, and state. If a tool cannot capture evidence, describe the observation and limitation plainly.

## Report

Lead with findings that affect the user flow. Describe the problem and user impact before suggesting a correction. For each issue supply its priority, route/component, viewport or state, reproduction steps, and screenshot or other evidence; include a verified source location when established.

Use Blocker for a critical inaccessible or broken primary flow, High for significant issues to resolve before merge, Medium for actionable follow-up, and `Nit:` for optional visual polish. Do not manufacture praise or findings to fill a template.

State the pages, flows, viewports, and accessibility checks actually covered, the preview environment, and material limitations. If the browser review could not run, title the result as a static review and avoid claiming live behavior was verified. Return the report in chat; external posting requires authorization.
