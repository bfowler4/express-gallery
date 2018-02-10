module.exports = handleError;

function handleError(error, response) {
  switch (error.code) {
    default:
      return response.status(400).json({ message: error.message });
  }
}