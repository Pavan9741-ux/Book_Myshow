import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  rating: number;
  votes: string | null;
  genres: string[];
  language: string | null;
  release_date: string | null;
  duration: string | null;
  is_new: boolean | null;
  is_trending: boolean | null;
  is_available: boolean | null;
  available_seats: number | null;
  price: number;
  show_times: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async (): Promise<Movie[]> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async (): Promise<Movie | null> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Movie;
    },
    enabled: !!id,
  });
};

export const useNowShowingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: async (): Promise<Movie[]> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: async (): Promise<Movie[]> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_trending', true)
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: async (): Promise<Movie[]> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_available', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};
