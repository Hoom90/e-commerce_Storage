import authHeader from "./auth-header";
const API_URL = import.meta.env.VITE_BASE_URL

class UserService {
  async getPublicContent() {
    return await fetch(API_URL + "all");
  }

  async getUserBoard() {
    return await fetch(API_URL + "user", {
      method: "GET",
      headers: authHeader(),
    });
  }

  async getModeratorBoard() {
    return await fetch(API_URL + "mod", {
      method: "GET",
      headers: authHeader(),
    });
  }

  async getAdminBoard() {
    return await fetch(API_URL + "admin", {
      method: "GET",
      headers: authHeader(),
    });
  }
}

export default new UserService();
