import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
    const { user } = useUser();

    if (!user) return <div className="p-10 text-center">Please log in to view profile.</div>;

    return (
        <div className="container mx-auto p-8 space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                User Profile
            </h1>

            <div className="w-full">
                <Card className="glass w-full">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-primary/20"
                            />
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                                <p className="text-muted-foreground text-lg">{user.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 dark:border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5 space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</label>
                                    <p className="font-mono text-sm break-all">{user.id}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5 space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Sign In</label>
                                    <p className="font-mono text-sm">
                                        {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
