import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaPhone, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      password: "",
      ...(isLogin ? {} : { confirmPassword: "" }),
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Required"),
      password: Yup.string().min(6, "Too short").required("Required"),
      ...(!isLogin && {
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required"),
      }),
    }),
    onSubmit: (values) => {
      if (isLogin) {
        dispatch(loginUser(values,navigate));
      } else {
        dispatch(registerUser(values,navigate));
      }
    },
  });

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-purple-400 to-pink-500 overflow-hidden">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 border border-gray-300 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter your phone number"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              {...formik.getFieldProps("mobileNumber")}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.mobileNumber}
              </p>
            )}
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          {!isLogin && (
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-bold hover:opacity-90 transition duration-200"
          >
            {isLogin ? "LOGIN" : "REGISTER"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-500 font-medium hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
