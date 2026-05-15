"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AlertCircle, Trash2, Plus, X, CheckCircle2, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import type { LabResult, ScreeningCatalog } from "@/lib/supabase/database.types";
import { LAB_RESULT_TYPE_OPTIONS } from "@/lib/validations";
import { useScreeningCatalog, useCreateCatalogItem, DEFAULT_SCREENING_CATALOG } from "@/hooks/use-screening-catalog";
import { useLabResults, useCreateLabResult, useUpdateLabResult, useDeleteLabResult } from "@/hooks/use-lab-results";

const LAB_RESULT_TYPE_NAMES: Record<string, string> = {
  hba1c: 'HbA1c',
  glucose: 'Đường huyết',
  blood_pressure: 'Huyết áp',
  eye_exam: 'Soi đáy mắt',
  kidney: 'Protein niệu',
  cholesterol: 'Cholesterol',
  creatinine: 'Creatinine',
  other: 'Khác',
};

// Mapping from type code to catalog content for target lookup
const TYPE_TO_CONTENT: Record<string, string> = {
  hba1c: 'HbA1c',
  glucose: 'Đường huyết lúc đói',
  blood_pressure: 'Huyết áp',
  eye_exam: 'Soi đáy mắt',
  kidney: 'Protein niệu (Thận)',
};

const getItemTitle = (type: string): string => {
  const found = LAB_RESULT_TYPE_NAMES[type];
  if (found) return found;
  // Try to find from default items
  const item = DEFAULT_SCREENING_CATALOG.find(d => d.content.toLowerCase().replace(/\s+/g, '_') === type);
  return item?.content || type;
};

