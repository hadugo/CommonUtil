// ==============================
// testUtil.js
// ==============================
function isNull(value){
    if(!value) return true
    if(Array.isArray(value) && !value.length) return true
    if((typeof value).toUpperCase() === 'object'.toUpperCase() && !Object.keys(value).length) return true
    return false
}

console.log(`null ==> ${isNull(null)}`)
console.log(`!null ==> ${isNull(!null)}`)
console.log(`undefined ==> ${isNull(undefined)}`)
console.log(`!undefined ==> ${isNull(!undefined)}`)
console.log(`"" ==> ${isNull("")}`)
console.log(`"aa" ==> ${isNull("a")}`)
console.log(`0 ==> ${isNull(0)}`)
console.log(`1 ==> ${isNull(1)}`)
console.log(`{} ==> ${isNull({})}`)
console.log(`{a:'a'} ==> ${isNull({a:'a'})}`)
console.log(`[] ==> ${isNull([])}`)
console.log(`[{a:'a'}] ==> ${isNull([{a:'a'}])}`)
