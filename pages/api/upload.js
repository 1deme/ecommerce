import multiparty from 'multiparty';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
const bucketName = 'next-ecommerce-demetre';
export default async function handle(req, res){
    const form = new multiparty.Form();
    const {fields, files} =  await new Promise((resolve,reject) => {
        form.parse(req, (err, fields, files) => {
            if(err)  reject(err);
            resolve({fields,files});
        });
    });
    console.log('length:', files);
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: "AKIAQE5G6KN3IZU4W5WK",
            secretAccessKey: "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",
        },
        logger: {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
          },
    });
    const links = [];
    for(const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;
        console.log({ext,file});
        await client.send(new PutObjectCommand({
            Bucket:bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContenType: mime.lookup(file.path),
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }
    return res.json({links});
    
}

export const config = {
    api: {bodyParser:false},
};