import { useState, useEffect } from "react";
import axios from "axios";

export default function useGetData<T>(url: string) {
    const [loading, setIsLoading] = useState(true);
    const [error, setIsError] = useState(false);
    const [fetchedData, setFetchedData] = useState<T>();

    async function refetch() {
        setIsLoading(true);

        try {
            const { data } = await axios.get(url);
            setFetchedData(data);
        } catch (error) {
            setIsError(true);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        async function getData() {
            setIsLoading(true);
            try {
                const { data } = await axios.get(url);
                setFetchedData(data);
            } catch (error) {
                setIsError(true);
            }
            setIsLoading(false);
        }

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    return {
        loading,
        error,
        data: fetchedData,
        refetch,
    };
}