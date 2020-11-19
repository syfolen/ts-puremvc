
module puremvc {
    /**
     * 复合命令
     * export
     */
    export abstract class MacroCommand extends Notifier implements ICommand {
        /**
         * 命令列表（内置属性，请勿操作）
         * export
         */
        private $commands: Array<new () => ICommand> = [];

        constructor() {
            super();
            this.$initializeMacroCommand();
        }

        /**
         * 初始化复合命令
         * 说明：
         * 1. 一个复合命令通常由多个简易命令组成
         * export
         */
        protected abstract $initializeMacroCommand(): void;

        /**
         * 添加子命令
         * 说明：
         * 1. 当复合命令被执行时，子命令将按照被添加的顺序先后执行
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