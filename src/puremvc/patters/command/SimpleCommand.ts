
module puremvc {
    /**
     * 简易命令
     * export
     */
    export abstract class SimpleCommand extends Notifier implements ICommand {

        /**
         * export
         */
        abstract execute(...args: any[]): void;
    }
}