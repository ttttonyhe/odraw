import dynamic from "next/dynamic";
const LoginMain = dynamic(
  () => {
    return import("../components/test");
  },
  { ssr: false }
);

const Login = (props) => {
  return <LoginMain {...props} />;
};

export default Login;
