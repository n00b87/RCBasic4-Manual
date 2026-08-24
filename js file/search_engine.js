const search = document.getElementById("searchDocs")
const details = document.querySelectorAll(".sidebar details")

search.addEventListener("keyup", function(){

let value = this.value.toLowerCase()

details.forEach(section => {

let links = section.querySelectorAll("a")
let matchFound = false

links.forEach(link => {

let text = link.textContent.toLowerCase()

if(text.includes(value)){
link.style.display = "block"
matchFound = true
}else{
link.style.display = "none"
}

})

/* abrir o cerrar el tree */

if(matchFound || value === ""){
section.open = true
}else{
section.open = false
}

})

})

