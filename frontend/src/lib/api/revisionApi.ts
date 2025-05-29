import { apiClient } from "./client";

export const createRevision = async (data: {
	contentId: string;
	numQuestions?: number;
}) => {
	const response = await apiClient.post("/revision/generate-revision", data);
	return response.data;
};

export const fetchAllRevisions = async () => {
	const response = await apiClient.get("/revision/fetch-all-revisions");
	return response.data;
};

export const fetchRevisionById = async (revisionId: string) => {
	const response = await apiClient.get(
		`/revision/fetch-revision/${revisionId}`
	);
	return response.data;
};
