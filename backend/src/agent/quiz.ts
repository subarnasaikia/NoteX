import { ChatOpenAI } from "@langchain/openai";
// import { LLMChain } from "langchain/chains";
import { quizChatPrompt } from "./prompt.js";

/**
 * Generate a quiz (Q&A with explanations) for given content.
 * @param content - The text or content to quiz on.
 * @param numQuestions - Number of quiz questions to generate.
 * @returns Array of {question, answer, explanation} objects.
 */
export async function generateQuiz(
    content: string,
    numQuestions: number = 5,
): Promise<{ question: string; answer: string; explanation: string }[]> {
    try {
        const llm = new ChatOpenAI({ modelName: "gpt-4", temperature: 0.3 });
        const promptTemplate = quizChatPrompt;
        const chain = promptTemplate.pipe(llm);
        // const chain = new LLMChain({ llm, prompt: quizChatPrompt });
        const response = await chain.invoke({ content, numQuestions });
        const text = response.text || "";
        if (!text) {
            throw new Error("No response text received from LLM.");
        }
        const quiz = JSON.parse(text);
        return quiz;
    } catch (err) {
        console.error("Failed to parse quiz JSON:", err);
        throw new Error("Failed to generate quiz: ");
        // throw new Error("Failed to generate quiz.");
    }
}
