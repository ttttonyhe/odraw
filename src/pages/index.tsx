import dynamic from "next/dynamic";
const Main = dynamic(
  () => {
    return import("./main");
  },
  { ssr: false }
);

const Home = () => {
  return (
    <div>
      <Main />
    </div>
  );
};

export default Home;
