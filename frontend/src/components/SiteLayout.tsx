import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";

export const SiteLayout = () => (
  <>
    <SmoothScroll />
    <div className="grain" aria-hidden="true" />
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);
