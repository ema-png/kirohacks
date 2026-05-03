# Requirements Document

## Introduction

The Landing Page and Navigation feature is the public-facing shell of the PlateShare / NoBeef application. It provides the fixed navigation bar, the hero section that hosts the onboarding widget, the "How It Works" marketing section, and the site footer. Together these components form the complete page layout that visitors see on arrival, guide them toward starting the onboarding flow, and give them enough context to understand the product's value proposition. The feature also includes scroll-aware visual behaviour, responsive mobile navigation, and hash-based in-page scrolling.

---

## Glossary

- **Navbar**: The fixed top navigation bar rendered on every page, containing the logo, desktop nav links, the "Start Here" CTA, and the mobile hamburger menu.
- **Logo**: The branded mark in the Navbar consisting of an icon and the wordmark "PlateShare" (desktop) or "NoBeef" (footer), linking back to the hero section.
- **CTA_Button**: The "Start Here →" call-to-action button in the Navbar that navigates the user to the hero section.
- **HamburgerMenu**: The mobile-only toggle button in the Navbar that opens and closes the MobileMenuPanel.
- **MobileMenuPanel**: The slide-down panel revealed on mobile when the HamburgerMenu is activated, containing nav links and the CTA_Button.
- **Hero**: The full-viewport-height section directly below the Navbar that embeds the OnboardingFlow widget and decorative background layers.
- **OnboardingFlow**: The multi-step wizard component embedded inside the Hero section.
- **HowItWorks**: The marketing section below the Hero that explains the four-step process from location input to restaurant results.
- **StepCard**: One of the four cards inside HowItWorks representing a single step in the process.
- **CalloutCard**: The "28 seconds" summary card at the bottom of the HowItWorks section.
- **Footer**: The dark-teal bar at the bottom of every page containing the logo, tagline, nav links, legal links, and asset attribution.
- **ScrollToHash**: The utility component that scrolls the viewport to a named anchor after a route change, or to the top of the page when no hash is present.
- **App**: The root layout component that composes Navbar, Hero, the main content sections, and Footer.
- **HomePage**: The page component used for the `/` route, rendering Hero and Footer.
- **HowItWorksPage**: The page component used for the `/how-it-works` route, rendering the HowItWorks section and Footer with its own background treatment.

---

## Requirements

### Requirement 1: Fixed Navigation Bar

**User Story:** As a visitor, I want a persistent navigation bar at the top of the page, so that I can access key sections and start the app from anywhere on the page.

#### Acceptance Criteria

1. THE Navbar SHALL be rendered at a fixed position at the top of the viewport with a z-index that places it above all page content.
2. THE Navbar SHALL have a height of 64 px.
3. THE Navbar SHALL display the Logo on the left side.
4. WHEN the user activates the Logo, THE Navbar SHALL navigate the viewport to the `#app` anchor (the Hero section).
5. THE Navbar SHALL display desktop nav links "How It Works" and "Why Different" in the centre on viewports 768 px wide and above.
6. THE Navbar SHALL display the CTA_Button on the right side on viewports 768 px wide and above.
7. WHEN the user activates the CTA_Button, THE Navbar SHALL navigate the viewport to the `#app` anchor.
8. THE Navbar SHALL hide the desktop nav links and CTA_Button on viewports narrower than 768 px.
9. THE Navbar SHALL display the HamburgerMenu button on viewports narrower than 768 px.

---

### Requirement 2: Scroll-Aware Navbar Background

**User Story:** As a visitor, I want the navbar background to change as I scroll, so that the page content beneath it remains readable at all scroll positions.

#### Acceptance Criteria

1. WHILE the vertical scroll position is 20 px or less, THE Navbar SHALL render with a plain white background and a bottom border.
2. WHEN the vertical scroll position exceeds 20 px, THE Navbar SHALL transition to a frosted-glass background (white at 90% opacity with backdrop blur) and a subtle drop shadow.
3. WHEN the vertical scroll position returns to 20 px or less, THE Navbar SHALL transition back to the plain white background.
4. THE Navbar background transition SHALL complete within 300 milliseconds.
5. WHEN the Navbar component is unmounted, THE Navbar SHALL remove the scroll event listener from the window.

---

### Requirement 3: Mobile Hamburger Menu

**User Story:** As a visitor on a mobile device, I want a hamburger menu, so that I can access navigation links without them cluttering the small screen.

#### Acceptance Criteria

