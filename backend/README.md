# Backend
I am in the process of developing a context-aware note-taking web application as a team project. The application features include auto-generation of revisions, search based on context, and generating quizzes to reinforce learning and memory retention.

My main contribution is server-side development, in which I developed and designed RESTful APIs for functionalities such as user registration, authentication, and secured routes. TypeScript, MongoDB, and LangChain form the backend, with media storage provided by Cloudinary.

The app facilitates creation of notes in various formats like LaTeX, Markdown, Excalidraw, and rich text (Docs). Notes are stored in a hierarchical file structure with folders, files, images, and pinned notes.

For features of intelligence such as revision suggestions, search in context, and generation of quizzes, we utilize OpenAI embeddings with LangChain, and vector store in MongoDB with vector search index. I also created intricate prompting pipelines to dynamically create relevant revision content and quizzes using the OpenAI API.
