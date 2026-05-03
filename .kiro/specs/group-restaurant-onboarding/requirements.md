# Requirements Document

## Introduction

The Group Restaurant Onboarding Flow is a multi-step wizard that helps groups of up to 8 people find a restaurant that works for everyone. Users provide their location, preferred dining style and cuisine, and each person's individual dietary needs, flavor cravings, foods to avoid, and budget. The system queries the Yelp API for nearby restaurants, then uses an AI model (OpenAI GPT-4o-mini) to rank results by how well they satisfy the whole group. The final screen presents ranked restaurant cards with group match scores, per-person meal suggestions, sort controls, and direct Yelp links.

---

## Glossary

- **OnboardingFlow**: The top-level React component that owns wizard state and orchestrates all steps.
- **StartScreen**: The landing screen that introduces the product and initiates the wizard.
- **StepLocation**: The wizard step where the user enters or detects their location.
- **StepVibe**: The wizard step where the group selects dining style and cuisine preferences.
- **StepPeople**: The wizard step where up to 8 people are added with individual preferences.
- **LoadingScreen**: The animated interstitial screen shown while the backend fetches and ranks restaurants.
- **StepResults**: The final wizard step that displays AI-ranked restaurant results.
- **ProgressBar**: The persistent step indicator shown above all steps except StartScreen.
- **PersonCard**: The collapsible card within StepPeople representing one person's preferences.
- **RestaurantCard**: A card in StepResults representing one ranked restaurant.
- **FilterSummaryCard**: A collapsible card in StepResults summarising the search inputs used.
- **Nominatim**: The OpenStreetMap geocoding service used for location autocomplete and reverse geocoding.
- **Yelp_API**: The Yelp Fusion API used to fetch nearby restaurant candidates.
- **AI_Ranker**: The OpenAI GPT-4o-mini model used to rank restaurants and generate per-person meal suggestions.
- **Backend**: The Express.js server (`server/index.js`) that proxies Yelp and OpenAI calls.
- **Hard_Dietary_Restriction**: A dietary need (Vegan, Vegetarian, Halal, Nut-Free, Gluten-Free) that must be accommodated; restaurants that cannot satisfy it are excluded from results.
- **Group_Match_Score**: The AI-computed score (0–100) representing how well a restaurant satisfies the whole group.
- **Satisfied_Count**: The number of people in the group whose preferences are met by a given restaurant.
- **Per_Person_Recs**: AI-generated dish suggestions for each person at a specific restaurant.

---

## Requirements

### Requirement 1: Start Screen

**User Story:** As a user, I want a welcoming landing screen, so that I understand the product's purpose and can begin the onboarding flow.

#### Acceptance Criteria

1. THE StartScreen SHALL display a headline, a short description, and a "Start Here" call-to-action button.
2. WHEN the user activates the "Start Here" button, THE OnboardingFlow SHALL transition to StepLocation.
3. THE StartScreen SHALL NOT display the ProgressBar.
4. WHEN the application receives a URL query parameter `step=location`, THE OnboardingFlow SHALL navigate directly to StepLocation and remove the query parameter from the URL without adding a history entry.

---

### Requirement 2: Progress Bar

**User Story:** As a user, I want to see where I am in the wizard, so that I know how many steps remain.

#### Acceptance Criteria

1. WHILE the active step is any step other than StartScreen, THE ProgressBar SHALL be visible above the step content.
2. THE ProgressBar SHALL display four labelled steps: Location, Vibe, Group, and Results, in that order.
3. WHEN a step has been completed, THE ProgressBar SHALL render that step's indicator in a visually distinct "completed" state (checkmark).
4. WHEN a step is the currently active step, THE ProgressBar SHALL render that step's indicator in a visually distinct "active" state.
5. WHILE the LoadingScreen is active, THE ProgressBar SHALL display the Results step as the active step.

---

### Requirement 3: Location Input

**User Story:** As a user, I want to enter my location by typing or using GPS, so that the system can find restaurants near me.

#### Acceptance Criteria

