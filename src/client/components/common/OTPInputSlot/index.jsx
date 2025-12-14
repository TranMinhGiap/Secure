import React from "react";

const OTPInputSlot = React.memo(({ value, onChange, onKeyDown, inputRef, isFilled, active }) => {
  return (
    <input
      ref={inputRef} // Hiểu nó lấy địa chỉ của input và truyền vào inputRef => Kiểu tham chiếu
      value={value}
      maxLength={1}
      className={`otp-input ${isFilled ? "filled" : ""} ${active ? "active" : ""}`}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={(e) => e.target.select()}
    />
  );
});

export default OTPInputSlot;
