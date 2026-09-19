import {
  getProjectAttachmentExtension,
  isSafeProjectAttachmentName,
} from '../components/development-request/project-wizard/utils/fileValidation';

export {
  PROJECT_ATTACHMENT_ACCEPT,
  PROJECT_ATTACHMENT_FIELD,
  PROJECT_ATTACHMENT_MAX_BYTES,
  PROJECT_ATTACHMENT_MAX_FILENAME_LENGTH,
  getProjectAttachmentExtension,
  isSafeProjectAttachmentName,
  validateProjectAttachment,
} from '../components/development-request/project-wizard/utils/fileValidation';

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
};

const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04];

export interface ProjectAttachmentContentValidationResult {
  ok: boolean;
  contentType?: string;
}

const startsWithBytes = (contents: Uint8Array, signature: number[]) =>
  signature.every((byte, index) => contents[index] === byte);

const containsAscii = (contents: Uint8Array, value: string) => {
  if (!value || contents.length < value.length) return false;

  outer: for (let index = 0; index <= contents.length - value.length; index += 1) {
    for (let offset = 0; offset < value.length; offset += 1) {
      if (contents[index + offset] !== value.charCodeAt(offset)) {
        continue outer;
      }
    }

    return true;
  }

  return false;
};

const hasOfficeMacroMarkers = (contents: Uint8Array) =>
  ['vbaProject.bin', 'word/vbaData.xml', 'Basic/', 'Scripts/'].some((marker) => containsAscii(contents, marker));

/**
 * Browser MIME values are client controlled. This is a lightweight server-side
 * plausibility check before a document is forwarded as an email attachment; it
 * intentionally complements, rather than replaces, malware scanning upstream.
 */
export const validateProjectAttachmentContent = (
  fileName: string,
  contents: Uint8Array
): ProjectAttachmentContentValidationResult => {
  if (!isSafeProjectAttachmentName(fileName) || !contents.length) {
    return { ok: false };
  }

  const extension = getProjectAttachmentExtension(fileName);
  const contentType = MIME_TYPES_BY_EXTENSION[extension];

  if (!contentType) {
    return { ok: false };
  }

  if (extension === '.pdf') {
    return startsWithBytes(contents, [0x25, 0x50, 0x44, 0x46, 0x2d]) ? { ok: true, contentType } : { ok: false };
  }

  if (!startsWithBytes(contents, ZIP_SIGNATURE) || hasOfficeMacroMarkers(contents)) {
    return { ok: false };
  }

  const isExpectedOfficeDocument =
    (extension === '.docx' && containsAscii(contents, 'word/document.xml') && containsAscii(contents, '[Content_Types].xml')) ||
    (extension === '.xlsx' && containsAscii(contents, 'xl/workbook.xml') && containsAscii(contents, '[Content_Types].xml')) ||
    (extension === '.odt' &&
      containsAscii(contents, 'mimetypeapplication/vnd.oasis.opendocument.text') &&
      containsAscii(contents, 'content.xml')) ||
    (extension === '.ods' &&
      containsAscii(contents, 'mimetypeapplication/vnd.oasis.opendocument.spreadsheet') &&
      containsAscii(contents, 'content.xml'));

  return isExpectedOfficeDocument ? { ok: true, contentType } : { ok: false };
};