1. WHEN the user activates the HamburgerMenu button while the MobileMenuPanel is closed, THE Navbar SHALL open the MobileMenuPanel below the Navbar bar.
2. WHEN the user activates the HamburgerMenu button while the MobileMenuPanel is open, THE Navbar SHALL close the MobileMenuPanel.
3. WHILE the MobileMenuPanel is open, THE HamburgerMenu button SHALL display a close (×) icon.
4. WHILE the MobileMenuPanel is closed, THE HamburgerMenu button SHALL display a hamburger (≡) icon.
5. THE MobileMenuPanel SHALL display the "How It Works" and "Why Different" nav links.
6. THE MobileMenuPanel SHALL display the CTA_Button spanning the full panel width.
7. WHEN the user activates any nav link inside the MobileMenuPanel, THE Navbar SHALL close the MobileMenuPanel.
8. WHEN the user activates the CTA_Button inside the MobileMenuPanel, THE Navbar SHALL close the MobileMenuPanel and navigate the viewport to the `#app` anchor.
9. THE HamburgerMenu button SHALL have an accessible `aria-label` attribute.

---

### Requirement 4: Hero Section

**User Story:** As a visitor, I want a visually engaging hero section that immediately presents the app, so that I can start using it without scrolling.

#### Acceptance Criteria

1. THE Hero SHALL occupy the full viewport height minus the 64 px Navbar height, with a top margin equal to the Navbar height so it is not obscured.
2. THE Hero SHALL render the OnboardingFlow widget as its primary content.
3. THE Hero SHALL display decorative background layers including a colour wash, a palette mesh gradient, a dot-grid pattern, and at least three blurred colour blobs, all non-interactive.
4. THE Hero section SHALL have the HTML id `app` so that Navbar anchor links resolve correctly.
5. THE Hero background layers SHALL be pointer-events-none so they do not intercept user interaction with the OnboardingFlow.

---

### Requirement 5: How It Works Section

**User Story:** As a visitor, I want to understand the four-step process, so that I know what to expect before I start the onboarding flow.

#### Acceptance Criteria

1. THE HowItWorks section SHALL display a section heading "4 steps take you from Chaos → Consensus".
2. THE HowItWorks section SHALL display exactly four StepCards in the order: Step 01 Drop Your Location, Step 02 Add Everyone's Profile, Step 03 Finding the Middle Ground, Step 04 Get Your Personalized List.
3. EACH StepCard SHALL display a sticker image, a step number label, a title, and a description.
4. THE HowItWorks section SHALL display a horizontal connecting line between the four StepCards on viewports 1024 px wide and above.
5. THE HowItWorks section SHALL display directional arrow indicators between StepCards on viewports narrower than 1024 px.
6. THE HowItWorks section SHALL display the CalloutCard below the step grid.
7. THE CalloutCard SHALL display the text "Average decision time: 28 seconds."
8. THE HowItWorks section SHALL have the HTML id `how-it-works` so that Navbar anchor links resolve correctly.
9. THE HowItWorks section SHALL display decorative background blobs that are non-interactive.
10. EACH StepCard sticker image SHALL have a non-empty `alt` attribute describing the image.
11. EACH StepCard sticker image SHALL be loaded lazily.

---

### Requirement 6: How It Works Page

**User Story:** As a visitor navigating to `/how-it-works`, I want to see the How It Works section as a standalone page, so that I can share or bookmark a direct link to it.

#### Acceptance Criteria

1. THE HowItWorksPage SHALL render the HowItWorks section as the primary content.
2. THE HowItWorksPage SHALL render the Footer below the HowItWorks section.
3. THE HowItWorksPage SHALL apply its own background treatment (gradient wash and dot-grid overlay) independent of the home page background.
4. WHEN the user navigates to `/how-it-works#how-it-works`, THE ScrollToHash component SHALL NOT scroll the viewport (the section is already at the top of the page).

---

### Requirement 7: Footer

**User Story:** As a visitor, I want a footer with branding, navigation, and legal links, so that I can find key pages and understand the product's identity from the bottom of any page.

#### Acceptance Criteria

1. THE Footer SHALL display the NoBeef logo mark and wordmark on the left side.
2. WHEN the user activates the Footer logo, THE Footer SHALL navigate to the `/` route.
3. THE Footer SHALL display the tagline "Group food picks, fast." adjacent to the logo.
4. THE Footer SHALL display nav links "Home" and "How It Works" linking to `/` and `/how-it-works` respectively.
5. THE Footer SHALL display legal placeholder links for "Privacy", "Terms", and "Cookies".
6. THE Footer SHALL display the current year in the copyright notice, computed dynamically.
7. THE Footer SHALL display attribution text crediting the logo sticker asset to Magnific on Flaticon, with hyperlinks to the asset page and the Flaticon homepage.
8. THE Footer attribution links SHALL open in a new browser tab with `rel="noopener noreferrer"`.
9. THE Footer SHALL use a dark teal background (`bg-cyan-800`) with white text.

