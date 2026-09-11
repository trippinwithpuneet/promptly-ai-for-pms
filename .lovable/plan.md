# Make Model Finder conversational

## What will change
- Replace the one-shot form with a short, single-session conversation.
- Let Model Finder decide whether the initial description is sufficient or one focused follow-up question is useful.
- Ask only one question at a time and always provide recommendations by the third user answer at the latest.
- Show the conversation, progress toward the three-answer limit, a typing state, and a clear restart action.
- Present final recommendations with fit rationale, pricing status, strengths, limitations, and practical next steps.

## Conversation behavior
- No account, saved threads, or conversation history after reload.
- Send the complete in-session conversation on each request so recommendations retain context.
- Skip clarification entirely when the first description already covers the goal, input/output type, scale, and key constraints.
- Never exceed three user answers in one recommendation flow.

## Technical details
- Add a dedicated server function for the guided recommendation logic; model calls and credentials remain private.
- Use structured responses so the interface can reliably distinguish a follow-up question from final recommendations.
- Handle service errors visibly and keep the existing visual style.
- Deploy and test the function, then verify both direct-recommendation and clarification flows in the live preview.
