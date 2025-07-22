import Papa from 'papaparse';

export function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        resolve(results.data);
      },
      error: (err: any) => {
        reject(err);
      },
    });
  });
}

export async function importUsersFromCSV(users: any[]): Promise<any> {

  const res = await fetch('http://localhost:5000/api/users/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Import CSV thất bại');
  }
  return res.json();
}

export function generateResultCSV(csvRows: any[], result: any[]): string {
  // Thêm cột Process vào từng dòng
  const csvWithResult = csvRows.map((row, idx) => ({
    ...row,
    Process: result[idx]?.status === 'success' ? '✔ Thành công' : `❌ ${result[idx]?.message || 'Lỗi'}`
  }));
  // Chuyển thành chuỗi CSV
  const csvString = Papa.unparse(csvWithResult);
  // Tạo Blob và URL
  const blob = new Blob([csvString], { type: 'text/csv' });
  return URL.createObjectURL(blob);
}

export function mapImportStatus(result: any[]): { status: string }[] {
  return result.map((r: any) => ({
    status: r.status === 'success' ? '✔ Thành công' : `❌ ${r.message || 'Lỗi'}`
  }));
}

export function validateCSVRows(rows: any[]): string | null {
  if (!Array.isArray(rows) || rows.length === 0) return 'File CSV không có dữ liệu';
  // Có thể kiểm tra thêm các cột bắt buộc ở đây nếu muốn
  return null;
}

export function resetImportState(setters: {
  setCsvRows: Function,
  setCsvProcess: Function,
  setCsvError: Function,
  setCsvFileName: Function
}) {
  setters.setCsvRows([]);
  setters.setCsvProcess([]);
  setters.setCsvError("");
  setters.setCsvFileName("");
} 