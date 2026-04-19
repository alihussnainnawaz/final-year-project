/**
 * App - Main Orchestrator
 * Coordinates the full pipeline:
 *   Input → Prompt Refinement → AI Debate → Code Generation → Preview & Download
 */
class App {
    constructor() {
        // Instantiate all modules
        this.apiClient    = new APIClient(CONFIG.BACKEND_URL);
        this.uiController = new UIController();
        this.promptRefiner = new PromptRefiner(this.apiClient);
        this.debateEngine  = new DebateEngine(this.apiClient, this.uiController);
        this.codeGenerator = new CodeGenerator(this.apiClient);
        this.fileManager   = new FileManager();

        // Pipeline state
        this.refinedPrompt   = null;
        this.debateResult    = null;
        this.generatedProject = null;
    }

    /**
     * Initialise event listeners and verify backend connectivity.
     */
    init() {
        const startBtn    = document.getElementById('startBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const restartBtn  = document.getElementById('restartBtn');

        if (startBtn)    startBtn.addEventListener('click', () => this.start());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.download());
        if (restartBtn)  restartBtn.addEventListener('click', () => this.restart());

        // Ctrl+Enter shortcut in the textarea
        const textarea = document.getElementById('userPrompt');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.start();
                }
            });
        }

        // Check backend health
        this._checkBackend();
    }

    /**
     * Ping the backend health endpoint and warn if unreachable.
     */
    async _checkBackend() {
        try {
            await this.apiClient.healthCheck();
            console.log('✓ Backend connection successful');
        } catch {
            this.uiController.showNotification(
                'Cannot reach the backend. Make sure the Python server is running on port 5000.',
                'error'
            );
        }
    }

    /**
     * Main pipeline entry point.
     */
    async start() {
        const promptEl = document.getElementById('userPrompt');
        const userInput = promptEl ? promptEl.value : '';

        if (!userInput || !userInput.trim()) {
            this.uiController.showNotification('Please enter a description first.', 'error');
            return;
        }

        this.uiController.disableButton('startBtn');

        try {
            await this._runRefinement(userInput);
            await this._runDebate();
            await this._runCodeGeneration();
            this._showPreview();
        } catch (err) {
            console.error('Pipeline error:', err);
            this.uiController.showNotification(`Error: ${err.message}`, 'error');
            this.uiController.enableButton('startBtn');
        }
    }

    /* ─── Step 2: Prompt Refinement ─────────────────────────────────── */

    async _runRefinement(userInput) {
        this.uiController.showStep(2);
        this.uiController.showLoader('refinementLoader');
        this.uiController.setContent('refinementContent', '');

        try {
            const result = await this.promptRefiner.refine(userInput);
            this.refinedPrompt = result.refinedPrompt;
            this.uiController.setContent('refinementContent', result.refinedPrompt);
            this.uiController.showNotification('Prompt refined successfully!', 'success');
        } finally {
            this.uiController.hideLoader('refinementLoader');
        }
    }

    /* ─── Step 3: AI Debate ──────────────────────────────────────────── */

    async _runDebate() {
        this.uiController.showStep(3);

        try {
            this.debateResult = await this.debateEngine.runDebate(this.refinedPrompt);
            this.uiController.showNotification('Debate completed!', 'success');
        } catch (err) {
            // Debate failure is non-fatal; continue with refinedPrompt as context
            console.warn('Debate failed, continuing without it:', err.message);
            this.uiController.showNotification('Debate skipped: ' + err.message, 'info');
            this.debateResult = { conclusion: this.refinedPrompt };
        }
    }

    /* ─── Step 4: Code Generation ────────────────────────────────────── */

    async _runCodeGeneration() {
        this.uiController.showStep(4);
        this.uiController.showLoader('generationLoader');
        this.uiController.setContent('generationContent', '');

        const conclusion = this.debateEngine.getConclusion() || this.refinedPrompt;

        try {
            this.generatedProject = await this.codeGenerator.generateProject(
                this.refinedPrompt,
                conclusion
            );
            this.fileManager.setFiles(this.generatedProject.files);
            this.uiController.showNotification('Code generated!', 'success');
        } finally {
            this.uiController.hideLoader('generationLoader');
        }
    }

    /* ─── Step 5: Preview ────────────────────────────────────────────── */

    _showPreview() {
        this.uiController.showStep(5);
        this.fileManager.displayPreview();

        const stats = this.fileManager.getStatistics();
        this.uiController.showNotification(
            `Project ready! ${stats.totalFiles} files generated.`,
            'success'
        );
    }

    /* ─── Download ───────────────────────────────────────────────────── */

    async download() {
        try {
            await this.fileManager.downloadZip();
            this.uiController.showNotification('ZIP downloaded!', 'success');
        } catch (err) {
            this.uiController.showNotification('Download failed: ' + err.message, 'error');
        }
    }

    /* ─── Restart ────────────────────────────────────────────────────── */

    restart() {
        this.refinedPrompt   = null;
        this.debateResult    = null;
        this.generatedProject = null;
        this.fileManager.setFiles({});
        this.uiController.reset();
    }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
