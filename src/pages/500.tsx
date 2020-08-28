import { Result, Button } from "antd";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <Result
      status="500"
      title="404"
      subTitle="服务错误"
      extra={
        <Link href="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
}