import type { Core } from "@strapi/strapi";
import { PLUGIN_UID, AuditAction } from "./types";
import { safeGet } from "./utils";

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  console.log("\n\nAudito -> Bootstrapping\n");

  let _modelsUID = [];
  let _modelsInfo = {};
  try {
    const contentTypes = Object.values(strapi.contentTypes);
    console.log("Audito -> loaded content types:");
    for (const contentType of contentTypes) {
      if (!contentType.uid.startsWith("api") || contentType.uid === PLUGIN_UID)
        continue;
      _modelsUID.push(contentType.uid);
      _modelsInfo[contentType.uid] = contentType;
      console.log(contentType.info.displayName);
    }
    console.log("\n");
  } catch (error) {
    console.error("Audito -> Error loading content:", error);
  }

  const createAuditLog = async (event, action) => {
    if (event.model.uid === PLUGIN_UID) return;

    try {
      await strapi.db.query(PLUGIN_UID).create({
        data: {
          action,
          contentTypeName: safeGet(
            _modelsInfo[event.model.uid],
            "info.displayName",
            ""
          ),
          recordId: event.result?.id || 0,
          userName:
            safeGet(event.result, "createdBy.firstname", "Unknown") +
            " " +
            safeGet(event.result, "createdBy.lastname", ""),
          changes: event.result || {},
        },
      });
      console.log(
        `Audito -> Audit created for |${action}| on ${event.model.uid}`
      );
    } catch (error) {
      console.error("Audito -> Error creating audit:", error);
    }
  };

  strapi.db.lifecycles.subscribe({
    models: _modelsUID,
    async afterCreate(event) {
      await createAuditLog(event, AuditAction.CREATE);
    },
  });

  strapi.db.lifecycles.subscribe({
    models: _modelsUID,
    async afterUpdate(event) {
      await createAuditLog(event, AuditAction.UPDATE);
    },
  });

  strapi.db.lifecycles.subscribe({
    models: _modelsUID,
    async afterDelete(event) {
      await createAuditLog(event, AuditAction.DELETE);
    },
  });
};

export default bootstrap;
