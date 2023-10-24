import { useEffect, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import { useNavigate , useParams} from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    category: '',
    all: false,
    computer: false,
    it: false,
    mechanical: false,
    extc: false,
    electrical: false,
    rewardvalue: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);


  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 2) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        setImageUploadError('Image upload failed (2 mb max per image)');
        setUploading(false);
      });
  } else {
    setImageUploadError('You can only upload 1 image per task');
    setUploading(false);
  }
};



  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange= (e) => { 
    if (
      e.target.id === 'all' ||
      e.target.id === 'computer' ||
      e.target.id === 'it' ||
      e.target.id === 'mechanical' ||
      e.target.id === 'extc' ||
      e.target.id === 'electrical'
    ) {
      if (e.target.id === 'all') {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
          computer: e.target.checked,
          it: e.target.checked,
          mechanical: e.target.checked,
          extc: e.target.checked,
          electrical: e.target.checked,
        });
      } else {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
        });
      }
    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
 
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update Task
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='5'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Category'
            className='border p-3 rounded-lg'
            id='category'
            required
            onChange={handleChange}
            value={formData.category}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <span>Branches :</span>
              <input type='checkbox' id='all' className='w-5'
              onChange={handleChange}
              checked={formData.all}/>
              <span>All</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='computer' className='w-5'
              onChange={handleChange}
              checked={formData.computer} />
              <span>Computer</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='it' className='w-5'
              onChange={handleChange}
              checked={formData.it} />
              <span>IT</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='mechanical' className='w-5'
              onChange={handleChange}
              checked={formData.mechanical} />
              <span>Mechanical</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='extc' className='w-5'
              onChange={handleChange}
              checked={formData.extc} />
              <span>EXTC</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='electrical' className='w-5'
              onChange={handleChange}
              checked={formData.electrical} />
              <span>Electrical</span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='number'
              id='rewardvalue'
              min='1'
              max='100'
              required
              className='p-3 border border-gray-300 rounded-lg'
              onChange={handleChange}
              value={formData.rewardvalue}/>
            <div className='flex flex-col items-center'>
              <p>Reward Value</p>
              <span className='text-xs'>(ETH)</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
          </p>
          <div className='flex gap-4'>
            <input onChange={(e)=>setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url,index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'>
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'/>
                <button
                  type='button'
                  onClick={()=> handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
                </div>
                ))
          }
          <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? 'Creating...' : 'Update task'}</button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
      </form>
    </main>
  );
}