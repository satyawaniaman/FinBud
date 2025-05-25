"use client";
import Image from "next/image";
import { useState, useEffect, FC } from "react";
import { Noto_Sans } from "next/font/google";
import { Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Container, Box, Typography, Button, Grid, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

//* ************** Custom imports *************** *//
import Footer from "./Footer";
import VideoPlayer from "./VideoPlayer";
import DefaultStocks from "./DefaultStocks";
import WithAuth, { WithAuthProps } from "../middleware/WithAuth";
import { ReduxState } from "@/lib/redux/store";
// Updated images from Unsplash for modern financial aesthetic
import IndianFlag from "../../../public/homepage/indian_flag.png";

// Google NOTO Font
const NotoFont = Noto_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

// Modern stock trading images
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop";
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop";
const REALTIME_IMAGE =
  "https://images.unsplash.com/photo-1642543348745-03b1219733d9?q=80&w=2069&auto=format&fit=crop";
const HISTORICAL_IMAGE =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop";

const HomePage: FC<WithAuthProps> = ({ isAuthenticated }) => {
  const [showStocksList, setShowStocksList] = useState<boolean>(false);
  const router = useRouter();
  const { isSignedIn } = useSelector((state: ReduxState) => state.auth);

  useEffect(() => {
    if (showStocksList) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showStocksList]);

  const handleStocksList = () => {
    if (!isAuthenticated && !isSignedIn) {
      router.push("/signup");
      return;
    }
    setShowStocksList((prev) => !prev);
  };

  const getStateFromStocks = (data: boolean) => {
    setShowStocksList(data);
  };

  // MUI media queries
  const theme = useTheme();
  // 'sm' means screens up to 600px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ background: "#0c1031" }}>
      <Container
        style={{ maxWidth: "100%" }}
        disableGutters
        className={NotoFont.className}
      >
        <Box
          style={
            showStocksList ? { filter: "blur(5px)", pointerEvents: "none" } : {}
          }
        >
          {/* Hero Section - Redesigned */}
          <Box
            sx={{
              position: "relative",
              height: "100vh",
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0c1031 0%, #1a1e3c 100%)",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: "10%",
                right: "5%",
                width: "300px",
                height: "300px",
                background: "linear-gradient(135deg, #4fc3f7 0%, #00796b 100%)",
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                filter: "blur(60px)",
                opacity: 0.4,
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "10%",
                left: "10%",
                width: "250px",
                height: "250px",
                background: "linear-gradient(135deg, #81c784 0%, #43a047 100%)",
                borderRadius: "50%",
                filter: "blur(70px)",
                opacity: 0.3,
                zIndex: 1,
              }}
            />

            {/* Content overlay */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                alignItems: "center",
                justifyContent: "space-between",
                px: {
                  xs: 4,
                  md: 10,
                },
                width: "100%",
              }}
            >
              {/* Left Side - Text Content */}
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "50%",
                  },
                  mb: {
                    xs: 5,
                    md: 0,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label="Features"
                    sx={{
                      backgroundColor: "rgba(144, 202, 249, 0.2)",
                      color: "#90CAF9",
                      mb: 2,
                      fontSize: "0.8rem",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: {
                      xs: "2.5rem",
                      md: "3.5rem",
                    },
                    fontFamily: "inherit",
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  Our services are designed to help you succeed
                </Typography>

                <Typography
                  sx={{
                    color: "#b2b5be",
                    fontWeight: 400,
                    fontSize: {
                      xs: "1rem",
                      md: "1.2rem",
                    },
                    fontFamily: "inherit",
                    mb: 4,
                    maxWidth: "80%",
                  }}
                >
                  Stay in the loop with real-time market updates. Get
                  lightning-fast notifications about stock prices, market
                  trends, and vital insights that can impact your wealth.
                </Typography>

                <Button
                  startIcon={<Search sx={{ color: "white" }} />}
                  sx={{
                    backgroundColor: "#4fc3f7",
                    borderRadius: "2rem",
                    color: "white",
                    textTransform: "none",
                    outline: "none",
                    border: "none",
                    padding: "0.8rem 2rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#03a9f4",
                      boxShadow: "0 4px 20px rgba(79, 195, 247, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleStocksList}
                >
                  Get Started
                </Button>
              </Box>

              {/* Right Side - Image or Visualization */}
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "45%",
                  },
                  height: {
                    xs: "300px",
                    md: "400px",
                  },
                  position: "relative",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Image
                  src={HERO_IMAGE}
                  alt="Trading platform preview"
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                />
              </Box>
            </Box>

            {/* Stats Section */}
            <Box
              sx={{
                position: "absolute",
                bottom: "5%",
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Grid
                container
                sx={{
                  maxWidth: "1200px",
                  mx: "auto",
                  px: {
                    xs: 4,
                    md: 0,
                  },
                  gap: {
                    xs: 2,
                    md: 0,
                  },
                }}
                spacing={2}
              >
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: {
                        xs: "center",
                        md: "flex-start",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4fc3f7",
                        fontWeight: 700,
                        fontSize: "2.5rem",
                      }}
                    >
                      500,000+
                    </Typography>
                    <Typography sx={{ color: "#b2b5be", fontSize: "0.9rem" }}>
                      Satisfied users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: {
                        xs: "center",
                        md: "flex-start",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4fc3f7",
                        fontWeight: 700,
                        fontSize: "2.5rem",
                      }}
                    >
                      50+
                    </Typography>
                    <Typography sx={{ color: "#b2b5be", fontSize: "0.9rem" }}>
                      Global exchanges
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: {
                        xs: "center",
                        md: "flex-start",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4fc3f7",
                        fontWeight: 700,
                        fontSize: "2.5rem",
                      }}
                    >
                      1,000+
                    </Typography>
                    <Typography sx={{ color: "#b2b5be", fontSize: "0.9rem" }}>
                      Daily transactions
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {showStocksList && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              position: "absolute",
              top: 0,
              zIndex: 20,
            }}
          >
            <DefaultStocks getStateFromStocks={setShowStocksList} />
          </Box>
        )}
      </Container>

      {/* Section Title */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: {
            xs: "2rem",
            md: "3.5rem",
          },
          fontFamily: "inherit",
          textAlign: "center",
          mt: 12,
          mb: 6,
          p: {
            xs: 1,
            md: 4,
          },
          letterSpacing: "0.05rem",
          background: "linear-gradient(90deg, #4fc3f7, #81c784)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Revamp Your Trading Experience
      </Typography>

      {/* Video player section */}
      <VideoPlayer />

      {/* Featured section with Indian stocks */}
      <Box
        sx={{
          mx: "auto",
          my: 12,
          px: {
            xs: 3,
            md: 10,
          },
          py: 6,
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Image
            src={IndianFlag}
            alt="Indian flag"
            style={{
              height: "60px",
              width: "auto",
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "1.8rem",
                md: "2.2rem",
              },
              color: "white",
              fontFamily: "inherit",
            }}
          >
            Indian Stocks
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: "#b2b5be",
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: {
              xs: "1rem",
              md: "1.1rem",
            },
            fontFamily: "inherit",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          Dive into the world of Indian stock markets with us. Our platform
          primarily focuses on offering data and insights from the National
          Stock Exchange (NSE). From the bustling activity of blue-chip stocks
          to the potential hidden gems in the small-cap universe, we provide
          comprehensive coverage of the Indian equities market. Stay updated,
          make informed decisions, and harness the potential of one of the
          world&apos;s fastest-growing economies.
        </Typography>
      </Box>

      {/* What We Offer Section */}
      <Box
        sx={{
          mx: "auto",
          px: {
            xs: 3,
            md: 10,
          },
          maxWidth: "1200px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "2rem",
              md: "3rem",
            },
            fontFamily: "inherit",
            textAlign: "center",
            mb: 8,
            color: "white",
          }}
        >
          What We Offer
        </Typography>

        {/* Features cards */}
        <Grid
          container
          spacing={4}
          sx={{
            mb: 12,
          }}
        >
          {/* Real-time data card */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                p: 4,
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(79, 195, 247, 0.1)",
                  borderColor: "rgba(79, 195, 247, 0.3)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "1.5rem",
                    md: "1.8rem",
                  },
                  fontFamily: "inherit",
                  color: "#4fc3f7",
                  mb: 3,
                }}
              >
                Real-Time Data
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  color: "#b2b5be",
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Dive deep into the world of stocks and stay ahead with
                up-to-the-second market data. Our platform ensures you&apos;re
                always informed, allowing you to make swift decisions backed by
                timely and accurate information.
              </Typography>

              <Box
                sx={{
                  mt: "auto",
                  height: "200px",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={REALTIME_IMAGE}
                  alt="Real Time Data Image"
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Historical data card */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                p: 4,
                display: "flex",
                flexDirection: "column",
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(129, 199, 132, 0.1)",
                  borderColor: "rgba(129, 199, 132, 0.3)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "1.5rem",
                    md: "1.8rem",
                  },
                  fontFamily: "inherit",
                  color: "#81c784",
                  mb: 3,
                }}
              >
                Historical Data
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  color: "#b2b5be",
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Delve into the vast archives of stock market history, exploring
                trends, patterns, and pivotal moments. Our platform offers a
                comprehensive look back, equipping you with the insights to
                forecast and strategize for future market movements.
              </Typography>

              <Box
                sx={{
                  mt: "auto",
                  height: "200px",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={HISTORICAL_IMAGE}
                  alt="Historical Data Image"
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Call to action section */}
      <Box
        sx={{
          position: "relative",
          my: 12,
          py: {
            xs: 8,
            md: 12,
          },
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(12, 16, 49, 0.8) 0%, rgba(26, 30, 60, 0.8) 100%)",
            zIndex: 1,
          }}
        />

        {/* Background image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Image
            src={BANNER_IMAGE}
            alt="Background"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.3,
            }}
            priority
          />
        </Box>

        {/* Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "2rem",
                md: "3.5rem",
              },
              color: "white",
              mb: 3,
              maxWidth: "800px",
            }}
          >
            Unleash the power of trading with us
          </Typography>

          <Typography
            sx={{
              color: "#b2b5be",
              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },
              mb: 6,
              maxWidth: "700px",
            }}
          >
            Explore a new level of trading performance with our global stock
            exchange platform. With over 500,000 satisfied users, gain access to
            real-time market data and advanced analytical tools.
          </Typography>

          <Button
            sx={{
              backgroundColor: "#4fc3f7",
              borderRadius: "2rem",
              color: "white",
              textTransform: "none",
              outline: "none",
              border: "none",
              padding: "0.8rem 2.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#03a9f4",
                boxShadow: "0 4px 20px rgba(79, 195, 247, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={handleStocksList}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Trusted by section */}
      <Box
        sx={{
          mx: "auto",
          px: {
            xs: 3,
            md: 10,
          },
          maxWidth: "1200px",
          mb: 12,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#b2b5be",
            fontSize: "0.9rem",
            mb: 2,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          They wrote about us
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
            mt: 3,
            opacity: 0.7,
          }}
        >
          <Typography
            sx={{ color: "#b2b5be", fontWeight: 700, fontSize: "1.5rem" }}
          >
            Forbes
          </Typography>
          <Typography
            sx={{ color: "#b2b5be", fontWeight: 700, fontSize: "1.5rem" }}
          >
            Bloomberg
          </Typography>
          <Typography
            sx={{ color: "#b2b5be", fontWeight: 700, fontSize: "1.5rem" }}
          >
            TIME
          </Typography>
          <Typography
            sx={{ color: "#b2b5be", fontWeight: 700, fontSize: "1.5rem" }}
          >
            The Wall Street Journal
          </Typography>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default WithAuth(HomePage, true);
