// import { Image, Button, Space, Flex } from 'antd';
// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { FreeMode } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import { useState } from 'react';

// const ImageDetail = ({ images }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [swiper, setSwiper] = useState(null);
//   const visibleSlides = 5;
//   const middleOffset = Math.floor((visibleSlides - 1) / 2); // = 2 khi visible=5

//   const handleThumbnailClick = (index) => {
//     setCurrentIndex(index);

//     if (swiper && typeof swiper.slideTo === 'function') {
//       let targetSlide = 0;

//       // Logic: Canh giữa nếu đủ ảnh hai bên
//       if (index >= middleOffset && index <= images.length - 1 - middleOffset) {
//         targetSlide = index - middleOffset;
//       } else if (index < middleOffset) {
//         targetSlide = 0; // đầu
//       } else {
//         targetSlide = images.length - visibleSlides; // cuối
//       }

//       // Thêm tốc độ 400ms để trượt mượt
//       swiper.slideTo(targetSlide, 400);
//     }
//   };

//   const goPrev = () => {
//     const newIndex = Math.max(0, currentIndex - 1);
//     handleThumbnailClick(newIndex);
//   };

//   const goNext = () => {
//     const newIndex = Math.min(images.length - 1, currentIndex + 1);
//     handleThumbnailClick(newIndex);
//   };

//   return (
//     <Flex vertical align='center'>
//       {/* Ảnh lớn với overlay bottom-right */}
//       <Flex style={{ marginBottom: '16px', width: "100%", aspectRatio: '1/1', position: 'relative', overflow: 'hidden', borderRadius: 12, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
//         <Image
//           width='100%'
//           height='100%'
//           src={images[currentIndex]}
//           preview={true}
//           style={{
//             objectFit: 'cover',
//             transition: 'opacity 0.3s ease-in-out',
//             opacity: 1,
//           }}
//           key={images[currentIndex]} // đảm bảo re-render khi đổi ảnh
//         />

//         {/* Overlay bottom-right */}
//         <Space
//           style={{ background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: "8px 12px", borderRadius: 20, position: "absolute", bottom: 12, right: 12 }}
//           align='center'
//         >
//           <Button
//             icon={<LeftOutlined />}
//             onClick={goPrev}
//             size="small"
//             shape="circle"
//             style={{
//               background: 'transparent',
//               color: 'white',
//               border: 'none',
//               width: '24px',
//               height: '24px',
//             }}
//           />
//           <span style={{ fontWeight: 'bold' }}>
//             {currentIndex + 1}/{images.length}
//           </span>
//           <Button
//             icon={<RightOutlined />}
//             onClick={goNext}
//             size="small"
//             shape="circle"
//             style={{
//               background: 'transparent',
//               color: 'white',
//               border: 'none',
//               width: '24px',
//               height: '24px',
//             }}
//           />
//         </Space>
//       </Flex>

//       {/* Thumbnails Swiper */}
//       <Swiper
//         modules={[FreeMode]}
//         freeMode={true}
//         slidesPerView={visibleSlides}
//         spaceBetween={8}
//         centeredSlides={false}
//         onSwiper={setSwiper} // 👈 lưu instance Swiper
//         style={{ width: '100%', maxWidth: '335px' }}
//       >
//         {images.map((img, index) => (
//           <SwiperSlide key={index} style={{ cursor: 'pointer' }}>
//             <Image
//               width={60}
//               height={60}
//               src={img}
//               preview={false}
//               onClick={() => handleThumbnailClick(index)}
//               style={{
//                 borderRadius: '4px',
//                 opacity: index === currentIndex ? 1 : 0.6,
//                 border:
//                   index === currentIndex
//                     ? '1px solid #52c41a'
//                     : '1px solid #d9d9d9',
//                 transition: 'all 0.3s ease',
//               }}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </Flex>
//   );
// };

// export default ImageDetail;

import { Image, Button, Space, Flex } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useState, useEffect } from 'react';