---

### Requirement 8: Page Layout and Section Composition

**User Story:** As a visitor on the home page, I want all marketing sections to appear in a logical order below the hero, so that I can learn about the product as I scroll.

#### Acceptance Criteria

1. THE App SHALL render sections in the following order: Navbar, Hero, main (Problem, HowItWorks, Features, WhyDifferent, Testimonials, CTA), Footer.
2. THE App SHALL wrap the marketing sections (Problem through CTA) in a `<main>` element.
3. THE Navbar SHALL be rendered outside the `<main>` element so it is not part of the document's main content landmark.
4. THE Footer SHALL be rendered outside the `<main>` element.

---

### Requirement 9: Hash-Based In-Page Scrolling

**User Story:** As a visitor clicking a nav link that targets a page section, I want the viewport to scroll smoothly to that section, so that I land in the right place without a jarring jump.

#### Acceptance Criteria

1. THE ScrollToHash component SHALL be rendered inside the BrowserRouter context so it has access to the current location.
2. WHEN the current URL contains a hash fragment, THE ScrollToHash component SHALL scroll the element with the matching id into view using smooth scrolling.
3. WHEN the current URL contains no hash fragment, THE ScrollToHash component SHALL scroll the viewport to the top of the page.
4. THE ScrollToHash component SHALL re-evaluate the scroll target whenever the pathname or hash changes.
5. WHEN the pathname is `/how-it-works` and the hash is `#how-it-works`, THE ScrollToHash component SHALL skip the scroll so the page does not jump unnecessarily.
6. THE ScrollToHash component SHALL schedule the scroll inside a `requestAnimationFrame` callback to allow the DOM to settle after a route change.
7. WHEN the ScrollToHash component unmounts or the effect re-runs, THE ScrollToHash component SHALL cancel any pending `requestAnimationFrame` callback.

---

### Requirement 10: "Start Here" Deep-Link to Onboarding

**User Story:** As a visitor clicking "Start Here" from an external link or a future campaign URL, I want to land directly on the location step of the onboarding flow, so that I can begin immediately without an extra click.

#### Acceptance Criteria

1. WHEN the application loads with the URL query parameter `step=location`, THE OnboardingFlow SHALL navigate directly to the StepLocation step.
2. WHEN the `step=location` parameter is consumed, THE OnboardingFlow SHALL remove it from the URL without adding a new browser history entry.
3. THE CTA_Button in the Navbar SHALL link to `#app` so that clicking it scrolls to the Hero section where the OnboardingFlow is embedded.

---

### Requirement 11: Responsive Layout

**User Story:** As a visitor on any device, I want the landing page to adapt to my screen size, so that the content is readable and usable on both mobile and desktop.

#### Acceptance Criteria

1. THE Navbar SHALL display the desktop layout (centred nav links + CTA_Button) on viewports 768 px wide and above.
2. THE Navbar SHALL display the mobile layout (HamburgerMenu only) on viewports narrower than 768 px.
3. THE HowItWorks step grid SHALL display four columns on viewports 1024 px wide and above.
4. THE HowItWorks step grid SHALL display two columns on viewports between 640 px and 1023 px wide.
5. THE HowItWorks step grid SHALL display one column on viewports narrower than 640 px.
6. THE Footer SHALL display its logo, tagline, and nav links in a single row on viewports 640 px wide and above.
7. THE Footer SHALL stack its logo, tagline, and nav links vertically on viewports narrower than 640 px.

---

### Requirement 12: Sticker Asset Attribution

**User Story:** As a legal stakeholder, I want all third-party sticker assets to be properly attributed, so that the application complies with the asset licences.

#### Acceptance Criteria

1. THE Footer SHALL display visible attribution for the NoBeef logo sticker crediting Magnific on Flaticon.
2. THE Footer attribution SHALL include a hyperlink to the specific asset page (`https://www.flaticon.com/free-sticker/beef_10310051`) and a hyperlink to the Flaticon homepage (`https://www.flaticon.com/`).
3. EACH StepCard sticker image in HowItWorks SHALL be sourced from the Flaticon CDN (`cdn-icons-png.flaticon.com`).
