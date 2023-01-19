module.exports = (req, res, next) => {
  const body = req.body;

  if (!body) {
    return res.status(200).json({
      error: {
        status: 500,
        message: 'Where your body ?'
      },
      data: {}
    });
  }

  next();
}