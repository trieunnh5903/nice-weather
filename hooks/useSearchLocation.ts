import { Location } from "@/type";
import axios from "axios";
import { useEffect, useState } from "react";

export function useSearchLocation(query: string) {
  const [results, setResults] = useState<Location[]>();

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
      try {
        const response = await axios.get<Location[]>(
          `/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`
        );
        const data = response.data;
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
      }
    };

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return { results };
}
