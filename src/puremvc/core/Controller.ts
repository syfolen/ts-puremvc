
module puremvc {
    /**
     * 控制类（命令集合）
     */
    export class Controller {

        static inst: Controller = null;

        /**
         * 命令集合
         */
        private $commands: { [name: string]: new () => ICommand } = {};

        constructor() {
            if (Controller.inst !== null) {
                throw Error(`Controller singleton already constructed!`);
            }
            Controller.inst = this;
        }

        executeCommand(name: string, data: any): void {
            const cmd: ICommand = new this.$commands[name]();
            if (data instanceof Array) {
                cmd.execute.apply(cmd, data);
            }
            else {
                cmd.execute.call(cmd, data);
            }
        }

        registerCommand(name: string, cls: new () => ICommand, priority: number, args: any[]): void {
            if (this.hasCommand(name) === true) {
                throw Error(`Register duplicate command: ${name}`);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this, false, priority, args);
        }

        removeCommand(name: string): void {
            if (this.hasCommand(name) === false) {
                throw Error(`Remove non-existent command: ${name}`);
            }
            delete this.$commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        }

        hasCommand(name: string): boolean {
            return this.$commands[name] !== void 0;
        }
    }
}