
module puremvc {
    /**
     * export
     */
    export abstract class MacroCommand extends Notifier implements ICommand {

        private $commands: Array<new () => ICommand> = [];

        constructor() {
            super();
            this.$initializeMacroCommand();
        }

        /**
         * export
         */
        protected abstract $initializeMacroCommand(): void;

        /**
         * export
         */
        protected $addSubCommand(cls: new () => ICommand): void {
            this.$commands.push(cls);
        }

        /**
         * export
         */
        execute(): void {
            for (let i: number = 0; i < this.$commands.length; i++) {
                const cmd: ICommand = new this.$commands[i]();
                cmd.execute.apply(cmd, arguments);
            }
        }
    }
}