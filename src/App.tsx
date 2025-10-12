import { useState } from "react";
import { getCollection } from "./APICalls";
import { type LpType } from "./LP";
import { useLocalStorage } from "./localStorage";
import { Carousel } from "./Carousel";

const STORAGE_KEYS = {
  LPS: "lps",
  value: "value",
};

export const App = () => {
  const [collection, setCollection] = useLocalStorage<LpType[]>(
    STORAGE_KEYS.LPS,
    []
  );
  const [collectionValue, setCollectionValue] = useLocalStorage<string>(
    STORAGE_KEYS.value,
    "0"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { lps, collectionValue } = await getCollection();
      if (lps) {
        setCollection(lps);
        setCollectionValue(collectionValue);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not get collection"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Min LP-samling</h1>
        <p>Total verdi (median): {collectionValue}</p>
      </div>
      <Carousel lps={collection}></Carousel>
      <div className="footer">
        {!isLoading && !error && (
          <button onClick={fetchCollection} className="btn btn-dark">
            Refresh collection
          </button>
        )}
        {isLoading ? "Laster..." : ""}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};
