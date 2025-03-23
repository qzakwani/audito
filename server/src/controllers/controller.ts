import type { Core } from "@strapi/strapi";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async list(ctx) {
    try {
      const audits = await strapi
        .plugin("audito")
        .service("service")
        .getAudits();
      ctx.body = audits;
    } catch (error) {
      console.error("Audito: Error in list endpoint", error);
      ctx.throw(500, "Failed to retrieve audit logs");
    }
  },
});

export default controller;
