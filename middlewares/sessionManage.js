export const checkStudSession = (req, res, next) => {
    if (req.session && req.session.student) { 
      next(); 
    } else {
      res.status(401).redirect('/loginpage'); 
    }
  };

export const checkStaffSession = (req, res, next) => {
    if (req.session && req.session.staff) { 
      next(); 
    } else {
      res.status(401).redirect('/loginpage'); 
    }
  };
  