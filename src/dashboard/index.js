import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import Dashboard from "./Dashboard";
import 'antd/dist/reset.css';
import "./index.scss";

const antdConfig = {
  locale: enUS,
};

// 将content页面添加到body
const contentRoot = document.createElement("div");
contentRoot.id = "CRX-dashboardRoot";
contentRoot.style.width = "100%";
contentRoot.style.height = "100%";
document.body.appendChild(contentRoot);
const root = ReactDOM.createRoot(contentRoot);
root.render(
  <ConfigProvider {...antdConfig}>
    <Dashboard />
  </ConfigProvider>
);
