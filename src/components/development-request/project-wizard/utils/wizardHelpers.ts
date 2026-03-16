import type { ProjectRequestFormData } from '../types/projectRequest.types';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const formatSavedTime = (date: Date) =>
  new Intl.DateTimeFormat('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const buildCompactList = (items: string[], fallback: string, limit = 3) => {
  if (!items.length) return fallback;
  if (items.length <= limit) return items.join(', ');
  return `${items.slice(0, limit).join(', ')} +${items.length - limit}`;
};

export const compactText = (value: string, fallback: string, maxLength = 140) => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) return fallback;
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength);
  const safeSlice = truncated.includes(' ') ? truncated.slice(0, truncated.lastIndexOf(' ')) : truncated;
  return `${safeSlice}...`;
};

interface ScopeSummaryCopy {
  fallback: string;
  featureCountSingular: string;
  featureCountPlural: string;
}

export const buildScopeSummary = (formData: ProjectRequestFormData, copy: ScopeSummaryCopy) => {
  const parts = [formData.projectType, formData.projectLevel, formData.pageRange, formData.designLevel].filter(Boolean);

  if (formData.features.length) {
    parts.push(
      `${formData.features.length} ${
        formData.features.length === 1 ? copy.featureCountSingular : copy.featureCountPlural
      }`
    );
  }

  return parts.length ? parts.join(' / ') : copy.fallback;
};

export const getFocusableElements = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
