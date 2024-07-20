const validator = require("validator")

exports.checkEmpty = (fields) => {
    const error = {}
    let isError = false    //isError mhdhe ture kiva false ahe
    for (const key in fields) {
        if (validator.isEmpty("" + fields[key] || "")) {
            error[key] = `${key} Is Required`
            isError = true
        }
    }
    return { isError, error }
}
//   error[key]  danamic key,      if (validator.isEmpty("" + fields[key] || "")) {  "" he use kele beasuse is empty undfined kive null chalt nhi mhnuun " " detat