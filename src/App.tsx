import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Anomalies from "./pages/Anomalies";
import Incidents from "./pages/Incidents";
import NotFound from "./pages/NotFound";

import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/sign-in/*"
            element={
              <div className="flex h-screen w-full items-center justify-center">
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="flex h-screen w-full items-center justify-center">
                <SignUp routing="path" path="/sign-up" />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <>
                <SignedIn>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="alerts" element={<Alerts />} />
                      <Route path="anomalies" element={<Anomalies />} />
                      <Route path="incidents" element={<Incidents />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
