const content = document.querySelector("#tema > .container")
//const load = document.querySelector('dialog')

async function postapi(page){
  return new Promise(function(resolve, reject){
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/data')
    xhr.setRequestHeader('Content-Type', 'application/json')
    const jsonData = JSON.stringify({data:page})
    xhr.send(jsonData)
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
         // console.log(response)
          resolve(response)
        } else {
          console.error('Erro ao receber resposta.')
          reject(new Error('error'))
        }
      })
  })
}

async function main(){
  const response = await postapi(1)
  response.data.forEach(element => {
    content.innerHTML += element
  });
}
main()

// Defina um evento de rolagem na página
let scr = 1
window.addEventListener('scroll',async function() {
  if ((window.innerHeight + window.scrollY + 10) >= document.body.offsetHeight) {
    try {
      scr ++
      const res = await postapi(scr)
      res.data.forEach(element => {
        content.innerHTML += element
      })
      // O usuário rolou até o final da página - carregue mais postagens
      
    } catch (error) {
      console.log(error);
      return
    }
  }
});
