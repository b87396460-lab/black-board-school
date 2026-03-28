// Enhanced app.js with full portal dashboards
class SchoolApp {
    constructor() {
        this.token = localStorage.getItem('authToken') || null;
        this.currentUser = null;
        this.initAuthHeader();
    }

    initAuthHeader() {
        if (this.token) {
            window.api.apiFetch = this.apiFetchWithAuth;
        }
    }

    // Authenticated API call
    async apiFetchWithAuth(endpoint, options = {}) {
        const config = {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        return window.apiConfig.apiFetch(endpoint, config);
    }

    async init() {
        if (typeof window.api === 'undefined') return console.error('❌ apiConfig not loaded');
        this.showLoading();

        try {
            await Promise.allSettled([this.loadGallery(), this.loadBlogs()]);
            this.checkAuthStatus();
            this.hideLoading();
        } catch (error) {
            this.showError('Backend connection failed');
        }
    }

    async checkAuthStatus() {
        if (this.token) {
            try {
                this.currentUser = await this.apiFetchWithAuth('/api/auth/profile');
                this.showDashboard(this.currentUser.role);
            } catch {
                localStorage.removeItem('authToken');
            }
        }
    }

    showDashboard(role) {
        // Hide all, show role dashboard
        document.querySelectorAll('[data-dashboard]').forEach(d => d.style.display = 'none');
        const dashboard = document.querySelector(`[data-dashboard="${role}"]`);
        if (dashboard) dashboard.style.display = 'block';

        document.querySelector('.portals-section').scrollIntoView();
        this.updateNavUser();
    }

    updateNavUser() {
        const userMenu = document.querySelector('.user-menu') || this.createUserMenu();
        userMenu.innerHTML = `
            <span>${this.currentUser.name} (${this.currentUser.role})</span>
            <button onclick="app.logout()">Logout</button>
        `;
    }

    createUserMenu() {
        const nav = document.querySelector('.nav-menu');
        const menu = document.createElement('li');
        menu.className = 'user-menu';
        menu.innerHTML = '<span>Login</span>';
        nav.appendChild(menu);
        return menu;
    }

    async handlePortalLogin(portalType) {
        const email = prompt(`Enter email for ${portalType} portal:`);
        if (!email) return;

        const password = prompt('Enter password:');
        if (!password) return;

        try {
            const data = await window.api.apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, role: portalType })
            });

            localStorage.setItem('authToken', data.token);
            this.token = data.token;
            this.currentUser = data.user;
            this.initAuthHeader();

            alert(`✅ Welcome ${data.user.name}!`);
            this.showDashboard(portalType);
        } catch (error) {
            alert('❌ Login failed: ' + error.message);
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        this.token = null;
        this.currentUser = null;
        document.querySelectorAll('[data-dashboard]').forEach(d => d.style.display = 'none');
        location.reload();
    }

    // ADMIN: Add Teacher
    async addTeacher() {
        const name = prompt('Teacher Name:');
        const email = prompt('Email:');
        const phone = prompt('Phone:');
        const subject = prompt('Subject:');

        if (!name || !email) return;

        try {
            const teacher = await this.apiFetchWithAuth('/api/admin/add-teacher', {
                method: 'POST',
                body: JSON.stringify({ name, email, phone, subject })
            });
            alert('✅ Teacher added: ' + teacher.name);
            this.refreshAdminList();
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    async refreshAdminList() {
        // Update teachers list in admin dashboard
        const teachers = await this.apiFetchWithAuth('/api/admin/users?role=teacher');
        const list = document.querySelector('#adminTeachersList');
        list.innerHTML = teachers.map(t => `<li>${t.name} - ${t.subject}</li>`).join('');
    }

    // TEACHER: Add Student & Marks/Attendance
    async addStudent() {
        const name = prompt('Student Name:');
        const classGrade = prompt('Class:');
        const parentName = prompt('Parent Name:');
        const parentPhone = prompt('Parent Phone:');

        try {
            const student = await this.apiFetchWithAuth('/api/teacher/add-student', {
                method: 'POST',
                body: JSON.stringify({ name, classGrade, parentName, parentPhone })
            });
            alert('✅ Student added: ' + student.name);
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    async addMarks(studentId = prompt('Student ID:')) {
        const subject = prompt('Subject:');
        const marks = prompt('Marks:');
        try {
            await this.apiFetchWithAuth('/api/marks', {
                method: 'POST',
                body: JSON.stringify({ studentId, subject, marks: Number(marks) })
            });
            alert('✅ Marks added');
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    async addAttendance(studentId = prompt('Student ID:')) {
        const date = prompt('Date (YYYY-MM-DD):') || new Date().toISOString().split('T')[0];
        const status = prompt('Status (present/absent):');
        try {
            await this.apiFetchWithAuth('/api/attendance', {
                method: 'POST',
                body: JSON.stringify({ studentId, date, status })
            });
            alert('✅ Attendance marked');
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    // STUDENT/PARENT: View Data
    async viewMarks() {
        const studentId = this.currentUser.studentId || prompt('Student ID:');
        const marks = await this.apiFetchWithAuth(`/api/marks/${studentId}`);
        let html = '<ul>';
        marks.forEach(m => html += `<li>${m.subject}: ${m.marks} (${m.date})</li>`);
        html += '</ul>';
        this.showModal('Marks', html);
    }

    async viewAttendance() {
        const studentId = this.currentUser.studentId || prompt('Student ID:');
        const attendance = await this.apiFetchWithAuth(`/api/attendance/${studentId}`);
        let html = '<ul>';
        attendance.forEach(a => html += `<li>${a.date}: ${a.status}</li>`);
        html += '</ul>';
        this.showModal('Attendance', html);
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>${title}</h3>
                ${content}
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Existing methods...
    async loadGallery() { /* unchanged */ }
    async loadBlogs() { /* unchanged */ }
    async submitAdmission(formData) { /* unchanged */ }
    showLoading() { document.body.style.opacity = '0.7'; }
    hideLoading() { document.body.style.opacity = '1'; }
    showError(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:red;color:white;padding:1rem;border-radius:5px;z-index:9999;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
}

const app = new SchoolApp();
document.addEventListener('DOMContentLoaded', () => app.init());
window.app = app;
