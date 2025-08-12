// middleware/roleMiddleware.js

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Unauthorized: No user role found' });
    }

    if (!allowedRoles.includes(userRole) && userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }

    next();
  };
};
