# Smart Assess UI

You are a senior frontend engineer and UI implementation specialist.

Build the COMPLETE FRONTEND UI for the "AI Smart Assessment" project.

IMPORTANT:

THIS IS A UI-ONLY PROJECT.

Do NOT build a backend.

Do NOT build Supabase integration.

Do NOT build authentication services.

Do NOT build AI API integrations.

Do NOT build database schemas.

Do NOT build server-side functionality.

Do NOT build real assessment evaluation.

Do NOT build real file processing.

We are creating a complete, polished, interactive frontend prototype based on the provided UI/UX Design Specification.

The goal is to make the UI feel like a real finished product, while all data and backend-dependent behavior can use realistic local mock data.

==================================================

1. SOURCE OF TRUTH

==================================================

Use the provided:

"AI Smart Assessment — UI/UX Design Specification v1.0 MVP Design File"

as the PRIMARY source for the UI.

Use the provided MVP Product & System Specification only to understand:

- required user roles

- required workflows

- terminology

- application states

- feature coverage

Do not implement backend functionality from the MVP specification.

The UI/UX Design Specification controls:

- screen structure

- navigation

- information architecture

- components

- interactions

- visual hierarchy

- responsive behavior

- accessibility

- visual design

==================================================

2. WHAT WE ARE BUILDING

==================================================

Build a complete frontend UI covering three roles:

1. Teacher

2. Student

3. Principal

Every major screen defined in the UI/UX specification should exist.

The application should be fully navigable.

Use mock/local data so the screens look realistic.

Buttons, tabs, filters, dialogs, navigation, forms, dropdowns and other UI controls should behave interactively on the frontend.

The result should look like a polished production SaaS interface, not a wireframe.

==================================================

3. TECH STACK

==================================================

Use:

- React

- TypeScript

- Vite

- Tailwind CSS

- reusable React components

Use a clean component architecture.

Do not add unnecessary backend dependencies.

Use local mock data/state for the prototype.

==================================================

4. DESIGN DIRECTION

==================================================

Independently implement the visual system specified in the provided UI/UX Design Specification.

Follow its defined:

- colors

- typography

- spacing

- borders

- radii

- cards

- navigation

- iconography

- role accents

- status styles

- AI visual treatment

Do not introduce an unrelated visual style.

The UI should feel:

- modern

- clean

- professional

- educational SaaS

- trustworthy

- easy to scan

- polished

- consistent

Do not make it overly decorative.

Avoid excessive gradients, glassmorphism, oversized illustrations, unnecessary animations, or visually noisy layouts.

==================================================

5. SHARED APPLICATION SHELL

==================================================

Create a reusable application shell.

Desktop:

- persistent sidebar

- top/header area where appropriate

- main content area

- consistent page width and spacing

Mobile:

- responsive navigation

- hamburger/menu behavior

- appropriately adapted layouts

The shell should change navigation according to the active role.

==================================================

6. AUTH UI

==================================================

Create the complete frontend authentication UI:

- Login

- Sign Up

- Role selection

- Forgot Password UI

- authentication error state

- loading state

These are UI-only.

Use mock authentication.

Allow the user to enter the application as:

Teacher

Student

Principal

The role selection should lead to the appropriate dashboard.

No real authentication service is required.

==================================================

7. TEACHER UI

==================================================

Create all teacher-facing screens defined in the specification.

Teacher navigation:

- Dashboard

- Classes

- Learning Materials

- Assessments

- Analytics

- Profile

- Logout

==================================================

8. TEACHER DASHBOARD

==================================================

Create a polished dashboard showing realistic mock information such as:

- number of classes

- active assessments

- student participation

- average performance

- learning gaps

- recent assessments

- recent activity

Use realistic educational data.

Do not use meaningless lorem ipsum.

Charts and statistics should be visually clear.

==================================================

9. TEACHER CLASSES

==================================================

Create:

- Classes list

- Create Class UI

- Class details

- Student/member list

- Join code display

- class performance overview

Create appropriate dialogs/forms.

Use mock classes and students.

Create realistic empty states.

==================================================

10. LEARNING MATERIALS

==================================================

Create the complete materials UI.

Include:

- Materials list

- Upload material UI

- drag/drop upload area

- upload progress

- processing state

- ready state

- failed state

- material details

- extracted concepts view

Use frontend mock behavior.

Example flow:

Upload

→ Uploading

→ Processing

→ Ready

Allow the UI to demonstrate these states.

Do not perform real file processing.

==================================================

11. AI CONCEPT EXTRACTION UI

==================================================

Create the UI showing concepts extracted from learning material.

Clearly distinguish AI-generated content visually.

Include:

- concept list

- concept names

- concept descriptions where specified

