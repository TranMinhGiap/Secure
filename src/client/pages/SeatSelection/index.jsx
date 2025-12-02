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

const { Title, Text } = Typography;

const formatCurrency = (n) =>
  `${(n || 0).toLocaleString("vi-VN")}₫`;

const SeatSelectionDrawer = ({
  open,
  onClose,
  flight,
  passengers,        // object: { adults, children, infants }
  seatClass,         // "Economy" ...
  value,             // { passengerSeats, totalSeatPrice } (optional)
  onChange,          // callback khi ấn Done
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePassenger, setActivePassenger] = useState(0);

  const [selectedSeats, setSelectedSeats] = useState(
    value?.passengerSeats || {}
  );

  /* ===============================
     DANH SÁCH HÀNH KHÁCH CHỌN GHẾ 
     ===============================
     → Giữ nguyên UI
     → Chỉ loại bỏ INFANT (không cần ghế)
  */
  const passengerList = useMemo(() => {
    const arr = [];

    // Người lớn
    for (let i = 0; i < (passengers?.adults || 0); i++) {
      arr.push({ label: `Người lớn ${i + 1}`, type: "ADULT" });
    }

    // Trẻ em
    for (let i = 0; i < (passengers?.children || 0); i++) {
      arr.push({ label: `Trẻ em ${i + 1}`, type: "CHILD" });
    }

    // ❌ Không push infant — không thay đổi UI nào khác
    return arr;
  }, [passengers]);

  /* ===============================
     MAPPING
     =============================== */

  const seatTypeMap = useMemo(() => {
    const map = {};
    seatMap?.seatTypes?.forEach((t) => {
      map[t.code] = t;
    });
    return map;
  }, [seatMap]);

  const seatIndex = useMemo(() => {
    const map = {};
    seatMap?.seats?.forEach((s) => {
      map[s.seatNumber] = s;
    });
    return map;
  }, [seatMap]);

  const totalSeatPrice = useMemo(() => {
    return Object.values(selectedSeats).reduce((sum, seat) => {
      const t = seatTypeMap[seat.typeCode];
      return sum + (t?.price || 0);
    }, 0);
  }, [selectedSeats, seatTypeMap]);


  /* ===============================
     LOAD SEAT MAP FROM API
     =============================== */
  useEffect(() => {
    if (!open || !flight) return;
    fetchSeatMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flight?.id, seatClass]);

  const fetchSeatMap = async () => {
    try {
      setLoading(true);

      const res = await GET(
        `/api/v1/seats/frontend?flightScheduleId=${flight.id}&seat_class=${encodeURIComponent(
          seatClass || "ECONOMY"
        )}`
      );

      setSeatMap(res.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Không tải được sơ đồ ghế");
    } finally {
      setLoading(false);
    }
  };


  /* ===============================
     CLICK GHẾ
     =============================== */
  const handleSeatClick = (seatNumber) => {
    if (!seatIndex[seatNumber]) return;
    const seat = seatIndex[seatNumber];

    if (seat.status !== "AVAILABLE") return;

    // Tránh chọn ghế trùng cho hành khách khác
    const taken = Object.entries(selectedSeats).find(
      ([idx, s]) => s.seatNumber === seatNumber && Number(idx) !== activePassenger
    );
    if (taken) {
      messageApi.warning("Ghế này đã được chọn cho hành khách khác");
      return;
    }

    setSelectedSeats((prev) => {
      const copy = { ...prev };
      copy[activePassenger] = seat;
      return copy;
    });
  };

  /* ===============================
     DONE BUTTON
     =============================== */
  const handleDone = () => {
    onChange?.({
      passengerSeats: selectedSeats,
      totalSeatPrice,
    });
    onClose();
  };

  /* ===============================
     LOADING UI
     =============================== */
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

  /* ===============================
     FULL UI (GIỮ NGUYÊN 100%)
     =============================== */
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
              return (
                <div
                  key={index}
                  onClick={() => setActivePassenger(index)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border:
                      activePassenger === index
                        ? "1px solid #1677ff"
                        : "1px solid #eee",
                    background:
                      activePassenger === index ? "#e6f4ff" : "#fff",
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
                </div>
              );
            })}
          </div>
        </Col>

        {/* RIGHT: SEAT MAP */}
        <Col span={18} style={{ padding: 16 }}>
          {/* Legend giữ nguyên */}
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
                        const isSelected =
                          selectedSeats[activePassenger]?.seatNumber ===
                          seatNumber;
                        const isUnavailable =
                          !seat || seat.status !== "AVAILABLE";

                        const bgColor = isUnavailable
                          ? "#cbd5f5"
                          : type?.color || "#e5e7eb";

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
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: bgColor,
                                opacity: isUnavailable ? 0.5 : 1,
                                cursor: isUnavailable
                                  ? "not-allowed"
                                  : "pointer",
                                border: isSelected
                                  ? "2px solid #f97316"
                                  : "1px solid #cbd5e1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                color: "#0f172a",
                              }}
                            >
                              {isUnavailable ? "X" : col}
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
                  {formatCurrency(totalSeatPrice)}
                </Text>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Drawer>
  );
};

/* ===============================
   LEGEND — GIỮ NGUYÊN
   =============================== */
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
