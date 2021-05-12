const env = process.env;
// console.log(env.DB_USERNAME);
// console.log(env.DB_PASSWORD);

const dbConfig = {
    database: `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME}?retryWrites=true&w=majority`,
    host: "https://cs-396-hw03-jackson.herokuapp.com/",
    mongoConfig: {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};
module.exports = {
    development: dbConfig,
    production: dbConfig
};