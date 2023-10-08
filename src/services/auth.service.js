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
        "content-type": "application/json",
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
          localStorage.setItem("token", data.token);
        }
        return data;
      });
  }

  logout() {
    localStorage.clear();
  }
}

export default new AuthService();
