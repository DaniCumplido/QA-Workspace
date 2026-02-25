import { useState } from "react";

export const useForm = (initialState, validate) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Maneja el cambio de cualquier input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Limpiamos el error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Resetea el formulario
    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        loading,
        setLoading,
        handleChange,
        resetForm,
    };
};