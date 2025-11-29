import React from "react";

const OTPInputSlot = React.memo(({ value, onChange, onKeyDown, inputRef, isFilled, active }) => {
  return (
    <input
      ref={inputRef}
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
