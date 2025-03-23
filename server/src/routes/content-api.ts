export default [
  {
    method: "GET",
    path: "/audits",
    handler: "controller.list",
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
    },
  },
];
