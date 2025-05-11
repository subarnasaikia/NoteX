import mongoose from "mongoose";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

/**
 * Perform a semantic search on the content collection.
 * Uses LangChain's MongoDB vector retriever (Atlas Vector Search).
 * @param query - The search query string.
 * @param k - Number of top results to return.
 * @returns Array of LangChain Document objects (with pageContent and metadata).
 */
export async function semanticSearch(
    query: string,
    k: number = 5,
): Promise<Document[]> {
    // Get native MongoDB collection
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("MongoDB connection is not established.");
    }
    const collection = db.collection("contents"); // name of your MongoDB collection
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
    });
    const retriever = vectorStore.asRetriever({ k });
    const results = await retriever.invoke(query);
    return results;
}
