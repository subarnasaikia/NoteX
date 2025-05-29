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
        "You are a helpful tutor. Given study content, generate a quiz. Return the result as a single JSON object with the following structure: {{'tags': [/* at most 3 relevant tags */], 'questions': [{{'question': 'Question text here', 'options': [/* 4 options */], 'answer': 'Correct option text', 'explanation': 'Brief explanation of the correct answer'}} ] }}. Generate {numQuestions} multiple-choice questions (MCQs). Each question must include four options, one correct answer, and a short explanation. The 'tags' array should contain up to three relevant topic tags summarizing the quiz content.",
    ],
    [
        "human",
        "Content:\n{content}\n\nGenerate {numQuestions} MCQ quiz questions with answers and explanations (output as a JSON array).",
    ],
]);
