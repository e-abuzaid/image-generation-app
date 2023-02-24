import { useState } from 'react'
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
  } from 'react-image-crop'
  import {BsUpload} from 'react-icons/bs'
  import 'react-image-crop/dist/ReactCrop.css'

const Variarions = ({formData, setFormData, isLoading, setIsLoading, setImage, isVariation, setIsVariation, setVariationList, setIsImage}) => {

    const [photo, setPhoto] = useState(null)
    const [crop, setCrop] = useState({
        unit: 'px',
        aspect: 1,
        width: 256,
        height: 256,
        // locked: true,
     })
     const [previewUrl, setPreviewUrl] = useState(null)
     const [isCrop, setIsCrop] = useState(false)
     const [isPreview, setisPreview] = useState(false)
     const [error, setError] = useState(false)


     const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        const newCrop = {
          x: croppedArea.x,
          y: croppedArea.y,
          width: croppedArea.width,
          height: croppedArea.width,
          aspect: 1,
        };
        setCrop(newCrop);
      }

    const handlePhotoChange = (event) => {
        setPhoto(event.target.files[0]);
        const url = URL.createObjectURL(event.target.files[0])
        setPreviewUrl(url)
        setisPreview(true)
      }

    const handleSave = (event) => {
        const canvas = document.createElement('canvas');
        const image = document.querySelector('#preview');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        canvas.toBlob((blob) => {
          const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
          setFormData({...formData, file: file})
          setIsCrop(true)
        });
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      setImage('')
      setVariationList([])
      setIsImage(false)
      try {
        const validationForm = new FormData()
        validationForm.append('photo', formData.file)
        validationForm.append('number', formData.number)
        const response = await fetch('http://localhost:5000/variation', {
          method: 'POST',
          body: validationForm
        })
        const imageList = await response.json()
        setVariationList(imageList.images)
        setIsVariation(true)
      } catch (error) {
        console.log(error)
        setError(true)
      }
      setIsLoading(false)
    }


  return (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
            <h2 className="font-bold text-xl mt-4 mb-4">Generate image variations</h2>
            <label for="image-input" className="custom-file-input text-black font-bold flex items-center justify-evenly w-1/2 ">
              Upload Image <BsUpload />
            </label>
            <p className="text-[#a7a7a7] mb-4">PNG image, crop to be square</p>
            <input type="file" id="image-input" required className="hidden" accept="image/*" onChange={handlePhotoChange} />
            {isCrop &&
                (
                    <img src={URL.createObjectURL(formData.file)} width="300px" />
                )}  {isPreview && !isCrop && (
                  <>
                  <ReactCrop crop={crop} onChange={newCrop => setCrop(newCrop)} onComplete={handleCropComplete}>
                      <img
                          src={previewUrl}
                          alt="preview"
                          id="preview"
                      />
                  </ReactCrop>
                  <button onClick={handleSave}>Save</button>
              </>
            )}
          <label htmlFor="number" className="mt-3">Number of variations...</label>
          <input
             id="number"
             className="w-full text-2xl text-[#ebedee] mb-4 mt-3"
             required
             type="number"
             min="1"
             max="10"
             placeholder="Minimum 1, Maximum 10"
             onChange={(e) => setFormData({...formData, number: e.target.value})}
          />
          <button type="submit">{isLoading ? 'Generating...' : 'Generate'}</button>
          {error && <p>There was an error generating the result, please try again...</p>}
        </form>
  )
}

export default Variarions