
module test {

    export class TestController {

        constructor() {
            console.log("test controller");
            puremvc.Facade.getInstance().registerCommand("CUI_TEST", CUITestSimpleCommand);
            console.assert(puremvc.Facade.getInstance().hasCommand("CUI_TEST"), "CUI_TEST 命令未注册");

            const data: IData = { msg: 0 };
            puremvc.Facade.getInstance().sendNotification("CUI_TEST", [data, 1]);
            console.assert(data.msg === 1, "CUI_TEST未执行");
            puremvc.Facade.getInstance().sendNotification("CUI_TEST", data);
            console.assert(data.msg === 0, "CUI_TEST未执行");

            puremvc.Facade.getInstance().removeCommand("CUI_TEST");
            console.assert(puremvc.Facade.getInstance().hasCommand("CUI_TEST") === false, "CUI_TEST 命令未移除");

            puremvc.Facade.getInstance().sendNotification("CUI_TEST", [data, 1]);
            console.assert(data.msg === 0, "data.test值异常");

            puremvc.Facade.getInstance().registerCommand("CUI_TEST", CUITestMacroCommand);

            data.msg = 0;
            puremvc.Facade.getInstance().sendNotification("CUI_TEST", [data, 1, 2]);
            console.assert(data.msg === 3, "MacroCommand 执行执行异常");
            puremvc.Facade.getInstance().removeCommand("CUI_TEST");
        }
    }

    class CUITestSimpleCommand extends puremvc.SimpleCommand {

        execute(data: IData, msg: number = 0): void {
            data.msg = msg;
        }
    }

    class CUITestMacroCommand extends puremvc.MacroCommand {

        protected $initializeMacroCommand(): void {
            this.$addSubCommand(CUITestMacroBCommand);
            this.$addSubCommand(CUITestMacroACommand);
        }
    }

    class CUITestMacroACommand extends puremvc.SimpleCommand {

        execute(data: IData, a: number, b: number): void {
            console.assert(data.msg === 2, "MacroACommand响应优先级不正确");
            data.msg += a;
        }
    }

    class CUITestMacroBCommand extends puremvc.SimpleCommand {

        execute(data: IData, a: number, b: number): void {
            console.assert(data.msg === 0, "MacroACommand响应优先级不正确");
            data.msg += b;
        }
    }

    interface IData {

        msg: number;
    }
}