<div align="center">
  <h1>NoteX</h1>
  <p>
    <a href="https://github.com/subarnasaikia">
      <img src="https://img.shields.io/badge/Subarna-%23121011?style=for-the-badge&logo=github&logoColor=white" alt="Subarna's GitHub" width=80px>
    </a>
    <a href="https://github.com/gautam84">
      <img src="https://img.shields.io/badge/Gautam-%23121011?style=for-the-badge&logo=github&logoColor=white" alt="Gautam's GitHub" width=80px>
    </a>
  </p>
</div>


_NoteX_ is a context-aware note-taking web application designed to enhance the way users create, manage, and retain knowledge through intelligent revision and quizzing. The app leverages artificial intelligence to generate personalized revision suggestions and context-based quizzes, aiding in effective learning and memory retention.

The application supports a wide range of input formats, including LaTeX, Markdown, and rich text (Docs), allowing users flexibility in note creation. Notes are organized in a hierarchical folder structure, enabling structured storage and easy retrieval. Key features include semantic search based on context, automatic revision content generation, and dynamic quiz creation tailored to the user's notes.

The system is developed using a modern full-stack architecture: Next.js with shadcn UI components on the frontend, and Node.js with TypeScript on the backend. MongoDB serves as the primary database, with Cloudinary for media storage. AI functionality is powered by LangChain and OpenAI embeddings, with vector storage integrated into MongoDB to enable efficient semantic search and retrieval. The backend exposes RESTful APIs for all functionalities, including user registration, authentication, and secure access.

Security is enforced through the use of HTTP-only cookies that store JWT tokens, ensuring stateless session management while protecting against common web vulnerabilities like XSS and CSRF.

As a result, NoteX delivers a fully functional prototype with a secure backend, intelligent features like context-aware search, and effective revision generation workflows. These capabilities demonstrate the potential of AI-enhanced tools in transforming traditional note-taking into an active learning experience.

