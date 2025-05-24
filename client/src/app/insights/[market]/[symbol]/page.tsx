"use client";
import { useState, useEffect, FC } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import InsightsIcon from "@mui/icons-material/Insights";
import { useDispatch, useSelector } from "react-redux";

//* ************** Custom imports *************** *//
import { ReduxDispatch, ReduxState } from "@/lib/redux/store";
import {
  useGetStockDataQuery,
  useLazyGetOnSelecteStockDataQuery,
} from "@/lib/redux/api/stockApi";
import { RED, GREEN } from "@/app/chart/[market]/[symbol]/ChartPage";

const InsightsPage: FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  const market = params.market as string;

  // Get stock data
  const { data, isLoading } = useGetStockDataQuery(params);

  // Generate metrics for the insights based on actual stock data
  const generateMetrics = () => {
    if (!data)
      return {
        fundamentals: {
          rating: "B+",
          status: "Good",
          earningsGrowth: 62.8,
          revenueGrowth: 75.4,
          profitMargin: 58.1,
          debtToEquity: 45.2,
          peRatio: 83.5,
          marketCap: 70.3,
        },
        technical: {
          signal: "Buy",
          rsi: (Math.random() * 30 + 40).toFixed(2),
          macd: (Math.random() * 2 - 1).toFixed(2),
          adx: (Math.random() * 20 + 15).toFixed(2),
          dayChanges: Array(7)
            .fill(0)
            .map(() => Math.random() * 10 - 5),
        },
        sentiment: {
          overall: "Bullish",
          score: 85,
          positive: 78,
          negative: 22,
          socialMedia: {
            twitter: "+24.6%",
            reddit: "+12.8%",
            stocktwits: "+31.5%",
          },
        },
      };

    // In a real implementation, you would calculate these from actual data
    const latestClose = data?.candles?.[0]?.[4] || 0;
    const prevClose = data?.candles?.[1]?.[4] || 0;
    const percentChange = prevClose
      ? ((latestClose - prevClose) / prevClose) * 100
      : 0;

    // More positive metrics if stock is up, more negative if down
    const sentiment =
      percentChange > 0
        ? {
            overall: "Bullish",
            score: Math.min(85 + percentChange * 2, 98),
            positive: Math.min(78 + percentChange, 95),
            negative: Math.max(22 - percentChange, 5),
            socialMedia: {
              twitter: "+24.6%",
              reddit: "+12.8%",
              stocktwits: "+31.5%",
            },
          }
        : {
            overall: percentChange < -5 ? "Bearish" : "Neutral",
            score: Math.max(50 + percentChange * 3, 20),
            positive: Math.max(50 + percentChange * 2, 30),
            negative: Math.min(50 - percentChange * 2, 70),
            socialMedia: {
              twitter: percentChange < -5 ? "-18.3%" : "+5.4%",
              reddit: percentChange < -5 ? "-15.7%" : "+3.2%",
              stocktwits: percentChange < -5 ? "-22.1%" : "+7.8%",
            },
          };

    return {
      fundamentals: {
        rating:
          percentChange > 3
            ? "A+"
            : percentChange > 0
              ? "A"
              : percentChange > -3
                ? "B+"
                : "B",
        status:
          percentChange > 3
            ? "Outstanding"
            : percentChange > 0
              ? "Strong"
              : percentChange > -3
                ? "Good"
                : "Average",
        earningsGrowth: 62.8 + percentChange * 2,
        revenueGrowth: 75.4 + percentChange,
        profitMargin: 58.1 + percentChange / 2,
        debtToEquity: 45.2,
        peRatio: 83.5,
        marketCap: 70.3 + percentChange,
      },
      technical: {
        signal:
          percentChange > 2
            ? "Strong Buy"
            : percentChange > 0
              ? "Buy"
              : percentChange > -2
                ? "Hold"
                : "Sell",
        rsi: (Math.random() * 30 + 40).toFixed(2),
        macd: (percentChange / 10).toFixed(2),
        adx: (Math.random() * 20 + 15).toFixed(2),
        dayChanges: Array(7)
          .fill(0)
          .map((_, i) => (i === 6 ? percentChange : Math.random() * 6 - 3)),
      },
      sentiment,
    };
  };

  const metrics = generateMetrics();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Navigate back to chart page
  const navigateToChart = () => {
    router.push(`/chart/${market}/${symbol}`);
  };

  return (
    <Grid container sx={{ mt: 8, px: 3 }} spacing={2} justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        {/* Navigation Bar */}
        <Paper
          sx={{
            mb: 3,
            p: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: "8px",
            backgroundColor: "rgba(21, 25, 36, 0.8)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Tooltip title="Chart View">
            <IconButton onClick={navigateToChart}>
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insights">
            <IconButton
              color="primary"
              sx={{ backgroundColor: "rgba(79, 195, 247, 0.1)" }}
            >
              <InsightsIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        <Box
          sx={{
            backgroundColor: "rgb(21, 25, 36, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(5px)",
            borderRadius: "1rem",
            p: 3,
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "white",
              }}
            >
              {market}: {symbol} Insights
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#b2b5be" }}>
              Update frequency: 24 hours
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              mb: 4,
              "& .MuiTab-root": {
                color: "#b2b5be",
                textTransform: "none",
                fontSize: "1rem",
                minWidth: "auto",
                mx: 1,
                "&.Mui-selected": {
                  color: "white",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#4fc3f7",
              },
            }}
          >
            <Tab label="Fundamental" />
            <Tab label="Technical" />
            <Tab label="Sentimental" />
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {tabValue === 0 && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Chip
                      label={metrics.fundamentals.rating}
                      sx={{
                        backgroundColor: "rgba(129, 199, 132, 0.2)",
                        color: "#81c784",
                        fontWeight: "bold",
                        mr: 1.5,
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#81c784",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {metrics.fundamentals.status}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#b2b5be",
                      fontSize: "1rem",
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {symbol} demonstrates strong financial performance with
                    consistent revenue growth and solid profit margins. The
                    company has maintained a healthy balance sheet and shows
                    potential for continued market expansion.
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      mb: 3,
                    }}
                  >
                    Financial Metrics
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Earnings Growth</span>
                      <span style={{ color: "#81c784" }}>
                        {metrics.fundamentals.earningsGrowth.toFixed(1)}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metrics.fundamentals.earningsGrowth, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#81c784",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Revenue Growth</span>
                      <span style={{ color: "#81c784" }}>
                        {metrics.fundamentals.revenueGrowth.toFixed(1)}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metrics.fundamentals.revenueGrowth, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#4fc3f7",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Profit Margin</span>
                      <span style={{ color: "#81c784" }}>
                        {metrics.fundamentals.profitMargin.toFixed(1)}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metrics.fundamentals.profitMargin, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#81c784",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Debt to Equity</span>
                      <span
                        style={{
                          color:
                            metrics.fundamentals.debtToEquity > 70
                              ? RED
                              : "#81c784",
                        }}
                      >
                        {metrics.fundamentals.debtToEquity.toFixed(1)}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metrics.fundamentals.debtToEquity, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            metrics.fundamentals.debtToEquity > 70
                              ? RED
                              : "#81c784",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>P/E Ratio (Relative to Sector)</span>
                      <span
                        style={{
                          color:
                            metrics.fundamentals.peRatio > 90 ? RED : "#81c784",
                        }}
                      >
                        {metrics.fundamentals.peRatio.toFixed(1)}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metrics.fundamentals.peRatio, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            metrics.fundamentals.peRatio > 90 ? RED : "#81c784",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Market Cap (Sector Position)</span>
                      <span style={{ color: "#81c784" }}>
                        {metrics.fundamentals.marketCap.toFixed(1)}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metrics.fundamentals.marketCap, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#4fc3f7",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Chip
                    label={metrics.technical.signal}
                    sx={{
                      backgroundColor: "rgba(129, 199, 132, 0.2)",
                      color: "#81c784",
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#b2b5be",
                      fontSize: "1rem",
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    Technical indicators suggest{" "}
                    {metrics.technical.signal === "Buy" ||
                    metrics.technical.signal === "Strong Buy"
                      ? "a bullish trend with strong momentum indicators and positive moving averages crossover"
                      : "a cautious approach with mixed signals from key indicators"}
                    . The stock has{" "}
                    {metrics.technical.signal === "Buy" ||
                    metrics.technical.signal === "Strong Buy"
                      ? "broken through key resistance levels"
                      : "struggled to maintain momentum"}
                    .
                  </Typography>

                  <Typography variant="h6" sx={{ color: "white", mb: 3 }}>
                    7-Day Performance
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 4,
                      height: "150px",
                    }}
                  >
                    {metrics.technical.dayChanges.map((change, index) => (
                      <Box
                        key={index}
                        sx={{
                          textAlign: "center",
                          width: "13%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            height: "80%",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: "60%",
                              height: `${Math.min(Math.abs(change) * 8, 100)}%`,
                              backgroundColor: change >= 0 ? GREEN : RED,
                              borderRadius: "3px 3px 0 0",
                              minHeight: 5,
                              position: "relative",
                            }}
                          >
                            <Typography
                              sx={{
                                position: "absolute",
                                top: change >= 0 ? -25 : -25,
                                bottom: "auto",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                                color: change >= 0 ? GREEN : RED,
                              }}
                            >
                              {change >= 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.8rem", color: "#b2b5be", mt: 1 }}
                        >
                          Day {index + 1}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Typography variant="h6" sx={{ color: "white", mb: 3 }}>
                    Technical Indicators
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#b2b5be", mb: 1 }}
                        >
                          RSI (14)
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            color:
                              parseFloat(metrics.technical.rsi) > 70
                                ? RED
                                : parseFloat(metrics.technical.rsi) < 30
                                  ? GREEN
                                  : "white",
                          }}
                        >
                          {metrics.technical.rsi}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.8rem", color: "#b2b5be", mt: 1 }}
                        >
                          {parseFloat(metrics.technical.rsi) > 70
                            ? "Overbought"
                            : parseFloat(metrics.technical.rsi) < 30
                              ? "Oversold"
                              : "Neutral"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#b2b5be", mb: 1 }}
                        >
                          MACD
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            color:
                              parseFloat(metrics.technical.macd) > 0
                                ? GREEN
                                : RED,
                          }}
                        >
                          {metrics.technical.macd}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.8rem", color: "#b2b5be", mt: 1 }}
                        >
                          {parseFloat(metrics.technical.macd) > 0
                            ? "Bullish"
                            : "Bearish"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#b2b5be", mb: 1 }}
                        >
                          ADX
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            color:
                              parseFloat(metrics.technical.adx) > 25
                                ? GREEN
                                : "white",
                          }}
                        >
                          {metrics.technical.adx}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.8rem", color: "#b2b5be", mt: 1 }}
                        >
                          {parseFloat(metrics.technical.adx) > 25
                            ? "Strong Trend"
                            : "Weak Trend"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Chip
                    label={metrics.sentiment.overall}
                    sx={{
                      backgroundColor:
                        metrics.sentiment.overall === "Bullish"
                          ? "rgba(129, 199, 132, 0.2)"
                          : metrics.sentiment.overall === "Bearish"
                            ? "rgba(244, 67, 54, 0.2)"
                            : "rgba(255, 193, 7, 0.2)",
                      color:
                        metrics.sentiment.overall === "Bullish"
                          ? "#81c784"
                          : metrics.sentiment.overall === "Bearish"
                            ? RED
                            : "#ffc107",
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#b2b5be",
                      fontSize: "1rem",
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    Market sentiment is{" "}
                    {metrics.sentiment.overall === "Bullish"
                      ? "overwhelmingly positive with strong institutional backing"
                      : metrics.sentiment.overall === "Bearish"
                        ? "generally negative with concerns about future performance"
                        : "mixed with divergent opinions about future prospects"}
                    . Social media mentions and engagement metrics show{" "}
                    {metrics.sentiment.overall === "Bullish"
                      ? "increasing interest from retail investors"
                      : metrics.sentiment.overall === "Bearish"
                        ? "growing skepticism from retail investors"
                        : "balanced discussions among retail investors"}
                    .
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "white" }}>
                      Sentiment Score
                    </Typography>
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={metrics.sentiment.score}
                        size={80}
                        thickness={5}
                        sx={{
                          color:
                            metrics.sentiment.score > 70
                              ? "#81c784"
                              : metrics.sentiment.score < 40
                                ? RED
                                : "#ffc107",
                          "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: "bold" }}
                        >
                          {metrics.sentiment.score}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Positive mentions</span>
                      <span style={{ color: "#81c784" }}>
                        {metrics.sentiment.positive}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.sentiment.positive}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#81c784",
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>Negative mentions</span>
                      <span style={{ color: RED }}>
                        {metrics.sentiment.negative}%
                      </span>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.sentiment.negative}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: RED,
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ color: "white", mb: 3 }}>
                    Social Media Engagement
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#b2b5be", mb: 1 }}
                        >
                          Twitter
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            color:
                              metrics.sentiment.overall === "Bullish"
                                ? GREEN
                                : metrics.sentiment.overall === "Bearish"
                                  ? RED
                                  : "white",
                          }}
                        >
                          {metrics.sentiment.socialMedia?.twitter || "+24.6%"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#b2b5be", mb: 1 }}
                        >
                          Reddit
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            color:
                              metrics.sentiment.overall === "Bullish"
                                ? GREEN
                                : metrics.sentiment.overall === "Bearish"
                                  ? RED
                                  : "white",
                          }}
                        >
                          {metrics.sentiment.socialMedia?.reddit || "+12.8%"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#b2b5be", mb: 1 }}
                        >
                          StockTwits
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.5rem",
                            color:
                              metrics.sentiment.overall === "Bullish"
                                ? GREEN
                                : metrics.sentiment.overall === "Bearish"
                                  ? RED
                                  : "white",
                          }}
                        >
                          {metrics.sentiment.socialMedia?.stocktwits ||
                            "+31.5%"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default InsightsPage;
