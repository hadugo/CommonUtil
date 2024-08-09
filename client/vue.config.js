const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map' // 소스 맵 활성화
  },
  /*
  devServer: {
    open: true, // 브라우저 자동 열기
    hot: true, // 핫 모듈 리플레이스먼트
    port: 8080, // 포트 번호
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
  },
  productionSourceMap: true // 프로덕션 소스 맵 생성
  */
});

