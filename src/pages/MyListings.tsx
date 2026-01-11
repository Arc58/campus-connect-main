import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, MapPin } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type ListingWithCategory = Tables<'listings'> & {
  categories: Tables<'categories'> | null;
};

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

const MyListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<ListingWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchListings();
  }, [user]);

  const fetchListings = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('listings')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching listings', description: error.message, variant: 'destructive' });
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting listing', description: error.message, variant: 'destructive' });
    } else {
      setListings(listings.filter(l => l.id !== id));
      toast({ title: 'Listing deleted' });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('listings')
      .update({ is_active: !isActive })
      .eq('id', id);
    if (error) {
      toast({ title: 'Error updating listing', description: error.message, variant: 'destructive' });
    } else {
      setListings(listings.map(l => l.id === id ? { ...l, is_active: !isActive } : l));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link to="/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">You haven't created any listings yet.</p>
          <Button asChild className="mt-4">
            <Link to="/create">Create Your First Listing</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => (
            <Card key={listing.id}>
              <CardContent className="flex gap-4 p-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/listing/${listing.id}`} className="font-semibold hover:text-primary">
                        {listing.title}
                      </Link>
                      <p className="text-lg font-bold text-primary">${Number(listing.price).toFixed(2)}</p>
                    </div>
                    <Badge variant={listing.is_active ? 'default' : 'secondary'}>
                      {listing.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {listing.condition && (
                      <Badge variant="outline">{conditionLabels[listing.condition]}</Badge>
                    )}
                    {listing.categories && (
                      <Badge variant="outline">{listing.categories.name}</Badge>
                    )}
                  </div>
                  {listing.location && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{listing.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-4 py-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(listing.id, listing.is_active ?? true)}
                  >
                    {listing.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteListing(listing.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
