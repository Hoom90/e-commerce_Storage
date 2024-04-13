const BASE_URL = import.meta.env.VITE_BASE_URL;
export default {
  auth: {
    login: BASE_URL + "/login",
  },
  storage: {
    getAll: BASE_URL + "/itemTransaction/",
    getSingleItem: BASE_URL + "/itemTransaction/",
    addSingleItem: BASE_URL + "/itemTransaction/",
    addListItem: BASE_URL + "/itemTransaction/list",
    orderSingleItem: (id) => `${BASE_URL}/itemTransaction/${id}`,
    editSingleItem: (id) => `${BASE_URL}/itemTransaction/${id}`,
    getSingleItem: (id) => `${BASE_URL}/itemTransaction/${id}`,
    deleteSingleItem: (id) => `${BASE_URL}/itemTransaction/${id}`,
  },
  cachier: {},
  status: {},
};
