import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
})

export async function uploadFile({ buffer, fileName, folder = "dripkart"}) {
    try {

        const result = await client.files.upload({
            file: await ImageKit.toFile(buffer),
            fileName,
            folder
        })

        return result;

    } catch (err) {
        console.log(err);
        throw new Error("File upload failed");
    }
}