1. THE StepLocation SHALL display a text input field for entering a city, neighbourhood, or address.
2. WHEN the user types 3 or more characters into the location input, THE StepLocation SHALL query the Nominatim search API with a debounce of no more than 400 milliseconds and display up to 6 autocomplete suggestions.
3. WHEN the user selects an autocomplete suggestion, THE StepLocation SHALL populate the input with the suggestion's display name and store the associated latitude and longitude coordinates.
4. WHEN the user activates the "Use my current location" control, THE StepLocation SHALL request the browser's Geolocation API with high accuracy enabled and a 10-second timeout.
5. WHEN the Geolocation API returns a position, THE StepLocation SHALL reverse-geocode the coordinates via the Nominatim reverse API and populate the input with a human-readable label composed of road, neighbourhood, city, and state segments.
6. IF the Geolocation API returns an error, THEN THE StepLocation SHALL display an inline error message instructing the user to type their address instead.
7. IF the user advances to StepVibe without having selected an autocomplete suggestion, THEN THE OnboardingFlow SHALL attempt to forward-geocode the typed text via Nominatim and store the resulting coordinates before transitioning.
8. WHEN the location input is non-empty, THE StepLocation SHALL display a clear button that resets the input and stored coordinates.
9. WHILE the location input is empty, THE StepLocation SHALL disable the "Next" button.
10. WHEN the user activates the "Next" button with a non-empty location, THE OnboardingFlow SHALL transition to StepVibe.

---

### Requirement 4: Vibe and Cuisine Selection

**User Story:** As a group, I want to choose a dining style and cuisine type, so that the restaurant search is scoped to what we're in the mood for.

#### Acceptance Criteria

1. THE StepVibe SHALL display 8 dining-style options: Casual, Fancy, Sit-Down, Fast Casual, Drive-Thru, Takeout / Delivery, Outdoor Seating, and Bar / Drinks Too.
2. THE StepVibe SHALL display 21 preset cuisine options: Mexican, Italian, Japanese, Chinese, Thai, Indian, Korean, Vietnamese, French, Mediterranean, Greek, American, Seafood, BBQ, Pizza, Middle Eastern, Caribbean, Latin, Brunch, Desserts, and Drinks (Non-Alcoholic).
3. THE StepVibe SHALL allow the user to select zero or more dining-style options simultaneously.
4. THE StepVibe SHALL allow the user to select zero or more cuisine options simultaneously.
5. THE StepVibe SHALL provide a free-text input for specifying a cuisine not listed among the preset options.
6. WHEN one or more vibe or cuisine selections are active, THE StepVibe SHALL display a summary panel listing the selected labels.
7. WHEN the user activates the "Back" button, THE OnboardingFlow SHALL transition to StepLocation.
8. WHEN the user activates the "Next" button, THE OnboardingFlow SHALL transition to StepPeople regardless of whether any vibe or cuisine options are selected.

---

### Requirement 5: Group People Management

**User Story:** As a group organiser, I want to add each person with their individual preferences, so that the AI can find a restaurant that works for everyone.

#### Acceptance Criteria

1. THE StepPeople SHALL initialise with one PersonCard already present.
2. THE StepPeople SHALL allow the user to add up to 8 PersonCards total.
3. WHILE the group contains fewer than 8 people, THE StepPeople SHALL display an "Add another person" button.
4. WHEN the group contains exactly 8 people, THE StepPeople SHALL hide the "Add another person" button.
5. WHEN the user activates the "Add another person" button, THE StepPeople SHALL append a new PersonCard and expand it.
6. WHILE the group contains more than 1 person, THE StepPeople SHALL display a remove control on each PersonCard.
7. WHEN the user activates the remove control on a PersonCard, THE StepPeople SHALL remove that person from the group.
8. THE PersonCard SHALL display a name input field.
9. THE PersonCard SHALL display 7 dietary-need toggle chips: Vegan, Vegetarian, Keto, Gluten-Free, Halal, Dairy-Free, and Nut-Free.
10. THE PersonCard SHALL display 8 flavor-craving toggle chips: Savory, Spicy, Sweet, Salty, Comfort Food, Light, Umami, and Smoky.
11. THE PersonCard SHALL display 8 avoid-ingredient toggle chips: Mushrooms, Onions, Seafood, Red Meat, Pork, Eggs, Soy, and Gluten.
12. THE PersonCard SHALL display 15 budget-per-meal options: $5, $8, $10, $12, $15, $18, $20, $25, $30, $35, $40, $50, $60, $75, and $100+.
13. THE PersonCard SHALL provide a free-text "Other" input for dietary needs, flavor cravings, and avoid-ingredient categories independently.
14. WHEN the user activates a preset chip that is not currently selected, THE PersonCard SHALL add that value to the person's selection for that category.
15. WHEN the user activates a preset chip that is currently selected, THE PersonCard SHALL remove that value from the person's selection for that category.
16. WHEN the user activates a budget option that is already selected, THE PersonCard SHALL deselect it, leaving the person with no budget set.
17. THE PersonCard header SHALL display the count of total preferences set across all categories.
18. WHEN the user activates the PersonCard header, THE StepPeople SHALL toggle the expanded state of that card.
19. WHEN the user activates the "Back" button, THE OnboardingFlow SHALL transition to StepVibe.
20. WHEN the user activates the "See restaurant options" button, THE OnboardingFlow SHALL transition to LoadingScreen.

