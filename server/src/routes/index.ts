import contentAPIRoutes from "./content-api";

const routes = {
  admin: {
    type: "admin",
    routes: contentAPIRoutes,
  },
};

export default routes;
