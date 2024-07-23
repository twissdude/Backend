const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malfrmatted id'});
    } else if (error.name === 'ValidatorError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = { errorHandler };