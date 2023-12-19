import { useFormik } from "formik";
import { toast } from "sonner";

import axios from "../../../../../sdk/api/config/index";
import { AuthActions, useAuth, useAuthForms } from "../../../../../sdk";
import { validateEmail } from "./validation";

export interface ResetPayload {
  email: string;
}

export const useEmailForm = () => {
  const { authDispatch } = useAuth();
  const toggleForm = useAuthForms((state) => state.setActiveForm);

  const formik = useFormik<ResetPayload>({
    initialValues: { email: "" },
    validate: validateEmail,
    validateOnChange: false,

    onSubmit: async (values, fn) => {
      authDispatch({ type: AuthActions.START_LOADING });

      try {
        const { data } = await axios.post("/forgot-password", values);

        localStorage.setItem("otp_msg", JSON.stringify(data?.message));
        toast.success(data?.message);

        toggleForm("otp");
        fn.resetForm();
      } catch (error: any) {
        toast.error(error?.response?.data?.message);

        authDispatch({
          type: AuthActions.SET_ERROR,
          payload: error?.response?.data?.message,
        });
      } finally {
        authDispatch({
          type: AuthActions.END_LOADING,
        });
      }
    },
  });

  return formik;
};