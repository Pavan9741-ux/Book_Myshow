import { genres } from "@/data/movies";

interface GenreFilterProps {
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

const GenreFilter = ({ selectedGenre, onSelectGenre }: GenreFilterProps) => {
  return (
    <section className="py-6 border-b border-border">
      <div className="container mx-auto">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => onSelectGenre(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedGenre === null
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card text-muted-foreground hover:bg-card-hover hover:text-foreground border border-border"
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedGenre === genre
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-muted-foreground hover:bg-card-hover hover:text-foreground border border-border"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
