const { Client, Events} = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const axios = require('axios');

async function main() {
    const client = new Client({ intents: [1, 32768, 512] });

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.username}`);
    });
    client.on(Events.MessageCreate, m => {
        if(m.author.bot) return
        m.attachments.forEach(async a => {
            if(a.contentType.startsWith("image")) {
                const fileName = "images/" + a.name.split(".")[0] + ".gif"
                await downloadImage(a.url, fileName)
                await m.reply({files: [fileName]})
                await fs.unlink(fileName, function () {

                })
            }
        })
    })
    client.login(token);
}



// https://stackabuse.com/bytes/how-to-download-an-image-from-a-url-in-node-js/
async function downloadImage (url, imagePath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}
main()

