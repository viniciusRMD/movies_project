const path = require('path');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000


const jsonData = JSON.parse((fs.readFileSync('./dados.json', 'utf8')))

const templ = (data)=>{
    return(
`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Torrent de Filmes</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body style="min-height: 0;display: block;" id="tema">
    <header>
        <a href="#"><h1>
            Scrapirata
        </h1></a>
        <ul class="navigation">
            <li><a href="#">filmes</a></li>
            <li><a href="#">series</a></li>
        </ul>      
    </header>
    <div id="bk"></div>
    <div id="over"></div>
    <div class="container">
    <div class="info">
    <h2>${data.page.pagetitle}</h2>
    <div style="display: flex;">
        <div><img src="${data.page.image}"></div>
        <div>${data.page.constent}</div>
    </div>
    <br>
    <p>${data.page.sinop}</p>
    <br>
    <div class="dl">
      <h3>${data.page.pagetitle}</h3>
      ${data.page.link}</div>
   </div>
    </div>
    </div>    
    <!--section id="ads"></section-->
    <script>
    document.querySelector('.info_nome a').remove();
</script>
</body>
</html>
`)
}


const all_data = new Array
for (let i in jsonData){
   // console.log(i)
   const card = jsonData[i].map(data => {
    return(`<div class="card" class="1"> 
    <div class="circle">
    <h2>${data.title}</h2>
    </div>
    <span>${data.type}</span>
    <div class="content">
    <img src="${data.page.image}" alt="">
    </div>
    <div class="link">
        <a target="_blank" href="/${encodeURIComponent(data.title)}">Visualizar</a>
    </div>
    </div>

    `)
}) 
all_data.push(card)
}


app.use(express.json())
app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(path.join(path.resolve('./'),'views/index.html')))

// Defina a rota POST
app.post('/api/data', (req, res) => {
    // Aqui você pode acessar os dados enviados pelo cliente usando req.body
    const {data} = req.body
    res.send(JSON.stringify({data:all_data[data]}))
  })
/***/
for(let j in jsonData){
    for(let i of jsonData[j]){
        app.get(`/${encodeURIComponent(i.title)}`,(req, res)=>{
            res.send(templ(i))
        }) 
    }
}
 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

