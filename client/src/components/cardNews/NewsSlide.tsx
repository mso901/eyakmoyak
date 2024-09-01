import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import styled from 'styled-components';

const Card = styled.img`
  width: 100%;
  height: auto;
`;

interface NewsNumber {
  num: number;
}

const NewsSlide = ({ num }: NewsNumber) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(loading);

  useEffect(() => {
    const loadImages = async () => {
      const imageList: string[] = [];
      let i: number = 1;

      while (true) {
        const imageUrl = `/img/cardNews/news${num}_${i}.png`;
        const img = new Image();
        img.src = imageUrl;

        try {
          // 반환값 필요 없음 ()
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
          });
          imageList.push(imageUrl);
          i += 1;
        } catch {
          break;
        }
      }

      setImages(imageList);
      setLoading(false);
    };

    loadImages();
  }, [num]);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };

  return (
    <Slider {...settings}>
      {images.map((src, index) => (
        <div key={index}>
          <Card src={src} alt='카드 뉴스' />
        </div>
      ))}
    </Slider>
  );
};

export default NewsSlide;
