"use client";

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Badge from '@/components/admin/Badge';
import GlassCard from '@/components/admin/GlassCard';
import { useTranslations, useLocale } from 'next-intl';

type BookingDetail = {
  _id: string;
  bookingNumber: string;
  createdAt: string;
  amountPaid: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  role: 'lady' | 'gent';
  language: 'en' | 'hr';
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    dob: string;
    residence: string;
    education: string;
    occupation: string;
    height: string;
  };
  preferences: {
    children: string;
    interests: string[];
    shortDescription: string;
    smoker: string;
    exercise: string;
    languages: string;
    lookingFor: string;
    sleepingHabits: string;
    outings: string;
  };
  images: {
    facePhoto: string;
    bodyPhoto: string;
  };
  paymentSummary: {
    last4: string;
    expiry: string;
  };
  event?: {
    title?: string;
    location?: string;
    date?: string;
    time?: string;
    translations?: {
      en?: { title?: string; location?: string };
      hr?: { title?: string; location?: string };
    };
  };
};

const getStatusVariant = (status: BookingDetail['paymentStatus']) => {
  if (status === 'paid') return 'success';
  if (status === 'failed') return 'danger';
  if (status === 'refunded') return 'info';
  return 'warning';
};

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1 rounded-2xl border border-white/10 bg-black/20 p-4">
    <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">{label}</p>
    <p className="text-sm text-white/80">{value || '-'}</p>
  </div>
);

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations('admin.bookings');
  const locale = useLocale();
  const dateLocale = locale === 'hr' ? 'hr-HR' : 'en-US';
  
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setBooking(data))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const eventTitle = booking?.event
    ? (booking.event.translations as any)?.[locale]?.title || booking.event.title || '-'
    : '-';

  const eventLocation = booking?.event
    ? (booking.event.translations as any)?.[locale]?.location || booking.event.location || '-'
    : '-';

  if (isLoading) {
    return <div className="text-white/55">{t('detail.loading')}</div>;
  }

  if (!booking) {
    return <div className="text-white/55">{t('detail.notFound')}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/admin/bookings" className="text-sm text-[#F4D693] hover:underline">
            {t('detail.back')}
          </Link>
          <h1 className="mt-3 text-4xl font-serif gold-text">{t('detail.title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge label={t(`statuses.${booking.paymentStatus}`)} variant={getStatusVariant(booking.paymentStatus)} />
          <div className="rounded-full border border-[#F4D693]/20 bg-[#F4D693]/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#F4D693]">
            {booking.bookingNumber}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="mb-4 text-2xl font-serif">{t('detail.sections.user')}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label={t('table.user')} value={`${booking.userDetails.firstName} ${booking.userDetails.lastName}`} />
              <DetailItem label={t('detail.fields.email')} value={booking.userDetails.email} />
              <DetailItem label={t('detail.fields.mobile')} value={booking.userDetails.mobile} />
              <DetailItem label={t('detail.fields.dob')} value={booking.userDetails.dob} />
              <DetailItem label={t('detail.fields.residence')} value={booking.userDetails.residence} />
              <DetailItem label={t('detail.fields.education')} value={booking.userDetails.education} />
              <DetailItem label={t('detail.fields.occupation')} value={booking.userDetails.occupation} />
              <DetailItem label={t('detail.fields.height')} value={booking.userDetails.height} />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="mb-4 text-2xl font-serif">{t('detail.sections.preferences')}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label={t('detail.fields.children')} value={booking.preferences.children} />
              <DetailItem label={t('detail.fields.smoker')} value={booking.preferences.smoker} />
              <DetailItem label={t('detail.fields.exercise')} value={booking.preferences.exercise} />
              <DetailItem label={t('detail.fields.languages')} value={booking.preferences.languages} />
              <DetailItem label={t('detail.fields.lookingFor')} value={booking.preferences.lookingFor} />
              <DetailItem label={t('detail.fields.sleepingHabits')} value={booking.preferences.sleepingHabits} />
              <DetailItem label={t('detail.fields.outings')} value={booking.preferences.outings} />
              <DetailItem label={t('detail.fields.shortDescription')} value={booking.preferences.shortDescription} />
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">{t('detail.fields.interests')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {booking.preferences.interests?.length ? (
                  booking.preferences.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-[#F4D693]/25 bg-[#F4D693]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#F4D693]"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/55">-</span>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="mb-4 text-2xl font-serif">{t('detail.sections.event')}</h2>
            <div className="space-y-4">
              <DetailItem label={t('table.event')} value={eventTitle} />
              <DetailItem label={t('detail.fields.location')} value={eventLocation} />
              <DetailItem
                label={t('detail.fields.eventDate')}
                value={
                  booking.event?.date
                    ? `${new Date(booking.event.date).toLocaleDateString(dateLocale)} ${booking.event.time || ''}`
                    : '-'
                }
              />
              <DetailItem label={t('detail.fields.role')} value={t(`roles.${booking.role}`)} />
              <DetailItem label={t('detail.fields.language')} value={booking.language.toUpperCase()} />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="mb-4 text-2xl font-serif">{t('detail.sections.payment')}</h2>
            <div className="space-y-4">
              <DetailItem label={t('detail.fields.bookingNumber')} value={booking.bookingNumber} />
              <DetailItem label={t('detail.fields.amountPaid')} value={`${booking.amountPaid} ${booking.currency}`} />
              <DetailItem label={t('detail.fields.paymentStatus')} value={t(`statuses.${booking.paymentStatus}`)} />
              <DetailItem label={t('detail.fields.card')} value={`**** **** **** ${booking.paymentSummary.last4}`} />
              <DetailItem label={t('detail.fields.expiry')} value={booking.paymentSummary.expiry} />
              <DetailItem
                label={t('detail.fields.createdAt')}
                value={new Date(booking.createdAt).toLocaleString(dateLocale)}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="mb-4 text-2xl font-serif">{t('detail.sections.images')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { key: 'facePhoto', label: t('detail.facePhoto'), src: booking.images.facePhoto },
                { key: 'bodyPhoto', label: t('detail.bodyPhoto'), src: booking.images.bodyPhoto },
              ].map((imageItem) => (
                <div key={imageItem.key} className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">{imageItem.label}</p>
                  {imageItem.src ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={imageItem.src}
                        alt={imageItem.label}
                        width={600}
                        height={800}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/45">
                      {t('detail.noImage')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
