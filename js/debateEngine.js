/**
 * Debate Engine Module
 * Orchestrates the multi-agent debate between Optimist and Pessimist agents.
 * Calls the backend /api/runDebate endpoint.
 */
class DebateEngine {
    constructor(apiClient, uiController) {
        this.api = apiClient;
        this.ui = uiController;
        this.debateResult = null;
    }

    /**
     * Run the full multi-agent debate for a given specification.
     * @param {string} refinedPrompt - The refined specification
     * @returns {Promise<object>} Full debate result with rounds and conclusion
     */
    async runDebate(refinedPrompt) {
        if (!refinedPrompt) {
            throw new Error('Refined prompt is required to start the debate.');
        }

        // Clear previous content
        this._clearDebateUI();

        const data = await this.api.runDebate(refinedPrompt);

        if (data.error) {
            throw new Error(data.error);
        }

        this.debateResult = data;
        this._displayDebate(data);

        return data;
    }

    /**
     * Clear debate UI panels.
     */
    _clearDebateUI() {
        const optimistEl = document.getElementById('optimistContent');
        const pessimistEl = document.getElementById('pessimistContent');
        const conclusionEl = document.getElementById('debateConclusion');

        if (optimistEl) optimistEl.textContent = '';
        if (pessimistEl) pessimistEl.textContent = '';
        if (conclusionEl) conclusionEl.innerHTML = '';
    }

    /**
     * Display the debate results in the UI.
     * @param {object} data - Debate result from backend
     */
    _displayDebate(data) {
        const optimistEl = document.getElementById('optimistContent');
        const pessimistEl = document.getElementById('pessimistContent');
        const conclusionEl = document.getElementById('debateConclusion');

        // Aggregate all optimist and pessimist arguments across rounds
        let optimistText = '';
        let pessimistText = '';

        if (data.rounds && Array.isArray(data.rounds)) {
            data.rounds.forEach((round, idx) => {
                const roundLabel = `--- Round ${idx + 1} ---\n`;
                if (round.optimist) {
                    optimistText += (idx > 0 ? '\n' : '') + roundLabel + round.optimist;
                }
                if (round.pessimist) {
                    pessimistText += (idx > 0 ? '\n' : '') + roundLabel + round.pessimist;
                }
            });
        }

        if (optimistEl) optimistEl.textContent = optimistText || 'No response.';
        if (pessimistEl) pessimistEl.textContent = pessimistText || 'No response.';

        // Display conclusion
        if (conclusionEl && data.conclusion) {
            conclusionEl.innerHTML = `
                <h3>⚖️ Final Conclusion</h3>
                <div class="conclusion-content">${this._escapeHtml(data.conclusion)}</div>
            `;
        }
    }

    /**
     * Escape HTML special characters.
     * @param {string} text
     * @returns {string}
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    /**
     * Get the conclusion from the last debate.
     * @returns {string|null}
     */
    getConclusion() {
        return this.debateResult ? (this.debateResult.conclusion || null) : null;
    }
}
