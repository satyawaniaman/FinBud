"use client";
import { useState, useEffect, useRef, FC } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import {
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import InsightsIcon from "@mui/icons-material/Insights";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

//* ************** Custom imports *************** *//
import LiveTime from "@/app/components/LiveTime";
import { socket } from "@/app/middleware/socket";
import { ReduxDispatch, ReduxState } from "@/lib/redux/store";
import { setMarketStatus, setDataType } from "@/lib/redux/slices/stockSlice";
import SelectStockDay from "./SelectStockDay";
import {
  useGetStockDataQuery,
  useLazyGetOnSelecteStockDataQuery,
} from "@/lib/redux/api/stockApi";
import {
  RED,
  GREEN,
  ohlcObj,
  monthNames,
  DEFAULT_COLOR,
  determineColor,
  transformDataToSeries,
  transformSingleDataToPoint,
} from "./ChartPage";

//* ************************ ************************ *//
const StockData: FC = () => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [latestOhlc, setLatestOhlc] = useState(ohlcObj);
  const [ohlc, setOhlc] = useState(ohlcObj);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverColor, setHoverColor] = useState<string>(DEFAULT_COLOR);
  const [prevClose, setPrevClose] = useState<number>(0);
  // Flag to determine if historical data option is selected
  const [isDayHighlighted, setIsDayHighlighted] = useState<boolean>(false);

  const chartContainerRef = useRef(null);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // Search stock by url params (rtk api)
  const { data, refetch } = useGetStockDataQuery(params);

  const dispatch = useDispatch<ReduxDispatch>();
  const { marketStatus, dataType } = useSelector(
    (state: ReduxState) => state.stock
  );

  // Get historical stock data by days
  const [getHistoricalData, { data: historicalData }] =
    useLazyGetOnSelecteStockDataQuery();

  const updateOHLCData: any = (param: any) => {
    if (param.seriesData && param.seriesData.has(series)) {
      const price = param.seriesData.get(series);
      if (price) {
        setOhlc({
          open: price.open,
          high: price.high,
          low: price.low,
          close: price.close,
        });

        // determineColor function to set the color
        setHoverColor(determineColor(price.open, price.close));
        setIsHovered(true);
      } else {
        setOhlc(latestOhlc);
        setIsHovered(false);
      }
    }
  };

  const formatAndSetData = (dataToFormat: any, seriesToUpdate: any) => {
    const formattedData = transformDataToSeries(dataToFormat).reverse();
    seriesToUpdate.setData(formattedData);

    const latestDataPoint = formattedData[formattedData.length - 1];
    const secondLatestDataPoint = formattedData[formattedData.length - 2];

    if (secondLatestDataPoint?.close) {
      setPrevClose(secondLatestDataPoint?.close);
    }

    if (latestDataPoint) {
      setLatestOhlc({
        open: latestDataPoint.open,
        high: latestDataPoint.high,
        low: latestDataPoint.low,
        close: latestDataPoint.close,
      });
      setColor(determineColor(latestDataPoint.open, latestDataPoint.close));
    }
  };

  // Create new chart
  const createNewChart = () => {
    if (!chartContainerRef.current) return;

    // If chart already exists, destroy it first to prevent duplicate charts
    if (chart) {
      chart.remove();
      setChart(null);
      setSeries(null);
    }

    const container = chartContainerRef.current as HTMLDivElement;
    const newChart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "#151924" },
        textColor: DEFAULT_COLOR,
      },
      grid: {
        vertLines: { color: "#232632" },
        horzLines: { color: "#232632" },
      },
      width: container.clientWidth,
      height: container.clientHeight,
      localization: {
        priceFormatter: (price: number) => `₹${price.toFixed(2)}`,
        timeFormatter: (time: number) => {
          const dateObj = new Date(time * 1000);
          return `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        },
      },
    });

    newChart.timeScale().applyOptions({
      timeVisible: true,
      secondsVisible: false,
      barSpacing: 10,
      tickMarkFormatter: (time: number) => {
        const date = new Date(time * 1000);
        const monthName = monthNames[date.getMonth()];

        if (dataType === "historical" || isDayHighlighted) {
          return `${date.getDate().toString().padStart(2, "0")} ${monthName}`;
        } else {
          return `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        }
      },
    });

    const newSeries = newChart.addCandlestickSeries({
      upColor: GREEN,
      downColor: RED,
      borderDownColor: RED,
      borderUpColor: GREEN,
      wickDownColor: RED,
      wickUpColor: GREEN,
    });

    setChart(newChart);
    setSeries(newSeries);
  };

  useEffect(() => {
    const newData = historicalData || data;

    if (newData) {
      if (newData.marketStatus && newData.marketStatus !== marketStatus) {
        dispatch(setMarketStatus(newData.marketStatus));
      }
      if (newData.type && newData.type !== dataType) {
        dispatch(setDataType(newData.type));
      }
    }

    // Initialize chart if it doesn't exist yet
    if (chartContainerRef.current && !chart) {
      createNewChart();
    }

    if (series && (data || historicalData)) {
      // If historical data is selected to show, show selected days data
      if (isDayHighlighted && historicalData) {
        formatAndSetData(historicalData, series);
      } else if (data) {
        // If market is open show Real-Time data || if market is closed show default 7 days data
        formatAndSetData(data, series);
      }

      // Fit content after updating data
      setTimeout(() => {
        chart?.timeScale().fitContent();
      }, 50);

      // Subscribe to crosshair move to get the hovered candlestick data
      chart?.subscribeCrosshairMove((param) => {
        if (param.point && param.seriesData && param.seriesData.has(series)) {
          setIsHovered(true);
          updateOHLCData(param);
        } else {
          setIsHovered(false);
        }
      });
    }

    // Handle Sokcet connect and real time data
    socket.connect();
    socket.on("marketStatusChange", (marketStatusChange) => {
      refetch();
    });

    if (data?.marketStatus !== null && data?.marketStatus !== "closed") {
      socket.emit("selectSymbol", params.symbol);

      socket.on("symbolData", (newData) => {
        if (newData && newData.type === "live_feed") {
          // Extracting the dynamic stock key
          const stockKey = Object.keys(newData.feeds || {})[0];

          if (!stockKey) {
            console.log("No valid stock key found");
            return;
          }

          // Accessing nested OHLC data
          const ohlcData =
            newData.feeds[stockKey]?.ff?.marketFF?.marketOHLC?.ohlc;

          if (ohlcData) {
            const filteredData = ohlcData.filter(
              (item: any) => item.interval === "I1"
            );

            setPrevClose(latestOhlc.close);

            const oneMinDataPoint = filteredData[1];
            const lastDataPoint = filteredData[0];

            if (lastDataPoint) {
              setPrevClose(lastDataPoint.close);
            }

            if (oneMinDataPoint && series) {
              const formattedData = transformSingleDataToPoint(oneMinDataPoint);
              // @ts-ignore
              series?.update(formattedData);
            }

            // Save this data as the latest OHLC data
            setLatestOhlc({
              open: oneMinDataPoint.open,
              high: oneMinDataPoint.high,
              low: oneMinDataPoint.low,
              close: oneMinDataPoint.close,
            });

            // Set the color based on the latest data
            if (oneMinDataPoint.close > oneMinDataPoint.open) {
              setColor(GREEN); // Green for price up
            } else if (oneMinDataPoint.close < oneMinDataPoint.open) {
              setColor(RED); // Red for price down
            } else {
              setColor(DEFAULT_COLOR);
            }
          }
        }
      });
    }

    return () => {
      socket.disconnect();

      // Cleanup: Unsubscribe from crosshair move when the component is unmounted
      if (chart) {
        chart?.unsubscribeCrosshairMove(updateOHLCData);
      }
    };
  }, [data, chart, series, historicalData]);

  useEffect(() => {
    if (dataType && marketStatus) {
      createNewChart();
    }
  }, [dataType, marketStatus, dispatch]);
  // *****************************************************************************

  // Ensure chart is reinitialized if the container ref changes
  useEffect(() => {
    // Make sure the chart resizes if the window size changes
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        const container = chartContainerRef.current as HTMLDivElement;
        const parent = container.parentElement;

        if (parent) {
          const width = parent.clientWidth;
          const height = parent.clientHeight;

          chart.resize(width, height);
          chart.timeScale().fitContent();
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // Call once to ensure proper sizing on initial render
    setTimeout(handleResize, 200);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chart]);

  // Percentage change of current data
  const percentageChangeValue =
    ((latestOhlc.close - prevClose) / prevClose) * 100;
  // Price diffrence between last data and new data
  const priceChangeValue = latestOhlc.close - prevClose;

  // Update title based on current values
  useEffect(() => {
    const prefix = percentageChangeValue > 0 ? "+" : "";

    const newTitle = `${params.market} : ${
      params.symbol
    } (${prefix}${percentageChangeValue.toFixed(2)}%)`;

    document.title = newTitle;
    document.body.style.backgroundColor = "red !important";

    return () => {
      document.title = "Stock Trading Platform";
    };
  }, [percentageChangeValue]);

  const handleDayChange = (day: string) => {
    const symbol = params.symbol;
    getHistoricalData({ symbol, day });
  };

  const handleActiveDay = (bool: boolean) => {
    setIsDayHighlighted(bool);
  };

  // Navigate to insights page
  const navigateToInsights = () => {
    router.push(`/insights/${params.market}/${params.symbol}`);
  };

  // Navigate to Upstox chart page for the specific stock
  const navigateToBuy = () => {
    // Get the symbol as string (handle potential array from params)
    const symbolStr = Array.isArray(params.symbol)
      ? params.symbol[0]
      : params.symbol;

    // Format the symbol appropriately
    const formattedSymbol = symbolStr.toUpperCase();

    // Stock token mapping for Upstox Pro
    const stockTokens: Record<string, string> = {
      HDFC: "4963",
      RELIANCE: "2885",
      TCS: "11536",
      INFY: "1594",
      WIPRO: "3787",
    };

    // Get the token for the current stock
    const token = stockTokens[formattedSymbol] || "0";

    // Create the Upstox URL with the current stock symbol - just charts without buy action
    const upstoxUrl = `https://pro.upstox.com/charts/${token}`;

    window.open(upstoxUrl, "_blank");
  };

  return (
    <Grid container sx={{ mt: 8 }} spacing={2}>
      <Grid item xs={12} md={8}>
        {/* Chart Navigation Bar */}
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
            <IconButton
              color="primary"
              sx={{ backgroundColor: "rgba(79, 195, 247, 0.1)" }}
            >
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insights">
            <IconButton onClick={navigateToInsights}>
              <InsightsIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        <Box
          sx={{
            width: "100%",
            height: "80vh",
            minHeight: "500px",
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundColor: "#151924",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            ref={chartContainerRef}
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <Box
            className="ohlcInfo"
            display="flex"
            gap={2}
            sx={{
              background: "rgba(21, 25, 36, 0.8)",
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              p: 1,
              borderRadius: "0.5rem",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography variant="body2">
              Open:{" "}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered ? ohlc.open.toFixed(2) : latestOhlc.open.toFixed(2)}
              </span>
            </Typography>
            <Typography variant="body2">
              High:{" "}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered ? ohlc.high.toFixed(2) : latestOhlc.high.toFixed(2)}
              </span>
            </Typography>
            <Typography variant="body2">
              Low:{" "}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered ? ohlc.low.toFixed(2) : latestOhlc.low.toFixed(2)}
              </span>
            </Typography>
            <Typography variant="body2">
              Close:{" "}
              <span style={{ color: isHovered ? hoverColor : color }}>
                {isHovered
                  ? ohlc.close.toFixed(2)
                  : latestOhlc.close.toFixed(2)}
              </span>
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={3.8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid
              item
              sx={{
                backgroundColor: "rgb(21, 25, 36, 0.8)",
                border: "1px solid rgba( 255, 255, 255, 0.10 )",
                backdropFilter: "blur(5px)",
                borderRadius: "1rem",
                p: 3.5,
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  background: "rgba( 255, 255, 255, 0.05 )",
                  border: "1px solid rgba( 255, 255, 255, 0.10 )",
                  backdropFilter: "blur(5px)",
                  textAlign: "center",
                  borderRadius: "1rem",
                  mb: 2,
                  padding: 1,
                  fontFamily: "inherit",
                }}
              >
                {params.market} : {params.symbol}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    background: "rgba( 255, 255, 255, 0.03 )",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    backdropFilter: "blur(5px)",
                    textAlign: "center",
                    borderRadius: "1rem",
                    padding: 1,
                    px: 2,
                    fontWeight: "600",
                    fontFamily: "inherit",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "",
                    },
                  }}
                >
                  Today {new Date().toDateString()}
                </Typography>

                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    background: "rgba( 255, 255, 255, 0.03 )",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    backdropFilter: "blur(5px)",
                    textAlign: "center",
                    borderRadius: "1rem",
                    padding: 1,
                    px: 2,
                    fontWeight: "600",
                    fontFamily: "inherit",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "",
                    },
                  }}
                >
                  <LiveTime />
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "rgba( 255, 255, 255, 0.03 )",
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    fontFamily: "inherit",
                    fontWeight: "600",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "",
                    },
                  }}
                >
                  Market
                </Typography>
                <Box
                  className={marketStatus === "open" ? "blob" : "blob_closed"}
                ></Box>
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    fontFamily: "inherit",
                    fontWeight: "600",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "",
                    },
                  }}
                >
                  {marketStatus}
                </Typography>
              </Box>
            </Grid>
            <Box
              sx={{
                backgroundColor: "rgb(21, 25, 36, 0.8)",
                border: "1px solid rgba( 255, 255, 255, 0.10 )",
                backdropFilter: "blur(5px)",
                borderRadius: "1rem",
                p: 3.5,
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  background: "rgba( 255, 255, 255, 0.03 )",
                  border: "1px solid rgba( 255, 255, 255, 0.10 )",
                  textAlign: "left",
                  borderRadius: "1rem",
                  my: 2,
                  padding: 1,
                  fontWeight: "600",
                }}
              >
                Latest Value: ₹{Number(latestOhlc.close).toFixed(2)}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  background: "rgba( 255, 255, 255, 0.03 )",
                  border: "1px solid rgba( 255, 255, 255, 0.10 )",
                  textAlign: "left",
                  borderRadius: "1rem",
                  mb: 2,
                  padding: 1,
                  fontWeight: "600",
                }}
              >
                Last Value: ₹{Number(prevClose).toFixed(2)}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  background: "rgba( 255, 255, 255, 0.03 )",
                  border: "1px solid rgba( 255, 255, 255, 0.10 )",
                  textAlign: "left",
                  borderRadius: "1rem",
                  mb: 2,
                  padding: 1,
                  fontWeight: "600",
                }}
              >
                Price Change:{" "}
                <span style={{ color: priceChangeValue < 0 ? RED : GREEN }}>
                  ₹ {priceChangeValue > 0 ? "+" : ""}
                  {priceChangeValue.toFixed(2)}
                </span>
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  background: "rgba( 255, 255, 255, 0.03 )",
                  border: "1px solid rgba( 255, 255, 255, 0.10 )",
                  textAlign: "left",
                  borderRadius: "1rem",
                  mb: 2,
                  padding: 1,
                  fontWeight: "600",
                }}
              >
                Percentage Change:{" "}
                <span
                  style={{ color: percentageChangeValue < 0 ? RED : GREEN }}
                >
                  {percentageChangeValue > 0 ? "+" : ""}
                  {percentageChangeValue.toFixed(2)}%
                </span>
              </Typography>
            </Box>

            {/* Buy Now Section */}
            <Box
              sx={{
                backgroundColor: "rgb(21, 25, 36, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                backdropFilter: "blur(5px)",
                borderRadius: "1rem",
                p: 3.5,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  mb: 3,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Ready to Invest?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#b2b5be",
                  mb: 3,
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Buy {params.symbol} shares at the current market price of ₹
                {Number(latestOhlc.close).toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                startIcon={<ShowChartIcon />}
                onClick={navigateToBuy}
                sx={{
                  backgroundColor: GREEN,
                  color: "white",
                  borderRadius: "2rem",
                  padding: "0.8rem 2rem",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#43a047",
                    boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                View on Upstox
              </Button>

              <Typography
                variant="caption"
                sx={{
                  color: "#b2b5be",
                  mt: 2,
                  textAlign: "center",
                  fontSize: "0.7rem",
                }}
              >
                You will be redirected to Upstox trading platform
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <SelectStockDay
        onDaySelect={handleDayChange}
        onHighlighted={handleActiveDay}
        marketStatus={marketStatus}
        dataType={dataType}
      />
    </Grid>
  );
};

export default StockData as FC;
