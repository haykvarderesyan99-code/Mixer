import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import Signup from "../pages/signup";
import Login from "../pages/login";
import NotFound from "../pages/notfound";
import Layout from "./layout";
import ProfilePage from "../pages/profile";
import SettingsPage from "../pages/settings";
import FavoritesPage from "../pages/favorites";
import BotsPage from "../pages/bots";
import AboutPage from "../pages/about";
import AcademyPage from "../pages/academy";
import { AuthProvider } from "./lib/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "bots",
        element: <BotsPage />,
      },
      {
        path: "academy",
        element: <AcademyPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);


createRoot(
  document.getElementById("root")!
).render(

  <StrictMode>
    <AuthProvider><RouterProvider router={router} /></AuthProvider>
  </StrictMode>

);