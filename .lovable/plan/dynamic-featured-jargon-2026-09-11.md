# Dynamic featured jargon

## What will change
- Replace the date-based featured term with a visit-based selection.
- Remember the last featured term in the browser so consecutive visits do not show the same term when alternatives exist.
- Keep the glossary search and term details unchanged.

## Technical details
- Update the Jargon buster selection logic in `GlossarySection`.
- Store only the last term ID in browser storage and safely fall back when storage is unavailable.
- Verify the app compiles and the featured term changes after a reload.
