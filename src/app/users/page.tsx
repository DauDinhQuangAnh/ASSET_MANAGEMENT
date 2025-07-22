"use client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { parseCSV, importUsersFromCSV, generateResultCSV, mapImportStatus, validateCSVRows, resetImportState } from './csvImport';
import Papa from 'papaparse';

const POSITIONS = [
  "Junior Staff", "Staff", "Assistant Supervisor", "Supervisor", "Senior Supervisor", "Assistant Manager", "Deputy Manager", "Manager", "Senior Manager", "Deputy General Manager", "BU HEAD", "General Director", "Chairman", "Operator", "Group Leader", "Team Leader", "Shift Staff", "SUB Leader", "Worker", "Senior Technician", "Technician", "Internship", "General Manager", "Other"
];
const BU_LIST = [
  'SMV',
  'GeneralDirectorOffice',
  'Administration',
  'DP',
  'CM',
  'SAS'
];
const BU_MAP: Record<string, number> = {
  'SMV': 1,
  'GeneralDirectorOffice': 2,
  'Administration': 3,
  'DP': 4,
  'CM': 5,
  'SAS': 6
};
const DEPARTMENTS = [
  { name: 'SMV', bu: 1 },
  { name: 'BSO', bu: 2 },
  { name: 'QMS', bu: 2 },
  { name: 'ME', bu: 3 },
  { name: 'Administration', bu: 3 },
  { name: 'HR & GA', bu: 3 },
  { name: 'Import/Export', bu: 3 },
  { name: 'GA', bu: 3 },
  { name: 'HR', bu: 3 },
  { name: 'Energy', bu: 3 },
  { name: 'Accounting', bu: 3 },
  { name: 'IT', bu: 3 },
  { name: 'Purchasing', bu: 3 },
  { name: 'Import/Export Management', bu: 3 },
  { name: 'QMS Management', bu: 3 },
  { name: 'HSE', bu: 3 },
  { name: 'DP BU', bu: 4 },
  { name: 'Material Management', bu: 4 },
  { name: 'Engineering', bu: 4 },
  { name: 'Production', bu: 4 },
  { name: 'QC', bu: 4 },
  { name: 'QA', bu: 4 },
  { name: 'Production Planning', bu: 4 },
  { name: 'Purchasing', bu: 4 },
  { name: 'CM BU', bu: 5 },
  { name: 'SMT Production Planning', bu: 5 },
  { name: 'SMT Production', bu: 5 },
  { name: 'SMT Engineering', bu: 5 },
  { name: 'QA', bu: 5 },
  { name: 'QA/QC', bu: 5 },
  { name: 'Supply Chain Management', bu: 5 },
  { name: 'Test Engineering', bu: 5 },
  { name: 'Equipment Engineering', bu: 5 },
  { name: 'Process Engineering', bu: 5 },
  { name: 'Planning', bu: 5 },
  { name: 'SAS BU', bu: 6 },
  { name: 'Production Planning', bu: 6 },
  { name: 'Production', bu: 6 },
  { name: 'Engineering', bu: 6 },
  { name: 'QA', bu: 6 },
  { name: 'Purchasing', bu: 6 },
  { name: 'Warehouse', bu: 6 },
  { name: 'QMS/QA', bu: 6 }
];
const STATUS_WORK_OPTIONS = [
  { value: 'working', label: 'Đang làm việc' },
  { value: 'on_leave', label: 'Tạm nghỉ' },
  { value: 'resigned', label: 'Đã nghỉ' }
];
const STATUS_ACCOUNT_OPTIONS = [
  { value: 'active', label: 'Đang sử dụng' },
  { value: 'inactive', label: 'Ngưng sử dụng' }
];

const statuses = {
  active: "Đang sử dụng",
  inactive: "Ngừng sử dụng",
};

