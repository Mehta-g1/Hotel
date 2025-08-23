p = document.querySelector("#p")
data = p.innerHTML;
data = data.replace('[','')
data = data.replace(']','')
data = Array(data)
data  = data.split(',')

console.log(typeof(data))
console.log(Array.isArray(data))
console.log(data)
dishes = document.querySelector(".dishes")

for (let e of data) {
    let p = document.createElement("p")
    p.setAttribute("class",'dish')
    p.innerHTML = e
    dishes.appendChild(p)
}

