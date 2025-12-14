import { useEffect, useMemo, useState } from "react";
import {
  Drawer,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Divider,
  Skeleton,
  message,
} from "antd";
import { GET } from "../../../utils/requests";
import { io } from "socket.io-client";

const { Title, Text } = Typography;

const formatCurrency = (n) => `${(n || 0).toLocaleString("vi-VN")}₫`;

const SeatSelectionDrawer = ({
  open,
  onClose,
  flight,
  passengers,        // object: { adults, children, infants }
  seatClass,         // "Economy" ...
  value,             // { passengerSeats, totalSeatPrice } (optional)
  onChange,          // callback khi ấn Done
  bookingSessionId,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePassenger, setActivePassenger] = useState(0);

  const [selectedSeats, setSelectedSeats] = useState(
    value?.passengerSeats || {}
  );
  const [socket, setSocket] = useState(null);
  const [serverTotalSeatPrice, setServerTotalSeatPrice] = useState(null);

  /* ===============================
     DANH SÁCH HÀNH KHÁCH CHỌN GHẾ 
     ===============================
     → Giữ nguyên UI
     → Chỉ loại bỏ INFANT (không cần ghế)
  */

  // Dựa vào số lượng hành khách => chuẩn hóa thành 1 mảng object đại diện cho từng hành khách { lable: ..., type: ADULT / CHILD }
  const passengerList = useMemo(() => {
    const arr = [];

    for (let i = 0; i < (passengers?.adults || 0); i++) {
      arr.push({ label: `Người lớn ${i + 1}`, type: "ADULT" });
    }

    for (let i = 0; i < (passengers?.children || 0); i++) {
      arr.push({ label: `Trẻ em ${i + 1}`, type: "CHILD" });
    }

    // Không push infant — không thay đổi UI nào khác
    return arr;
  }, [passengers]);

  // ===============================
  // MAPPING
  // ===============================

  // Tạo ra cơ chế mapping => chỉ cần có mã loại ghế => tra ra được thông tin của loại ghế (giá , màu sắc, ...)
  const seatTypeMap = useMemo(() => {
    const map = {};
    seatMap?.seatTypes?.forEach((t) => {
      map[t.code] = t;
    });
    return map;
  }, [seatMap]);

  // Cùng tạo ra cơ chế mapping => chỉ cần có số ghế => tra ra thông tin ghế (loại ghế, status, ...)
  const seatIndex = useMemo(() => {
    const map = {};
    seatMap?.seats?.forEach((s) => {
      const flightSeatId = s.id || s.flightSeatId || s.seat_id;
      map[s.seatNumber] = { ...s, id: flightSeatId };
    });
    return map;
  }, [seatMap]);

  const totalSeatPrice = useMemo(() => {
    return Object.values(selectedSeats).reduce((sum, seat) => {
      const t = seatTypeMap[seat.typeCode];
      return sum + (t?.price || 0);
    }, 0);
  }, [selectedSeats, seatTypeMap]);

  // ===============================
  // LOAD SEAT MAP FROM API
  // ===============================
  useEffect(() => {
    console.log("Drawer open:", open, "flight:", flight, "bookingSessionId:", bookingSessionId);
    if (!open || !flight || !bookingSessionId) return;
    console.log("Fetching seat map... bookingSessionId:", bookingSessionId);
    fetchSeatMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flight?.id, seatClass, bookingSessionId]);

  // Manage socket connection lifecycle
  useEffect(() => {
    if (!open || !flight?.id || !bookingSessionId) return;

    const s = io(process.env.REACT_APP_API_URL, {
      transports: ["websocket"],
      query: {
        booking_session_id: bookingSessionId,
        flight_schedule_id: flight.id,
      },
    });

    s.on("seat:locked", () => fetchSeatMap());
    s.on("seat:unlocked", () => fetchSeatMap());
    s.on("seat:selected", () => fetchSeatMap());
    s.on("seat:removed", () => fetchSeatMap());

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [open, flight?.id, bookingSessionId]);

  const fetchSeatMap = async () => {
    try {
      setLoading(true);
      console.log("Fetching seat map for flight:", flight?.id, "seatClass:", seatClass);

      const res = await GET(
        `/api/v1/seats/frontend?flightScheduleId=${flight.id}&seat_class=${encodeURIComponent(
          seatClass || "ECONOMY"
        )}`
      );
      console.log("Seat map data received:", res.data);
      setSeatMap(res.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Không tải được sơ đồ ghế");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CLICK GHẾ
  // ===============================
  const handleSeatClick = (seatNumber) => {
    const seat = seatIndex[seatNumber];
    if (!seat || typeof seat.status !== "string") return;

    const status = seat.status.toLowerCase();
    if (status !== "available") return;

    // Prevent selecting a seat already chosen by another passenger
    const taken = Object.entries(selectedSeats).find(
      ([idx, s]) => s.seatNumber === seatNumber && Number(idx) !== activePassenger
    );
    if (taken) {
      messageApi.warning("Ghế này đã được chọn cho hành khách khác");
      return;
    }

    if (!socket) {
      // Fallback local update if socket not connected
      setSelectedSeats((prev) => ({ ...prev, [activePassenger]: seat }));
      return;
    }

    console.log("FE chọn ghế → sending flight_seat_id:", seat.id);

    socket.emit(
      "seat:select",
      {
        passenger_index: activePassenger,
        flight_seat_id: seat.id, // backend expects flight_seat_id
        account_id: null,
      },
      (resp) => {
        if (!resp?.success) {
          messageApi.error(resp?.message || "Chọn ghế thất bại");
          return;
        }

        const result = resp.data;
        const seatNum = result?.seat_selected?.seat_number;
        const pickedSeat = seatIndex[seatNum];
        if (pickedSeat) {
          setSelectedSeats((prev) => ({ ...prev, [activePassenger]: pickedSeat }));
        }
        setServerTotalSeatPrice(result.flight_seat_subtotal ?? null);
        fetchSeatMap();
      }
    );
  };

  const handleRemoveSeat = (passengerIndex) => {
    const current = selectedSeats[passengerIndex];
    if (!current) return;

    if (!socket) {
      setSelectedSeats((prev) => {
        const copy = { ...prev };
        delete copy[passengerIndex];
        return copy;
      });
      return;
    }

    socket.emit(
      "seat:remove",
      { passenger_index: passengerIndex },
      (resp) => {
        if (!resp?.success) {
          messageApi.error(resp?.message || "Bỏ ghế thất bại");
          return;
        }
        const result = resp.data;
        setSelectedSeats((prev) => {
          const copy = { ...prev };
          delete copy[passengerIndex];
          return copy;
        });
        setServerTotalSeatPrice(result.flight_seat_subtotal ?? null);
        fetchSeatMap();
      }
    );
  };

  // ===============================
  // DONE BUTTON
  // ===============================
  const handleDone = () => {
    onChange?.({
      passengerSeats: selectedSeats,
      totalSeatPrice: serverTotalSeatPrice ?? totalSeatPrice,
    });
    onClose();
  };

  /* ===============================
     LOADING UI
     =============================== */

  // Không có seatMap => hiển thị skeleton (OK)
  if (!seatMap) {
    return (
      <Drawer
        title="Chọn ghế"
        width={900}
        open={open}
        onClose={onClose}
      >
        {contextHolder}
        <Skeleton active />
      </Drawer>
    );
  }

  const { layout } = seatMap;
  const rows = layout.rows || 0;
  const columns = layout.columns || [];
  const aisles = layout.aisles || [];

  return (
    <Drawer
      title="Chọn ghế ngồi"
      width={960}
      open={open}
      onClose={onClose}
      extra={
        <Button type="primary" onClick={handleDone}>
          Done
        </Button>
      }
      styles={{
        body: { padding: 0, background: "#f7f9fb" },
      }}
    >
      {contextHolder}

      <Row style={{ height: "100%" }}>
        {/* LEFT: PASSENGER LIST */}
        <Col
          span={6}
          style={{
            borderRight: "1px solid #eee",
            background: "#fff",
            padding: 16,
          }}
        >
          <Title level={5} style={{ marginBottom: 12 }}>
            Hành khách
          </Title>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {passengerList.map((p, index) => {
              const seat = selectedSeats[index];
              const isActive = activePassenger === index;
              return (
                <div
                  key={index}
                  onClick={() => setActivePassenger(index)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: isActive ? "1px solid #1677ff" : "1px solid #eee",
                    background: isActive ? "#e6f4ff" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "0.2s",
                  }}
                >
                  <div>
                    <Text strong>{p.label}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {seat ? `Ghế ${seat.seatNumber}` : "Chưa chọn ghế"}
                    </Text>
                  </div>
                  {seat && (
                    <Button
                      size="small"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSeat(index);
                      }}
                    >
                      Bỏ ghế
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Col>

        {/* RIGHT: SEAT MAP */}
        <Col span={18} style={{ padding: 16 }}>
          <CardLegend seatTypes={seatMap.seatTypes} />

          <Divider />

          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 12,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Đầu máy bay
              </div>

              {/* Header cột */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: 10,
                  marginBottom: 4,
                }}
              >
                <div style={{ width: 24 }} />
                {columns.map((col, colIdx) => (
                  <div
                    key={col}
                    style={{
                      width: 36,
                      textAlign: "center",
                      marginRight: 4,
                    }}
                  >
                    {col}
                    {aisles.includes(colIdx + 1) && (
                      <span style={{ marginLeft: 10 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div
                style={{
                  maxHeight: "440px",
                  overflowY: "auto",
                  paddingRight: 12,
                }}
              >
                {Array.from({ length: rows }).map((_, rowIndex) => {
                  const rowNum = rowIndex + 1;
                  return (
                    <div
                      key={rowNum}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 6,
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          textAlign: "right",
                          marginRight: 8,
                          color: "#64748b",
                          fontSize: 13,
                        }}
                      >
                        {rowNum}
                      </div>

                      {columns.map((col, colIdx) => {
                        const seatNumber = `${rowNum}${col}`;
                        const seat = seatIndex[seatNumber];
                        const type = seatTypeMap[seat?.typeCode];

                        const isActive =
                          selectedSeats[activePassenger]?.seatNumber === seatNumber;

                        const isPicked = Object.entries(selectedSeats).some(
                          ([idx, s]) =>
                            s?.seatNumber === seatNumber &&
                            Number(idx) !== activePassenger
                        );

                        const isUnavailable =
                          !seat ||
                          typeof seat.status !== "string" ||
                          seat.status.toLowerCase() !== "available";

                        let bgColor = type?.color || "#e5e7eb";
                        if (isUnavailable) {
                          bgColor = "#cbd5f5";
                        } else if (isActive) {
                          bgColor = "#ffe6cc";
                        } else if (isPicked) {
                          bgColor = "#d1fadf";
                        }

                        let pickedIndex = null;
                        for (const [idx, s] of Object.entries(selectedSeats)) {
                          if (s?.seatNumber === seatNumber) {
                            pickedIndex = Number(idx);
                            break;
                          }
                        }

                        return (
                          <div
                            key={col}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: 4,
                            }}
                          >
                            <div
                              onClick={() => handleSeatClick(seatNumber)}
                              style={{
                                width: isActive ? 40 : 34,
                                height: isActive ? 40 : 34,
                                borderRadius: 8,
                                background: bgColor,
                                opacity: isUnavailable ? 0.5 : 1,
                                cursor: isUnavailable
                                  ? "not-allowed"
                                  : "pointer",
                                border: isActive
                                  ? "2.5px solid #f97316"
                                  : isPicked
                                    ? "2px solid #22c55e"
                                    : "1px solid #cbd5e1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isActive ? 15 : 12,
                                color: isActive ? "#d97706" : "#0f172a",
                                fontWeight: isActive ? 700 : 500,
                                transition:
                                  "all 0.15s cubic-bezier(.4,2.2,.2,1)",
                                boxShadow: isActive
                                  ? "0 0 0 2px #ffd8b5"
                                  : undefined,
                                zIndex: isActive ? 2 : 1,
                              }}
                            >
                              {isUnavailable
                                ? "X"
                                : pickedIndex !== null
                                  ? pickedIndex + 1
                                  : col}
                            </div>

                            {aisles.includes(colIdx + 1) && (
                              <div style={{ width: 10 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <Divider />

              {/* Total seats price */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text>Tổng tiền ghế:</Text>
                <Text strong style={{ fontSize: 16, color: "#f97316" }}>
                  {formatCurrency(serverTotalSeatPrice ?? totalSeatPrice)}
                </Text>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Drawer>
  );
};

const CardLegend = ({ seatTypes = [] }) => {
  return (
    <div
      style={{
        padding: 12,
        background: "#fff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
      }}
    >
      <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
        Loại ghế & giá
      </Title>
      <Space wrap>
        {seatTypes.map((t) => (
          <Space key={t.code}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: t.color,
                border: "1px solid #cbd5e1",
              }}
            />
            <Text>
              {t.label} · <b>{formatCurrency(t.price)}</b>
            </Text>
          </Space>
        ))}
        <Space>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: "#cbd5f5",
              border: "1px solid #cbd5e1",
            }}
          />
          <Text>Đã có người chọn</Text>
        </Space>
      </Space>
    </div>
  );
};

export default SeatSelectionDrawer;
