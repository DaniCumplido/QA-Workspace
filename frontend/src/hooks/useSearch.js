import { useState } from "react";

export function useSearch(items, filterFields) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    // Comprueba si el término está en cualquiera de los campos definidos (nombre, email, etc.)
    return filterFields.some((field) =>
      item[field]?.toLowerCase().includes(term),
    );
  });

  return { search, setSearch, filteredItems };
}
