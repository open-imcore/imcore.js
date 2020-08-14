import axios, {  AxiosResponse, AxiosError, AxiosInstance } from "axios";

axios.interceptors.request.use
axios.interceptors.response.use()

abstract class Interceptor<V> {
    constructor(protected client: AxiosInstance) {}

    onFulfilled(value: V): V | Promise<V> {
        return value;
    }
    
    onRejected(error: any): any {
        return error;
    }

    register(axios: AxiosInstance) {
        axios.interceptors[this instanceof ResponseInterceptor ? "response" : "request"].use((conf) => this.onFulfilled(conf) as any, (err) => this.onRejected(err))
    }
}

class ResponseInterceptor extends Interceptor<AxiosResponse> {}
// class RequestInterceptor extends Interceptor<AxiosRequestConfig> {}

const RetryAfter = "Retry-After".toLowerCase()

export class RatelimitResponseInterceptor extends ResponseInterceptor {
    onRejected(error: AxiosError) {
        let response: AxiosResponse, retryAfter: number;
        if ((response = error.response) && (response.status === 429) && (retryAfter = +response.headers[RetryAfter]) && !isNaN(retryAfter)) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    return this.client.request(error.config).then(resolve).catch(reject)
                }, (retryAfter * 1000) + 1000);
            })
        }

        return Promise.reject(error)
    }
}