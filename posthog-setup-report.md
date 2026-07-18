<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Recurly subscription management app. The SDK is installed, a dynamic `app.config.js` exposes PostHog credentials via Expo Constants, a typed `src/config/posthog.ts` initialises the shared client, and `PostHogProvider` with autocapture and manual screen tracking wraps the entire app in `app/_layout.tsx`. Users are identified by their Clerk user ID immediately after sign-in and sign-up. Seven custom events are captured across five screens.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password via Clerk. | `app/(auth)/sign-in.tsx` |
| `sign_in_failed` | A sign-in attempt results in an error or validation failure. | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User completes sign-up and email verification to create a new Recurly account. | `app/(auth)/sign-up.tsx` |
| `sign_up_verification_sent` | Email verification code is sent after the user submits their sign-up details. | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signs out from the Settings screen. | `app/(tabs)/settings.tsx` |
| `subscription_card_expanded` | User taps a subscription card on the home screen to expand its details. | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User navigates to the full subscription detail page. | `app/subscriptions/[id].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://eu.posthog.com/project/199016/dashboard/829977)
- **New user sign-ups over time**: [https://eu.posthog.com/project/199016/insights/fOiGabXF](https://eu.posthog.com/project/199016/insights/fOiGabXF)
- **Sign-up to completion funnel**: [https://eu.posthog.com/project/199016/insights/62nczRd6](https://eu.posthog.com/project/199016/insights/62nczRd6)
- **Sign-ins vs sign-outs**: [https://eu.posthog.com/project/199016/insights/51HoMeiw](https://eu.posthog.com/project/199016/insights/51HoMeiw)
- **Subscription engagement**: [https://eu.posthog.com/project/199016/insights/wcIfLOKn](https://eu.posthog.com/project/199016/insights/wcIfLOKn)
- **Sign-in failure rate**: [https://eu.posthog.com/project/199016/insights/NQhIO6qS](https://eu.posthog.com/project/199016/insights/NQhIO6qS)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
