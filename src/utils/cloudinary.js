import { v2 as cloudinary } from 'cloudinary'
import key from '../state/index.js'


const {
    CLOUD_NAME,
    API_KEY,
    API_SECRET } = key

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

export default cloudinary