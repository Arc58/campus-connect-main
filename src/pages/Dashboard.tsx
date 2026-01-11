import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/ListingCard';
import { ArrowRight, PlusCircle, Search } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type ListingWithRelations = Tables<'listings'> & {
  categories: Tables<'categories'> | null;
  profiles: Tables<'profiles'> | null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentListings, setRecentListings] = useState<ListingWithRelations[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentListings();
    if (user) fetchFavorites();
  }, [user]);

  const fetchRecentListings = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*, categories(*), profiles(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      toast({ title: 'Error fetching listings', description: error.message, variant: 'destructive' });
    } else {
      setRecentListings(data || []);
    }
    setLoading(false);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user.id);
    setFavorites(data?.map(f => f.listing_id) || []);
  };

  const toggleFavorite = async (listingId: string) => {
    if (!user) return;

    const isFav = favorites.includes(listingId);
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', listingId);
      setFavorites(favorites.filter(id => id !== listingId));
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: listingId });
      setFavorites([...favorites, listingId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Welcome to Campus Connect</h1>
        <p className="mb-6 max-w-2xl text-lg opacity-90">
          Buy and sell items within your campus community. Find great deals on textbooks, electronics, furniture, and more.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link to="/browse">
              <Search className="mr-2 h-5 w-5" />
              Browse Listings
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Listing
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Listings</h2>
          <Button asChild variant="ghost">
            <Link to="/browse">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : recentListings.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No listings yet. Be the first to create one!</p>
            <Button asChild className="mt-4">
              <Link to="/create">Create Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={() => toggleFavorite(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
