import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ApiResponse, TVLData } from '@shared/types';
export function HomePage() {
  const [tvlData, setTvlData] = useState<TVLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tvl');
      const result: ApiResponse<TVLData> = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch data.');
      }
      setTvlData(result.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  const renderContent = () => {
    if (loading) {
      return (
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/3" />
          </CardFooter>
        </Card>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" size="sm" onClick={fetchData} className="pl-1">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    if (tvlData) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="w-full transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-muted-foreground">
                Paradex Vault TVL
              </CardTitle>
              <CardDescription>
                Total Value Locked across all vaults.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {formatCurrency(tvlData.tvl)}
              </p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground flex justify-between items-center">
              <span>
                Last updated: {formatDistanceToNow(new Date(tvlData.lastUpdated), { addSuffix: true })}
              </span>
              <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    }
    return null;
  };
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.05),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.1),transparent)]"></div>
      </div>
      <ThemeToggle className="absolute top-6 right-6" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
          <div className="text-center space-y-6 mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">
              VaultTrack
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A minimalist, modern web application to display the real-time Total Value Locked (TVL) of a Paradex vault.
            </p>
          </div>
          <div className="w-full flex justify-center">
            {renderContent()}
          </div>
        </div>
      </main>
      <footer className="absolute bottom-0 w-full py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Built with ❤️ at Cloudflare
        </div>
      </footer>
    </div>
  );
}