import { useNavigate } from 'react-router-dom';

export enum PopupType {
  Register, // src\components\authentication\Register.tsx
  RegistrationSuccess,
  RegistrationFailure,
  VerificationEmailSentSuccess,
  VerificationEmailSentFailure,

  changePassword, // src\components\myPage\EditPassword.tsx
  changePasswordSuccess,
  changePasswordFailure,

  DeleteAccount, // src\components\myPage\EditMyInformation.tsx
  DeleteAccountSuccess,
  DeleteAccountFailure,

  ChangeUserName, // src\components\myPage\EditName.tsx
  ChangeUserNameSuccess,
  ChangeUserNameFailure,

  ChangeUserProfileImage, // src\components\myPage\EditMyInformation.tsx
  ChangeUserProfileImageSuccess,
  ChangeUserProfileImageFailure,

  DeleteFavorite, // src\components\myPage\FavoriteMedications.tsx
  DeleteFavoriteSuccess,
  DeleteFavoriteFailure,

  DeleteReview, // src\components\myPage\ManageReviews.tsx
  DeleteReviewSuccess,
  DeleteReviewFailure,

  ResetPasswordRequest, // src\components\authentication\ResetPassword.tsx
  ResetPasswordRequestSuccess,
  ResetPasswordRequestFailure,

  ResetPassword, // src\components\authentication\ResetPassword.tsx
  ResetPasswordSuccess,
  ResetPasswordFailure,

  DeleteMyPill, // src\components\myPage\MyMedications.tsx
  DeleteMyPillSuccess,
  DeleteMyPillFailure,

  AddMyPill, // src\components\myPage\MyMedications.tsx
  AddMyPillSuccess,
  AddMyPillFailure,

  Certifications, // src\api\certificationsApi.ts
  CertificationsSuccess,
  CertificationsFailure,

  FinishChatBot, // src\components\chatBot\Chatbot.tsx

  ImageSearchInfo, // src\components\search\SearchBox.tsx

  LoginRequired, // src\components\search\SearchResults.tsx
  DeleteData, // src\components\calendar\EditCalendarDetail.tsx

  None
}

const PopupContent = (
  type: PopupType,
  navigate: ReturnType<typeof useNavigate>
) => {
  const getPopupContent = (type: PopupType) => {
    switch (type) {
      case PopupType.RegistrationSuccess:
        return (
          <div>
            회원가입에 성공했습니다.
            {getHomeButton()}
          </div>
        );
      case PopupType.RegistrationFailure:
        return <div>회원가입에 실패했습니다.</div>;

      case PopupType.VerificationEmailSentSuccess:
        return (
          <div>
            이메일 인증 링크가 전송되었습니다. 이메일 인증 완료 후 회원가입을
            계속 진행해 주세요.
          </div>
        );
      case PopupType.VerificationEmailSentFailure:
        return <div>인증메일 전송에 실패했습니다.</div>;

      case PopupType.changePasswordSuccess:
        return <div>비밀번호를 변경했습니다.</div>;
      case PopupType.changePasswordFailure:
        return (
          <div>비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.DeleteAccountSuccess:
        return (
          <div>
            회원탈퇴가 정상적으로 처리되었습니다.
            {getHomeButton()}
          </div>
        );

      case PopupType.DeleteAccountFailure:
        return <div>회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.</div>;

      case PopupType.ChangeUserNameSuccess:
        return (
          <div>
            이름을 변경했습니다. <button className='bottomClose'>확인</button>{' '}
          </div>
        );

      case PopupType.ChangeUserNameFailure:
        return <div>이름변경에 실패했습니다. 잠시 후 다시 시도해주세요.</div>;

      case PopupType.ChangeUserProfileImageFailure:
        return (
          <div>프로필사진 변경에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.DeleteFavoriteFailure:
        return (
          <div>즐겨찾는 약 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.DeleteReviewFailure:
        return <div>리뷰 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.</div>;

      case PopupType.ResetPasswordRequestSuccess:
        return (
          <div>
            패스워드 재설정 이메일을 발송했습니다.
            <button
              className='bottomClose'
              onClick={() => {
                navigate(-1);
              }}
            >
              확인
            </button>
          </div>
        );

      case PopupType.CertificationsSuccess:
        return (
          <div>
            약사인증에 성공했습니다.
            <button className='bottomClose'>확인</button>
          </div>
        );

      case PopupType.CertificationsFailure:
        return (
          <div>
            약사인증에 실패했습니다. 등록 정보를 재확인해주세요.
            <button className='bottomClose'>확인</button>
          </div>
        );

      case PopupType.ResetPasswordRequestFailure:
        return (
          <div>
            패스워드 재설정 이메일을 발송에 실패했습니다. 잠시 후 다시
            시도해주세요.
          </div>
        );

      case PopupType.ResetPasswordSuccess:
        return (
          <div>
            패스워드 재설정에 성공했습니다. 메인페이지로 돌아가 로그인을
            시도해주세요.
            <button
              className='bottomClose'
              onClick={() => {
                navigate('/');
              }}
            >
              확인
            </button>
          </div>
        );

      case PopupType.ResetPasswordFailure:
        return (
          <div>패스워드 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.DeleteMyPillFailure:
        return (
          <div>나의 약 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.AddMyPillFailure:
        return (
          <div>나의 약 추가에 실패했습니다. 잠시 후 다시 시도해주세요.</div>
        );

      case PopupType.FinishChatBot:
        return (
          <div>
            채팅을 종료하시면 기존 내용은 삭제돼요. <br />
            삭제하시겠어요?
          </div>
        );
      case PopupType.ImageSearchInfo:
        return (
          <div>
            <p>알약의 앞, 뒷면의 사진을 찍어주세요.</p>
            <img
              src='/img/pill.webp'
              style={{ width: '50%', marginTop: '10px' }}
            />
          </div>
        );
      case PopupType.LoginRequired:
        return (
          <div>
            로그인이 필요합니다.
            <button
              className='bottomClose'
              onClick={() => {
                navigate('/login', { replace: true });
                window.location.reload();
              }}
            >
              로그인 페이지로 이동
            </button>
          </div>
        );
      case PopupType.DeleteData:
        return <div>삭제하시겠어요?</div>;
    }
  };

  const getHomeButton = () => {
    return (
      <button
        className='bottomClose'
        onClick={() => {
          navigate('/', { replace: true });
          window.location.reload();
        }}
      >
        홈으로
      </button>
    );
  };

  return getPopupContent(type);
};

export default PopupContent;
