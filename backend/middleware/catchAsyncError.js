// function theFun(req,res,next){
//     Promise.resolve(theFun(req,res,next)).catch(next);
// }
// module.exports=theFun;


module.exports = (theFun) => (req, res, next) => {
     Promise.resolve(theFun(req, res, next)).catch(next);
}