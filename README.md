<h2>Nodejs-Auth</h2>

<h3>사용 기술</h3> 
Nodejs, Express, lowdb

<h3>실행 방법</h3>

0. Nodejs 가 설치된 환경에서만 실행 가능합니다
1. repository 다운로드 이후 압축을 풀어줍니다
2. 가장 최상위 폴더에 위치한 main.js를 실행합니다
   * pm2에서 실행시 '--watch' 를 사용하거나 'nodemon'을 사용하여 실행할 경우<br> 
     파일이 갱신될때마다 서버가 재시작 되어 정상적인 실행이 불가능할 수 있습니다.<br> 
     파일이 갱신되어도 서버가 재시작되지 않도록 설정하고 실행 바랍니다
3. "localhost:3000" 으로 접속합니다

<h3> 웹사이트 기능 </h3>

1. 좌측 상단의 Register 버튼을 이용하여 회원가입
2. 회원가입 성공시 자동 로그인
3. logout, login 버튼을 이용하여 사용자 변경 가능
4. create 버튼을 이용하여 글 쓰기 가능
   * 로그인 인증 완료된 경우만 글 쓰기 가능
6. update, delete 버튼을 이용하여 글 수정 삭제 가능
   * 글 작성자만 수정 삭제 가능
