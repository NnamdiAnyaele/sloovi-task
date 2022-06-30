export const auth = {
    authenticate: () => {
      const token = localStorage.getItem("token");
      if (token) {
        return true;
      }
      return false;
    },
};