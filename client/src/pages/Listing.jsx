import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main >
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                 
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaClock
              className={`text-slate-500 ${copied ? 'opacity-60' : ''}`}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col items-center max-w-4xl mx-auto gap-4 mt-[-140px]'>
            <p className='text-2xl font-semibold'>
              {listing.name}
            </p>
            <div className='flex items-center text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700 mr-1 ' />
              <span>{listing.category}</span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {listing.all && (
                <p className='bg-red-900 text-white text-center p-1 rounded-md'>
                  All
                </p>
              )}
              {listing.computer && (
                <p className='bg-red-900 text-white text-center p-1 rounded-md'>
                  Computer
                </p>
              )}
              {listing.it && (
                <p className='bg-red-900 text-white text-center p-1 rounded-md'>
                  IT
                </p>
              )}
              {listing.mechanical && (
                <p className='bg-red-900 text-white text-center p-1 rounded-md'>
                  Mechanical
                </p>
              )}
              {listing.extc && (
                <p className='bg-red-900 text-white text-center p-1 rounded-md'>
                  EXTC
                </p>
              )}
              {listing.electrical && (
                <p className='bg-red-900 text-white text-center p-1 rounded-md'>
                  Electrical
                </p>
              )}
            </div>
            <p className='text-slate-550'>
              <span className='font-semibold text-black text-sm'>Description - </span>
              {listing.description}
            </p>
            <div className='flex items-center text-slate-600 text-sm'>
              <FaClock className='text-green-700 mr-1' />
              <span>No of hours: {listing.rewardvalue}</span>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}


