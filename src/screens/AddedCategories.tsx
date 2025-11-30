//TODO: IMNPLEMENT
/**
 * This screen wil fetch all user made categories from the async storage with the key CUSTOM_WORD_CATEGORIES.
 * The words are stored there in the following way [{ "name": "Word", "category": "Category" }]
 * and list them. The user selects one and either is redirect to another screen or
 * the words from that category unfold into a scrollable view. Here the user can either edit or remove a word altogether
 * Categories coming with the game e.g stored in the json file should not be affected. although maybe they can be loaded to be edited?
 * A reusable component should probably be made and shared with AddedCategories.tsx
**/