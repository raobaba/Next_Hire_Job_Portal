
 Job Alerts Digest
Model: extend User with jobAlerts settings (frequency, lastSentAt, savedFilters array).
Endpoints:
POST /api/v1/user/job-alerts – create/update alert preferences.
GET /api/v1/user/job-alerts – fetch current settings.
Logic: cron job runs daily/hourly, queries new jobs by saved filters, sends digest email using existing mailer.
2. Saved Searches & Alerts
Model: add savedSearches array storing filter blobs and optional alertEnabled.
Endpoints:
POST /api/v1/user/saved-searches – save/update a filter preset.
DELETE /api/v1/user/saved-searches/:id
GET /api/v1/user/saved-searches
Reuse: job alerts pull from the same data.
3. Interview Prep Resources
Model: new collection PrepResource with title, category, content/url, tags.
Endpoints:
GET /api/v1/prep-resources with optional tags/category filters.
Admin-only POST/PUT/DELETE to manage resources.
4. Skill Gap Insights
Model: no schema change needed; derive on demand.
Endpoint: GET /api/v1/profile/skill-gap?jobId=...
Looks up job requirements vs user skills, returns missing skills + suggested resources (linking to PrepResource).
5. In-app Notifications Center
Model: new Notification subdocument on User (or separate collection referencing user).
Endpoints:
GET /api/v1/notifications (auth) – paginated list.
PATCH /api/v1/notifications/:id/read
Internal helpers trigger notifications on events (application status changes, reminders).
6. Profile Completion Meter
Model: store computed profileCompletion percentage on User (update hook) or compute on demand.
Endpoint: GET /api/v1/profile/completion returns score + pending tasks array.
Logic: evaluate presence of headline, skills, resume, avatar, etc.
7. Company Badges
Model: extend Company with derived stats (avg response time, hires, reviews). Add badges array.
Endpoint: existing company/job APIs now include badges.
Logic: scheduled job calculates badges (e.g., “Fast Hiring” if median review time < X days).
8. Applicant Timeline View
Model: enhance Application with statusHistory array storing {status, timestamp, note}.
Endpoint: GET /api/v1/application/:id/timeline.
Logic: when status changes, push entry into history (middleware around status updates).
9. Quick Apply Templates
Model: new quickTemplates array on User storing {title, coverLetter, resumeId}.
Endpoints:
POST /api/v1/user/templates
PUT /api/v1/user/templates/:id
DELETE /api/v1/user/templates/:id
GET /api/v1/user/templates
Integration: application submission endpoint accepts templateId to autofill.
10. Public Landing Highlights
Model: new Highlight collection or extend Company/Job with isFeatured.
Endpoints:
GET /api/v1/highlights – fetch featured employers, success stories.
Admin endpoints to manage highlights.