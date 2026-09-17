# Add light mode to Promptly

## What will change
- Add a sun/moon toggle in the header, available on desktop and mobile.
- Keep Promptly’s existing premium dark theme as the default.
- Add a warm, high-contrast light palette that preserves the lime brand accent.
- Remember each visitor’s theme choice across visits.
- Update backgrounds, cards, inputs, borders, status colors, and shadows through the shared design tokens so every section switches consistently.

## Technical details
- Use the project’s existing theme support to switch a class on the page root and persist the selection locally.
- Replace the current fallback dark token block with a deliberate light token set while leaving component behavior unchanged.
- Respect reduced-motion preferences and provide an accessible label and tooltip for the icon-only theme control.
- Verify the homepage in both themes at desktop and mobile sizes, then check the project build status.
