// frontend/src/app.js - Shared app logic connecting to backend API
// Loads after apiConfig.js

class SchoolApp {
    constructor() {
        this.token = localStorage.getItem('authToken') || null;
        this.currentUser = null;
    }

    // Initialize app on DOM ready
    async init() {
        if (typeof window.api === 'undefined') {
            console.error('❌ apiConfig not loaded');
            return;
        }

        // Add global loading spinner
        this.showLoading();

        try {
            // Load dynamic content
            await Promise.allSettled([
                this.loadGallery(),
                this.loadBlogs()
            ]);

            this.hideLoading();
            console.log('✅ App initialized - connected to backend');
        } catch (error) {
            console.error('❌ Init failed:', error);
            this.showError('Failed to load content. Is backend running on port 5002?');
        }
    }

    // Load gallery images from /api/gallery
    async loadGallery() {
        try {
            const data = await window.api.apiFetch('/api/gallery');
            const grid = document.querySelector('.gallery-grid');
            grid.innerHTML = '';

            data.forEach(image => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.style.backgroundImage = `url(${image.url || image.imageUrl || 'logo.png'})`;
                item.innerHTML = `
                    <div class="gallery-overlay">
                        <button class="gallery-btn" onclick="app.viewImage('${image._id}')">View</button>
                    </div>
                `;
                grid.appendChild(item);
            });
        } catch (error) {
            console.error('Gallery load failed:', error);
            document.querySelector('.gallery-grid').innerHTML = '<p>Gallery coming soon...</p>';
        }
    }

    // Load blogs from /api/blog
    async loadBlogs() {
        try {
            const data = await window.api.apiFetch('/api/blog');
            const grid = document.querySelector('.blogs-grid');
            grid.innerHTML = '';

            data.slice(0, 6).forEach(blog => { // Show latest 6
                const card = document.createElement('article');
                card.className = 'blog-card';
                card.innerHTML = `
                    <div class="blog-image" style="background: linear-gradient(135deg, ${blog.color || '#4a90e2'}, #7db9e8);"></div>
                    <div class="blog-content">
                        <span class="blog-category">${blog.category || 'News'}</span>
                        <div class="blog-meta">
                            <span class="blog-date">${new Date(blog.createdAt).toLocaleDateString()}</span>
                            <span class="blog-author">• ${blog.author || 'Admin'}</span>
                        </div>
                        <h3>${blog.title}</h3>
                        <p>${blog.content?.substring(0, 150)}...</p>
                        <a href="#" class="read-more" onclick="app.viewBlog('${blog._id}')">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Blogs load failed:', error);
            // Keep static blogs as fallback
        }
    }

    // Handle portal login
    async handlePortalLogin(portalType) {
        const email = prompt(`Enter email for ${portalType} portal:`);
        const password = prompt('Enter password:');

        if (!email || !password) return;

        try {
            const data = await window.api.apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, role: portalType })
            });

            localStorage.setItem('authToken', data.token);
            this.token = data.token;
            this.currentUser = data.user;

            alert(`✅ Welcome ${data.user.name} to ${portalType} portal!`);
            // TODO: Redirect to dashboard or show mini-dashboard
            window.location.href = `/#${portalType}-dashboard`;
        } catch (error) {
            alert('❌ Login failed: ' + error.message);
        }
    }

    // Submit real admission form
    async submitAdmission(formData) {
        try {
            const data = await window.api.submitAdmission(formData);
            return data;
        } catch (error) {
            throw new Error(`Submission failed: ${error.message}`);
        }
    }

    // UI Helpers
    showLoading() {
        document.body.style.opacity = '0.7';
        // Add spinner if needed
    }

    hideLoading() {
        document.body.style.opacity = '1';
    }

    showError(message) {
        // Simple toast
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:red;color:white;padding:1rem;border-radius:5px;z-index:9999;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
}

// Global app instance
const app = new SchoolApp();

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => app.init());

// Expose for onclick handlers
window.app = app;