- extraction status

- AI processing state

- error state

- retry UI

Use mock concepts.

==================================================

12. ASSESSMENT UI

==================================================

Create complete teacher assessment management.

Include:

- Assessment list

- Draft assessments

- Review

- Published assessments

- Assessment details

- Create assessment UI

- AI generation configuration UI

- Generated question list

- Question editor

- Question review

- Publish confirmation

Use realistic mock questions.

==================================================

13. QUESTION EDITOR

==================================================

Create a polished question editor.

Support the UI for:

- question text

- answer options

- correct answer

- concept

- question metadata

- edit

- delete/remove

- save

Make it easy for teachers to review AI-generated questions.

Clearly indicate AI-generated content.

==================================================

14. ASSESSMENT STATES

==================================================

Visually represent:

Draft

Review

Published

Available

In Progress

Submitted

Evaluated

Results Available

Use clear status badges and text.

Never communicate important states through color alone.

==================================================

15. TEACHER ANALYTICS

==================================================

Create polished analytics screens.

Include:

- assessment performance

- completion

- pass rate

- average score

- concept performance

- strong concepts

- medium concepts

- weak concepts

- learning gaps

- affected students

- class performance

- individual student drilldown

Use realistic mock charts/data.

Create useful visualizations rather than generic placeholder charts.

Support drilldown:

Assessment

→ Concept

→ Students

→ Individual performance

==================================================

16. LEARNING GAPS UI

==================================================

Create a dedicated and clear learning-gap experience.

Show:

- weak concept

- affected students

- performance

- severity/classification

- suggested action

- AI teaching suggestions

Make learning gaps visually important without making the interface alarming.

==================================================

17. AI TEACHING SUGGESTIONS

==================================================

Create UI for AI-generated teaching suggestions.

Clearly distinguish:

SYSTEM DATA

from

AI SUGGESTIONS

For example:

System:

"Concept accuracy: 42%"

AI:

"Consider revisiting..."

Never visually imply that the AI calculated the score.

==================================================

18. STUDENT UI

==================================================

Create the complete student frontend.

Student navigation:

- Dashboard

- My Classes

- Assessments

- Results

- Practice

==================================================

19. STUDENT DASHBOARD

==================================================

Create a student dashboard showing:

- enrolled classes

- available assessments

- recent results

- progress

- weak concepts

- learning gaps

- practice opportunities

Use realistic mock data.

==================================================

20. JOIN CLASS

==================================================

Create:

- Join Class screen/dialog

- join-code input

- validation state

- success state

- invalid-code state

- already-joined state

Frontend-only behavior is sufficient.

==================================================

21. STUDENT ASSESSMENT EXPERIENCE

==================================================

Create the full assessment-taking interface.

Include:

- instructions

- question

- answer options

- question number

- progress

- answered/unanswered state

- previous/next

- review questions

- submit confirmation

- submission state

The assessment experience should be distraction-free.

Make it excellent on both desktop and mobile.

==================================================

22. STUDENT RESULTS

==================================================

Create a polished results page.

Include:

- score

- percentage

- pass/fail

- concept performance

- Strong/Medium/Weak classification

- weak concepts

- learning gaps

- recommended practice

Use mock data.

Clearly distinguish calculated system results from AI-generated suggestions.

==================================================

23. STUDENT PRACTICE

==================================================

Create the practice UI.

Include:

- weak concept

- practice questions

- question answering

- progress

- result/feedback state

This is a UI prototype only.

Use mock data.

Do not implement adaptive learning.

==================================================

24. PRINCIPAL UI

==================================================

Create the complete principal experience.

Navigation:

- School Overview

- Classes

- Teachers

- Assessments

- Weak Concepts / Students

- AI Review

==================================================

25. PRINCIPAL DASHBOARD

==================================================

Create a school-level overview containing realistic mock KPIs:

- students

- classes

- teachers

- assessments

- average performance

- pass rate

- weak students

- weak concepts

Create useful charts and summaries.

==================================================

26. PRINCIPAL DRILLDOWNS

==================================================

Create:

School

→ Class

→ Teacher

→ Assessment

→ Concept

→ Student

where defined by the specification.

The drilldown should feel coherent and navigable.

==================================================

27. WEAK STUDENTS

==================================================

Create a principal view for weak students.

Show:

- student

- class

- weak concept(s)

- performance

- assessment context

Use the specification's concept-level learning-gap terminology.

==================================================

28. WEAK CONCEPTS

==================================================

Create a school-level weak concept view.

Show:

- concept

- affected students

- average accuracy

- classification

- related classes

==================================================

29. PRINCIPAL AI REVIEW

==================================================

Create an AI review page showing:

- school-level observations

- notable weak concepts

