# MathPath AI — Web-Based AI Math Differentiator

An interactive responsive web app for the Topic 8 assignment, **AI for Differentiated Learning**. It adapts a single core topic—linear equations—into Foundation, Standard, and Advanced learning paths with AI-generated problems, hints, step-by-step solutions, and instant answer feedback.

## Features

- Three selectable difficulty levels with different scaffolding requirements.
- AI-generated practice problems based on the selected level.
- Separate actions for hint, solution, and answer checking.
- Responsive layout for desktop and mobile.
- Server-side AI calls; the API key is never placed in browser JavaScript.
- Accessible status feedback and keyboard Enter-to-check support.

## Technology

- HTML, CSS, and browser JavaScript
- Vercel serverless function (`api/generate.js`)
- OpenAI Responses API
- Environment variables for secret management

## Run locally

Prerequisites: Node.js, an OpenAI API key with API access, and a Vercel account/CLI.

1. Install the Vercel CLI if needed: `npm install`
2. Add a local environment file named `.env.local` containing:

   ```env
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4.1-mini
   ```

   Never commit `.env.local` or share your API key.
3. Run `npx vercel dev` and open the local URL printed by the CLI.

## Deploy to Vercel

1. Create a new public GitHub repository and upload the files in this project.
2. Import the repository in Vercel.
3. In **Project Settings → Environment Variables**, add `OPENAI_API_KEY` with your secret key. Optionally set `OPENAI_MODEL` to a model available to your account.
4. Deploy, then test all three levels and all four actions: new problem, hint, solution, and check answer.
5. Copy the deployed URL for the assignment submission. The live URL cannot be generated until you deploy it under your account.

## API behavior

`POST /api/generate` accepts JSON with:
- `topic`: topic name
- `level`: `foundation`, `standard`, or `advanced`
- `action`: `generate`, `hint`, `solution`, or `check`
- `task`: current problem and/or learner answer

The server validates inputs, builds a level-specific prompt, calls the OpenAI Responses API, and returns structured JSON. The secret key stays server-side.

## Testing checklist

- [ ] App loads on desktop and mobile widths.
- [ ] Selecting a level updates the active level indicator.
- [ ] New problem returns a problem suitable for the chosen level.
- [ ] Hint gives guidance without disclosing the final answer.
- [ ] Solution shows steps and a final answer.
- [ ] Check action responds to the learner's answer.
- [ ] Missing API key shows a helpful configuration message.
- [ ] API key is configured only as a deployment environment variable.
- [ ] Verify sample math independently before demonstrating or submitting.

## Academic integrity note

The assignment brief says the interface code, prompt design, and report must be the student's own original work and that unverified AI-generated math logic can lose marks. Use this project as a working starting point: review every file, understand the prompt and API flow, test the mathematics, and personalize the design and report in your own words before submission.
