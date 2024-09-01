import { Icon } from '@iconify-icon/react';
import { useEffect, useRef, useState } from 'react';
import { FiXCircle } from 'react-icons/fi';
import styled from 'styled-components';
import { useCalendar } from '../../store/calendar';

const EditDetailPhoto = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { setPhoto, nowData, setCalImg } = useCalendar();

  const [isDeniedCameraPermission, setIsDeniedCameraPermission] =
    useState(false);

  console.log(isDeniedCameraPermission);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsDeniedCameraPermission(false);
        }
      } catch (error) {
        console.error('Error accessing camera: ', error);
        setIsDeniedCameraPermission(true);
        setIsCameraOn(false);
      }
    };

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isCameraOn]);

  const photoInput = useRef<HTMLInputElement | null>(null);
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const imageUrl = URL.createObjectURL(file);

      setCalImg(imageUrl);
      setPhoto(formData);
    }
  };

  const handleClick = () => photoInput.current?.click();
  const deletePhoto = () => {
    setCalImg('');
    setPhoto(new FormData());
  };

  return (
    <Container>
      <IconContainer>
        <Icon
          icon='solar:gallery-send-linear'
          width='23px'
          onClick={handleClick}
        />
        <HiddenInput
          type='file'
          accept='image/*'
          multiple
          ref={photoInput}
          onChange={onChangeImage}
        />
      </IconContainer>
      <ImageContainer>
        {nowData?.calImg && (
          <img
            src={nowData?.calImg}
            alt='기록 이미지'
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        <DeleteIcon onClick={deletePhoto} />
      </ImageContainer>
    </Container>
  );
};

export default EditDetailPhoto;

const Container = styled.div`
  width: 150px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ImageContainer = styled.div`
  position: relative;
  margin-top: 10px;
  margin-right: 20px;
`;

const DeleteIcon = styled(FiXCircle)`
  color: #777777;
  margin: 5px 5px;
  cursor: pointer;
  position: absolute;
  top: 50px;
`;

const HiddenInput = styled.input`
  display: none;
`;
