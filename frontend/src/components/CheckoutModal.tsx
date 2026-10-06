'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Listing } from '@/lib/types';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Lock, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { createBooking } from '@/lib/api';
import { useRole } from '@/context/RoleContext';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  bookingDetails: {
    checkIn: string;
    checkOut: string;
    guests: number;
    adults?: number;
    childrenCount?: number;
    infants?: number;
    pets?: number;
    totalPrice: number;
    nights: number;
  };
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  listing,
  bookingDetails
}) => {
  const router = useRouter();
  const { addToast } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive Guests State
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [adults, setAdults] = useState(bookingDetails.adults || bookingDetails.guests || 1);
  const [childrenCount, setChildrenCount] = useState(bookingDetails.childrenCount || 0);
  const [infants, setInfants] = useState(bookingDetails.infants || 0);
  const [pets, setPets] = useState(bookingDetails.pets || 0);

  // Dynamic calculated totals
  const totalGuests = adults + childrenCount;
  const currentTotalPrice = Math.round(
    bookingDetails.nights * listing.price_per_night + listing.cleaning_fee + listing.service_fee
  );
  
  // Payment Options State
  const [paymentType, setPaymentType] = useState<'card' | 'applepay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState('Alex Morgan');

  if (!isOpen) return null;

  const handleConfirmPay = async () => {
    setIsSubmitting(true);
    try {
      await createBooking({
        listing_id: listing.id,
        check_in: bookingDetails.checkIn,
        check_out: bookingDetails.checkOut,
        guests_count: totalGuests,
        total_price: currentTotalPrice
      });

      addToast(
        'Reservation Confirmed!',
        `Your stay at "${listing.title}" is confirmed for ${bookingDetails.checkIn}`,
        'success'
      );
      onClose();
      router.push('/trips');
    } catch (err: any) {
      addToast('Booking Failed', err.message || 'Could not complete reservation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGuestSummaryText = () => {
    const parts = [];
    parts.push(`${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`);
    if (infants > 0) parts.push(`${infants} infant${infants !== 1 ? 's' : ''}`);
    if (pets > 0) parts.push(`${pets} pet${pets !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold text-airbnb-dark flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            Request to Book & Checkout
          </h3>
          <div className="w-9" />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Listing Summary Card */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-200">
              <Image
                src={listing.images[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between text-xs">
              <div>
                <p className="text-airbnb-gray">{listing.property_type} in {listing.city}</p>
                <h4 className="font-bold text-sm text-airbnb-dark line-clamp-1">{listing.title}</h4>
              </div>
              <div className="flex items-center gap-1 font-medium text-airbnb-dark">
                <span>★ {listing.rating.toFixed(2)}</span>
                <span className="text-airbnb-gray">({listing.review_count} reviews)</span>
              </div>
            </div>
          </div>

          {/* Trip Details Section with Airbnb Guest Box (Matching PDF Problem 2 Screenshot) */}
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-5">
            <h4 className="font-bold text-airbnb-dark text-base">Your trip</h4>

            {/* Airbnb Expandable Box UI for Dates & Guest List */}
            <div className="border border-gray-300 rounded-2xl overflow-hidden divide-y divide-gray-300">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                <div className="p-3 bg-gray-50/50">
                  <label className="text-[10px] font-bold uppercase text-airbnb-dark block">CHECK-IN</label>
                  <p className="text-xs font-bold text-airbnb-dark mt-0.5">{bookingDetails.checkIn}</p>
                </div>
                <div className="p-3 bg-gray-50/50">
                  <label className="text-[10px] font-bold uppercase text-airbnb-dark block">CHECKOUT</label>
                  <p className="text-xs font-bold text-airbnb-dark mt-0.5">{bookingDetails.checkOut}</p>
                </div>
              </div>

              {/* Expandable Guest Breakdown Trigger & Menu */}
              <div className="relative">
                <div
                  onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                  className="p-3 bg-gray-50/50 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <label className="text-[10px] font-bold uppercase text-airbnb-dark block">GUESTS</label>
                    <p className="text-xs font-semibold text-airbnb-dark">{getGuestSummaryText()}</p>
                  </div>
                  {isGuestDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-airbnb-dark" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-airbnb-dark" />
                  )}
                </div>

                {/* Expandable Guest Controls (Matching PDF Problem 2 UI) */}
                {isGuestDropdownOpen && (
                  <div className="p-4 bg-white border-t border-gray-200 flex flex-col gap-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between py-1 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-airbnb-dark">Adults</p>
                        <p className="text-xs text-airbnb-gray">Age 13+</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults(adults - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{adults}</span>
                        <button
                          type="button"
                          disabled={totalGuests >= listing.max_guests}
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-1 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-airbnb-dark">Children</p>
                        <p className="text-xs text-airbnb-gray">Ages 2–12</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={childrenCount <= 0}
                          onClick={() => setChildrenCount(childrenCount - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{childrenCount}</span>
                        <button
                          type="button"
                          disabled={totalGuests >= listing.max_guests}
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between py-1 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-airbnb-dark">Infants</p>
                        <p className="text-xs text-airbnb-gray">Under 2</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={infants <= 0}
                          onClick={() => setInfants(infants - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{infants}</span>
                        <button
                          type="button"
                          disabled={infants >= 5}
                          onClick={() => setInfants(infants + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Pets */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-sm font-bold text-airbnb-dark">Pets</p>
                        <p className="text-xs text-airbnb-gray">Bringing a service animal?</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={pets <= 0}
                          onClick={() => setPets(pets - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{pets}</span>
                        <button
                          type="button"
                          disabled={pets >= 3}
                          onClick={() => setPets(pets + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark bg-white shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-5">
            <h4 className="font-bold text-airbnb-dark text-base">Pay with</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType('card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentType === 'card'
                    ? 'border-airbnb-dark bg-gray-50 ring-1 ring-airbnb-dark text-airbnb-dark'
                    : 'border-gray-200 text-airbnb-gray hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('applepay')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentType === 'applepay'
                    ? 'border-airbnb-dark bg-gray-50 ring-1 ring-airbnb-dark text-airbnb-dark'
                    : 'border-gray-200 text-airbnb-gray hover:border-gray-300'
                }`}
              >
                <span> Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('paypal')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentType === 'paypal'
                    ? 'border-airbnb-dark bg-gray-50 ring-1 ring-airbnb-dark text-airbnb-dark'
                    : 'border-gray-200 text-airbnb-gray hover:border-gray-300'
                }`}
              >
                <span>PayPal</span>
              </button>
            </div>

            {paymentType === 'card' && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="border border-gray-300 rounded-xl overflow-hidden divide-y divide-gray-300 text-xs">
                  <div className="p-3 bg-white">
                    <label className="text-[10px] font-bold text-airbnb-gray block uppercase">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full focus:outline-none font-medium text-airbnb-dark mt-0.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-300 bg-white">
                    <div className="p-3">
                      <label className="text-[10px] font-bold text-airbnb-gray block uppercase">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full focus:outline-none font-medium text-airbnb-dark mt-0.5"
                      />
                    </div>
                    <div className="p-3">
                      <label className="text-[10px] font-bold text-airbnb-gray block uppercase">CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full focus:outline-none font-medium text-airbnb-dark mt-0.5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-airbnb-gray block uppercase mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium text-airbnb-dark focus:outline-none focus:ring-1 focus:ring-airbnb-dark"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="flex flex-col gap-2.5 text-xs text-airbnb-dark border-b border-gray-100 pb-4">
            <h4 className="font-bold text-sm mb-1">Price details</h4>
            <div className="flex justify-between">
              <span>${listing.price_per_night} × {bookingDetails.nights} nights</span>
              <span>${bookingDetails.nights * listing.price_per_night}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${listing.cleaning_fee}</span>
            </div>
            <div className="flex justify-between">
              <span>Airbnb service fee</span>
              <span>${listing.service_fee}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-200">
              <span>Total (USD)</span>
              <span>${bookingDetails.totalPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-airbnb-gray bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mocked checkout flow. Confirming will save your reservation to the backend database.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleConfirmPay}
            disabled={isSubmitting}
            className="w-full bg-airbnb-red text-white font-bold py-3.5 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <span>Confirm & Pay ${bookingDetails.totalPrice}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