---

### Requirement 6: Loading Screen

**User Story:** As a user, I want to see animated progress while the system searches for restaurants, so that I know the app is working and understand what it is doing.

#### Acceptance Criteria

1. THE LoadingScreen SHALL display 6 sequential loading steps with descriptive labels: finding restaurants nearby, applying vibe filters, checking dietary restrictions, balancing budgets, matching flavor profiles, and ranking results.
2. WHEN a loading step is active, THE LoadingScreen SHALL render it at full opacity with an animated indicator.
3. WHEN a loading step has been passed, THE LoadingScreen SHALL render it at reduced opacity with a checkmark.
4. WHEN a loading step has not yet been reached, THE LoadingScreen SHALL render it at reduced opacity without a checkmark.
5. THE LoadingScreen SHALL advance through loading steps at intervals of no more than 400 milliseconds each.
6. THE LoadingScreen SHALL display a group summary card listing each person's name, up to 3 preference tags, and budget.
7. THE LoadingScreen SHALL display a natural-language summary sentence composed from the group's vibe, cuisine, location, dietary needs, flavor cravings, avoided ingredients, and lowest budget.
8. WHEN all loading steps have been displayed, THE LoadingScreen SHALL call the completion callback within 600 milliseconds, transitioning to StepResults.

---

### Requirement 7: Backend Restaurant Fetching

**User Story:** As the system, I want to query the Yelp API for nearby restaurants matching the group's preferences, so that the AI has a relevant candidate pool to rank.

#### Acceptance Criteria

1. THE Backend SHALL expose a POST `/api/rank` endpoint that accepts `people`, `vibe`, `cuisine`, `otherCuisine`, `openNow`, and `location` fields.
2. IF the `people` array is empty, THEN THE Backend SHALL return HTTP 400 with a descriptive error message.
3. IF the `location` field is blank, THEN THE Backend SHALL return HTTP 400 with a descriptive error message.
4. THE Backend SHALL map selected vibe options to Yelp category aliases when constructing the Yelp search query.
5. THE Backend SHALL map selected cuisine options to Yelp category aliases when constructing the Yelp search query.
6. WHEN more than one cuisine is selected, THE Backend SHALL issue one Yelp search request per cuisine and merge the results, deduplicating by Yelp business ID.
7. WHEN the `otherCuisine` field is non-empty, THE Backend SHALL issue an additional Yelp term-based search for that value and merge the results.
8. WHEN `openNow` is true, THE Backend SHALL include the `open_now=true` parameter in all Yelp requests.
9. IF the Yelp API returns no businesses, THEN THE Backend SHALL return HTTP 404 with a descriptive error message.
10. THE Backend SHALL normalise each Yelp business into a restaurant object containing: id, name, emoji, cuisine label, address, distance in miles, rating, review count, price tier, Yelp URL, coordinates, and open status.

---

### Requirement 8: AI Restaurant Ranking

**User Story:** As the system, I want to use an AI model to rank restaurants by group fit, so that the best option for everyone appears first.

#### Acceptance Criteria

1. THE AI_Ranker SHALL receive the full list of Yelp candidates, all group members' preferences, selected vibe, selected cuisine, and location.
2. THE AI_Ranker SHALL return a ranked list of up to 8 restaurant IDs ordered from best to worst group fit.
3. THE AI_Ranker SHALL assign each restaurant a Group_Match_Score between 0 and 100.
4. THE AI_Ranker SHALL evaluate each restaurant against each person's Hard_Dietary_Restrictions and set `passesHardDiet` to false for restaurants that cannot accommodate them.
5. THE Backend SHALL exclude from the final ranked list any restaurant where `passesHardDiet` is false.
6. THE Backend SHALL exclude from the final ranked list any restaurant where `satisfiedCount` is 0.
7. THE AI_Ranker SHALL compute a Satisfied_Count for each restaurant representing the number of group members whose preferences are met.
8. THE AI_Ranker SHALL generate a one-sentence reasoning string for each ranked restaurant explaining why it suits the group.
9. THE AI_Ranker SHALL generate a two-sentence `aiSummary` explaining why the top-ranked restaurant is the best choice for the group.
10. THE AI_Ranker SHALL generate a one-sentence `groupInsight` describing the group's key constraints or preferences.
11. THE Backend SHALL attach `score`, `passesHardDiet`, `passesBudget`, `satisfiedCount`, `totalPeople`, and `reasoning` fields to each ranked restaurant object before returning the response.
12. THE Backend SHALL respond within 60 seconds; IF the request exceeds this timeout, THEN THE Frontend SHALL treat it as a failed request and display an error state.

