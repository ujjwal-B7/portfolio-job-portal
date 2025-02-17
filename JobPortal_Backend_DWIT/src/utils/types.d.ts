import mongoose from 'mongoose';

export interface loggedInUserProps {
  user: {
    userId: mongoose.Schema.Types.ObjectId;
    role: string;
  };
}

export interface ResetPasswordProp {
  new_password: string;
  confirm_new_password: string;
}

export interface UpdatePasswordProp extends ResetPasswordProp {
  old_password: string;
}
