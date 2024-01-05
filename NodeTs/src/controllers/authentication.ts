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
