import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '@/hooks/useMovies';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  subtitle?: string;
  isLoading?: boolean;
}

const MovieCarousel = ({ title, movies, subtitle, isLoading }: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-card border border-border hover:bg-card-hover hover:border-primary/50 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-card border border-border hover:bg-card-hover hover:border-primary/50 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