- teaching/intervention suggestions

- AI-generated recommendations

Clearly label these as AI-generated insights.

Do not present AI suggestions as factual calculations.

==================================================

30. MOCK DATA

==================================================

Use realistic mock data throughout the UI.

Examples:

Classes:

- Class 8A — Mathematics

- Class 8B — Science

- Class 9A — Mathematics

Concepts:

- Linear Equations

- Fractions

- Photosynthesis

- Force and Motion

- Algebraic Expressions

Students should have realistic names.

Assessments should have realistic titles.

Scores should be realistic.

Do not use lorem ipsum.

Create enough mock data to make:

- tables

- dashboards

- charts

- drilldowns

- analytics

look complete.

==================================================

31. FIXED VISUAL BUSINESS RULES

==================================================

Represent these rules consistently in the UI:

Pass:

>50%

Fail:

≤50%

Strong:

≥80%

Medium:

≥50% and <80%

Weak:

<50%

Weak Student:

A student with at least one Weak concept.

These are displayed as mock system-calculated values.

Do not implement backend scoring.

==================================================

32. INTERACTIONS

==================================================

Make the prototype interactive.

Implement frontend behavior for:

- navigation

- sidebar collapse/mobile menu

- tabs

- dropdowns

- modals

- dialogs

- forms

- validation

- search

- filtering

- sorting

- pagination where useful

- question navigation

- assessment progress

- upload simulation

- processing simulation

- success/error states

- edit/save interactions

- publish confirmation

- join class interaction

- dashboard drilldowns

Use local state.

==================================================

33. STATES

==================================================

Every major screen should have intentional:

- loading

- empty

- success

- error

- processing

- disabled

- hover

- focus

- selected

- active

states where applicable.

Do not leave pages looking unfinished.

==================================================

34. RESPONSIVE DESIGN

==================================================

The UI must work at:

- desktop

- laptop

- tablet

- mobile

Pay particular attention to:

- sidebar behavior

- tables

- cards

- analytics

- forms

- question-taking

- dialogs

- navigation

The mobile assessment-taking experience must be especially polished.

==================================================

35. ACCESSIBILITY

==================================================

Implement:

- semantic HTML

- keyboard navigation

- visible focus states

- accessible labels

- accessible dialogs

- appropriate button names

- status text

- sufficient contrast

- non-color-only status communication

Do not use emoji as functional icons.

Use a consistent professional icon library such as Lucide.

==================================================

36. CODE QUALITY

==================================================

Create reusable components.

Avoid duplicated UI code.

Use:

- TypeScript interfaces/types

- reusable layouts

- reusable cards

- reusable tables

- reusable status badges

- reusable dialogs

- reusable form components

- reusable analytics components

Keep role-specific screens organized cleanly.

==================================================

37. IMPORTANT RESTRICTIONS

==================================================

This project is UI ONLY.

Do NOT add:

- Supabase

- PostgreSQL

- backend APIs

- AI API calls

- authentication backend

- real file upload processing

- server functions

- payment systems

- parent portal

- messaging

- live classroom

- advanced LMS

- advanced adaptive testing

- predictive analytics

- advanced proctoring

- unnecessary gamification

Everything should run as a frontend prototype with local/mock state.

==================================================

38. NO PLACEHOLDER UI

==================================================

Do not create empty placeholder pages such as:

"Dashboard coming soon"

"Analytics coming soon"

"TODO"

"Feature not implemented"

Every required screen must be properly designed.

Every navigation item must lead to a real UI screen.

Every major workflow must be demonstrable through frontend interactions.

==================================================

39. VISUAL QUALITY

==================================================

Treat this as a portfolio-quality frontend.

The final result should look like a real modern EdTech SaaS product.

Pay attention to:

- spacing

- typography hierarchy

- alignment

- card composition

- table readability

- charts

- empty states

- status badges

- button hierarchy

- responsive behavior

- consistency

- visual polish

Avoid making every section look like a generic card grid.

Use visual hierarchy to communicate what matters most.

==================================================

40. FINAL REQUIREMENT

==================================================

Build the COMPLETE UI now.

Do not provide a development plan instead of building.

Do not stop after creating a few screens.

Implement ALL required Teacher, Student and Principal screens from the UI/UX specification.

Make the application fully navigable.

Use realistic mock data.

Make interactions functional using local frontend state.

The final result must be a complete, polished, responsive, accessible UI prototype for AI Smart Assessment.

Again:

THIS IS FRONTEND UI ONLY.

NO BACKEND.

NO SUPABASE.

NO REAL AI.

NO DATABASE.

NO REAL AUTHENTICATION.

Build the complete UI in one project.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d86c92b1-63f6-45ba-8f86-14bb759f625c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
