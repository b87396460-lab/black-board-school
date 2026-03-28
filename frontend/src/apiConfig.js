/**
 * API Configuration - Dynamic Base URL
 * Automatically detects local dev vs production (Netlify)
 * Beginner-friendly wrapper for fetch/axios-style calls
 */

const API_CONFIG = {
    // Local development
    LOCAL_BASE: 'http://localhost:5002/api',
    // Production (Render)
    PROD_BASE: 'https://black-board-school.onrender.com/api',

    /**
     * Get dynamic API base URL
     * @returns {string} Base URL for current environment
     */
    getBaseUrl() {
        // Local development (Live Server or file://)
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:') {
            return this.LOCAL_BASE;
        }

        // Production (Netlify or other hosted)
        return this.PROD_BASE;
    },

    /**
     * Clean API fetch wrapper (fetch or axios style)
     * @param {string} endpoint - API endpoint (e.g., '/auth/login')
     * @param {Object} [options] - Fetch options
     * @returns {Promise} Response
     */
    async apiFetch(endpoint, options = {}) {
        const baseUrl = this.getBaseUrl();
        const url = `${baseUrl}${endpoint}`;

        // Default options
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // For auth cookies
            ...options
        };

        try {
            console.log(`🌐 API Call: ${url}`);
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    }
};

// Example API functions (use these in your code)
const api = {
    // Auth examples
    login: (credentials) => API_CONFIG.apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    // Admissions example (for form)
    submitAdmission: (formData) => API_CONFIG.apiFetch('/admissions', {
        method: 'POST',
        body: JSON.stringify(formData)
    }),

    // Other examples
    getBlogs: () => API_CONFIG.apiFetch('/blog'),
    uploadGallery: (imageData) => API_CONFIG.apiFetch('/gallery', {
        method: 'POST',
        body: imageData
    })
};

// Export for use in HTML/scripts
window.apiConfig = API_CONFIG;
window.api = api;

console.log('✅ API Config loaded. Local:', API_CONFIG.getBaseUrl());

// For Netlify builds - this works automatically!

