import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";

interface BackendUser {
    email: string;
    clerk_id: string;
    preferences: Record<string, any>;
    created_at?: string;
}

export function useBackendUser() {
    const { getToken, isLoaded: authLoaded } = useAuth();
    const { user: clerkUser } = useUser();
    const [userData, setUserData] = useState<BackendUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        if (!authLoaded || !clerkUser) return;

        try {
            setLoading(true);
            setError(null);
            const token = await getToken();

            if (!token) {
                throw new Error("No authentication token available");
            }

            const response = await fetch("http://localhost:8000/api/users/me/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }

            const data = await response.json();
            setUserData(data);
        } catch (err: any) {
            console.error("Error fetching backend user:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authLoaded, clerkUser, getToken]);

    // Initial fetch when auth is ready
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return {
        userData,
        loading,
        error,
        refetch: fetchUser
    };
}
