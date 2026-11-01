import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GenreFilter from '@/components/GenreFilter';
import MovieCarousel from '@/components/MovieCarousel';
import Footer from '@/components/Footer';
import { useNowShowingMovies, useTrendingMovies, useUpcomingMovies } from '@/hooks/useMovies';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const { data: nowShowing, isLoading: loadingNowShowing } = useNowShowingMovies();
  const { data: trending, isLoading: loadingTrending } = useTrendingMovies();
  const { data: upcoming, isLoading: loadingUpcoming } = useUpcomingMovies();

  // Filter movies based on selected genre
  const filteredNowShowing = useMemo(() => {
    if (!selectedGenre || !nowShowing) return nowShowing || [];
    return nowShowing.filter((movie) =>
      movie.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    );
  }, [selectedGenre, nowShowing]);

  const filteredUpcoming = useMemo(() => {
    if (!selectedGenre || !upcoming) return upcoming || [];
    return upcoming.filter((movie) =>
      movie.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    );
  }, [selectedGenre, upcoming]);

  const filteredTrending = useMemo(() => {
    if (!selectedGenre || !trending) return trending || [];
    return trending.filter((movie) =>
      movie.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    );
  }, [selectedGenre, trending]);

  const isLoading = loadingNowShowing || loadingTrending || loadingUpcoming;
  const hasNoResults = !isLoading && 
    filteredNowShowing.length === 0 && 
    filteredUpcoming.length === 0 && 
    filteredTrending.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Genre Filter */}
      <GenreFilter selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />

      {/* Movie Sections */}
      <main className="relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Trending Now */}
        <MovieCarousel
          title="🔥 Trending Now"
          subtitle="Most popular movies this week"
          movies={filteredTrending}
          isLoading={loadingTrending}
        />

        {/* Now Showing */}
        <MovieCarousel
          title="Now Showing"
          subtitle="Currently in cinemas near you"
          movies={filteredNowShowing}
          isLoading={loadingNowShowing}
        />

        {/* Coming Soon */}
        <MovieCarousel
          title="Coming Soon"
          subtitle="Upcoming releases to look forward to"
          movies={filteredUpcoming}
          isLoading={loadingUpcoming}
        />

        {/* No Results Message */}
        {hasNoResults && (
          <div className="container mx-auto py-20 text-center">
            <p className="text-xl text-muted-foreground">
              No movies found for "{selectedGenre}" genre.
            </p>
            <button
              onClick={() => setSelectedGenre(null)}
              className="mt-4 text-primary hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