---

### Requirement 9: Per-Person Meal Recommendations

**User Story:** As a user, I want to see specific dish suggestions for each person at each restaurant, so that I know what everyone can order.

#### Acceptance Criteria

1. THE AI_Ranker SHALL generate Per_Person_Recs for each person at each ranked restaurant, containing at least one dish suggestion.
2. EACH Per_Person_Recs entry SHALL include a dish name, a short description, and an emoji.
3. WHERE a dish price is known, THE AI_Ranker SHALL include it in the Per_Person_Recs entry.
4. WHERE a dish matches a person's dietary needs or flavor cravings, THE AI_Ranker SHALL include a `matchNote` explaining the match.
5. WHEN a restaurant has no suitable dishes for a person, THE RestaurantCard SHALL display a "Limited options — may need to customize order" warning for that person.

---

### Requirement 10: Results Display

**User Story:** As a user, I want to see ranked restaurant results with group match information, so that I can quickly choose where to go.

#### Acceptance Criteria

1. THE StepResults SHALL display the count of restaurants found and the search location in the header.
2. THE StepResults SHALL display the number of people the results are ranked for.
3. THE StepResults SHALL render one RestaurantCard per ranked restaurant.
4. THE RestaurantCard SHALL display: restaurant name, cuisine label, star rating, distance in miles, price tier, address, and open/closed status.
5. THE RestaurantCard SHALL display a group match progress bar showing the Satisfied_Count out of total people.
6. THE RestaurantCard SHALL display the AI reasoning sentence for the restaurant.
7. THE RestaurantCard ranked first SHALL be visually distinguished with a "Best Match for Your Group" banner.
8. THE RestaurantCard SHALL display cuisine, dietary, and flavor tags derived from the group's preferences.
9. WHEN a restaurant has a Yelp URL, THE RestaurantCard SHALL display a "View on Yelp" link that opens in a new tab.
10. THE StepResults SHALL display a FilterSummaryCard that is collapsed by default.
11. WHEN the user expands the FilterSummaryCard, THE FilterSummaryCard SHALL display the search location, selected vibe labels, selected cuisine labels, and a per-person preference summary.
12. THE StepResults SHALL display three sort controls: Best Match, Nearest, and Top Rated.
13. WHEN the user selects "Best Match", THE StepResults SHALL order restaurants by Group_Match_Score descending.
14. WHEN the user selects "Nearest", THE StepResults SHALL order restaurants by distance ascending.
15. WHEN the user selects "Top Rated", THE StepResults SHALL order restaurants by Yelp rating descending.
16. THE StepResults SHALL display a "Start over" button.
17. WHEN the user activates the "Start over" button, THE OnboardingFlow SHALL reset all wizard state and return to StartScreen.

---

### Requirement 11: Error Handling and Empty States

**User Story:** As a user, I want clear feedback when something goes wrong, so that I know what to do next.

#### Acceptance Criteria

1. IF the Backend returns an error response, THEN THE StepResults SHALL display an error message and a "Try again" button.
2. IF the ranked results list is empty after filtering, THEN THE StepResults SHALL display a "No restaurants found" empty state with the backend error message if available.
3. WHEN the user activates the "Try again" button in the empty state, THE StepResults SHALL invoke the reset callback to return to StartScreen.
4. IF the Nominatim autocomplete request fails, THEN THE StepLocation SHALL silently clear the suggestions list without displaying an error to the user.
5. IF the Yelp API key is not configured on the Backend, THEN THE Backend SHALL return HTTP 500 with the message "YELP_API_KEY not set in .env".
6. IF the OpenAI API key is not configured on the Backend, THEN THE Backend SHALL return HTTP 500 with a descriptive error message.

---

### Requirement 12: Wizard Navigation and State Reset

**User Story:** As a user, I want to navigate back through the wizard steps and start over, so that I can correct my inputs.

#### Acceptance Criteria

1. THE StepVibe SHALL provide a "Back" button that returns the user to StepLocation without clearing any previously entered data.
2. THE StepPeople SHALL provide a "Back" button that returns the user to StepVibe without clearing any previously entered data.
3. WHEN the OnboardingFlow resets, THE OnboardingFlow SHALL clear location, coordinates, vibe, cuisine, otherCuisine, and people state and return to StartScreen.
4. THE OnboardingFlow SHALL initialise with one empty PersonCard so the user is never presented with a completely empty group.
