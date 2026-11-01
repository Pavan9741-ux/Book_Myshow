import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { useTrendingMovies, Movie } from '@/hooks/useMovies';
import BookingModal from './BookingModal';

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: trendingMovies, isLoading } = useTrendingMovies();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Use the first trending movie from DB, or fallback to static data
  const featuredMovie: Movie | null = trendingMovies?.[0] || null;

  if (isLoading) {
    return (
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Featured Movie" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie?.backdrop_url || heroBg}
            alt="Featured Movie"
            className="w-full h-full object-cover"
          />
          {/* Multi-layer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 gradient-hero opacity-50" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto pb-16 lg:pb-24 pt-32">
          <div className="max-w-2xl animate-slide-up">
            {/* Featured Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">Featured Movie</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
              {featuredMovie?.title || 'Inception: The Dream Heist'}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Rating */}
              {featuredMovie && featuredMovie.rating > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card/80 backdrop-blur-sm rounded-lg">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="font-bold text-foreground">{featuredMovie.rating}</span>
                  <span className="text-muted-foreground text-sm">({featuredMovie.votes} votes)</span>
                </div>
              )}

              {/* Duration */}
              {featuredMovie?.duration && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{featuredMovie.duration}</span>
                </div>
              )}

              {/* Release */}
              {featuredMovie?.release_date && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{featuredMovie.release_date}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(featuredMovie?.genres || ['Sci-Fi', 'Action', 'Thriller']).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-sm font-medium rounded-full border border-border"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => featuredMovie && setIsBookingOpen(true)}
                disabled={!featuredMovie?.is_available}
              >
                {featuredMovie?.is_available ? 'Book Tickets' : 'Coming Soon'}
              </Button>
              <Button variant="hero-outline" size="xl" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {featuredMovie && (
        <BookingModal
          movie={featuredMovie}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </>
  );
};

export default HeroSection;
