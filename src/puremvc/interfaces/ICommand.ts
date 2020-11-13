
module puremvc {
    /**
     * export
     */
    export interface ICommand {

        /**
         * export
         */
        execute(...args: any[]): void;
    }
}