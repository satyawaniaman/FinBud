"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import Loader from "../components/Loader";
import { validateUser } from "@/lib/redux/slices/authSlice";

function GoogleOAuth() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<any>();

  useEffect(() => {
    const token: string | null = new URLSearchParams(
      window.location.search
    ).get("token");

    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      document.cookie = `jwtoken=${token}; max-age=36000; path=/`;

      // Update authentication state
      dispatch(validateUser({ isSignedIn: true }));

      // Redirect to the charts page instead of home page
      // Using a default stock for the initial view
      router.push("/");
    }
  }, [token, router, dispatch]);

  return <Loader />;
}

export default GoogleOAuth;
