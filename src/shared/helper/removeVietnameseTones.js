const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")     
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^0-9a-zA-Z ]/g, "")      
    .toLowerCase();
};

export default removeVietnameseTones; 