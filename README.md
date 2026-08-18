# Auth Demo Exercise

A simple React authentication demo showing the required flow:

Login -> MFA -> Protected screen

This app uses mock users and mock MFA codes to demonstrate:
- login form validation
- MFA verification
- read-only vs read/write access control
- sign-up navigation stub
- clean Bootstrap-based UI

## Technologies used
- React
- Vite
- Bootstrap 5
- Vitest
- Testing Library

## Setup and install
```bash
npm install
```

## Local run instructions
```bash
npm run dev
```
Then open the local URL shown in the terminal, typically:

http://localhost:5173/

## Mock user credentials and roles
These are the demo accounts built into the app:

- Viewer Demo
  - email: viewer@demo.com
  - password: Viewer123!
  - role: read-only
  - MFA code: 123456

- Editor Demo
  - email: editor@demo.com
  - password: Editor123!
  - role: read-write
  - MFA code: 654321

## How to test the login/MFA flow
1. Open the app in the browser.
2. Enter an invalid email or password to confirm validation errors.
3. Sign in using one of the mock users above.
4. The app will redirect to the MFA screen.
5. Enter the matching mock MFA code.
6. After validation, the protected dashboard loads.
7. Confirm read-only users cannot edit, while read/write users can.

## Key design decisions and assumptions
- The app intentionally uses mock data instead of a backend to keep the exercise focused on UX and access control.
- MFA is simulated with a deterministic 6-digit code rather than a real OTP service.
- Bootstrap is used to maintain a consistent UI without overbuilding the app.
- The app keeps logic simple and modular so it remains readable and maintainable.

## Known limitations
- No real authentication backend or database is implemented.
- MFA codes are not persisted or sent over a real channel.
- Sign up is a mock screen and does not create real accounts.
- Access control is client-side only, which is appropriate for this exercise.

## Demo run order
1. Login with viewer@demo.com / Viewer123!
2. Enter MFA code 123456
3. Confirm the protected screen shows read-only behavior
4. Log out
5. Login with editor@demo.com / Editor123!
6. Enter MFA code 654321
7. Confirm edit actions are enabled

## Notes on testing
```bash
npm test
```
This checks the validation flow and the login/MFA success path.
