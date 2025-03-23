export type AuditLogEntry = {
  id: number;
  action: AuditAction;
  contentTypeName: string;
  userName: string;
  createdAt: string;
};

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}
