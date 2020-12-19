
module puremvc {
    /**
     * 模型类（数据集合）
     */
    export interface IModel {

        registerProxy(proxy: IProxy<any>): void;

        removeProxy(name: string): void;

        retrieveProxy(name: string): IProxy<any>;

        hasProxy(name: string): boolean;
    }
}