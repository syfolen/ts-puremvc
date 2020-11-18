
module puremvc {
    /**
     * 控制类（命令集合）
     */
    export class Controller {

        static inst: Controller = null;

        private $commands: { [name: string]: new () => ICommand } = {};

        constructor() {
            if (Controller.inst !== null) {
                throw Error("重复构建控制类！！！");
            }
            Controller.inst = this;
        }

        executeCommand(name: string, args: any): void {
            const cmd: ICommand = new this.$commands[name]();
            if (args instanceof Array) {
                cmd.execute.apply(cmd, args);
            }
            else {
                cmd.execute.call(cmd, args);
            }
        }

        registerCommand(name: string, cls: new () => ICommand, priority: suncom.EventPriorityEnum, option?: number | CareModuleID | any[] | IOption): void {
            if (this.hasCommand(name) === true) {
                throw Error("重复注册命令：" + name);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this, false, priority, option);
        }

        removeCommand(name: string): void {
            if (this.hasCommand(name) === false) {
                throw Error("移除不存在的命令：" + name);
            }
            delete this.$commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        }

        retrieveCommand(name: string): new () => ICommand {
            return this.$commands[name] || null;
        }

        hasCommand(name: string): boolean {
            return this.$commands[name] !== void 0;
        }
    }
}