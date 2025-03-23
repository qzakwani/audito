import type { Core } from "@strapi/strapi";
import { PLUGIN_UID } from "../types";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getAudits() {
    return await strapi.db.query(PLUGIN_UID).findMany({
      select: ["id", "action", "contentTypeName", "userName", "createdAt"],
    });
  },
});

export default service;
