export default [
  {
    method: "GET",
    path: "/audits",
    handler: "controller.list",
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
    },
  },
  {
    method: "GET",
    path: "/audits/:id",
    handler: "controller.getChanges",
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
    },
  },
];