const ImageDetail = ({ images = [] }) => {
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleSlides = 5;
  const middleOffset = Math.floor((visibleSlides - 1) / 2); // = 2 khi visible=5

  // helper: tính target slide cho thumbnails để "center" ảnh được chọn
  const calcThumbTarget = (index) => {
    if (!images || images.length <= visibleSlides) return 0;
    const lastStart = images.length - visibleSlides;
    if (index >= middleOffset && index <= images.length - 1 - middleOffset) {
      return index - middleOffset;
    } else if (index < middleOffset) {
      return 0;
    } else {
      return lastStart;
    }
  };

  // Khi user click thumbnail: điều khiển main swiper và center thumbnail
  const handleThumbnailClick = (index) => {
    if (mainSwiper && typeof mainSwiper.slideTo === 'function') {
      mainSwiper.slideTo(index, 400);
    } else {
      setCurrentIndex(index);
    }

    // center thumb slides nếu cần
    if (thumbsSwiper && typeof thumbsSwiper.slideTo === 'function') {
      const target = calcThumbTarget(index);
      thumbsSwiper.slideTo(target, 400);
    }
  };

  // Nút Prev / Next dùng cho main swiper (ảnh lớn)
  const goPrev = () => {
    if (!mainSwiper) return;
    mainSwiper.slidePrev(400);
  };

  const goNext = () => {
    if (!mainSwiper) return;
    mainSwiper.slideNext(400);
  };

  // Khi mainSwiper thay đổi slide (bấm arrow hoặc vuốt), cập nhật currentIndex và center thumb
  const onMainSlideChange = (swiper) => {
    const idx = swiper.activeIndex;
    setCurrentIndex(idx);

    // center thumbnail swiper theo idx
    if (thumbsSwiper && typeof thumbsSwiper.slideTo === 'function') {
      const target = calcThumbTarget(idx);
      thumbsSwiper.slideTo(target, 400);
    }
  };

  // Khi thumbnails swiper ready, đảm bảo nó được sync với currentIndex ban đầu
  useEffect(() => {
    if (thumbsSwiper && typeof thumbsSwiper.slideTo === 'function') {
      const t = calcThumbTarget(currentIndex);
      thumbsSwiper.slideTo(t, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbsSwiper]);

  return (
    <Flex vertical align="center" style={{ width: '100%' }}>
      {/* Ảnh lớn: sử dụng Swiper chính */}
      <div style={{
        width: '100%',
        maxWidth: 800,
        aspectRatio: '1/1',
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        marginBottom: 16,
      }}>
        <Swiper
          modules={[Thumbs]}
          onSwiper={setMainSwiper}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSlideChange={onMainSlideChange}
          style={{ width: '100%', height: '100%' }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} style={{ width: '100%', height: '100%' }}>
              <Image
                src={img}
                width="100%"
                height="100%"
                preview={true}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  transition: 'opacity 0.3s ease-in-out',
                }}
                alt={`img-${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Overlay bottom-right: counter + arrows (giữ nguyên vị trí như cũ) */}
        <Space
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            borderRadius: 20,
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 10,
            alignItems: 'center'
          }}
        >
          <Button
            icon={<LeftOutlined />}
            onClick={goPrev}
            size="small"
            shape="circle"
            style={{
              background: 'transparent',
              color: 'white',
              border: 'none',
              width: '28px',
              height: '28px',
            }}
          />
          <span style={{ fontWeight: 'bold' }}>{currentIndex + 1}/{images.length}</span>
          <Button
            icon={<RightOutlined />}
            onClick={goNext}
            size="small"
            shape="circle"
            style={{
              background: 'transparent',
              color: 'white',
              border: 'none',
              width: '28px',
              height: '28px',
            }}
          />
        </Space>
      </div>

      {/* Thumbnails Swiper (giữ logic visibleSlides + freeMode) */}
      <Swiper
        modules={[FreeMode]}
        onSwiper={setThumbsSwiper}
        freeMode={true}
        watchSlidesProgress={true}
        slidesPerView={visibleSlides}
        spaceBetween={8}
        centeredSlides={false}
        style={{ width: '100%', maxWidth: 335 }}
      >
        {images.map((img, index) => {
          const isActive = index === currentIndex;
          return (
            <SwiperSlide key={index} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div onClick={() => handleThumbnailClick(index)} style={{ width: 60, height: 60 }}>
                <Image
                  width={60}
                  height={60}
                  src={img}
                  preview={false}
                  style={{
                    borderRadius: 4,
                    opacity: isActive ? 1 : 0.6,
                    border: isActive ? '1px solid #52c41a' : '1px solid #d9d9d9',
                    objectFit: 'cover',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Flex>
  );
};

export default ImageDetail;
