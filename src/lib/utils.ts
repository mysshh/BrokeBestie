export const downloadCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(',');
  const csvContent = [headers, ...data.map(row => Object.values(row).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
};

export const filterExpensesByDate = (expenses: any[], period: string) => {
  const now = new Date();
  
  if (period === '7d') {
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    return expenses.filter(e => new Date(e.date) >= sevenDaysAgo);
  } else if (period === '30d') {
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    return expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
  } else if (period === 'current_month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses.filter(e => new Date(e.date) >= startOfMonth);
  }
  
  return expenses;
};
