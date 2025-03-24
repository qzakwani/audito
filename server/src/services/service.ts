import type { Core } from "@strapi/strapi";
import { PLUGIN_UID } from "../types";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getAudits(p = 1) {
    return await strapi.db.query(PLUGIN_UID).findPage({
      page: p,
      pageSize: 20,
      select: ["id", "action", "contentTypeName", "userName", "createdAt"],
      orderBy: { createdAt: "desc" }, // Correct syntax for sorting by createdAt in descending order
    });
  },

  async getChangesById(id) {
    return await strapi.db.query(PLUGIN_UID).findOne({
      select: ["changes"],
      where: { id },
    });
  },
});

export default service;
