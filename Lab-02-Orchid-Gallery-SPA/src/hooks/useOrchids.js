import { useCallback, useEffect, useState } from "react";
import orchidService from "../api/orchidService";

function useOrchids() {
    const [orchids, setOrchids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadOrchids = useCallback(async (force = false) => {
        try {
            setLoading(true);
            setError(null);

            const data = await orchidService.getOrchids({ force });

            setOrchids(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrchids(false);
    }, [loadOrchids]);

    const reload = useCallback(() => {
        loadOrchids(true);
    }, [loadOrchids]);

    return {
        orchids,
        loading,
        error,
        reload,
    };
}

export default useOrchids;