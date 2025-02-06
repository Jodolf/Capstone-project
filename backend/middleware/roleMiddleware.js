const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accesso negato.' });
      }
      next();
    };
  };
  
  export default checkRole;
  