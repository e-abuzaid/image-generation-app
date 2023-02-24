import { useState } from 'react'

import './App.css'
import Generations from './views/Generations'
import Results from './views/Results'
import Variarions from './views/Variarions'

function App() {
  const [type, setType] = useState('generation')
  const [formData, setFormData] = useState({
    prompt: '',
    size: '',
    file: '',
    number: ''
  })
  const [image, setImage] = useState('')
  const [isImage, setIsImage] = useState(false)
  const [isVariation, setIsVariation] = useState(false)
  const [variationList, setVariationList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex w-full md:flex-row flex-col">
      <div className="md:w-1/3 w-full flex flex-col p-6">
        <h1 className="font-extrabold mb-3">Image Generation App</h1>
        <h2 className="font-bold text-xl mb-3 ">Build the perfect image by just inputting a simple prompt!</h2>
        <div className="flex mb-5">
          <button className={`m-2 ${type === 'generation' && `active`}`} onClick={() => {setType('generation')}}>Generate an Image</button>
          <button className={`m-2 ${type === 'variation' && `active`}`} onClick={() => {setType('variation')}}>Create variations of an image</button>
        </div>
        <hr />
        {type === 'generation' && (
          <Generations
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setImage={setImage}
            setIsImage={setIsImage}
            isVariation={isVariation}
            setIsVariation={setIsVariation}
            setVariationList={setVariationList}
          />
        )
        }  {type === 'variation' && (
          <Variarions
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setImage={setImage}
            setIsImage={setIsImage}
            isVariation={isVariation}
            setIsVariation={setIsVariation}
            setVariationList={setVariationList}
          />
        )
        }
      </div>
      <div className="md:w-2/3 w-full">
        <Results
          image={image}
          isImage={isImage}
          type={type}
          variationList={variationList}
          isLoading={isLoading}
          isVariation={isVariation}
        />
      </div>
    </div>
  )
}

export default App
