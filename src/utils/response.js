const createSuccessResponse = (data) => {
    return {
        status: 'success',
        data
    }
}

const createErrorResponse = (error) => {
    return {
        status: 'error',
        error
    }
}

module.exports = {
    createSuccessResponse,
    createErrorResponse
}