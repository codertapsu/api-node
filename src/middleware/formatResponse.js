const formatResponse = (data, message) => {
    return {
        data: data,
        message: message,
        time: Date.now()
    }
}
export default formatResponse