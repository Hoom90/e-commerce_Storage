import axios from "axios";
let timerLoading;

const HttpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 20 * 1000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

HttpClient.interceptors.request.use(
  (config) => {
    // clearTimeout(timerLoading);
    // timerLoading = setTimeout(() => {
    //   // common.globalLoading();
    //   // در حال بارگزاری
    // }, 500);
    const token = localStorage.getItem('token')
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

HttpClient.interceptors.response.use(
  (response) => {
    // clearTimeout(timerLoading);

    // common.endLoading();
      // اتمام در حال بارگزاری 

    if (
      response.headers["content-type"] ===
      "application/octet-stream;charset=UTF-8"
    ) {
      return response.data || null;
    }
    // const { code, message } = response.data;
    return response.data || null;
  },
  (error) => {
    // clearTimeout(timerLoading);

       // common.endLoading();
      // اتمام در حال بارگزاری 

      if (error && error.response) {
      switch (error.response.status) {
        case 0:
          // common.showError({ "عدم ارتباط با سرور": { "": "با مدیر سامانه تماس بگیرید" } })
          break;
        case 400:
          console.log("وقوع خطا در سمت سرور...");
          break;
        case 401:
          console.log("عدم احراز هویت");
          // routerInstance.push("/account/login");
          break;
        case 403:
          console.log("مشکل عدم دسترسی");
          // routerInstance.push("/accessDenied");
          break;
        case 404:
          console.log("درخواست شما سمت سرور یافت نشد");
          break;
        case 405:
          break;
        case 408:
          break;
        case 411:
          break;
        case 413:
          break;
        case 414:
          break;
        case 415:
          break;
        case 500:
          break;
        case 501:
          break;
        case 502:
          break;
        case 503:
          break;
        case 504:
          break;
        case 505:
          break;
        default:
          console.log(`http client status : ${error.response.status}`);
      }
    }
    return Promise.reject(error.response);
  }
);
export default HttpClient;
