import { Router } from 'express';
import {
  getAllAccountsQuerySchema,
  deactivateUserParamsSchema,
  updateUserProfileBodySchema,
  deleteUserAccountParamsSchema,
} from '#utils/user-schema.js';
import { ROLES } from '#constants/index.js';
import { checkRole } from '#middlewares/role-middleware.js';
import { checkAuth } from '#middlewares/check-auth-middleware.js';
import { validateRequest } from '#middlewares/request-validator-middleware.js';
import { deactivateUser } from '#controllers/users/deactivate-user-controller.js';
import { getUserProfile } from '#controllers/users/get-user-profile-controller.js';
import { deleteMyAccount } from '#controllers/users/delete-my-account-controller.js';
import { updateUserProfile } from '#controllers/users/update-user-profile-controller.js';
import { deleteUserAccount } from '#controllers/users/delete-user-account-controller.js';
import { getAllUserAccounts } from '#controllers/users/get-all-user-accounts-controller.js';

export const userRouter = Router();

userRouter.use(checkAuth);

userRouter
  .route('/profile')
  .get(getUserProfile)
  .patch(
    validateRequest({ body: updateUserProfileBodySchema }),
    updateUserProfile
  )
  .delete(deleteMyAccount);

userRouter.use(checkRole([ROLES.ADMIN]));

userRouter
  .route('/all')
  .get(
    validateRequest({ query: getAllAccountsQuerySchema }),
    getAllUserAccounts
  );
userRouter
  .route('/:id')
  .delete(
    validateRequest({ params: deleteUserAccountParamsSchema }),
    deleteUserAccount
  );
userRouter
  .route('/:id/deactivate')
  .patch(
    validateRequest({ params: deactivateUserParamsSchema }),
    deactivateUser
  );
