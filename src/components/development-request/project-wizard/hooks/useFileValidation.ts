import type { ProjectAttachmentValidationMessages } from '../types/projectRequest.types';
import { validateProjectAttachment } from '../utils/fileValidation';

interface FileValidationOptions {
  fileInput: HTMLInputElement;
  uploadList: HTMLElement;
  uploadPlaceholder: HTMLElement;
  messages: ProjectAttachmentValidationMessages;
  setFieldError: (fieldName: string, message?: string) => void;
  onChange: () => void;
}

export const useFileValidation = ({
  fileInput,
  uploadList,
  uploadPlaceholder,
  messages,
  setFieldError,
  onChange,
}: FileValidationOptions) => {
  let selectedAttachment: File | null = null;

  const renderUploadList = () => {
    uploadList.innerHTML = '';

    if (!selectedAttachment) {
      uploadPlaceholder.hidden = false;
      uploadList.appendChild(uploadPlaceholder);
      return;
    }

    uploadPlaceholder.hidden = true;

    const fileChip = document.createElement('span');
    fileChip.className = 'development-upload-item';
    fileChip.textContent = selectedAttachment.name;

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'development-upload-clear';
    clearButton.textContent = messages.clearLabel;
    clearButton.addEventListener('click', clearAttachment);

    uploadList.append(fileChip, clearButton);
  };

  const clearAttachment = () => {
    selectedAttachment = null;
    fileInput.value = '';
    setFieldError('uploadedFiles', '');
    renderUploadList();
    onChange();
  };

  const validateAttachment = () => {
    const validation = validateProjectAttachment(selectedAttachment, messages);
    setFieldError('uploadedFiles', validation.message);
    return validation.ok;
  };

  const handleSelectionChange = () => {
    selectedAttachment = fileInput.files?.[0] ?? null;

    if (!validateAttachment()) {
      selectedAttachment = null;
      fileInput.value = '';
    }

    renderUploadList();
    onChange();
  };

  return {
    clearAttachment,
    getSelectedAttachment: () => selectedAttachment,
    getUploadedFileNames: () => (selectedAttachment ? [selectedAttachment.name] : []),
    handleSelectionChange,
    renderUploadList,
    validateAttachment,
  };
};
