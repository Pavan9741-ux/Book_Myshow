import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface Booking {
  id: string;
  user_id: string;
  movie_id: string;
  show_date: string;
  show_time: string;
  seats: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async (): Promise<Booking[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

interface CreateBookingData {
  movie_id: string;
  show_date: string;
  show_time: string;
  seats: number;
  total_amount: number;
}

export const useCreateBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingData): Promise<Booking> => {
      if (!user) throw new Error('Must be logged in to book');

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          movie_id: data.movie_id,
          show_date: data.show_date,
          show_time: data.show_time,
          seats: data.seats,
          total_amount: data.total_amount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return booking as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useProcessPayment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string): Promise<Booking> => {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock payment ID
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'paid',
          payment_id: paymentId
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      // Mock email notification - show toast instead
      toast({
        title: '🎉 Booking Confirmed!',
        description: `Your tickets have been booked successfully! Confirmation sent to your email. Payment ID: ${booking.payment_id}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
