import store from "./store";
import router from "./config";

export default function authHeader() {
  let user = JSON.parse(sessionStorage.getItem("token"));

  if (user && user.accessToken) {
    // for Node.js Express back-end
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
}
