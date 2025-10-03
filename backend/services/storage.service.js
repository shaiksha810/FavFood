const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


const uploadFile = async (file,fileName) => {
    const result = await imagekit.upload({
      file:file, // buffer of the uploaded file
      fileName:fileName, // original file name
    });

    return result;
}

module.exports = {
    uploadFile
}
