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
          if (res.status === 404) {
            throw new Error("Username or Password Not Correct!");
          } else {
            throw new Error("An error has occurred. Please try again later.");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          sessionStorage.setItem("token", data.token);
        }
        return data;
      });
  }

  logout() {
    sessionStorage.clear();
  }
}

export default new AuthService();
