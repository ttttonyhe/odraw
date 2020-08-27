import dynamic from "next/dynamic";
const IndexMain = dynamic(
  () => {
    return import("../components/index");
  },
  { ssr: false }
);

const Index = (
  props: JSX.IntrinsicAttributes & { children?: import("react").ReactNode }
) => {
  return (
    <div>
      <IndexMain {...props} />
    </div>
  );
};

export default Index;
