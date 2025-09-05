const a = [1, 2, 3, 4, null]
const filtered = a.filter((item, index) => {
    return item == null ? true : false
})
console.log(filtered)