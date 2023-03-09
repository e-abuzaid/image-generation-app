import { useEffect, useState } from 'react'

const Generations = ({formData, setFormData, isLoading, setIsLoading, setImage, setIsImage, isVariation, setError, setIsVariation, setVariationList}) => {
  const [text, setText] = useState("")
  const [fullText, setFullText] = useState(
    "e.g.: A boy playing with a ball..."
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      setTimeout(() => {
        setText(text + fullText[index])
        setIndex(index + 1)
      }, 40)
    }
  }, [index])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setImage('')
    setVariationList([])
    setIsVariation(false)
    setIsImage(false)
    try {
      const response = await fetch('https://image-generation-app.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          size: formData.size
        })
      })
      const image = await response.json()
      setImage(image)
      setIsImage(true)
    } catch (error) {
      setError(true)
      console.log(error)
    }
    setIsLoading(false)
  }


  return (
    <form className="flex flex-col items-start" onSubmit={handleSubmit}>
      <h2 className="font-bold text-xl mt-4 mb-4">Generate an image</h2>
      <label htmlFor="prompt">Enter a prompt...</label>
      <input
        id="prompt"
        required
        onChange={(e) => setFormData({...formData, prompt: e.target.value})}
        placeholder={text}
        className="w-full md:text-xl text-md p-3 mb-4 text-[#ebedee]"
      />
      <label htmlFor="size">Choose preferred size...</label>
      <select
        id="size"
        className="w-full mb-4 mt-3"
        required
        onChange={(e) => setFormData({...formData, size: e.target.value})}
      >
        <option value='256x256' className="p-3">256x256</option>
        <option value='512x512' className="p-3 bg-[#ebedee]">512x512</option>
        <option value='1024x1024' className="p-3">1024x1024</option>
      </select>
      <button type="submit">{isLoading ? 'Generating...' : 'Generate'}</button>
  </form>
)
}

export default Generations