import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, MapPin, Mail, Calendar } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type ListingWithRelations = Tables<'listings'> & {
  categories: Tables<'categories'> | null;
  profiles: Tables<'profiles'> | null;
};

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<ListingWithRelations | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchListing();
      if (user) checkFavorite();
    }
  }, [id, user]);

  const fetchListing = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*, categories(*), profiles(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      toast({ title: 'Error fetching listing', description: error.message, variant: 'destructive' });
    } else {
      setListing(data);
    }
    setLoading(false);
  };

  const checkFavorite = async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', id)
      .maybeSingle();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user || !id) return;

    if (isFavorite) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', id);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: id });
      setIsFavorite(true);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Button asChild className="mt-4">
          <Link to="/browse">Back to Browse</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/browse">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {listing.condition && (
                <Badge variant="secondary">{conditionLabels[listing.condition]}</Badge>
              )}
              {listing.categories && (
                <Badge variant="outline">{listing.categories.name}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="mt-2 text-4xl font-bold text-primary">
              ${Number(listing.price).toFixed(2)}
            </p>
          </div>

          {listing.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{listing.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted on {new Date(listing.created_at).toLocaleDateString()}</span>
          </div>

          {listing.description && (
            <div>
              <h2 className="mb-2 font-semibold">Description</h2>
              <p className="text-muted-foreground">{listing.description}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={toggleFavorite} variant={isFavorite ? 'default' : 'outline'}>
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            {listing.profiles?.email && (
              <Button asChild>
                <a href={`mailto:${listing.profiles.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Seller
                </a>
              </Button>
            )}
          </div>

          {/* Seller Info */}
          {listing.profiles && (
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold">Seller Information</h3>
                <p className="text-muted-foreground">
                  {listing.profiles.full_name || 'Anonymous'}
                </p>
                <p className="text-sm text-muted-foreground">{listing.profiles.email}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
