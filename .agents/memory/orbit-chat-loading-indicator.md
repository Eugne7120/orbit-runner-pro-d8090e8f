---
name: 0RBIT chat "waiting for first token" indicator
description: Why the chat UI could look frozen/glitchy during slow OpenRouter free-model responses, and how it's fixed.
---

The chat send flow (`src/routes/app.chat.$id.tsx`) adds an empty assistant
message to state immediately when a send starts, before the network request
resolves. A loading indicator (`RuntimePipeline`) that keys off "last message
role is still 'user'" will therefore never fire, since the last message role
flips to "assistant" (with empty content) right away.

**Why:** Free/rate-limited OpenRouter models can take many seconds to emit
the first token. Without a real loading indicator during that gap, the chat
looks completely unresponsive — users see an empty bubble and no feedback,
so they assume it's broken and re-send, and then eventually the earlier
requests all resolve close together it looks like everything arrived "at once."

**How to apply:** Drive loading indicators off an explicit `waitingFirstToken`
boolean state that's set true on send and cleared by an `onFirstToken`
callback fired from the stream reader on the first real content chunk — not
off derived conditions like "which role is the last message." Also pair this
with a client-side timeout (e.g. 30s) that cancels the read and surfaces a
clear error if no token ever arrives, and abort in-flight requests on
conversation/route unmount so stale streams can't update the wrong
conversation later.
