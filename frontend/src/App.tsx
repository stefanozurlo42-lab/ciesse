import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteLayout } from "@/components/SiteLayout";
import Home from "@/pages/Home";
import Collezioni from "@/pages/Collezioni";
import Servizi from "@/pages/Servizi";
import Preventivo from "@/pages/Preventivo";
import Contatti from "@/pages/Contatti";
import Admin from "@/pages/Admin";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collezioni" element={<Collezioni />} />
          <Route path="/servizi" element={<Servizi />} />
          <Route path="/preventivo" element={<Preventivo />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="*" element={<Home />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}
