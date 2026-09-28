import api from './api';

/** Open a protected attachment returned by the authenticated API client. */
export async function openLetterAttachment(letterId: number): Promise<void> {
  if (!Number.isInteger(letterId) || letterId < 1) {
    throw new Error('Invalid letter id');
  }

  const attachmentWindow = window.open('', '_blank');
  if (attachmentWindow) {
    attachmentWindow.opener = null;
  }

  try {
    const response = await api.get<Blob>(`/letter-requests/${letterId}/attachment`, {
      responseType: 'blob',
    });
    const fileUrl = URL.createObjectURL(response.data);

    if (attachmentWindow && !attachmentWindow.closed) {
      attachmentWindow.location.href = fileUrl;
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }

    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
  } catch (error) {
    attachmentWindow?.close();
    throw error;
  }
}
