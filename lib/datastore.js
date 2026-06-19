const { Datastore } = require("@google-cloud/datastore");

const datastore = new Datastore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  // 로컬 에뮬레이터 사용 시: DATASTORE_EMULATOR_HOST 환경변수로 자동 감지됨
  // 서비스 계정 키 사용 시: GOOGLE_APPLICATION_CREDENTIALS 환경변수로 경로 지정
});

module.exports = datastore;
