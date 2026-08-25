# Reflection

The hardest part was making several kinds of uncertainty visible at once: an AI response can be pending, streaming, tool-backed, or failed, while a travel record needs validation and persistence. Treating those as explicit UI states led to clearer error recovery, a keyboard-reachable stop action, and tests that exercise behavior instead of CSS implementation details.

I would design the deployment boundary earlier. The application and CI are reproducible locally, but the Vercel preview still requires authentication, which means a reviewer cannot verify the production URL anonymously. Next time I would configure the hosting project and public access before writing the final audit, then run Lighthouse against the actual deployment rather than a local equivalent.

The surprising lesson was that accessibility improvements also clarified the product model. A polite live region forced the chat to distinguish streamed conversation from status feedback, and the skip link plus named landmarks made the app easier to reason about even before considering assistive technology.