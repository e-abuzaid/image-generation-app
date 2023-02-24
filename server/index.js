import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import {Configuration, OpenAIApi} from 'openai'
import bodyParser from 'body-parser'
import multer from 'multer'
import fs from 'fs'
import path from 'path'


dotenv.config()

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const originalName = path.parse(file.originalname).name;
      const fileExtension = path.extname(file.originalname);
      const filename = `${originalName}-${uniqueSuffix}${fileExtension}`;
      cb(null, filename);
    }
  })

  const upload = multer({ storage: storage })


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json({limit: '50mb'}))


app.get('/', async (req, res) => {
    res.send('Hello')
})

app.post('/', async (req, res) => {
    try {
        const {prompt, size} = req.body
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: size
        })
        res.status(200).send({
            image: response.data.data[0].url
        })
    } catch (error) {
        res.status(500).send({error})
    }
})

app.post('/variation', upload.single('photo'), async (req, res) => {
    const {file} = req
    const {number} = req.body
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    try {
        const photoStream = fs.createReadStream(file.path);
        const response = await openai.createImageVariation(
            photoStream,
            number,
            '1024x1024'
        )
        fs.unlink(file.path, (err) => {
            if (err) {
              console.error(err)
              res.status(500).send({ error: 'Error deleting file' })
            }
        })
        res.status(200).send({
            images: response.data.data
        })
    } catch (error) {
        res.status(500).send({error})
        console.log(error)

    }
})

app.listen(5000, () => console.log('Server is running on port 5000'))