module.exports = (theFunc)=>(req,res,mext)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
}