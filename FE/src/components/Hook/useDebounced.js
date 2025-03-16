import { useState, useEffect } from "react";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handle = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handle); // Cleanup timeout nếu value thay đổi trước khi hết delay
    }, [value]); 

    return debouncedValue;
}

export { useDebounce };