const USERS_PER_PAGE = 10;

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBU, setFilterBU] = useState("");
  const [allUsers, setAllUsers] = useState([]); // lưu toàn bộ users để filter
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [csvProcess, setCsvProcess] = useState<any[]>([]);
  const [csvError, setCsvError] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvResultUrl, setCsvResultUrl] = useState("");
  const [form, setForm] = useState({
    emp_code: '',
    email: '',
    password: '',
    full_name: '',
    first_name: '',
    last_name: '',
    business_unit_id: '',
    department_id: '',
    position: '',
    join_date: '',
    status_account: 'Đang sử dụng',
    status_work: 'Đang làm việc',
    note: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/users/all");
        const data = await res.json();
        setUsers(data);
        setAllUsers(data);
      } catch (err) {
        setUsers([]);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Lọc users theo filter
  useEffect(() => {
    let filtered = allUsers;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((u: any) =>
        (u.emp_code && u.emp_code.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s)) ||
        (u.full_name && u.full_name.toLowerCase().includes(s))
      );
    }
    if (filterBU) {
      filtered = filtered.filter((u: any) => u.business_unit_id === filterBU);
    }
    if (filterDept) {
      filtered = filtered.filter((u: any) => u.department_id === filterDept);
    }
    if (filterStatus) {
      filtered = filtered.filter((u: any) => (statuses[u.status_account as keyof typeof statuses] || u.status_account) === filterStatus);
    }
    setUsers(filtered);
    setCurrentPage(1); 
  }, [search, filterDept, filterStatus, allUsers, filterBU]);

  // Lấy danh sách phòng ban theo BU filter
  const filteredDepartments = filterBU
    ? DEPARTMENTS.filter(dep => BU_MAP[filterBU] === dep.bu).map(dep => dep.name)
    : Array.from(new Set(DEPARTMENTS.map(dep => dep.name)));

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý người dùng" description="Danh sách và thao tác người dùng hệ thống" showAddButton={false} />
        <main className="flex-1 bg-gray-100 p-6">
          <div className="mx-[0%]">
            <div className="flex flex-row items-center justify-between mb-4 gap-2 w-full">
              <div className="flex-1 bg-white p-2.5 rounded-lg shadow mb-0 md:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mã, email..."
                    className="border p-2 rounded"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <select className="border p-2 rounded" value={filterBU} onChange={e => { setFilterBU(e.target.value); setFilterDept(""); }}>
                    <option value="">Tất cả BU</option>
                    {BU_LIST.map(bu => (
                      <option key={bu} value={bu}>{bu}</option>
                    ))}
                  </select>
                  <select className="border p-2 rounded" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                    <option value="">Tất cả phòng ban</option>
                    {filteredDepartments.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <select className="border p-2 rounded" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(statuses).map(([id, name]) => (
                      <option key={id} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-row gap-2 ml-2">
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition text-sm h-fit">+ Thêm người dùng</button>
                <button onClick={() => setShowImport(true)} className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition text-sm h-fit">Import CSV</button>
              </div>
            </div>
            {/* Modal thêm user */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                <div className="bg-white border border-white/50 rounded-3xl shadow-2xl p-10 w-full max-w-2xl max-h-[95vh] overflow-y-auto relative animate-fade-in">
                  <button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold transition-all">×</button>
                  <div className="flex flex-col items-center mb-6">
                    <UserCircleIcon className="w-16 h-16 text-blue-500 mb-2" />
                    <h3 className="text-2xl font-bold mb-1 text-center">Thêm người dùng mới</h3>
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setFormError('');
                    setFormLoading(true);
                    try {
                      const res = await fetch("http://localhost:5000/api/users/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(form),
                      });
                      const result = await res.json();
                      if (!res.ok) {
                        setFormError(result.message || "Thêm người dùng thất bại");
                      } else {
                        setShowModal(false);
                        window.location.reload();
                        return;
                      }
                    } catch (err: any) {
                      setFormError(err.message || "Có lỗi xảy ra");
                    } finally {
                      setFormLoading(false);
                    }
                  }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-semibold">Mã NV <span className="text-red-500">*</span></label>
                      <input className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="emp_code" value={form.emp_code} onChange={e => setForm(f => ({ ...f, emp_code: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                      <input className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="font-semibold">Mật khẩu <span className="text-red-500">*</span></label>
                      <input type="password" className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="font-semibold">Họ và tên</label>
                      <input className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="full_name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-semibold">Tên</label>
                      <input className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="first_name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-semibold">Họ</label>
                      <input className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="last_name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-semibold">Business Unit</label>
                      <select className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="business_unit_id" value={form.business_unit_id} onChange={e => setForm(f => ({ ...f, business_unit_id: e.target.value, department_id: '' }))}>
                        <option value="">-- Chọn BU --</option>
                        {BU_LIST.map(bu => (
                          <option key={bu} value={bu}>{bu}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold">Phòng ban</label>
                      <select className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="department_id" value={form.department_id} onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}>
                        <option value="">-- Chọn phòng ban --</option>
                        {(() => {
                          const buNum = BU_MAP[form.business_unit_id];
                          return DEPARTMENTS.filter(dep => dep.bu === buNum).map(dep => (
                            <option key={dep.name} value={dep.name}>{dep.name}</option>
                          ));
                        })()}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold">Chức vụ</label>
                      <select className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="position" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}>
                        <option value="">-- Chọn chức vụ --</option>
                        {POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold">Ngày vào làm</label>
                      <input type="date" className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="join_date" value={form.join_date} onChange={e => setForm(f => ({ ...f, join_date: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-semibold">Ghi chú</label>
                      <textarea className="border rounded p-2 w-full border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black bg-white/70" name="note" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                      <button type="button" className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400" onClick={() => setShowModal(false)} disabled={formLoading}>Hủy</button>
                      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={formLoading}>{formLoading ? 'Đang lưu...' : 'Lưu'}</button>
                    </div>
                    {formError && <div className="md:col-span-2 text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded p-3 mt-2">{formError}</div>}
                  </form>
                </div>
              </div>
            )}
            {/* Modal import CSV */}
            {showImport && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all" onClick={e => { if (e.target === e.currentTarget) { setShowImport(false); resetImportState({ setCsvRows, setCsvProcess, setCsvError, setCsvFileName }); } }}>
                <div className="bg-white border border-blue-200 rounded-3xl shadow-2xl p-12 w-full max-w-7xl max-h-[90vh] overflow-y-auto relative animate-fade-in">
                  <button onClick={() => { setShowImport(false); resetImportState({ setCsvRows, setCsvProcess, setCsvError, setCsvFileName }); }} className="absolute top-3 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold transition-all">×</button>
                  <div className="flex flex-col items-center mb-8">
                    <h3 className="text-3xl font-bold mb-1 text-center text-gray-800">Import người dùng từ CSV</h3>
                  </div>
                  <form className="flex flex-col gap-6 w-full" onSubmit={e => e.preventDefault()}>
                    <div className="flex flex-row gap-3 w-full items-center">
                      <input
                        type="file"
                        accept=".csv"
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border-2 border-blue-100 rounded-lg shadow"
                        onChange={async e => {
                          resetImportState({ setCsvRows, setCsvProcess, setCsvError, setCsvFileName });
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setCsvFileName(file.name);
                          if (!file.name.endsWith('.csv')) {
                            setCsvError('Vui lòng chọn file .csv');
                            return;
                          }
                          try {
                            const rows = await parseCSV(file);
                            const error = validateCSVRows(rows);
                            if (error) {
                              setCsvError(error);
                              return;
                            }
                            setCsvRows(rows);
                            setCsvProcess(rows.map(() => ({ status: 'Chưa xử lý' })));
                          } catch (err: any) {
                            setCsvError('Lỗi đọc file CSV: ' + (err.message || err));
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition text-base"
                        disabled={csvRows.length === 0 || csvLoading}
                        onClick={async () => {
                          setCsvError("");
                          setCsvLoading(true);
                          try {
                            const result = await importUsersFromCSV(csvRows);
                            setCsvProcess(mapImportStatus(result));
                            const url = generateResultCSV(csvRows, result);
                            setCsvResultUrl(url);
                          } catch (err: any) {
                            setCsvError('Import thất bại: ' + (err.message || err));
                          } finally {
                            setCsvLoading(false);
                          }
                        }}
                      >
                        {csvLoading ? 'Đang import...' : 'Import'}
                      </button>
                      <a
                        href="/templates/employee_template.csv"
                        download
                        className="bg-blue-50 text-blue-600 hover:underline font-semibold text-sm px-4 py-2 rounded-lg transition border border-blue-200 shadow whitespace-nowrap flex items-center"
                        style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}
                      >
                        Tải file mẫu CSV
                      </a>
                    </div>
                  </form>
                  {csvError && <div className="text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded p-2 mt-2 shadow">{csvError}</div>}
                  {csvRows.length > 0 && (
                    <div className="w-full mt-6 overflow-x-auto border-2 border-blue-300 rounded-2xl shadow-lg bg-white">
                      <div className="font-semibold mb-2 text-base text-gray-700 p-2">Xem trước dữ liệu ({csvFileName}):</div>
                      <table className="min-w-full text-sm border rounded-xl overflow-hidden shadow">
                        <thead className="bg-blue-100">
                          <tr>
                            {Object.keys(csvRows[0]).map(col => <th key={col} className="px-3 py-2 border text-gray-700 font-semibold">{col}</th>)}
                            <th className="px-3 py-2 border text-gray-700 font-semibold">Process</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvRows.map((row, idx) => (
                            <tr key={idx} className="bg-white hover:bg-blue-50 transition">
                              {Object.keys(csvRows[0]).map(col => <td key={col} className="px-3 py-2 border text-gray-900">{row[col]}</td>)}
                              <td className={`px-3 py-2 border font-semibold text-center ${csvProcess[idx]?.status?.includes('✔') ? 'text-green-600' : csvProcess[idx]?.status?.includes('❌') ? 'text-red-600' : 'text-gray-500'}`}>{csvProcess[idx]?.status || 'Chưa xử lý'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {csvResultUrl && csvProcess.length > 0 && csvProcess.every(p => p.status !== 'Chưa xử lý') && (
                    <div className="w-full flex justify-end mt-4">
                      <a
                        href={csvResultUrl}
                        download={`import_result_${Date.now()}.csv`}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition text-base"
                        onClick={() => setTimeout(() => window.location.reload(), 1000)}
                      >
                        Tải file kết quả
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-blue-600 font-semibold">Đang tải danh sách người dùng...</div>
              ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã NV</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng ban</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.slice((currentPage-1)*USERS_PER_PAGE, currentPage*USERS_PER_PAGE).map((user: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.emp_code}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.full_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 capitalize">{user.position}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.department_id || "N/A"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.status_account === "Đang sử dụng" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {statuses[user.status_account as keyof typeof statuses] || user.status_account}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="font-semibold">Trang {currentPage} / {totalPages}</span>
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
} 