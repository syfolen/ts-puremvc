
module puremvc {
    /**
     * 控制类（命令集合）
     */
    export interface IController {

        executeCommand(name: string, data: any): void;

        registerCommand(name: string, cls: new () => ICommand, priority: number, args: any[]): void;

        removeCommand(name: string): void;

        hasCommand(name: string): boolean;
    }
}