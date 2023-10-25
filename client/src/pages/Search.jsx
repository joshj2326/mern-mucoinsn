import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
      searchTerm: '',
      all: false,
      computer: false,
      it: false,
      mechanical: false,
      extc: false,
      electrical: false,
      sort: 'created_at',
      order: 'desc',
    });
  
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      const allFromUrl = urlParams.get('all');
      const computerFromUrl = urlParams.get('computer');
      const itFromUrl = urlParams.get('it');
      const mechanicalFromUrl = urlParams.get('mechanical');
      const extcFromUrl = urlParams.get('extc');
      const electricalFromUrl = urlParams.get('electrical');
      const sortFromUrl = urlParams.get('sort');
      const orderFromUrl = urlParams.get('order');
  
      if (
        searchTermFromUrl ||
        allFromUrl ||
        computerFromUrl ||
        itFromUrl ||
        mechanicalFromUrl ||
        extcFromUrl ||
        electricalFromUrl ||
        sortFromUrl ||
        orderFromUrl
      ) {
        setSidebardata({
          searchTerm: searchTermFromUrl || '',
          all: allFromUrl === 'true' ? true : false,
          computer: computerFromUrl=== 'true' ? true : false,
          it: itFromUrl === 'true' ? true : false,
          mechanical: mechanicalFromUrl === 'true' ? true : false,
          extc: extcFromUrl === 'true' ? true : false,
          electrical: electricalFromUrl === 'true' ? true : false,
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc',
        });
      }
  
      const fetchListings = async () => {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        setListings(data);
        setLoading(false);
      };
  
      fetchListings();
    }, [location.search]);
  
    const handleChange = (e) => {
      
      if (e.target.id === 'searchTerm') {
        setSidebardata({ ...sidebardata, searchTerm: e.target.value });
      }
  
      if (
        e.target.id === 'all' ||
        e.target.id === 'computer' ||
        e.target.id === 'it' ||
        e.target.id === 'mechanical' ||
        e.target.id === 'extc' ||
        e.target.id === 'electrical' 
      ) {
        setSidebardata({
          ...sidebardata,
          [e.target.id]:
            e.target.checked || e.target.checked === 'true' ? true : false,
        });
      }
  
      if (e.target.id === 'sort_order') {
        const sort = e.target.value.split('_')[0] || 'created_at';
  
        const order = e.target.value.split('_')[1] || 'desc';
  
        setSidebardata({ ...sidebardata, sort, order });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', sidebardata.searchTerm);
      urlParams.set('all', sidebardata.all);
      urlParams.set('computer', sidebardata.computer);
      urlParams.set('it', sidebardata.it);
      urlParams.set('mechanical', sidebardata.mechanical);
      urlParams.set('extc', sidebardata.extc);
      urlParams.set('electrical', sidebardata.electrical);
      urlParams.set('sort', sidebardata.sort);
      urlParams.set('order', sidebardata.order);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Branch:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='all' className='w-5'
              onChange={handleChange} 
              checked={sidebardata.all} />
              <span>All</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='computer' className='w-5'
              onChange={handleChange}
              checked={sidebardata.computer} /> 
              <span>Computer</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='it' className='w-5'
              onChange={handleChange}
              checked={sidebardata.it} /> 
              
              <span>IT</span>

            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='mechanical' className='w-5'
               onChange={handleChange}
               checked={sidebardata.mechanical} />
              <span>Mechanical</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='extc' className='w-5'
              onChange={handleChange}
              checked={sidebardata.extc} />
              <span>EXTC</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='electrical' className='w-5'
              onChange={handleChange}
              checked={sidebardata.electrical} />
              <span>Electrical</span>
            </div>
          </div>
          
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
             onChange={handleChange}
             defaultValue={'created_at_desc'}

             id='sort_order' className='border rounded-lg p-3'>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_desc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Task results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No task found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
            
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
            </div>
      </div>
    </div>
  );
}