const EndUser = require('../model/EndUser');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const AppError = require('../utils/appError');
require('dotenv').config();

async function jwtToken(data, accesstokenduration, refereshtokenduration) {
    const datatoken = {};
    datatoken.accessToken = jwt.sign({ data }, process.env.JWT_SECRET_KEY, {
      expiresIn: accesstokenduration,
    });
    datatoken.refreshToken = jwt.sign({ data }, process.env.JWT_SECRET_KEY, {
      expiresIn: refereshtokenduration,
    });
    return datatoken;
  }

  async function verifyJWTData(token) {
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (verificationError) {
      if (verificationError.name === 'TokenExpiredError') {
        throw new AppError('Session has expired, Please login again!', 401);
      }
      if (verificationError.name === 'JsonWebTokenError') {
        throw new AppError('Your login has expired, Please login again!', 401);
      }
      throw new AppError('Invalid Token', 401);
    }
    return decoded;
  }

async function generateAccessandRefershToken(userData) {
    const tokenData = await jwtToken(
      userData,
      '15d',
      '30d'
    );
    return {
      message: 'Sucess',
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
    };
  }

async function passwordVerifierAuth(req, res, next) {
    try {
      const { email, password } = req.body;
     
      const foundUser = await EndUser.findOne({
        where: { email },
      });
      if (!foundUser) {
        return next(new AppError("User not found. Please signup", 404));
      }
    
      const encryptInputPassword = CryptoJS.SHA256(password).toString();
      if (foundUser.dataValues.password !== encryptInputPassword) {
        return next(new AppError('Password does not match', 401));
      }
  
      const data1 = {
        id: foundUser.dataValues.id,
        email: foundUser.email,
        role: foundUser.role,
      };
  
      const tokenData = await generateAccessandRefershToken(data1);
      res.status(200).json(tokenData);
    } catch (error) {
      console.log('error', error);
      return next(new AppError(error.message, 500));
    }
  }

  async function protect(req, res, next) {
    try {
      // 1) Getting token and check if it's there
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
        return next(
          new AppError(
            req.customErrorMessage || 'You are not logged in! Please log in to access this feature.',
            401,
          ),
        );
      }
      // 2) Verify token
      let decoded;
      try {
        decoded = await verifyJWTData(token);
      } catch (error) {
        return next(new AppError(error.message, error.statusCode));
      }
      req.user = decoded.data;
      req.user.id = decoded.data.id;
      next();
    } catch (error) {
        console.log('requesttttttttttttttttttttt came to catch');
      return next(new AppError(error.message, error.statusCode));
    }
  }
  
  module.exports = { passwordVerifierAuth, protect };