# Brief Report: AI for Differentiated Learning

**Project:** MathPath AI — Web-Based AI Math Differentiator  
**Core topic:** Solving linear equations

## Purpose and design

MathPath AI is a responsive web application that adapts practice on one mathematical topic to three learner levels. The learner chooses Foundation, Standard, or Advanced, then requests a new problem, a hint, a worked solution, or feedback on an answer. Keeping the core topic consistent makes it possible to change the amount of scaffolding and the complexity of reasoning without changing the learning domain.

## How differentiation is achieved

- **Foundation:** The system prompt asks for simple language, small numbers, guided steps, and a direct hint so learners can follow the process.
- **Standard:** The prompt requests a typical school-level task, concise reasoning, and a hint that supports independent work.
- **Advanced:** The prompt requests a multi-step or applied challenge, justification, and a strategic hint rather than immediately revealing the method.

The interface sends the chosen level and requested action to a server-side API endpoint. The endpoint includes level-specific instructions and asks the model to return structured JSON containing a problem, hint, solution, answer, and feedback. The app displays the relevant response to the learner. A separate answer-check action sends both the problem and learner's response so the AI can give immediate, tailored feedback.

## AI prompts and safeguards

The prompt identifies the role as a careful mathematics tutor, specifies the topic and learner level, defines the requested action, and requires a fixed JSON response format. It also instructs the model to verify algebra and arithmetic, use encouraging age-appropriate language, and avoid giving away the answer during hint-only requests. The API key is stored as a server-side environment variable rather than embedded in front-end code. The app displays a notice that AI-generated practice may contain errors, so outputs should be checked before classroom use.

## Evaluation plan and limitations

Before submission, test all three levels and each action. Check that Foundation includes sufficient scaffolding, Standard is appropriate for ordinary curriculum practice, Advanced requires deeper reasoning, hints do not reveal answers, and solutions are mathematically correct. Confirm the app works at desktop and mobile widths and test the missing-key error. AI responses can still be inaccurate or vary between requests; therefore, teacher review and independent verification remain necessary. The deployed URL should be added after publishing the app to Vercel or another compatible host.

*This is a draft report. Revise it in your own words and document the tests you actually perform before submitting.*
