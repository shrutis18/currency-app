export const format = (value) => {
    if (typeof (value) == 'number')
      return parseFloat(value).toFixed(4)
    else
        return value
}
