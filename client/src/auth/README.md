# Client Auth

Expo screens and hooks import this layer.

Responsibilities:

- Validate form input for immediate UI feedback.
- Open Apple and Google OAuth browser sessions.
- Store and refresh Supabase client sessions on device.
- Keep React Native components away from server-only code.

Do not import backend/server-only modules in client components.
