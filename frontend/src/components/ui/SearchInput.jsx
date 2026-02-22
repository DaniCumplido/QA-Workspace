// Buscador
export function SearchInput({ value, onChange, placeholder = "Buscar..." }) {
    return (
        <div className="flex items-center px-3 py-2 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-500">
            <span className="mr-2 text-gray-400">🔍</span>
            <input 
                type="text"
                value={value}
                onChange={onChange} // Avisa al padre cada vez que hay un cambio
                placeholder={placeholder}
                className="w-full text-sm bg-transparent outline-none"
            />
        </div>
    );
}