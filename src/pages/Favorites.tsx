import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ListingCard from '@/components/ListingCard';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

type ListingWithRelations = Tables<'listings'> & {
  categories: Tables<'categories'> | null;
  profiles: Tables<'profiles'> | null;
};

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<ListingWithRelations[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('listing_id, listings(*, categories(*), profiles(*))')
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error fetching favorites', description: error.message, variant: 'destructive' });
    } else {
      const listings = data
        ?.map(f => f.listings)
        .filter((l): l is ListingWithRelations => l !== null && l.is_active === true) || [];
      setFavorites(listings);
      setFavoriteIds(listings.map(l => l.id));
    }
    setLoading(false);
  };

  const removeFavorite = async (listingId: string) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', listingId);
    setFavorites(favorites.filter(l => l.id !== listingId));
    setFavoriteIds(favoriteIds.filter(id => id !== listingId));
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">You haven't saved any items yet.</p>
          <p className="text-sm text-muted-foreground">Browse listings and click the heart icon to save them here.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorite={true}
              onToggleFavorite={() => removeFavorite(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
