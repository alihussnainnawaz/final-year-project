/**
 * Code Generator Module
 * Generates structured, modular frontend code by calling
 * the backend /api/generateFullProject endpoint.
 */
class CodeGenerator {
    constructor(apiClient) {
        this.api = apiClient;
        this.generatedProject = null;
    }

    /**
     * Generate a full project from the refined spec and debate conclusion.
     * @param {string} refinedPrompt - Refined specification
     * @param {string} conclusion - Debate conclusion
     * @returns {Promise<object>} Project with files map and structure info
     */
    async generateProject(refinedPrompt, conclusion) {
        if (!refinedPrompt) {
            throw new Error('Refined prompt is required for code generation.');
        }

        const data = await this.api.generateFullProject({
            refinedPrompt,
            conclusion: conclusion || ''
        });

        if (data.error) {
            throw new Error(data.error);
        }

        // Normalize files into a plain Map-like object
        this.generatedProject = {
            files: data.files || {},        // { "path": "content", ... }
            structure: data.structure || [],  // [{ path, type, description }]
            summary: data.summary || ''
        };

        this._displayFileStructure(this.generatedProject);

        return this.generatedProject;
    }

    /**
     * Display the generated file structure in the UI.
     * @param {object} project
     */
    _displayFileStructure(project) {
        const container = document.getElementById('fileStructure');
        const contentEl = document.getElementById('generationContent');

        if (contentEl && project.summary) {
            contentEl.textContent = project.summary;
        }

        if (!container) return;

        const paths = Object.keys(project.files);
        if (paths.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);">No files generated.</p>';
            return;
        }

        const fileIcons = { html: '📄', css: '🎨', js: '⚡', py: '🐍', md: '📝', txt: '📋', json: '📦' };

        let html = '<div class="file-tree">';
        paths.sort().forEach(filePath => {
            const ext = filePath.split('.').pop().toLowerCase();
            const icon = fileIcons[ext] || '📁';
            const extClass = ['html', 'css', 'js', 'py'].includes(ext) ? ` ${ext}-ext` : '';
            html += `
                <div class="file-tree-item">
                    <span>${icon}</span>
                    <span class="file-name${extClass}">${this._escapeHtml(filePath)}</span>
                    <span class="badge badge-info" style="margin-left:auto;font-size:0.7rem;">${ext.toUpperCase()}</span>
                </div>`;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    /**
     * Get the generated project.
     * @returns {object|null}
     */
    getProject() {
        return this.generatedProject;
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
}
