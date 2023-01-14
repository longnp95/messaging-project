exports.get404 = (req, res, next) => {
  return res.status(404).json({
    error: {
      status: 404,
      message: 'Page Not Found'
    },
    data: {}
  });
};