import mongoose from "mongoose";
import multiparty from 'multiparty'
import cloudinary from 'cloudinary'

export default function handle(req, res){
    mongoose.connect(process.env.MONGODB)
    const form = new multiparty.Form()
    form.parse(req, function(err, fields, files){
        for(const file of files.file){
            cloudinary.config({ 
                cloud_name: 'dgvngkhdp', 
                api_key: process.env.API_KEY, 
                api_secret: process.env.API_SECRET 
              });
              cloudinary.v2.uploader.upload(file.path,
                { public_id: Date.now() }, 
                function(error, result) {res.json(result); });
        }
    })
}

export const config = {
    api: {bodyParser: false}
}