export default function asyncErrHandler(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(err => next(err));
  };
}
