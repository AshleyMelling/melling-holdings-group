import { useEffect, useState } from "react";

export function useKrakenData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchKrakenData = async () => {
      try {
        const response = await fetch("/api/kraken/balance");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Error fetching Kraken data");
      } finally {
        setLoading(false);
      }
    };

    fetchKrakenData();
  }, []);

  return { data, loading, error };
}
