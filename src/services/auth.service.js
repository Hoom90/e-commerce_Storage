import axios from "axios";
import apiPath from "../composables/api-path";

class AuthService {
  async login(user) {
    const data = {
      username: user.username,
      password: user.password,
    };
    return await axios
      .post(apiPath.auth.login, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (!res.data.token) {
          throw new Error("رمز عبور یا نام کاربری صحیح نمیباشد.");
        }
        localStorage.setItem("token", res.data.token);
        return res.data;
      })
      .catch((error) => {
        throw new Error("مشکلی پیش اومد. دوباره سعی کنید.");
      });
  }

  logout() {
    localStorage.clear();
  }
}

export default new AuthService();
