# Dynamic Jargon Buster explanations

## What will change
- Keep dark mode as the default for first-time visitors while continuing to remember an existing visitor’s chosen theme.
- When glossary search finds no saved term, offer a clear “Explain this term” action instead of an empty grid.
- Generate an AI-term card at runtime with the same information as existing cards: simple explanation, detailed explanation, benefits, drawbacks, alternatives, category, and difficulty.
- Let visitors open the generated card in the existing explainer panel.
- If the query is unrelated to AI, show a friendly message explaining that Jargon Buster only covers AI terms and keep the search available.
- Show clear loading and service-error states without losing the typed term.

## Technical details
- Add a public Lovable Cloud function that validates the query, uses Lovable AI server-side, and returns a strict, normalized result identifying whether the term is AI-related.
- Use the existing default AI model and streaming Responses API pattern; keep the secret and prompt out of the browser.
- Submit only on an explicit button click or Enter key, not on every keystroke, to avoid unnecessary usage.
- Cache generated explanations for the current browser session so repeated searches do not make duplicate requests.
- Extend the existing glossary interface without changing the curated rotating terms or the current detail layout.
- Verify first-visit dark mode, remembered theme choice, known-term search, unknown AI-term generation, non-AI handling, retry behavior, and mobile layout.
