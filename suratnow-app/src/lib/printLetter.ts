import api from './api';

/** Open an approved letter PDF through the authenticated API client. */
export async function openLetterPdf(letterId: number): Promise<void> {
  if (!Number.isInteger(letterId) || letterId < 1) {
    throw new Error('Invalid letter id');
  }

  // Open synchronously from the click handler so the browser does not block the tab.
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.opener = null;
  }

  try {
    const response = await api.get<Blob>(`/letters/${letterId}/print`, {
      responseType: 'blob',
    });
    const pdfUrl = URL.createObjectURL(response.data);

    if (printWindow && !printWindow.closed) {
      printWindow.location.href = pdfUrl;
    } else {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }

    window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
  } catch (error) {
    printWindow?.close();
    throw error;
  }
}
