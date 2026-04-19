/**
 * Prompt Refiner Module
 * Transforms casual user input into professional specifications
 * by calling the backend /api/refinePrompt endpoint.
 */
class PromptRefiner {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Refine a user prompt into a professional specification.
     * @param {string} userPrompt - Raw input from the user
     * @returns {Promise<{originalPrompt: string, refinedPrompt: string, timestamp: string}>}
     */
    async refine(userPrompt) {
        if (!userPrompt || !userPrompt.trim()) {
            throw new Error('Please enter a description of what you want to build.');
        }

        const trimmed = userPrompt.trim();
        if (trimmed.length < 10) {
            throw new Error('Please provide a more detailed description (at least 10 characters).');
        }

        const data = await this.api.refinePrompt(trimmed);

        if (data.error) {
            throw new Error(data.error);
        }

        return {
            originalPrompt: trimmed,
            refinedPrompt: data.refinedPrompt || data.result || '',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Format the refined prompt for display in the UI.
     * @param {object} refinementResult
     * @returns {string}
     */
    formatForDisplay(refinementResult) {
        return refinementResult.refinedPrompt;
    }
}
