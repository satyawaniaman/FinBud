"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Paper, Button, Container } from "@mui/material";
import Link from "next/link";

export default function OAuthDebug() {
  const [cookies, setCookies] = useState<string>("");
  const [urlParams, setUrlParams] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    setCookies(document.cookie);

    // Convert search params to object safely
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setUrlParams(params);
  }, [searchParams]);

  return (
    <Container sx={{ mt: 10, mb: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          OAuth Debug Information
        </Typography>

        {error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "#ffebee", borderRadius: 1 }}>
            <Typography variant="h6" color="error">
              Error: {error}
            </Typography>
          </Box>
        )}

        <Typography variant="h6">Current URL Params:</Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            overflow: "auto",
            mb: 3,
          }}
        >
          {JSON.stringify(urlParams, null, 2)}
        </Box>

        <Typography variant="h6">Cookies:</Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            overflow: "auto",
            mb: 3,
          }}
        >
          {cookies || "No cookies found"}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button variant="contained" component={Link} href="/">
            Go to Homepage
          </Button>

          <Button
            variant="contained"
            color="secondary"
            component={Link}
            href="/"
          >
            Try to Access Charts
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              document.cookie = "jwtoken=; Max-Age=-99999999;";
              setCookies("");
              window.location.reload();
            }}
          >
            Clear Cookies
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
