PROJECT RULES

Never rewrite architecture.

Never change:

- JWT payload:
{ sub, email }

Never change socket rooms:

chat-${userId}
user-${userId}

Never change pagination:

take + skip

Never rewrite services unless explicitly requested.

Only patch existing files.

Production-ready code only.

No placeholders.

No mock APIs.

Use existing backend endpoints only.

Mobile-first.

Accessibility required.

Dark/light mode support.