class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async refinePrompt(prompt) {
        const response = await fetch(`${this.baseURL}/api/refinePrompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        return response.json();
    }
    
    async runDebate(topic) {
        const response = await fetch(`${this.baseURL}/api/runDebate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic })
        });
        return response.json();
    }
    
    async generateCode(requestDetails) {
        const response = await fetch(`${this.baseURL}/api/generateCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestDetails)
        });
        return response.json();
    }
    
    async generateFullProject(projectDetails) {
        const response = await fetch(`${this.baseURL}/api/generateFullProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectDetails)
        });
        return response.json();
    }
}

// Export the APIClient class
export default APIClient;
