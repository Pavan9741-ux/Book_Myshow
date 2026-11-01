import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Ticket, Calendar, Clock, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import Navbar from '@/components/Navbar';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  confirmed: 'bg-blue-500/20 text-blue-500',
  paid: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

const Bookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your movie bookings</p>
            </div>
          </div>

          {bookingsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card border border-border rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Ticket className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Booking #{booking.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.show_date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.show_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                      <span className="text-lg font-bold text-accent">
                        ₹{booking.total_amount}
                      </span>
                    </div>
                  </div>

                  {booking.payment_id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Payment ID: <span className="text-foreground font-mono">{booking.payment_id}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto bg-card rounded-full flex items-center justify-center mb-4">
                <Ticket className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't made any movie bookings yet.
              </p>
              <Button variant="hero" onClick={() => navigate('/')}>
                Browse Movies
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookings;
