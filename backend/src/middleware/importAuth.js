export const importAuth = (req, res, next) => {
  const secret = req.headers["x-import-secret"];

  if (secret !== process.env.IMPORT_SECRET) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
};

