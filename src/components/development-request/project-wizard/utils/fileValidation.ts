import type {
  ProjectAttachmentLike,
  ProjectAttachmentValidationMessages,
  ProjectAttachmentValidationResult,
} from '../types/projectRequest.types';

export const PROJECT_ATTACHMENT_FIELD = 'attachment';
export const PROJECT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const PROJECT_ATTACHMENT_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.odt,.ods';

const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.odt',
  '.ods',
]);

export const getProjectAttachmentExtension = (fileName: string) => {
  const normalizedName = fileName.trim().toLowerCase();
  const dotIndex = normalizedName.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === normalizedName.length - 1) {
    return '';
  }

  return normalizedName.slice(dotIndex);
};

export const validateProjectAttachment = (
  file: ProjectAttachmentLike | null | undefined,
  messages?: ProjectAttachmentValidationMessages
): ProjectAttachmentValidationResult => {
  if (!file) {
    return { ok: true };
  }

  const extension = getProjectAttachmentExtension(file.name);

  if (!ALLOWED_DOCUMENT_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      message: messages?.invalidType,
    };
  }

  if (file.size > PROJECT_ATTACHMENT_MAX_BYTES) {
    return {
      ok: false,
      message: messages?.tooLarge,
    };
  }

  return { ok: true };
};
