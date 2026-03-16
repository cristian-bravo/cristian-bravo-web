import type { ProjectRequestFormData } from '../types/projectRequest.types';

interface ProjectRequestServiceOptions {
  attachmentField: string;
  attachment: File | null;
}

export const sendProjectRequest = async (
  formData: ProjectRequestFormData,
  { attachmentField, attachment }: ProjectRequestServiceOptions
) => {
  const payload = new FormData();

  Object.entries(formData).forEach(([fieldName, value]) => {
    if (fieldName === 'features' || fieldName === 'integrations') {
      value.forEach((item) => payload.append(fieldName, item));
      return;
    }

    if (fieldName === 'uploadedFiles') {
      return;
    }

    payload.append(fieldName, value);
  });

  if (attachment) {
    payload.append(attachmentField, attachment, attachment.name);
  }

  const response = await fetch('/api/send-project', {
    method: 'POST',
    body: payload,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || '');
  }
};
