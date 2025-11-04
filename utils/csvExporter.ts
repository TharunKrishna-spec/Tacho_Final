import { Session } from '../types';

export const exportSessionToCSV = (session: Session): void => {
  const headers = ['Timestamp', 'RPM'];
  const rows = session.data.map(d => [new Date(d.timestamp).toISOString(), d.rpm].join(','));
  
  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const dateStr = new Date(session.startTime).toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `tachometer-session-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
