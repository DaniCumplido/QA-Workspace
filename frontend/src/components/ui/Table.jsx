export function Table ({headers, children}) {
    return (
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {children}
                </tbody>
            </table>
        </div>
    )
}