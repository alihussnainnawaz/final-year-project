/**
 * UI Controller Module
 * Manages step visibility, loaders, notifications, and button states.
 */
class UIController {
    constructor() {
        this.currentStep = 1;
        this._notificationTimer = null;
    }

    /**
     * Show a specific step (1-5) and hide all others.
     * @param {number} stepNumber
     */
    showStep(stepNumber) {
        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));

        const stepIds = ['step-input', 'step-refinement', 'step-debate', 'step-generation', 'step-preview'];
        const idx = stepNumber - 1;

        if (idx >= 0 && idx < stepIds.length) {
            const el = document.getElementById(stepIds[idx]);
            if (el) {
                el.classList.add('active');
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        this.currentStep = stepNumber;
    }

    /**
     * Show a loader element.
     * @param {string} loaderId - The element ID of the loader
     */
    showLoader(loaderId) {
        const el = document.getElementById(loaderId);
        if (el) el.classList.add('active');
    }

    /**
     * Hide a loader element.
     * @param {string} loaderId
     */
    hideLoader(loaderId) {
        const el = document.getElementById(loaderId);
        if (el) el.classList.remove('active');
    }

    /**
     * Set text content of an element.
     * @param {string} elementId
     * @param {string} text
     */
    setContent(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = text;
    }

    /**
     * Show a toast notification.
     * @param {string} message
     * @param {'success'|'error'|'info'} type
     */
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        if (this._notificationTimer) {
            clearTimeout(this._notificationTimer);
        }

        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const div = document.createElement('div');
        div.className = `notification ${type}`;
        div.textContent = `${icons[type] || ''} ${message}`;

        document.body.appendChild(div);

        this._notificationTimer = setTimeout(() => {
            div.style.opacity = '0';
            div.style.transition = 'opacity 0.3s ease';
            setTimeout(() => div.remove(), 300);
        }, CONFIG.NOTIFICATION_DURATION);
    }

    /**
     * Disable a button (e.g., while processing).
     * @param {string} buttonId
     */
    disableButton(buttonId) {
        const btn = document.getElementById(buttonId);
        if (btn) btn.disabled = true;
    }

    /**
     * Enable a button.
     * @param {string} buttonId
     */
    enableButton(buttonId) {
        const btn = document.getElementById(buttonId);
        if (btn) btn.disabled = false;
    }

    /**
     * Reset the UI to step 1.
     */
    reset() {
        this.showStep(1);
        this.setContent('refinementContent', '');
        this.setContent('optimistContent', '');
        this.setContent('pessimistContent', '');

        const conclusionEl = document.getElementById('debateConclusion');
        if (conclusionEl) conclusionEl.innerHTML = '';

        const fileStructure = document.getElementById('fileStructure');
        if (fileStructure) fileStructure.innerHTML = '';

        const generationContent = document.getElementById('generationContent');
        if (generationContent) generationContent.textContent = '';

        const iframe = document.getElementById('previewFrame');
        if (iframe) iframe.src = '';

        const promptEl = document.getElementById('userPrompt');
        if (promptEl) promptEl.value = '';

        this.enableButton('startBtn');
        this.currentStep = 1;
    }
}
