import { ChatOpenAI } from "@langchain/openai";
import { revisionChatPrompt } from "./prompt.js";
// import { LLMChain } from "langchain/chains";

/**
 * Generate a revision plan (list of Q&A) for given content.
 * @param content - The text or content to base questions on.
 * @param numQuestions - How many questions to generate.
 * @returns Array of {question, answer} objects.
 */
export async function generateRevisionPlan(
    content: string,
    numQuestions: number = 5,
): Promise<{ question: string; answer: string }[]> {
    try {
        const llm = new ChatOpenAI({ modelName: "gpt-4", temperature: 0.3 });
        const promptTemplate = revisionChatPrompt;
        const chain = promptTemplate.pipe(llm);
        // const chain = new LLMChain({ llm, prompt: revisionChatPrompt });
        const response = await chain.invoke({ content, numQuestions });
        const text = response.text || "";

        const plan = JSON.parse(text);
        return plan;
    } catch (err) {
        console.error("Failed to parse revision plan JSON:", err);
        throw new Error("Failed to generate revision plan.");
    }
}
