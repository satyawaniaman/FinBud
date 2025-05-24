"use client";
import { Box, Typography } from "@mui/material";
// @ts-ignore
import STP from "../../../public/video/STP.mp4";

const VideoPlayer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0c1031 0%, #1a1e3c 100%)",
        padding: {
          xs: "3rem 1rem",
          md: "5rem 3rem",
        },
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "linear-gradient(135deg, #4fc3f7 0%, #00796b 100%)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          filter: "blur(70px)",
          opacity: 0.15,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "350px",
          height: "350px",
          background: "linear-gradient(135deg, #81c784 0%, #43a047 100%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "1.5rem",
              md: "2rem",
            },
            color: "white",
            textAlign: "center",
            mb: 3,
          }}
        >
          Why choose our trading platform?
        </Typography>

        <Typography
          sx={{
            color: "#b2b5be",
            fontWeight: 400,
            fontSize: {
              xs: "1rem",
              md: "1.1rem",
            },
            textAlign: "center",
            maxWidth: "800px",
            mb: 6,
          }}
        >
          Experience real-time market data, advanced charting tools, and
          seamless trading in one unified platform.
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: "1000px",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "12px",
              padding: "2px",
              background: "linear-gradient(45deg, #4fc3f7, #81c784)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              zIndex: 2,
            },
          }}
        >
          <video
            preload="metadata"
            width="100%"
            height="auto"
            autoPlay
            muted
            loop
            style={{
              borderRadius: "10px",
              display: "block",
              objectFit: "cover",
            }}
          >
            <source src={STP} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
