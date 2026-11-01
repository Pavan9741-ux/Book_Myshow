import { useState } from 'react';
import { Star } from 'lucide-react';
import { Movie } from '@/hooks/useMovies';
import BookingModal from './BookingModal';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <div 
        className="group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] cursor-pointer"
        onClick={() => movie.is_available && setIsBookingOpen(true)}
      >
        {/* Poster Container */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden card-shadow transition-all duration-300 group-hover:card-shadow-hover group-hover:scale-[1.02]">
          {/* Poster Image */}
          <img
            src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {movie.is_new && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md">
                NEW
              </span>
            )}
            {movie.is_trending && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-md">
                🔥 TRENDING
              </span>
            )}
          </div>

          {/* Availability Badge */}
          {!movie.is_available && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md">
                COMING SOON
              </span>
            </div>
          )}

          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="text-xs font-semibold text-foreground">{movie.rating}</span>
              <span className="text-xs text-muted-foreground">({movie.votes})</span>
            </div>
          )}

          {/* Hover Overlay */}
          {movie.is_available && (
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                Book Now
              </span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {movie.genres?.join(' • ')}
          </p>
          <p className="text-xs text-muted-foreground">
            {movie.language} • {movie.duration}
          </p>
          {movie.is_available && movie.price && (
            <p className="text-xs font-medium text-accent">
              ₹{movie.price}
            </p>
          )}
        </div>
      </div>

      <BookingModal
        movie={movie}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
};

export default MovieCard;
