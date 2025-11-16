const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const uploadToS3 = async (file, bucketName, metaData = {}) => {
    const fileName = `${Date.now()}_${file.originalname}`;

    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
            'original-filename': fileName,
            ...metaData
        }
    };

    await s3Client.send(new PutObjectCommand(params));

    return {
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
        key: fileName
    };
};


const getDownloadUrl = async (bucketName, key) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const response = await s3Client.send(command);

    return response;
};

const deleteFromS3 = async (bucket, key) => {
    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        })
    );
};

module.exports = {
    uploadToS3,
    getDownloadUrl,
    deleteFromS3
};