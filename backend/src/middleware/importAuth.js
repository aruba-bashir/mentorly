/*export const importAuth = (req, res, next) => {
  const secret = req.headers["x-import-secret"];

  if (secret !== process.env.IMPORT_SECRET) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
};*/

export const importAuth = (req, res, next) => {
  console.log("HEADER SECRET:", req.headers["x-import-secret"]);
  console.log("ENV SECRET:", process.env.IMPORT_SECRET);

  return res.status(200).json({
    header: req.headers["x-import-secret"],
    env: process.env.IMPORT_SECRET,
  });
};