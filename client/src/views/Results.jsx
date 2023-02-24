import { useEffect, useState } from 'react'
import {useSwipeable} from 'react-swipeable'
import {BsDownload} from 'react-icons/bs'
import {MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft} from 'react-icons/md'

import Placeholder from '../assets/placeholder.jpg'
import Loader from "./Loader"

const Results = ({isImage, isVariation, type, variationList, image, isLoading}) => {
  const [index, setIndex] = useState(0)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index > 0) {
        setIndex(prevIndex => prevIndex - 1)
        document.querySelector('#generated-image').classList.add('slide-right');
      } else {
        setIndex(variationList.length - 1)
        document.querySelector('#generated-image').classList.add('slide-right');
      }
    },
    onSwipedRight: () => {
      if (index < variationList.length - 1) {
        setIndex(prevIndex => prevIndex + 1)
        document.querySelector('#generated-image').classList.add('slide-left');
      } else {
        setIndex(0)
        document.querySelector('#generated-image').classList.add('slide-left');
      }
    },
  });

  const handleRightArrow = () => {
    if (index < variationList.length - 1) {
      setIndex(prevIndex => prevIndex + 1)
    } else {
      setIndex(0)
    }
  }

  const handleLeftArrow = () => {
    if (index > 0) {
      setIndex(prevIndex => prevIndex - 1)
    } else {
      setIndex(variationList.length - 1)
    }
  }

  useEffect(() => {
    const generatedImage = document.querySelector('#generated-image');
    if (generatedImage) {
    const onTransitionEnd = () => {
      generatedImage.classList.remove('slide-right');
      generatedImage.classList.remove('slide-left');
    }
    generatedImage.addEventListener('transitionend', onTransitionEnd);
    return () => {
      generatedImage.removeEventListener('transitionend', onTransitionEnd);
    }
  }
  }, [index]);


  return (
    <div className="p-6 flex flex-col items-center h-[100vh]">
        <h1 className="font-extrabold mb-8">Results</h1>
        {isLoading && <Loader /> }
        {!isImage && !isLoading && !isVariation &&
          <div>
            <h2>Your results will show here</h2>
            <img
              src={Placeholder}
              width="80%"
              className="m-auto"
              alt="placeholder"
            />
          </div>
        }
        {isImage &&
        <div>
          <img
            width="100%"
            src={image.image}
          />
          <a
            href={image.image}
            download
            className="relative border-solid border-2 border-[#787878] bottom-20 left-5 flex items-center justify-evenly w-[60px] h-[60px] rounded-full bg-[#ebedee] font-bold"
          > Save <BsDownload /></a>
        </div>
        }
    {isVariation &&
    <div {...handlers}>
        <div>
          <img
            src={variationList[index].url}
            className="mx-auto md:w-[80%] w-[100%]"
            id="generated-image"
          />
          <div className="w-[75%] flex justify-between relative bottom-[300px] left-[95px]">
            <button
              className="hidden md:flex"
              onClick={handleLeftArrow}
            >
              <MdOutlineKeyboardArrowLeft />
            </button>
            <button
              className="hidden md:flex"
              onClick={handleRightArrow}
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          </div>
          <a
            href={variationList[index].url}
            download
            className="relative border-solid border-2 border-[#787878] bottom-[100px] left-20 flex items-center justify-evenly w-[60px] h-[60px] rounded-full bg-[#ebedee] font-bold"
          > Save <BsDownload /></a>
        </div>
        <div className="grid grid-cols-5  w-[100%] gap-4">
          {variationList.map((image) => (
            <div>
              <img
              className={`w-[100%] cursor-pointer ${index === variationList.indexOf(image) && `border-double border-4 border-[#ebedee]-600`}`}
              src={image.url}
              alt="variation"
              key={image.url}
              onClick={() => setIndex(variationList.indexOf(image))}
              />
            </div>
          ))}
        </div>
      </div>
    }
  </div>
)
}

export default Results