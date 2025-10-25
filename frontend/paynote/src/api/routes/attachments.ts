import { http } from "../lib/http";
import type { Attachment } from "@/types/interfaces/Attachment";
import type { UUID } from "@/types/primitives/UUID";
import type { AttachmentCreate } from "../types/requests";

/**
 * Attachments API
 * Manage file attachments (metadata only, upload is out-of-band)
 */
export const attachmentsApi = {
  /**
   * Create attachment metadata
   * POST /orgs/{orgId}/attachments
   * Note: Actual file upload happens out-of-band (e.g., S3 presigned URL)
   */
  create: (orgId: UUID, data: AttachmentCreate) =>
    http.post<Attachment>(`/orgs/${orgId}/attachments`, data),
};
