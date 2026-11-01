import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, Users, CreditCard, Loader2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBooking, useProcessPayment } from '@/hooks/useBookings';
import { Movie } from '@/hooks/useMovies';

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'select' | 'payment' | 'success';

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBooking = useCreateBooking();
  const processPayment = useProcessPayment();

  const [step, setStep] = useState<BookingStep>('select');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>(movie.show_times?.[0] || '10:00 AM');
  const [seats, setSeats] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE'),
      day: format(date, 'd'),
      month: format(date, 'MMM'),
    };
  });

  const totalAmount = Number(movie.price) * seats;

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      onClose();
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        show_date: selectedDate,
        show_time: selectedTime,
        seats,
        total_amount: totalAmount,
      });
      setBookingId(booking.id);
      setStep('payment');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;

    try {
      await processPayment.mutateAsync(bookingId);
      setStep('success');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    setStep('select');
    setBookingId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" />
            {step === 'success' ? 'Booking Confirmed!' : `Book Tickets - ${movie.title}`}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                Select Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {dates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all ${
                      selectedDate === date.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xs opacity-80">{date.label}</span>
                    <span className="text-lg font-bold">{date.day}</span>
                    <span className="text-xs opacity-80">{date.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="w-4 h-4 text-primary" />
                Select Show Time
              </label>
              <div className="flex flex-wrap gap-2">
                {(movie.show_times || ['10:00 AM', '1:30 PM', '5:00 PM', '9:00 PM']).map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedTime === time
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary border-border hover:border-primary/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Seats Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="w-4 h-4 text-primary" />
                Number of Seats
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-lg font-bold hover:bg-card transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-foreground w-8 text-center">{seats}</span>
                <button
                  onClick={() => setSeats(Math.min(10, seats + 1))}
                  className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-lg font-bold hover:bg-card transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-muted-foreground ml-4">
                  ₹{movie.price} per seat
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-secondary/50 rounded-xl border border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-accent">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              variant="hero"
              size="lg"
              className="w-full"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : user ? (
                'Proceed to Payment'
              ) : (
                'Sign In to Book'
              )}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="p-6 bg-secondary/50 rounded-xl border border-border space-y-4">
              <h3 className="font-semibold text-foreground">{movie.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground">{format(new Date(selectedDate), 'EEEE, MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="text-foreground">{seats}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-accent">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Mock Payment */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">Payment Method</span>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-center text-muted-foreground">
                <p className="text-sm">Mock Payment - Click Pay Now to simulate payment</p>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              variant="hero"
              size="lg"
              className="w-full"
              disabled={processPayment.isPending}
            >
              {processPayment.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <Ticket className="w-10 h-10 text-green-500" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Booking Successful!</h3>
              <p className="text-muted-foreground">
                Your tickets for <span className="text-foreground font-medium">{movie.title}</span> have been booked.
              </p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-xl text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{format(new Date(selectedDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{seats}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your registered email address.
            </p>

            <Button onClick={handleClose} variant="hero" size="lg" className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
