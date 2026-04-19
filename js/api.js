/**
 * Backend API Client
 * Communicates with the Python Flask backend.
 */
class APIClient {
    constructor(baseURL) {
        this.baseURL = (baseURL || '').replace(/\/$/, '');
    }

    async _post(endpoint, body) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}`;
            try {
                const err = await response.json();
                errorMsg = err.error || errorMsg;
            } catch (_) {}
            throw new Error(errorMsg);
        }

        return response.json();
    }

    async refinePrompt(prompt) {
        return this._post('/api/refinePrompt', { prompt });
    }

    async runDebate(topic) {
        return this._post('/api/runDebate', { topic });
    }

    async generateCode(requestDetails) {
        return this._post('/api/generateCode', requestDetails);
    }

    async generateFullProject(projectDetails) {
        return this._post('/api/generateFullProject', projectDetails);
    }

    async healthCheck() {
        const response = await fetch(`${this.baseURL}/api/health`);
        return response.json();
    }
}
