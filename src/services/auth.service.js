import axios from "axios";
import serverURL from "../config/serverAddress";

const API_URL = serverURL + "/api/";

class AuthService {
  async login(user) {
    const data = {
      username: user.username,
      password: user.password,
    };
    return await axios
      .post(API_URL + "login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (!res.data.token) {
          throw new Error("رمز عبور یا نام کاربری صحیح نمیباشد.");
        }
        sessionStorage.setItem("token", res.data.token);
        return res.data;
      })
      .catch((error) => {
        throw new Error("مشکلی پیش اومد. دوباره سعی کنید.");
      });
  }

  logout() {
    sessionStorage.clear();
  }
}

export default new AuthService();
