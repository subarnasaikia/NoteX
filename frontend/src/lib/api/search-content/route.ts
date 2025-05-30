import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "../client"; // adjust this path based on your project

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { query } = body;

		const { data } = await apiClient.post("notes/contents/search-content", {
			query,
		});

		return NextResponse.json(data);
	} catch (error: any) {
		console.error("Search error:", error.message);
		return NextResponse.json(
			{ message: "Search failed", error: error.message },
			{ status: 500 }
		);
	}
}