export function ScreeningList() {
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newFrequency, setNewFrequency] = useState("");
  const [newMeaning, setNewMeaning] = useState("");

  // React Query hooks for data fetching
  const { data: labResultsData, isLoading: labLoading } = useLabResults({ limit: 100 });
  const { data: catalogData, isLoading: catLoading } = useScreeningCatalog();
  const createCatalogItem = useCreateCatalogItem();

  const labResults = labResultsData?.results || [];
  const catalog = catalogData?.catalog || [];
  const isDefaultCatalog = catalogData?.isDefault ?? true;
  const loading = labLoading || catLoading;

  // Get items for display
  const getItems = () => {
    if (catalog.length > 0) {
      return catalog.map(item => ({
        title: item.content,
        type: item.content.toLowerCase().replace(/\s+/g, '_'),
        target: item.target || '',
        frequency: item.frequency || '',
        meaning: item.meaning || '',
      }));
    }
    return DEFAULT_SCREENING_CATALOG.map(item => ({
      title: item.content,
      type: item.content.toLowerCase().replace(/\s+/g, '_'),
      target: item.target || '',
      frequency: item.frequency || '',
      meaning: item.meaning || '',
    }));
  };

  const handleAddCatalogItem = async () => {
    if (!newContent.trim()) return;
    const contentToSave = newContent.startsWith("custom_new:")
      ? newContent.replace("custom_new:", "")
      : newContent;

    try {
      await createCatalogItem.mutateAsync({
        content: contentToSave.trim(),
        target: newTarget.trim() || undefined,
        frequency: newFrequency.trim() || undefined,
        meaning: newMeaning.trim() || undefined,
      });
      setIsAddingRow(false);
      setNewContent("");
      setNewTarget("");
      setNewFrequency("");
      setNewMeaning("");
    } catch (err) {
      console.error("Failed to add:", err);
    }
  };

  const isCompleted = (log: LabResult) => {
    try {
      const notesObj = log.notes ? JSON.parse(log.notes) : {};
      return !!notesObj.completed;
    } catch {
      return false;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getReminderDate = (title: string) => {
    const type = title.toLowerCase().replace(/\s+/g, '_');
    const uncompletedLogs = labResults.filter(log => log.type === type && !isCompleted(log));
    if (uncompletedLogs.length === 0) return null;
    const sorted = [...uncompletedLogs].sort((a, b) =>
      (b.recorded_at || "").localeCompare(a.recorded_at || "")
    );
    return sorted[0]?.recorded_at || null;
  };

  const items = getItems();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-8 rounded-[32px] bg-natural-beige border border-natural-border flex gap-6 items-center">
        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <AlertCircle className="w-6 h-6 text-natural-accent" />
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-base font-black text-natural-primary-dark uppercase tracking-tight">Lưu ý quan trọng</p>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Mục tiêu điều trị có thể thay đổi tùy theo độ tuổi và tình trạng sức khỏe cụ thể của bạn. Luôn tham khảo ý kiến bác sĩ chuyên khoa.
          </p>
        </div>
        <button
          onClick={() => setIsAddingRow(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-natural-border text-xs font-bold text-natural-primary hover:bg-natural-light/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Thêm mục
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-none rounded-[32px] border border-natural-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-natural-light/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-natural-border">
              <th className="py-6 pl-8">Nội dung tầm soát</th>
              <th className="py-6 px-4">Ngưỡng mục tiêu</th>
              <th className="py-6 px-4 text-center">Định kỳ</th>
              <th className="py-6 px-4">Nhắc hẹn</th>
              <th className="py-6 pr-8">Ý nghĩa lâm sàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-natural-border/50">
            {isAddingRow && (
              <tr className="bg-natural-light/20">
                <td className="py-4 pl-8">
                  <div className="space-y-2">
                    <select
                      value={newContent.includes("custom_") ? "custom" : newContent}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setNewContent("custom_new:");
                        } else {
                          setNewContent(e.target.value);
                        }
                      }}
                      className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary uppercase"
                    >
                      <option value="">-- Chọn nội dung --</option>
                      <option value="custom">Khác (nhập mới)...</option>
                      {catalog.map((item) => (
                        <option key={item.id} value={item.content}>{item.content}</option>
                      ))}
                      {!isDefaultCatalog && DEFAULT_SCREENING_CATALOG.map((item) => (
                        <option key={item.content} value={item.content}>{item.content}</option>
                      ))}
                    </select>
                    {newContent.startsWith("custom_new:") && (
                      <input
                        type="text"
                        value={newContent.replace("custom_new:", "")}
                        onChange={(e) => setNewContent("custom_new:" + e.target.value)}
                        placeholder="Nhập nội dung mới..."
                        className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary uppercase"
                      />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="< 7.0%"
                    className="w-full text-xs font-medium p-2 rounded-lg bg-white border border-natural-border"
                  />
                </td>
                <td className="py-4 px-4 text-center">
                  <input
                    type="text"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    placeholder="Mỗi 3 tháng"
                    className="w-full text-xs font-medium p-2 rounded-lg bg-white border border-natural-border text-center"
                  />
                </td>
                <td className="py-4 px-4">
                  <span className="text-[10px] font-bold text-slate-400 italic">Chưa có lịch</span>
                </td>
                <td className="py-4 px-4">
                  <input
                    type="text"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    placeholder="Ý nghĩa..."
                    className="w-full text-xs font-medium p-2 rounded-lg bg-white border border-natural-border"
                  />
                </td>
                <td className="py-4 pr-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddCatalogItem}
                      disabled={createCatalogItem.isPending || !newContent.trim() || (newContent.startsWith("custom_new:") && newContent.replace("custom_new:", "").trim() === "")}
                      className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
                      title="Lưu"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingRow(false);
                        setNewContent("");
                        setNewTarget("");
                        setNewFrequency("");
                        setNewMeaning("");
                      }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                      title="Hủy"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {items.map((item, i) => {
              const reminderDate = getReminderDate(item.type);
              return (
                <tr key={i} className="group hover:bg-natural-light/10 transition-colors">
                  <td className="py-6 pl-8">
                    <span className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">{item.title}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold">
                      {item.target}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-xs font-bold text-slate-500 font-mono">{item.frequency}</span>
                  </td>
                  <td className="py-6 px-4">
                    {reminderDate ? (
                      <span className="text-[10px] font-bold text-natural-primary uppercase tracking-widest">
                        {formatDate(reminderDate)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase italic">Chưa có lịch</span>
                    )}
                  </td>
                  <td className="py-6 pr-8">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm">
                      {item.meaning}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-[28px] border border-natural-border bg-white space-y-3">
          <h4 className="text-xs font-black text-natural-primary uppercase tracking-widest">Tiểu đường Type 1</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Cần theo dõi sát sao hơn, đo đường huyết ít nhất 4-7 lần/ngày và xét nghiệm HbA1c định kỳ mỗi 3 tháng.</p>
        </div>
        <div className="p-6 rounded-[28px] border border-natural-border bg-white space-y-3">
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Biến chứng thần kinh</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Nếu có dấu hiệu tê bì, châm chích bàn chân, cần thực hiện khám bàn chân ngay lập tức.</p>
        </div>
      </div>

          </div>
  );
}

export function ScreeningLog() {
  const [logs, setLogs] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<LabResult & { customContent: string; location: string }>>({});
  const [editLevel, setEditLevel] = useState<string>(""); // Separate state for optional assessment level
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { data: catalogData } = useScreeningCatalog();
  const catalog = catalogData?.catalog || [];

  // Get default target from catalog based on selected type
  const getDefaultTarget = (type: string | undefined): string => {
    if (!type || type === "custom") return "";
    // Find matching catalog item by content name
    const contentKey = TYPE_TO_CONTENT[type] || LAB_RESULT_TYPE_NAMES[type] || type;
    const item = catalog.find(c => c.content.toLowerCase().includes(contentKey.toLowerCase()));
    if (item) return item.target || "";
    return "";
  };

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/lab-results?limit=50");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setLogs(json.data?.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  // Refetch logs when catalog changes (after adding new catalog item)
  useEffect(() => {
    if (!loading && catalogData) {
      const refetchLogs = async () => {
        try {
          const res = await fetch("/api/lab-results?limit=50");
          if (!res.ok) return;
          const json = await res.json();
          setLogs(json.data?.results || []);
        } catch (err) {
          console.error(err);
        }
      };
      refetchLogs();
    }
  }, [catalogData, loading]);

  const handleAddRow = () => {
    // Guard: if already editing, don't create new row
    if (editingId !== null) return;
    const newId = `temp-${Date.now()}`;
    const newRow: LabResult = {
      id: newId,
      user_id: "",
      type: "hba1c",
      value: 0,
      unit: "",
      recorded_at: new Date().toISOString().split("T")[0],
      notes: null,
      created_at: "",
      updated_at: "",
    };
    setLogs([newRow, ...logs]);
    setEditingId(newId);
    setEditData({ ...newRow, customContent: "", location: "" });
    setEditLevel(""); // Initialize empty for optional assessment
  };

  const handleEdit = (log: LabResult) => {
    if (isCompleted(log)) return;
    setEditingId(log.id);
    let notesObj: Record<string, string> = {};
    try {
      if (log.notes) {
        notesObj = JSON.parse(log.notes);
      }
    } catch {
      notesObj = {};
    }
    setEditData({
      ...log,
      customContent: notesObj.customContent || "",
      location: notesObj.location || "",
    });
    setEditLevel(""); // Initialize empty for optional assessment
  };

  const handleSave = async () => {
    const rawType = editData.type as string | undefined;
    const typeValue = rawType === "custom" ? "other" : rawType;

    // Validate required fields: Nội dung tầm soát and Ngày
    if (!typeValue) {
      setError("Vui lòng chọn Nội dung tầm soát");
      return;
    }

    if (!editData.recorded_at) {
      setError("Vui lòng nhập Ngày");
      return;
    }

    // Check for duplicate: same type + same date (for new entries)
    if (editData.id?.startsWith("temp-")) {
      const dateOnly = editData.recorded_at.split("T")[0];
      const isDuplicate = logs.some(log => {
        if (log.type === typeValue && log.recorded_at) {
          const logDate = log.recorded_at.split("T")[0];
          return logDate === dateOnly;
        }
        return false;
      });
      if (isDuplicate) {
        setError("Đã có dữ liệu tầm soát này trong ngày. Vui lòng chọn ngày khác.");
        return;
      }
    }

    // Preserve existing completed status
    let existingNotes: Record<string, string> = {};
    try {
      if (editData.notes) {
        existingNotes = JSON.parse(editData.notes);
      }
    } catch {
      existingNotes = {};
    }
    const notesObj: Record<string, string> = {};
    if (existingNotes.completed) notesObj.completed = existingNotes.completed;
    if (rawType === "custom" && editData.customContent) notesObj.customContent = editData.customContent;
    // Use notes field for location storage
    if (editData.notes && editData.notes.trim()) notesObj.location = editData.notes.trim();
    const notes = Object.keys(notesObj).length > 0 ? JSON.stringify(notesObj) : null;

    if (editData.id?.startsWith("temp-")) {
      setSaving(true);
      setError("");
      try {
        const res = await fetch("/api/lab-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: typeValue,
            value: parseFloat(String(editData.value)) || 0,
            unit: editData.unit || undefined,
            recordedAt: editData.recorded_at,
            notes: notes,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          const newLog = json.data;
          // Preserve display name for custom types
          if (rawType === "custom" && editData.customContent) {
            newLog.displayName = editData.customContent;
          }
          setLogs(logs.map(l => l.id === editData.id ? newLog : l));
        } else {
          const json = await res.json();
          setError(json.error?.message || "Lưu thất bại");
        }
      } catch (err) {
        setError("Lưu thất bại: " + String(err));
      } finally {
        setSaving(false);
        setEditingId(null);
        setEditData({});
        setEditLevel("");
      }
    } else {
      setSaving(true);
      setError("");
      try {
        const res = await fetch(`/api/lab-results/${editData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: editData.type,
            value: parseFloat(String(editData.value)) || 0,
            unit: editData.unit || undefined,
            recordedAt: editData.recorded_at,
            notes: editData.notes || undefined,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          setLogs(logs.map(l => l.id === editData.id ? json.data : l));
        } else {
          const json = await res.json();
          setError(json.error?.message || "Lưu thất bại");
        }
      } catch (err) {
        setError("Lưu thất bại: " + String(err));
      } finally {
        setSaving(false);
        setEditingId(null);
        setEditData({});
        setEditLevel("");
      }
    }
  };

  const handleCancel = (log: LabResult) => {
    if (log.id.startsWith("temp-")) {
      setLogs(logs.filter(l => l.id !== log.id));
    }
    setEditingId(null);
    setEditData({});
    setEditLevel("");
  };

  const handleDelete = async (id: string) => {
    const log = logs.find(l => l.id === id);
    if (log && isCompleted(log)) return;
    if (id.startsWith("temp-")) {
      setLogs(logs.filter(l => l.id !== id));
      return;
    }
    try {
      const res = await fetch(`/api/lab-results/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLogs(logs.filter(log => log.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLevel = (value: number, type: string | null) => {
    if (type === 'hba1c') {
      if (value < 7.0) return { label: 'Tốt', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      if (value < 8.0) return { label: 'Bình thường', className: 'bg-amber-50 text-amber-600 border-amber-100' };
      return { label: 'Cao', className: 'bg-rose-50 text-rose-600 border-rose-100' };
    }
    if (value <= 7.0) return { label: 'Tốt', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    if (value <= 10.0) return { label: 'Bình thường', className: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'Cao', className: 'bg-rose-50 text-rose-600 border-rose-100' };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getTypeName = (type: string | null, log?: LabResult) => {
    if (type === "custom" && log) {
      try {
        const notesObj = log.notes ? JSON.parse(log.notes) : {};
        return notesObj.customContent || "Khác";
      } catch {
        return "Khác";
      }
    }
    return type ? LAB_RESULT_TYPE_NAMES[type] || type : 'Khác';
  };

  const getLocation = (log: LabResult) => {
    try {
      const notesObj = log.notes ? JSON.parse(log.notes) : {};
      return notesObj.location || "";
    } catch {
      return "";
    }
  };

  const isCompleted = (log: LabResult) => {
    try {
      const notesObj = log.notes ? JSON.parse(log.notes) : {};
      return !!notesObj.completed;
    } catch {
      return false;
    }
  };

  const toggleCompleted = useCallback(async (log: LabResult) => {
    const completed = !isCompleted(log);
    try {
      let notesObj: Record<string, unknown> = {};
      try {
        if (log.notes) {
          notesObj = JSON.parse(log.notes);
        }
      } catch {
        notesObj = {};
      }
      notesObj.completed = completed;
      const newNotes = JSON.stringify(notesObj);

      const res = await fetch(`/api/lab-results/${log.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: newNotes }),
      });
      if (res.ok) {
        setLogs(prev => prev.map(l => l.id === log.id ? { ...l, notes: newNotes } : l));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Sort logs by recorded_at descending
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) =>
      (b.recorded_at || "").localeCompare(a.recorded_at || "")
    );
  }, [logs]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký tầm soát chi tiết</h3>
        {editingId === null && (
          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest hover:bg-natural-primary/90 transition-all shadow-lg shadow-natural-primary/20"
          >
            <Plus className="h-4 w-4" />
            Nhập lịch tầm soát
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <p className="text-sm font-bold text-rose-600">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-none rounded-[32px] border border-natural-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-natural-light/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-natural-border">
              <th className="py-6 pl-4">Trạng thái</th>
              <th className="py-6 pl-8">Nội dung tầm soát</th>
              <th className="py-6 px-4">Chỉ số</th>
              <th className="py-6 px-4">Ngưỡng mục tiêu</th>
              <th className="py-6 px-4">Kết quả</th>
              <th className="py-6 px-4">Đánh giá</th>
              <th className="py-6 px-4">Nơi tầm soát</th>
              <th className="py-6 pr-8 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-natural-border/50">
            {sortedLogs.map((log) => {
              const level = getLevel(log.value, log.type);
              const isEditing = editingId === log.id;
              const completed = isCompleted(log);

              return (
                <tr key={log.id} onClick={(e) => e.stopPropagation()} className={clsx(
                  "group transition-colors",
                  isEditing ? "bg-natural-light/20" : "hover:bg-natural-light/10"
                )}>
                  {isEditing ? (
                    <>
                      <td className="py-4 pl-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleCompleted(log); }}
                            className="p-2 rounded-lg bg-emerald-100 text-emerald-500 hover:bg-emerald-200 transition-all"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 pl-8">
                        <div className="space-y-2">
                          <select
                            value={editData.type || "hba1c"}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "custom") {
                                setEditData({ ...editData, type: "custom" as any, customContent: "" });
                              } else {
                                const defaultTarget = getDefaultTarget(val);
                                setEditData(prev => ({ ...prev, type: val as any, unit: defaultTarget }));
                              }
                            }}
                            className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary uppercase"
                          >
                            {LAB_RESULT_TYPE_OPTIONS.map(t => (
                              <option key={t} value={t}>{LAB_RESULT_TYPE_NAMES[t]}</option>
                            ))}
                            <option value="custom">Khác...</option>
                          </select>
                          {(editData.type as string) === "custom" && (
                            <input
                              type="text"
                              value={editData.customContent || ""}
                              onChange={(e) => setEditData({ ...editData, customContent: e.target.value })}
                              placeholder="Nhập nội dung..."
                              className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary uppercase"
                            />
                          )}
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={editData.recorded_at?.split("T")[0] || ""}
                              onChange={(e) => setEditData({ ...editData, recorded_at: e.target.value })}
                              className="w-full text-[10px] font-bold p-1 rounded-md bg-white border border-natural-border"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="number"
                          step="0.1"
                          value={editData.value || ""}
                          onChange={(e) => setEditData({ ...editData, value: parseFloat(e.target.value) })}
                          placeholder="Chỉ số"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="text"
                          value={editData.unit || ""}
                          onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                          placeholder="Đơn vị"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="text"
                          value={editData.value ? `${editData.value} ${editData.unit || ""}` : ""}
                          placeholder="Kết quả"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <select
                          value={editLevel}
                          onChange={(e) => setEditLevel(e.target.value)}
                          className="w-full text-[10px] font-black p-2 rounded-lg bg-white border border-natural-border uppercase"
                        >
                          <option value="">-- Chọn --</option>
                          <option>An toàn</option>
                          <option>Tốt</option>
                          <option>Bình thường</option>
                          <option>Cao</option>
                        </select>
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="text"
                          value={editData.notes || ""}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          placeholder="Nơi tầm soát"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSave(); }}
                            disabled={saving}
                            className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm disabled:opacity-50"
                            title="Lưu"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCancel(log); }}
                            className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all shadow-sm"
                            title="Hủy"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-6 pl-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCompleted(log); }}
                          className={clsx(
                            "p-2 rounded-xl border transition-all",
                            completed
                              ? "bg-emerald-100 text-emerald-500 border-emerald-200"
                              : "bg-slate-50 text-slate-300 border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-6 pl-8">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">{getTypeName(log.type, log)}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400">{formatDate(log.recorded_at)}</span>
                            {getLocation(log) && (
                              <span className="text-[10px] font-medium text-natural-primary/70">{getLocation(log)}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-sm font-black text-natural-primary-dark">{log.value}</span>
                        <span className="text-[10px] text-slate-400 ml-1">{log.unit}</span>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-xs font-bold text-slate-400 font-mono tracking-tight">
                          {getDefaultTarget(log.type || undefined)}
                        </span>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-xs font-bold text-natural-primary-dark">{log.value} {log.unit}</p>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${level.className}`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[150px] line-clamp-2">
                          {getLocation(log) || '-'}
                        </p>
                      </td>
                      <td className="py-6 pr-8 text-right">
                        {!completed && (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(log); }}
                              className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all shadow-sm"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                              className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}