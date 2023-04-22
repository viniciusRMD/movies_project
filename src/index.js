
const axios = require('axios');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const {resolve} = require('path')
const ws = 'https://baixarportorrent.com/'


const imagepath = resolve('./')+'/public/images'


async function writeimages(filename,path,url){
    const writer = fs.createWriteStream(`${path}/${filename}`)
        const response = await axios.get(url, {
            responseType: 'stream',});
            response.data.pipe(writer);
}


async function main(){
    const block = {}
    for(let cd=0; cd < 10;cd++){
        
    const map = new Array
    const {data} = await axios.get(ws+cd)
    const dom = new JSDOM(data)
    const page = dom.window.document.querySelectorAll("#capas_pequenas > li")

    
    await new Promise((resolve, reject) =>{
        let count = 0
        page.forEach(async(data)=>{
            const text = data.querySelector('.capa_nome').textContent
            const type = data.querySelector("#capas_pequenas a > span.capa_categoria").textContent
            const link = data.querySelector('a').href
            const getlink = await axios.get(link)
            const dm = new JSDOM(getlink.data)
            const torrents = dm.window.document.querySelector("#lista_download").outerHTML
            const pagetitle = dm.window.document.querySelector("body > div:nth-child(3) > div.row.justify-content-md-center.conteudo > div > h1").textContent
           // const contentsb = dm.window.document.querySelector("body > div:nth-child(3) > div:nth-child(2) > div.col-12.col-md-6")
            const contents = dm.window.document.querySelector("body > div:nth-child(3) > div:nth-child(2) > div.col-12.col-md-6").outerHTML
            const sinop = dm.window.document.querySelector("body > div:nth-child(3) > div:nth-child(3) > div > p").textContent
            const imagedl = dm.window.document.querySelector("body > div:nth-child(3) > div:nth-child(2) > div.col-12.col-md-4 > img").src
            const imagename = imagedl.slice(imagedl.lastIndexOf("/")+1,-1)
            writeimages(imagename,imagepath,imagedl)
            const obj = {
                title:text,
                type:type,
                page:{
                    pagetitle:pagetitle,
                    image: 'images/'+imagename,
                    constent:contents.toString(),
                    sinop:sinop,
                    link:torrents,
                },
                
            }
        
             map.push(obj)
            //process
            count++
            if(count== page.length){
                resolve()
            }
        })
    })

    // armazena em ordem de paginas
    block[cd+1] = map
}
    console.log('====================================');
    //console.log(map);
    console.log('====================================');

    const tojson = JSON.stringify(block,null,2)
    fs.writeFile('dados.json', tojson, (err) => {
        if (err) throw err;
        console.log('Arquivo criado com sucesso!');
    });
}
main();