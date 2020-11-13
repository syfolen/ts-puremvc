
module puremvc {
    /**
     * export
     */
    export abstract class SimpleCommand extends Notifier implements ICommand {

        /**
         * export
         */
        abstract execute(...args: any[]): void;
    }
}