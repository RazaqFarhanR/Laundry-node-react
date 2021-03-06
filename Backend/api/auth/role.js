exports.IsCustomer = async (req, res, next) => {
    if (req.user.role === "customer") {
      next();
    }
    return res.status(401).send("Forbidden! You are Not Customer");   
  }
exports.IsAdmin = async (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    }
    else{
        return res.status(401).send("Forbidden! You are Not Admin");
    }
  }

  exports.IsAdminorIsOwner = async (req,res, next) =>{
    if (req.user.role === "admin" || "owner") {
      next();
    }
    else{
        return res.status(401).send("Forbidden! You are Not Admin or Owner");
    }
  }
  exports.IsAdminorIskasir = async (req,res, next) =>{
    if (req.user.role === "admin" || "kasir") {
      next();
    }
    else{
        return res.status(401).send("Forbidden! You are Not Admin or Kasir");
    }
  }
  