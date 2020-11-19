
module puremvc {
    /**
     * 命令接口，实现此接口的对象允许通过registerCommand注册
     * export
     */
    export interface ICommand {

        /**
         * 命令执行接口
         * export
         */
        execute(...args: any[]): void;
    }
}