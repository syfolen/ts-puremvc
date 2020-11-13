
module puremvc {
    /**
     * 字典接口
     */
    export type IDictionary<T> = { [key: string]: T };

    /**
     * 判断字符串是否为空
     */
    export function isStringNullOrEmpty(str: string): boolean {
        return str === void 0 || str === null || str === "";
    }
}