import { User } from '#models/user-model.js';
import { VerifyResetToken } from '#models/verify-reset-token-model.js';

// User operations
export const findUserByEmail = (data) => User.findOne(data);

export const findUserByEmailWithPassword = (data) =>
  User.findOne(data).select('+password');

export const findUserById = (id) => User.findById(id);

export const findUserByIdLean = (
  id,
  projection = '-refreshToken -roles -__v'
) => User.findById(id).select(projection).lean();

export const findUserByIdAndUpdate = (id, data) =>
  User.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  })
    .select('-refreshToken -roles -__v')
    .lean();

export const findUserByIdAndDelete = (id) =>
  User.findByIdAndDelete(id).select('-refreshToken -roles -__v').lean();

export const countAllUsers = () => User.countDocuments({});

export const findAllUsers = (pageSize, page) =>
  User.find()
    .sort({ createdAt: -1 })
    .select('-refreshToken -__v')
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .lean();

export const findUserByRefreshToken = (data) => User.findOne(data);

export const findUserByRefTAndRotateRefT = (oldToken, newToken) =>
  User.findOneAndUpdate(
    { refreshToken: oldToken },
    [
      {
        $set: {
          refreshToken: {
            $concatArrays: [
              {
                $filter: {
                  input: '$refreshToken',
                  as: 'token',
                  cond: { $ne: ['$$token', oldToken] },
                },
              },
              [newToken],
            ],
          },
        },
      },
      {
        $set: {
          refreshToken: { $slice: ['$refreshToken', -5] },
        },
      },
    ],
    {
      returnDocument: 'after',
      runValidators: true,
      updatePipeline: true,
    }
  );

export const findUserByRefTAndDeleteRefT = (refreshToken) =>
  User.findOneAndUpdate(
    { refreshToken },
    { $pull: { refreshToken } },
    { returnDocument: 'after' }
  );

export const createUser = (data) => User.create(data);

// VerifyResetToken operations
export const createVerifyResetToken = (data) => VerifyResetToken.create(data);

export const findVerifyResetToken = (data) => VerifyResetToken.findOne(data);

export const deleteVerifyResetToken = (data) =>
  VerifyResetToken.findOneAndDelete(data);
