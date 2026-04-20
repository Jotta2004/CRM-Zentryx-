// Auth Context Management
const AUTH_KEY = 'zentryx_auth';

class AuthSystem {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem(AUTH_KEY));
  }

  login(email, password) {
    const user = window.db.getUser(email, password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'E-mail ou senha inválidos' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    window.app.navigate('login');
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  isActive() {
    return this.currentUser && this.currentUser.subscriptionStatus === 'active';
  }

  getUser() {
    return this.currentUser;
  }
}

window.auth = new AuthSystem();
