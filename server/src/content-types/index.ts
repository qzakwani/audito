export default {
  audito: {
    schema: {
      kind: "collectionType",
      collectionName: "auditos",
      info: {
        singularName: "audito",
        pluralName: "auditos",
        displayName: "Audito",
        description: "",
      },
      options: {
        draftAndPublish: false,
      },
      pluginOptions: {
        "content-manager": {
          visible: false,
        },
        "content-type-builder": {
          visible: false,
        },
      },
      attributes: {
        action: {
          type: "string",
          required: true,
          maxLength: 20,
        },
        contentTypeName: {
          type: "string",
          required: true,
        },
        recordId: {
          type: "biginteger",
          required: true,
        },
        userName: {
          type: "string",
          required: true,
        },
        changes: {
          type: "json",
        },
      },
    },
  },
};
