import type {
  ProjectAttachmentLike,
  ProjectAttachmentValidationMessages,
  ProjectAttachmentValidationResult,
} from '../types/projectRequest.types';

export const PROJECT_ATTACHMENT_FIELD = 'attachment';
export const PROJECT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const PROJECT_ATTACHMENT_MAX_FILENAME_LENGTH = 120;
export const PROJECT_ATTACHMENT_ACCEPT = '.pdf,.docx,.xlsx,.odt,.ods';

const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.xlsx',
  '.odt',
  '.ods',
]);
const UNSAFE_FILE_NAME_CHARACTERS = /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069\\/:*?"<>|]/;

export const getProjectAttachmentExtension = (fileName: string) => {
  const normalizedName = fileName.trim().toLowerCase();
  const dotIndex = normalizedName.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === normalizedName.length - 1) {
    return '';
  }

  return normalizedName.slice(dotIndex);
};

export const isSafeProjectAttachmentName = (fileName: string) => {
  const normalizedName = fileName.trim();

  return (
    Boolean(normalizedName) &&
    normalizedName.length <= PROJECT_ATTACHMENT_MAX_FILENAME_LENGTH &&
    !UNSAFE_FILE_NAME_CHARACTERS.test(normalizedName) &&
    !normalizedName.startsWith('.')
  );
};

export const validateProjectAttachment = (
  file: ProjectAttachmentLike | null | undefined,
  messages?: ProjectAttachmentValidationMessages
): ProjectAttachmentValidationResult => {
  if (!file) {
    return { ok: true };
  }

  const extension = getProjectAttachmentExtension(file.name);

  if (!isSafeProjectAttachmentName(file.name) || !ALLOWED_DOCUMENT_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      message: messages?.invalidType,
    };
  }

  if (!Number.isFinite(file.size) || file.size < 0 || file.size > PROJECT_ATTACHMENT_MAX_BYTES) {
    return {
      ok: false,
      message: messages?.tooLarge,
    };
  }

  return { ok: true };
};
