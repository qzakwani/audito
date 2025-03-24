import type { Core } from "@strapi/strapi";

// Function to sanitize JSON data by removing sensitive fields
const sanitizeData = (data: any) => {
  if (!data) return data;

  // For arrays, sanitize each element
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // For objects, sanitize recursively
  if (typeof data === "object") {
    const sanitized = { ...data };

    // Remove top-level documentId - no need to check if exists
    delete sanitized.documentId;

    // Clean createdBy if it exists
    if (sanitized.createdBy && typeof sanitized.createdBy === "object") {
      delete sanitized.createdBy.documentId;
      delete sanitized.createdBy.password;
      delete sanitized.createdBy.resetPasswordToken;
      delete sanitized.createdBy.registrationToken;
      delete sanitized.createdBy.preferedLanguage;
      delete sanitized.createdBy.locale;
    }

    // Clean updatedBy if it exists
    if (sanitized.updatedBy && typeof sanitized.updatedBy === "object") {
      delete sanitized.updatedBy.documentId;
      delete sanitized.updatedBy.password;
      delete sanitized.updatedBy.resetPasswordToken;
      delete sanitized.updatedBy.registrationToken;
      delete sanitized.updatedBy.preferedLanguage;
      delete sanitized.updatedBy.locale;
    }

    return sanitized;
  }

  return data;
};

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async list(ctx) {
    try {
      const { page } = ctx.query;
      const audits = await strapi
        .plugin("audito")
        .service("service")
        .getAudits(page);
      ctx.body = audits;
    } catch (error) {
      console.error("Audito: Error in list endpoint", error);
      ctx.throw(500, "Failed to retrieve audit logs");
    }
  },

  async getChanges(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        return ctx.badRequest("ID is required");
      }

      const changes = await strapi
        .plugin("audito")
        .service("service")
        .getChangesById(id);

      if (!changes) {
        return ctx.notFound("Audit record not found");
      }

      // Sanitize the changes data to remove sensitive information
      const sanitizedData = sanitizeData(changes.changes);

      ctx.body = sanitizedData;
    } catch (error) {
      console.error("Audito: Error in getChanges endpoint", error);
      ctx.throw(500, "Failed to retrieve audit changes");
    }
  },
});

export default controller;
