import ResourcePage from "../components/templates/ResourcePage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import { SlideOver } from "../components/ui/SideOver";

export default function ProjectTests() {
  const { id: projectId } = useParams();

  // --- ESTADOS PARA INCIDENCIAS ---
  const [issueData, setIssueData] = useState(null);
  // Guardamos la referencia de la función de refresco para usarla fuera del renderRow
  const [tableRefresh, setTableRefresh] = useState(null);

  // --- ESTADOS PARA DETALLE / EDICIÓN ---
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (test, newStatus, refresh) => {
    // Guardamos la función refresh para usarla después en handleCreateIssue si es necesario
    setTableRefresh(() => refresh);

    if (newStatus === "FAILED") {
      setIssueData({
        testId: test.id,
        title: `Fallo en: ${test.title}`,
        description: `Pasos realizados:\n${test.steps || ""}\n\nResultado esperado:\n${test.expected || ""}`,
        severity: "MEDIA",
      });
      return;
    }

    try {
      await api.patch(`/projects/${projectId}/tests/${test.id}`, {
        status: newStatus,
      });
      if (refresh) refresh();
    } catch (error) {
      alert("Error al actualizar el estado");
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      await api.post(`/projects/${projectId}/issues`, {
        ...data,
        testCaseId: issueData.testId,
      });

      await api.patch(`/projects/${projectId}/tests/${issueData.testId}`, {
        status: "FAILED",
      });

      setIssueData(null);
      if (tableRefresh) tableRefresh(); // Refrescamos la tabla
    } catch (error) {
      alert("Error al generar la incidencia.");
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
      alert("Error al actualizar la prueba");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ResourcePage
        title="Pruebas"
        resourceName="Prueba"
        endpoint={`/projects/${projectId}/tests`}
        tableHeaders={["Nombre", "Estado", "Acciones"]}
        searchKeys={["title"]}
        initialFormValues={{ title: "", steps: "", expected: "" }}
        validate={(data) => {
          let err = {};
          if (data.title.length < 3) err.title = "Nombre demasiado corto";
          if (!data.steps) err.steps = "Pasos obligatorio";
          if (!data.expected) err.expected = "Resultado esperado obligatorio";
          return err;
        }}
        renderRow={(test, refresh) => (
          <tr
            key={test.id}
            className="transition-colors border-t border-white/5 hover:bg-white/5"
          >
            <td className="px-6 py-4 font-medium text-slate-200">{test.title}</td>
            <td className="px-6 py-4">
              <select
                value={test.status}
                onChange={(e) => handleStatusChange(test, e.target.value, refresh)}
                className={`px-2 py-1 text-xs font-semibold rounded-full border bg-transparent cursor-pointer focus:outline-none ${
                  test.status === "PASSED"
                    ? "text-green-400 border-green-400/20 bg-green-400/10"
                    : test.status === "FAILED"
                      ? "text-red-400 border-red-400/20 bg-red-400/10"
                      : test.status === "RETEST"
                        ? "text-orange-400 border-orange-400/20 bg-orange-400/10"
                        : "text-blue-400 border-blue-400/20 bg-blue-400/10"
                }`}
              >
                {test.status === "RETEST" && (
                  <option value="RETEST" disabled className="bg-slate-900 text-slate-500">
                    RETEST (Automático)
                  </option>
                )}
                <option value="PENDING" className="bg-slate-900">PENDING</option>
                <option value="PASSED" className="bg-slate-900">PASSED</option>
                <option value="FAILED" className="bg-slate-900">FAILED</option>
              </select>
            </td>
            <td className="px-6 py-4 text-right space-x-3.5">
              <button
                onClick={() => openDetail(test, false, refresh)}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Detalle
              </button>
              <button
                onClick={() => openDetail(test, true, refresh)}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Editar
              </button>
            </td>
          </tr>
        )}
      />

      {/* SlideOvers de Detalle/Edición e Incidencias se mantienen igual pero usando tableRefresh */}
      <SlideOver
        open={!!selectedTest}
        onClose={() => setSelectedTest(null)}
        onSave={handleUpdate}
        title={isEditMode ? "Editar Prueba" : "Detalle de la Prueba"}
        isSubmitting={isSubmitting}
      >
        {selectedTest && (
          <div className="space-y-6">
            {/* ... Campos de edición/detalle (sin cambios) ... */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase">Título</label>
              {isEditMode ? (
                <input name="title" defaultValue={selectedTest.title} className="w-full p-2 mt-1 text-white rounded bg-white/5 border-white/10" />
              ) : (
                <p className="mt-1 text-lg text-white">{selectedTest.title}</p>
              )}
            </div>
            {/* ... resto de campos (steps, expected) ... */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase">Pasos</label>
              {isEditMode ? (
                <textarea name="steps" rows={5} defaultValue={selectedTest.steps} className="w-full p-2 mt-1 text-white rounded bg-white/5 border-white/10" />
              ) : (
                <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{selectedTest.steps}</p>
              )}
            </div>
             <div>
              <label className="block text-xs font-medium text-gray-400 uppercase">Resultado Esperado</label>
              {isEditMode ? (
                <textarea name="expected" rows={3} defaultValue={selectedTest.expected} className="w-full p-2 mt-1 text-white rounded bg-white/5 border-white/10" />
              ) : (
                <p className="mt-1 text-sm text-gray-300">{selectedTest.expected}</p>
              )}
            </div>
            {!isEditMode && (
              <button type="button" onClick={() => setIsEditMode(true)} className="w-full py-2 text-sm font-semibold text-indigo-400 border border-indigo-400/20 rounded-md hover:bg-indigo-400/10">
                Cambiar a modo edición
              </button>
            )}
          </div>
        )}
      </SlideOver>

      <SlideOver
        open={!!issueData}
        onClose={() => setIssueData(null)}
        onSave={handleCreateIssue}
        title="Reportar Incidencia"
        isSubmitting={isSubmitting}
      >
        {issueData && (
          <div className="space-y-4">
             <p className="text-xs text-amber-400 bg-amber-400/10 p-2 rounded">
              La prueba se marcará como FAILED solo si la incidencia se registra con éxito.
            </p>
            {/* ... Campos de incidencia (sin cambios) ... */}
            <div>
               <label className="text-white text-sm">Título de Incidencia</label>
               <input name="title" defaultValue={issueData.title} className="w-full p-2 bg-white/5 border border-white/10 text-white rounded focus:outline-indigo-500" required />
            </div>
            <div>
               <label className="text-white text-sm">Descripción / Evidencia</label>
               <textarea name="description" defaultValue={issueData.description} rows={5} className="w-full p-2 bg-white/5 border border-white/10 text-white rounded focus:outline-indigo-500" />
            </div>
            <div>
               <label className="text-white text-sm">Severidad</label>
               <select name="severity" defaultValue="MEDIA" className="w-full p-2 bg-gray-800 text-white border border-white/10 rounded focus:outline-none">
                 <option value="BAJA">BAJA</option>
                 <option value="MEDIA">MEDIA</option>
                 <option value="ALTA">ALTA</option>
               </select>
            </div>
          </div>
        )}
      </SlideOver>
    </>
  );
}