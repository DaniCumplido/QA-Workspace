import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import ResourcePage from "../components/templates/ResourcePage";
import { SlideOver } from "../components/ui/SideOver";
import { 
  AlertTriangle, 
  CheckCircle, 
  PlayCircle, 
  Edit3, 
  Eye, 
  Terminal, 
  ClipboardList
} from "lucide-react";

/**
 * ProjectTests: Repositorio de ejecución y gestión de casos de prueba.
 * Incluye lógica para disparar reportes de bugs automáticamente cuando un test falla.
 */
export default function ProjectTests() {
  const { id: projectId } = useParams();

  const [issueData, setIssueData] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIC HANDLERS ---

  const handleStatusChange = async (test, newStatus, refresh) => {
    setTableRefresh(() => refresh);

    // Si el usuario marca el test como FALLIDO, preparamos el reporte de bug
    if (newStatus === "FAILED") {
      setIssueData({
        testId: test.id,
        title: `Defect: ${test.title}`,
        description: `REPRODUCTION STEPS:\n${test.steps || ""}\n\nEXPECTED RESULT:\n${test.expected || ""}\n\nEXECUTION LOGS:`,
        severity: "MEDIA",
      });
      return;
    }

    try {
      await api.patch(`/projects/${projectId}/tests/${test.id}`, { status: newStatus });
      if (refresh) refresh();
    } catch (error) {
      console.error("Failed to update test status");
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // 1. Creamos la incidencia vinculada al caso de prueba
      await api.post(`/projects/${projectId}/issues`, {
        ...data,
        testCaseId: issueData.testId,
      });

      // 2. Sincronizamos el estado del test a FAILED
      await api.patch(`/projects/${projectId}/tests/${issueData.testId}`, { status: "FAILED" });

      setIssueData(null);
      if (tableRefresh) tableRefresh();
    } catch (error) {
      alert("Error generating the bug report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetail = (test, edit = false, refresh) => {
    setSelectedTest(test);
    setIsEditMode(edit);
    setTableRefresh(() => refresh);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      await api.patch(`/projects/${projectId}/tests/${selectedTest.id}`, data);
      setSelectedTest(null);
      if (tableRefresh) tableRefresh();
    } catch (error) {
      alert("Error updating the test case configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ResourcePage
        title="Testing Repository"
        resourceName="Test Case"
        endpoint={`/projects/${projectId}/tests`}
        tableHeaders={["Test Designation", "Execution Status", "Operations"]}
        searchKeys={["title"]}
        canCreate={true}
        initialFormValues={{ title: "", steps: "", expected: "" }}
        validate={(data) => {
          let err = {};
          if (!data.title || data.title.length < 5) err.title = "Title is too short";
          if (!data.steps) err.steps = "Execution steps are required";
          if (!data.expected) err.expected = "Expected result must be defined";
          return err;
        }}
        renderForm={(formData, handleChange, errors) => (
          <div className="space-y-6 mt-8">
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-center">
              <ClipboardList className="text-indigo-400" size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                Protocol Configuration
              </p>
            </div>

            <div className="space-y-5">
              <FormField label="Test Title" error={errors.title} icon={<PlayCircle size={12} />}>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Password Recovery Validation"
                  className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-medium"
                />
              </FormField>

              <FormField label="Execution Steps" error={errors.steps} icon={<Terminal size={12} />}>
                <textarea
                  name="steps"
                  rows={5}
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="1. Open application..."
                  className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-medium resize-none font-mono"
                />
              </FormField>

              <FormField label="Expected Outcome" error={errors.expected} icon={<CheckCircle size={12} />}>
                <textarea
                  name="expected"
                  rows={3}
                  value={formData.expected}
                  onChange={handleChange}
                  placeholder="System should display a success confirmation..."
                  className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-indigo-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-medium resize-none"
                />
              </FormField>
            </div>
          </div>
        )}
        renderRow={(test, refresh) => (
          <tr key={test.id} className="group border-b border-slate-100 hover:bg-slate-50 transition-all">
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <ClipboardList size={14} />
                 </div>
                 <span className="text-sm font-bold text-slate-800">{test.title}</span>
              </div>
            </td>
            <td className="px-6 py-5">
              <select
                value={test.status}
                onChange={(e) => handleStatusChange(test, e.target.value, refresh)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all cursor-pointer outline-none ${
                  test.status === "PASSED" ? "text-emerald-600 border-emerald-200 bg-emerald-50" :
                  test.status === "FAILED" ? "text-rose-600 border-rose-200 bg-rose-50 font-bold" :
                  test.status === "RETEST" ? "text-amber-600 border-amber-200 bg-amber-50" :
                  "text-indigo-600 border-indigo-200 bg-indigo-50"
                }`}
              >
                <option value="PENDING">PENDING</option>
                <option value="PASSED">PASSED</option>
                <option value="FAILED">FAILED</option>
                <option value="RETEST">RE-TEST</option>
              </select>
            </td>
            <td className="px-6 py-5 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => openDetail(test, false, refresh)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                  <Eye size={16} />
                </button>
                <button onClick={() => openDetail(test, true, refresh)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit Test">
                  <Edit3 size={16} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* SlideOver for Test Details/Editing */}
      <SlideOver
        open={!!selectedTest}
        onClose={() => setSelectedTest(null)}
        onSave={handleUpdate}
        title={isEditMode ? "Modify Test Case" : "Technical Overview"}
        isSubmitting={isSubmitting}
      >
        {selectedTest && (
          <div className="space-y-8 mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Case Designation</label>
              {isEditMode ? (
                <input name="title" defaultValue={selectedTest.title} className="block w-full rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" />
              ) : (
                <p className="text-xl font-bold text-white tracking-tight">{selectedTest.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Protocol Steps</label>
              {isEditMode ? (
                <textarea name="steps" rows={6} defaultValue={selectedTest.steps} className="block w-full rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 resize-none" />
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedTest.steps}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Expected Result</label>
              {isEditMode ? (
                <textarea name="expected" rows={3} defaultValue={selectedTest.expected} className="block w-full rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 resize-none" />
              ) : (
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-sm text-indigo-300 font-medium">
                  {selectedTest.expected}
                </div>
              )}
            </div>

            {!isEditMode && (
              <button type="button" onClick={() => setIsEditMode(true)} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2">
                <Edit3 size={14} /> Update Logic Configuration
              </button>
            )}
          </div>
        )}
      </SlideOver>

      {/* SlideOver for Automatic Bug Reporting */}
      <SlideOver
        open={!!issueData}
        onClose={() => setIssueData(null)}
        onSave={handleCreateIssue}
        title="Incident Report"
        isSubmitting={isSubmitting}
      >
        {issueData && (
          <div className="space-y-6 mt-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <AlertTriangle size={18} className="text-rose-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-rose-500 uppercase">Failure Warning</p>
                <p className="text-[10px] text-rose-200/60 uppercase leading-tight tracking-wider">
                  Generating this report will automatically flag the test as <span className="text-rose-400 font-bold italic">FAILED</span>.
                </p>
              </div>
            </div>

            <FormField label="Incident Title" icon={<AlertTriangle size={12} className="text-rose-500"/>}>
              <input name="title" defaultValue={issueData.title} className="block w-full rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-white focus:outline-none focus:border-rose-500/50" required />
            </FormField>

            <FormField label="Failure Analysis & Logs" icon={<Terminal size={12} className="text-rose-500"/>}>
              <textarea name="description" defaultValue={issueData.description} rows={10} className="block w-full rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-rose-500/50" />
            </FormField>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Criticality</label>
              <select name="severity" defaultValue="MEDIA" className="w-full appearance-none rounded-xl bg-black/40 border border-white/5 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 text-[10px] font-bold uppercase tracking-widest">
                <option value="BAJA">LOW</option>
                <option value="MEDIA">MEDIUM</option>
                <option value="ALTA">HIGH / CRITICAL</option>
              </select>
            </div>
          </div>
        )}
      </SlideOver>
    </>
  );
}

function FormField({ label, error, icon, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
        {icon && <span className="text-indigo-500">{icon}</span>}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[10px] text-rose-500 font-bold uppercase italic ml-1">{error}</p>}
    </div>
  );
}