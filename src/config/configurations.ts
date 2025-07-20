export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
    entities: [__dirname + '/**/*.entity.{ts,js}'],
    ssl: process.env.DB_SSL === 'true',
  },
});
