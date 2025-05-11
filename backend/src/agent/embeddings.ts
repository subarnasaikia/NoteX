import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

/**
 * Chunk a note's content into pieces based on its type.
 * Uses LangChain's RecursiveCharacterTextSplitter for different languages.
 * - Markdown: splits on headers/sentences.
 * - LaTeX: uses the "latex" splitter to respect sections and code blocks:contentReference[oaicite:7]{index=7}.
 * - Excalidraw JSON or rich text: treated as generic text.
 * @param content - Raw content (Markdown, LaTeX, JSON string, or text).
 * @param contentType - One of: "markdown", "latex", "excalidraw", "richtext".
 * @returns Array of text chunks for embedding.
 */
export async function chunkContent(
    content: string,
    contentType: string,
): Promise<string[]> {
    let splitter;
    const chunkSize = 1000;
    const chunkOverlap = 200;
    switch (contentType) {
        case "markdown":
            splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
                chunkSize,
                chunkOverlap,
            });
            break;
        case "latex":
            splitter = RecursiveCharacterTextSplitter.fromLanguage("latex", {
                chunkSize,
                chunkOverlap,
            });
            break;
        // For Excalidraw JSON, we treat it as plain text or code
        case "excalidraw":
            splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
                chunkSize,
                chunkOverlap,
            });
            break;
        case "docs":
        default:
            splitter = new RecursiveCharacterTextSplitter({
                chunkSize,
                chunkOverlap,
            });
    }
    // Create LangChain Document objects then extract text
    const docs: Document[] = await splitter.createDocuments([content]);
    return docs.map((doc) => doc.pageContent);
}

/**
 * Convert a float array embedding to a Node.js Buffer (32-bit floats).
 * @param embedding - Array of numbers (float) from an embedding model.
 * @returns Buffer storing the 32-bit float data.
 */
export function embeddingToBuffer(embedding: number[]): Buffer {
    const floatArray = Float32Array.from(embedding);
    return Buffer.from(floatArray.buffer);
}

/**
 * Convert a Buffer back into a float array (32-bit floats).
 * @param buffer - Buffer containing 32-bit float binary data.
 * @returns The embedding as number[].
 */
export function bufferToEmbedding(buffer: Buffer): number[] {
    const floatArray = new Float32Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength / 4,
    );
    return Array.from(floatArray);
}

/**
 * Generate an embedding vector for given text by chunking and averaging.
 * @param content - The raw note content.
 * @param contentType - The content type ("markdown", "latex", etc.).
 * @returns The averaged embedding as a float array.
 */
export async function embedContent(
    content: string,
    contentType: string,
): Promise<number[]> {
    const chunks = await chunkContent(content, contentType);
    if (chunks.length === 0) return [];
    const embeddings = new OpenAIEmbeddings();
    const vectors = await embeddings.embedDocuments(chunks);
    // Average the chunk embeddings component-wise
    const dim = vectors[0].length;
    const avg = new Array<number>(dim).fill(0);
    for (const vec of vectors) {
        for (let i = 0; i < dim; i++) {
            avg[i] += vec[i];
        }
    }
    for (let i = 0; i < dim; i++) {
        avg[i] /= vectors.length;
    }
    return avg;
}
