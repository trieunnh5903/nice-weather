import { weatherApi } from "@/api/weatherApi";
import { Place } from "@/types/type";
import { useEffect, useState } from "react";

export function useSearchLocation(query: string) {
  const [results, setResults] = useState<Place[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (query.length === 0) {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500);

    const handleSearch = async () => {
      setLoading(true);
      try {
        const data = await weatherApi.directGeocoding(query);
        setResults(data);
        setError("");
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Error");
      } finally {
        setLoading(false);
      }
    };

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return { results, isLoading: loading, error };
}
