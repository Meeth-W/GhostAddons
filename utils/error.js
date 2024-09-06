const handleError = (message, error = " ") => {
    console.log(`[King] ${message} (${error})`)
}

module.exports = { handleError }
