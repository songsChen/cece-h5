import axios from "axios";

// create an axios instance
const service = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? // ? "https://api-test.cece.com"
              "/api"
            : "/api", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
    (config) => {
        // do something before request is sent
        // config.headers["X-Token"] = getToken();
        return config;
    },
    (error) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    },
);

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response) => {
        const res = response.data;

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 0) {
            return Promise.reject(new Error(res.message || "Error"));
        } else {
            return res;
        }
    },
    (error) => {
        console.log(process.env);
        console.log("err" + error); // for debug
        return Promise.reject(error);
    },
);

export default service;
