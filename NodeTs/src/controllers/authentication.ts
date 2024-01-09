import { createUser, getUserByEmail } from '../db/users';
import express from 'express';
import { authentication, random } from '../helpers';

/**
 * function to create new user based on what the front end sent
 * @param req from the front end
 * @param res
 * @returns
 */

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    console.log('request at backend', email);

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    // check if there's already a user with that email address
    const extinguisher = await getUserByEmail(email);

    if (extinguisher) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    console.log('request at backend', email);

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    // check if there's already a user with that email address
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.sendStatus(400);
    }

    // authenticate user without knowing their password using hash comparison
    const expectedHash = authentication(user.authentication.salt, password);
    // if user is not authenticated, send 403 response
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    // if user is authenticated, open a session token
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('OSAS-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
