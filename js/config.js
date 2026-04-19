/**
 * Frontend Configuration
 * Points to the Python Flask backend.
 * Change BACKEND_URL to match your deployment.
 */
const CONFIG = {
    // Backend API base URL - update for production
    BACKEND_URL: 'http://localhost:5000',

    // Debate settings
    DEBATE_ROUNDS: 2,

    // UI settings
    NOTIFICATION_DURATION: 4000, // ms
    ANIMATION_DELAY: 200         // ms between step transitions
};
