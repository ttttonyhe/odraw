import { Result, Button } from "antd";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Link href="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
}
