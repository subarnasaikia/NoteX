import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Prompt template for generating a revision plan (question-answer pairs).
 * Expects to receive 'content' (the note text) and 'numQuestions' variables.
 */
export const revisionChatPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are an educational assistant. Given study content, generate a revision plan. For each item, output JSON with {{question, answer}}. Use the content to form clear questions and answers.",
    ],
    [
        "human",
        "Content:\n{content}\n\nGenerate {numQuestions} revision questions with answers (output as a JSON array).",
    ],
]);

/**
 * Prompt template for generating a quiz (questions with answers and explanations).
 */
export const quizChatPrompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful tutor. Given study content, generate a quiz. Provide {numQuestions} MCQ questions. For each, output JSON with {{question, options, answer, explanation}}.",
    ],
    [
        "human",
        "Content:\n{content}\n\nGenerate {numQuestions} MCQ quiz questions with answers and explanations (output as a JSON array).",
    ],
]);
