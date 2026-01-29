import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBackendUser } from "@/hooks/useBackendUser";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Profile() {
    const { user } = useUser();
    // Use our new custom hook!
    const { userData, loading, error, refetch } = useBackendUser();

    if (!user) return <div className="p-10 text-center">Please log in to view profile.</div>;

    return (
        <div className="container mx-auto p-8 space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                User Profile
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Clerk Data */}
                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Clerk Frontend Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img src={user.imageUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-primary/50" />
                            <div>
                                <p className="font-semibold text-lg">{user.fullName}</p>
                                <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono bg-black/20 p-2 rounded">
                            User ID: {user.id}
                        </p>
                    </CardContent>
                </Card>

                {/* Backend Synced Data */}
                <Card className="glass border-primary/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Backend Synced Data</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={refetch}
                            disabled={loading}
                            className={loading ? "animate-spin" : ""}
                        >
                            <RefreshCw size={16} />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {error ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
                                <p className="font-bold">Sync Error:</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : userData ? (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Email (MongoDB)</label>
                                    <div className="p-2 bg-secondary/50 rounded font-mono text-sm text-primary">
                                        {userData.email}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Clerk ID (MongoDB)</label>
                                    <div className="p-2 bg-secondary/50 rounded font-mono text-xs text-muted-foreground">
                                        {userData.clerk_id}
                                    </div>
                                </div>

                                <div className="mt-4 p-2 bg-green-500/10 border border-green-500/20 rounded flex items-center gap-2 text-green-500 text-sm font-medium">
                                    <span>✅</span> Securely fetched from Django
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                {loading ? "Syncing with database..." : "No data found."}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
