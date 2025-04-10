declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string; //或者 APP_PORT: `${number}`;  如果你希望它必须是一个数字的字符串
      DATABASE_URL: string;
      PASS_SALT: string;

      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_REFRESH_EXPIRE: string;
      NODE_ENV: 'development' | 'production' | 'test'; //  通常 NODE_ENV 也应该在这里声明
    }
  }
}

export {};
