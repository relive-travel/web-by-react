import { useSelector } from "react-redux";

function Regist() {
  const userNickName = useSelector((state) => state.user.nickName);
  const userEmail = useSelector((state) => state.user.email);

  return (
    <section className="regist-component">
      <header>회원 가입 정보</header>
      <main>
        <header>정보가 바뀌면 토끼가 알아볼 수 없어요!</header>
        <main className="regist-info">
          <article className="regist-nickName">
            닉네임 : <span>{userNickName}</span>
          </article>
          <article className="regist-email">
            이메일 : <span>{userEmail}</span>
          </article>
        </main>
        <footer className="regist-buttons">
          <button className="regist-rallback-button">돌아 가기</button>
          <button className="regist-complete-button">회원 가입</button>
        </footer>
      </main>
      <footer>※ 카카오에서 동의된 닉네임, 이메일을 사용합니다</footer>
    </section>
  );
}

export default Regist;
