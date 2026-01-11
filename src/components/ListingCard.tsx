import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface ListingCardProps {
  listing: Tables<'listings'> & {
    categories?: Tables<'categories'> | null;
    profiles?: Tables<'profiles'> | null;
  };
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
}

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

const ListingCard = ({ listing, isFavorite, onToggleFavorite, showFavoriteButton = true }: ListingCardProps) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/listing/${listing.id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <Link to={`/listing/${listing.id}`}>
            <h3 className="line-clamp-1 font-semibold hover:text-primary">{listing.title}</h3>
          </Link>
          {showFavoriteButton && onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite();
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
          )}
        </div>
        <p className="text-xl font-bold text-primary">${Number(listing.price).toFixed(2)}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {listing.condition && (
            <Badge variant="secondary">{conditionLabels[listing.condition]}</Badge>
          )}
          {listing.categories && (
            <Badge variant="outline">{listing.categories.name}</Badge>
          )}
        </div>
      </CardContent>
      {listing.location && (
        <CardFooter className="border-t px-4 py-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ListingCard;
