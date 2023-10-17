import serverURL from "../config/serverAddress";

const API_URL = serverURL + "/api/";

class AuthService {
  async login(user) {
    const data = {
      username: user.username,
      password: user.password,
    };
    return await fetch(API_URL + "login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status == 404 || res.status == 401) {
            throw new Error("رمز عبور یا نام کاربری صحیح نمیباشد.");
          } else {
            throw new Error("مشکلی پیش اومد. دوباره سعی کنید.");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          const now = new Date();
          let value = data.token;
          const item = {
            value: value,
            expiry: now.getTime() + 43200000, // token will expire in 12 hours
            // expiry: now.getTime() + 5000, // token will expire in 5 seconds
          };
          localStorage.setItem("token", JSON.stringify(item));
        }
        return data;
      });
  }

  logout() {
    localStorage.clear();
  }
}

export default new AuthService();
